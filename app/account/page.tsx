"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AccountShell from "@/components/AccountShell";
import FullHeader from "@/components/FullHeader";


const pickErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "message" in err) {
    const maybe = (err as { message?: unknown }).message;
    if (typeof maybe === "string") {
      const s = maybe.trim();
      if (s && s !== "{}" && s !== "[]") return s;
    }
  }
  return fallback;
};


type OrderItem = { product_id?: number; quantity?: number };
type Order = {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

type WishlistRow = {
  product_id?: number;
  product?: { id?: number };
};

type CartRow = {
  id?: number; // row id
  id_bienthesp?: number;
  quantity?: number;
};

type Address = {
  id: number;
  hoten: string;
  sodienthoai: string;
  diachi: string;
  tinhthanh?: string;
  trangthai?: string;
};

type AuthUser = {
  id?: number;
  username?: string;
  sodienthoai?: string;
  hoten?: string;
  name?: string;
  email?: string;
  gioitinh?: string;
  ngaysinh?: string;
  avatar?: string;
  vaitro?: string;
  trangthai?: string;
  diachi?: Address[];
};

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const { login, register, logout, user, isLoggedIn } = useAuth();

  // Mirror FullHeader token detection -> set x-user-id cookie for mock server
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoggedIn) return; // client already knows logged in

    // if cookie already present, nothing to do
    if (document.cookie.match(/\bx-user-id=([^;]+)/)) return;

    // candidate token keys used by the app
    const candidates = [
      localStorage.getItem("token"),
      localStorage.getItem("auth_token"),
      localStorage.getItem("mock_token"),
      localStorage.getItem("user_token"),
      (() => {
        try {
          const a = localStorage.getItem("auth");
          if (!a) return null;
          const p = JSON.parse(a);
          return p?.token ?? null;
        } catch {
          return null;
        }
      })(),
    ].filter(Boolean) as string[];

    const raw = candidates[0] || "";
    if (!raw) return;

    let token = raw.replace(/^Bearer\s+/i, "").trim();
    if (!token) return;

    // token format "userId:timestamp" -> extract userId
    if (token.includes(":")) token = token.split(":")[0];
    if (!/^\d+$/.test(token)) return;

    try {
      const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
      document.cookie = `x-user-id=${encodeURIComponent(token)}; Path=/; Expires=${expires}`;
      console.debug("[auth] set x-user-id cookie (dev)", token);
    } catch {
      // ignore
    }
  }, [isLoggedIn]);

  // Chuẩn hoá host để cookie không rớt (localhost ↔ 127.0.0.1)
  const API = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";
    try {
      if (typeof window === "undefined") return raw;
      const u = new URL(raw);
      const host = window.location.hostname; // "localhost" hoặc "127.0.0.1"
      if (
        (u.hostname === "127.0.0.1" && host === "localhost") ||
        (u.hostname === "localhost" && host === "127.0.0.1")
      )
        u.hostname = host;
      return u.origin;
    } catch {
      return raw;
    }
  }, []);

  const [tab, setTab] = useState<
    "login" | "register" | "wishlist" | "cart" | "orders" | "profile"
  >(() => (search?.get("tab") === "register" ? "register" : "login"));

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Các state “value” không dùng trong UI → chỉ giữ setter để tránh cảnh báo unused
  const [, setWishlist] = useState<WishlistRow[]>([]);
  const [, setCart] = useState<CartRow[]>([]);
  const [, setOrders] = useState<Order[]>([]);

  // const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  useEffect(() => {
    const src = (profile && (profile.avatar as string)) || (user && (user.avatar as string)) || null;
    setAvatarPreview(src);
  }, [profile, user]);

  useEffect(() => {
    const cls = ["color-two", "font-exo", "header-style-two"];
    const html = document.documentElement;
    cls.forEach((c) => html.classList.add(c));
    return () => {
      cls.forEach((c) => html.classList.remove(c));
    };
  }, []);

  useEffect(() => {
    let alive = true;
    // 1) seed profile from useAuth.user so UI updates immediately after login
    if (user) {
      setProfile((user as AuthUser) ?? null);
    }

    // 2) fetch detailed profile (diachi etc.) only when logged in
    if (!isLoggedIn) return () => { alive = false; };
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/thong-tin-nguoi-dung`, { credentials: "include" });
        if (!alive) return;
        if (!res.ok) return;
        const j = await res.json();
        const remote = (j?.data ?? j?.user ?? j) as AuthUser | null;
        if (remote && alive) {
          // merge to keep any fields already in user (avoid dropping token/other)
          setProfile((prev) => ({ ...(prev ?? {}), ...(remote ?? {}) }));
        }
      } catch {
        // ignore
      }
    })();
    return () => { alive = false; };
  }, [user, isLoggedIn, API]);
  // Khi đã đăng nhập, nếu đang ở tab login/register thì chuyển sang wishlist
  useEffect(() => {
    if (!isLoggedIn) return;
    if (tab === "login" || tab === "register") setTab("wishlist");
  }, [isLoggedIn, tab]);

  // Tải dữ liệu theo tab (giữ nguyên endpoint, chỉ đổi kiểu)
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        if (tab === "wishlist") {
          const res = await fetch(`${API}/api/yeuthichs`, { credentials: "include" });
          const data = await res.json();
          setWishlist(Array.isArray(data) ? (data as WishlistRow[]) : (data?.data ?? []));
        } else if (tab === "cart") {
          const res = await fetch(`${API}/api/toi/giohang`, { credentials: "include" });
          const j = await res.json();
          setCart((j?.data as CartRow[]) ?? []);
        } else if (tab === "orders") {
          const res = await fetch(`${API}/api/toi/donhangs`, { credentials: "include" });
          const j = await res.json();
          setOrders((j?.data as Order[]) ?? []);
        } else if (tab === "profile") {
          const res = await fetch(`${API}/api/auth/thong-tin-nguoi-dung`, { credentials: "include" });
          const j = await res.json();
          setProfile((j?.data as AuthUser) ?? null);
        }
      } catch {
        // ignore
      }
    })();
  }, [tab, isLoggedIn, API]);

  const handleSaveProfile: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setLoading(true);
    setNotice(null);
    const formEl = e.currentTarget;

    try {
      const formData = new FormData(formEl);
      const fd = new FormData();

      const hoten = String(formData.get("name") || "");
      const sodienthoai = String(formData.get("phone") || formData.get("sodienthoai") || "");
      const ngaysinh = String(formData.get("birthday") || "");
      const gioitinh = String(formData.get("gender") || formData.get("gioitinh") || "");
      const email = String(formData.get("email") || "");
      const tinhthanh = String(formData.get("address_city") || formData.get("tinhthanh") || "");
      const diachi = String(formData.get("address_street") || formData.get("address") || "");
      const trangthai_diachi = String(formData.get("address_state") || formData.get("trangthai_diachi") || "Mặc định");

      fd.append("hoten", hoten);
      if (sodienthoai) fd.append("sodienthoai", sodienthoai);
      if (ngaysinh) fd.append("ngaysinh", ngaysinh);
      if (gioitinh) fd.append("gioitinh", gioitinh);
      if (email) fd.append("email", email);
      if (tinhthanh) fd.append("tinhthanh", tinhthanh);
      if (diachi) fd.append("diachi", diachi);
      fd.append("trangthai_diachi", trangthai_diachi);

      // avatar file (if user selected one)
      const fileInput = formEl.querySelector<HTMLInputElement>('input[type="file"][name="avatar"]');
      const avatarFile = fileInput?.files?.[0];
      if (avatarFile) fd.append("avatar", avatarFile);

      // send as multipart/form-data (let browser set Content-Type)
      const res = await fetch(`${API}/api/auth/cap-nhat-thong-tin`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      const j = await res.json();
      const newProfile = (j?.user ?? j?.data ?? j) as AuthUser | null;
      if (newProfile) setProfile(newProfile);

      // update avatar preview + persist for AccountShell/sidebar
      if (newProfile?.avatar && typeof newProfile.avatar === "string") {
        setAvatarPreview(String(newProfile.avatar));
        try { localStorage.setItem("avatar", String(newProfile.avatar)); } catch { }
      }

      // persist display name / username so sidebar shows immediately
      if (newProfile?.hoten && typeof newProfile.hoten === "string") {
        try { localStorage.setItem("fullname", String(newProfile.hoten)); } catch { }
      }
      if (newProfile?.username && typeof newProfile.username === "string") {
        try { localStorage.setItem("username", String(newProfile.username)); } catch { }
      }

      // if backend returns diachi array, remind user to add address if empty
      const diachiArr = Array.isArray(newProfile?.diachi) ? (newProfile!.diachi as Address[]) : undefined;
      if (!diachiArr || diachiArr.length === 0) {
        setNotice({
          type: "success",
          msg: "Đã lưu thông tin. Bạn chưa có địa chỉ giao hàng — vui lòng thêm ở Sổ địa chỉ để sử dụng khi đặt hàng.",
        });
      } else {
        setNotice({ type: "success", msg: "Đã lưu thông tin cá nhân" });
      }
    } catch (err: unknown) {
      setNotice({
        type: "error",
        msg: pickErrorMessage(err, "Không thể lưu thông tin cá nhân"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ wishlist khách sau khi đăng nhập (giữ nguyên API)
  const syncGuestWishlist = async () => {
    try {
      const raw = localStorage.getItem("guest_wishlist") || "[]";
      const parsed = JSON.parse(raw);
      const ids: number[] = Array.isArray(parsed) ? parsed : [];
      if (!ids.length) return;
      await Promise.allSettled(
        ids.map((id) =>
          fetch(`${API}/api/yeuthichs`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            credentials: "include",
            body: JSON.stringify({ product_id: id }),
          })
        )
      );
    } catch { }
  };

  // const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
  //   e.preventDefault();
  //   const form = new FormData(e.currentTarget);
  //   const identifier = String(form.get("identifier") || "").trim();
  //   const password = String(form.get("password") || "").trim();
  //   setLoading(true);
  //   setNotice(null);
  //   try {
  //     await login({ identifier, password });

  //     // useCart hook sẽ tự động sync giỏ hàng khi isLoggedIn thay đổi
  //     // Không cần gọi syncGuestCart ở đây nữa
  //     await syncGuestWishlist();

  //     router.replace("/");
  //   } catch (err: unknown) {
  //     setNotice({
  //       type: "error",
  //       msg: pickErrorMessage(
  //         err,
  //         "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại."
  //       ),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
  //   e.preventDefault();
  //   const form = new FormData(e.currentTarget);
  //   const name = String(form.get("name") || "").trim();
  //   const email = String(form.get("email") || "").trim();
  //   const password = String(form.get("password") || "").trim();
  //   const phone = String(form.get("phone") || "").trim();
  //   const gender = String(form.get("gender") || "unknown");
  //   const birthday = String(form.get("birthday") || "").trim();
  //   const nationality = String(form.get("nationality") || "VN").trim();
  //   setLoading(true);
  //   setNotice(null);
  //   try {
  //     await register({ name, email, password, phone, gender, birthday, nationality });
  //     setNotice({
  //       type: "success",
  //       msg: "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.",
  //     });
  //     if (typeof window !== "undefined") {
  //       window.location.replace("/account?tab=login");
  //     } else {
  //       setTab("login");
  //     }
  //   } catch (err: unknown) {
  //     setNotice({
  //       type: "error",
  //       msg: pickErrorMessage(
  //         err,
  //         "Đăng ký thất bại. Email hoặc SĐT có thể đã tồn tại."
  //       ),
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") || "").trim();
    const password = String(form.get("password") || "").trim();
    setLoading(true);
    setNotice(null);
    try {
      // gọi useAuth.login với key 'username'
      await login({ username, password });
      await syncGuestWishlist();
      router.replace("/");
    } catch (err: unknown) {
      setNotice({
        type: "error",
        msg: pickErrorMessage(err, "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại."),
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const hoten = String(form.get("hoten") || "").trim();
    const username = String(form.get("username") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();
    const password_confirmation = String(form.get("password_confirmation") || "").trim();
    const sodienthoai = String(form.get("sodienthoai") || "").trim();

    setLoading(true);
    setNotice(null);
    try {
      // gửi payload thuần tiếng Việt theo API ví dụ
      const payload: Record<string, unknown> = {
        hoten,
        username: username || hoten,
        password,
        password_confirmation: password_confirmation || password,
      };
      if (email) payload.email = email;
      if (sodienthoai) payload.sodienthoai = sodienthoai;

      const res = await fetch(`${API}/api/auth/dang-ky`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Đăng ký thất bại (HTTP ${res.status})`);
      }
      const j = await res.json();
      setNotice({ type: "success", msg: j?.message ?? "Đăng ký thành công. Vui lòng đăng nhập." });
      // chuyển sang trang đăng nhập
      if (typeof window !== "undefined") window.location.replace("/account?tab=login");
      else setTab("login");
    } catch (err: unknown) {
      setNotice({ type: "error", msg: pickErrorMessage(err, "Đăng ký thất bại. Kiểm tra và thử lại.") });
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveWish = async (productId: number) => {
    try {
      await fetch(`${API}/api/yeuthichs/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setWishlist((prev) =>
        prev.filter((w) => (w.product?.id ?? w.product_id) !== productId)
      );
    } catch { }
  };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />
      <AccountShell title="Tài khoản" current="profile">
        {!isLoggedIn ? (
          <>
            <div className="gap-16 mb-16 d-flex">
              <button
                className={`btn ${tab === "login" ? "btn-main-two" : "btn-outline-main-two"}`}
                onClick={() => setTab("login")}
              >
                Đăng nhập
              </button>
              <button
                className={`btn ${tab === "register" ? "btn-main-two" : "btn-outline-main-two"}`}
                onClick={() => setTab("register")}
              >
                Đăng ký
              </button>
            </div>

            {notice && (
              <div
                className={`alert ${notice.type === "success" ? "alert-success" : "alert-danger"} py-10 px-12 mb-16`}
              >
                {notice.msg}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin}>
                <div className="row gy-4">
                  <div className="col-12">
                    <label htmlFor="login-username" className="text-sm text-gray-900 fw-medium">Email hoặc SĐT *</label>
                    <input id="login-username" name="username" type="text" className="common-input" placeholder="tên đăng nhập / email / sđt" autoComplete="username" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="login-password" className="text-sm text-gray-900 fw-medium">Mật khẩu</label>
                    <input id="login-password" name="password" type="password" className="common-input" placeholder="••••••••" required />
                  </div>
                  <div className="col-12">
                    <button disabled={loading} type="submit" className="btn btn-main-two">
                      {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="row gy-4">
                  <div className="col-12">
                    <label htmlFor="reg-hoten" className="text-sm text-gray-900 fw-medium">Họ tên *</label>
                    <input id="reg-hoten" name="hoten" type="text" autoComplete="name" className="common-input" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="reg-username" className="text-sm text-gray-900 fw-medium">Tên tài khoản (username)</label>
                    <input id="reg-username" name="username" type="text" autoComplete="username" className="common-input" placeholder="tùy chọn — để trống sẽ dùng họ tên" />
                    <small className="text-xs text-muted">Bạn có thể đăng nhập bằng username, email hoặc số điện thoại.</small>
                  </div>
                  <div className="col-12">
                    <label htmlFor="reg-email" className="text-sm text-gray-900 fw-medium">Email</label>
                    <input id="reg-email" name="email" type="email" autoComplete="email" className="common-input" placeholder="you@example.com" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="reg-password" className="text-sm text-gray-900 fw-medium">Mật khẩu *</label>
                    <input id="reg-password" name="password" type="password" autoComplete="new-password" className="common-input" placeholder="••••••••" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="reg-password-confirm" className="text-sm text-gray-900 fw-medium">Xác nhận mật khẩu *</label>
                    <input id="reg-password-confirm" name="password_confirmation" type="password" autoComplete="new-password" className="common-input" placeholder="Nhập lại mật khẩu" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="reg-sodienthoai" className="text-sm text-gray-900 fw-medium">Số điện thoại</label>
                    <input id="reg-sodienthoai" name="sodienthoai" type="tel" autoComplete="tel" className="common-input" placeholder="098xxxxxxx" />
                  </div>
                  <div className="col-12">
                    <button disabled={loading} type="submit" className="btn btn-main-two">
                      {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        ) : (
          <form key={String(profile?.id ?? "no-profile")} onSubmit={handleSaveProfile}>
            <div className="row gy-3">
              <div className="col-8">
                <div className="row gy-3">
                  <div className="col-12">
                    <label className="text-sm text-gray-900 fw-medium">Họ tên</label>
                    <input name="name" defaultValue={(profile?.name as string) || (user?.hoten ?? "")} className="common-input" />
                  </div>
                  <div className="col-6">
                    <label className="text-sm text-gray-900 fw-medium">Giới tính</label>
                    <select name="gioitinh" defaultValue={(profile?.gioitinh as string) || "unknown"} className="common-input">
                      <option value="unknown">Không xác định</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="text-sm text-gray-900 fw-medium">Ngày sinh</label>
                    <input type="date" name="ngaysinh" defaultValue={(profile?.ngaysinh as string) || ""} className="common-input" />
                  </div>
                  {/* <div className="col-6">
                  <label className="text-sm text-gray-900 fw-medium">Email</label>
                  <input type="email" name="email" defaultValue={(profile?.email as string) || (user?.email ?? "")} className="common-input" />
                </div> */}
                  {/* <div className="col-6">
                  <label className="text-sm text-gray-900 fw-medium">Quốc tịch</label>
                  <input name="quoctich" defaultValue={(profile?.quoctich as string) || "VN"} className="common-input" />
                </div> */}
                  <div className="col-6">
                    <label className="text-sm text-gray-900 fw-medium">Quốc tịch</label>
                    <input name="quoctich" className="common-input" defaultValue="VN" />
                  </div>
                  <div className="col-6">
                    <label className="text-sm text-gray-900 fw-medium">Số điện thoại</label>
                    <input name="sodienthoai" defaultValue={(profile?.sodienthoai as string) || ""} className="common-input" />
                  </div>

                  {/* <div className="col-12">
                  <label className="text-sm text-gray-900 fw-medium">Địa chỉ</label>
                  <input name="address_street" defaultValue={(profile?.address_street as string) || ""} className="mb-2 common-input" placeholder="Số nhà, tên đường" />
                  <div className="gap-8 d-flex">
                    <input name="address_district" defaultValue={(profile?.address_district as string) || ""} className="common-input" placeholder="Quận/Huyện" />
                    <input name="address_city" defaultValue={(profile?.address_city as string) || ""} className="common-input" placeholder="Tỉnh/Thành phố" />
                    <input name="address_postal" defaultValue={(profile?.address_postal as string) || ""} className="common-input" placeholder="Mã bưu chính" />
                  </div>
                </div> */}
                  <input
                    type="hidden"
                    name="avatar"
                    defaultValue={(profile?.avatar as string) || (user?.avatar as string) || ""}
                  />

                  <div className="col-12">
                    <button disabled={loading} type="submit" className="btn btn-main-two">
                      {loading ? "Đang lưu..." : "Lưu thông tin"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="p-12 text-center card">
                  <div style={{ width: 120, height: 120, margin: "0 auto 12px" }}>
                    <img
                      src={avatarPreview || "/assets/images/default-avatar.png"}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/images/default-avatar.png"; }}
                    />
                  </div>
                  <label className="btn btn-outline-main-two">
                    Chọn Hình Ảnh
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(ev) => {
                        const f = (ev.target as HTMLInputElement).files?.[0];
                        if (f) setAvatarPreview(URL.createObjectURL(f));
                      }}
                    />
                  </label>
                  <p className="mt-8 text-xs text-muted">Kích thước tối đa 1MB. JPG, PNG</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </AccountShell>
    </>
  );
}