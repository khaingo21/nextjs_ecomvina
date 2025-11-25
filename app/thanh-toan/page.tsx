"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

/** Types */
/** Thông tin Giá */
type ThongTinGia = {
  hien_tai?: number; // current
  truoc_giam_gia?: number | null; // before_discount
};

/** Vật phẩm trong giỏ hàng */
type VatPhamGioHang = {
  id_bienthesp?: number | string; // ID biến thể sản phẩm (được dùng để POST /giohang)
  id?: number | string; // ID giỏ hàng (nếu có)
  ten?: string; // name / ten
  product?: {
    id?: number | string;
    ten?: string; // ten/name
    mediaurl?: string;
    gia?: ThongTinGia; // Sử dụng ThongTinGia mới
    [k: string]: unknown;
  };
  soluong?: number; // quantity / qty
  gia?: ThongTinGia; // Sử dụng ThongTinGia mới
  [k: string]: unknown;
};

type ApiCartResponse = {
  status?: boolean;
  data?: VatPhamGioHang[];
};

type ItemThanhToan = VatPhamGioHang & { id_bienthesp?: number | string }; // Dùng VatPhamGioHang mới
// type PriceInfo = {
//   current?: number;
//   before_discount?: number | null;
// };

// type CartItem = {
//   id?: number;
//   ten?: string;
//   name?: string;
//   product?: {
//     id?: number | string;
//     ten?: string;
//     name?: string;
//     mediaurl?: string;
//     gia?: PriceInfo;
//     [k: string]: unknown;
//   };
//   quantity?: number;
//   qty?: number;
//   gia?: PriceInfo;
//   price?: number;
//   selling_price?: number;
//   unit_price?: number;
//   [k: string]: unknown;
// };

// type ApiCartResponse = {
//   status?: boolean;
//   data?: CartItem[];
// };

// type CheckoutItem = CartItem & { id_bienthesp?: number | string };

export default function Page() {
  const { isLoggedIn, user } = useAuth();
  const [cartItems, setCartItems] = useState<VatPhamGioHang[]>([]);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const router = useRouter();

  const API = useMemo(() => process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000", []);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/account?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoggedIn, router]);

  // Load profile (address) để hiển thị trên trang thanh toán
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/thong-tin-nguoi-dung`, { credentials: "include" });
        const j = await res.json();
        if (!alive) return;
        setProfile((j?.data as Record<string, unknown>) ?? null);
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [API, isLoggedIn]);

  // Load giỏ hàng — ưu tiên snapshot từ sessionStorage (Cart → checkout_cart)
  useEffect(() => {
    let alive = true;

    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("checkout_cart");
        if (raw) {
          const parsed = JSON.parse(raw) as VatPhamGioHang[];
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
            setLoadingCart(false);
            return () => {
              alive = false;
            };
          }
        }
      } catch {
        // ignore
      }
    }

    (async () => {
      try {
        setLoadingCart(true);
        const res = await api.get<ApiCartResponse>("/api/toi/giohang", { credentials: "include" });
        if (!alive) return;
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res as unknown as VatPhamGioHang[]) ? (res as unknown as VatPhamGioHang[]) : [];
        setCartItems(items);
      } catch {
        setCartItems([]);
      } finally {
        if (alive) setLoadingCart(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isLoggedIn]);

  const computeTotals = (): { tamtinh: number; giam_gia: number; thanhtien: number } => {
    let tamtinh = 0;
    let giam_gia = 0;
    for (const it of cartItems) {
      const soluong = Number(it.soluong ?? it.qty ?? it.quantity ?? 1) || 1;
      const gia_hien_tai = 
      Number(it.product?.gia?.hien_tai ?? it.gia?.hien_tai ?? it.price ?? it.selling_price ?? it.unit_price ?? 0) || 0;
    const gia_truoc_giam = Number(it.product?.gia?.truoc_giam_gia ?? it.gia?.truoc_giam_gia ?? 0) || 0;
      tamtinh += gia_hien_tai * soluong;
      if (gia_truoc_giam > gia_hien_tai) giam_gia += (gia_truoc_giam - gia_hien_tai) * soluong;
    }
    const thanhtien = tamtinh - giam_gia;
    return { tamtinh, giam_gia, thanhtien };
  };

  // const { tamtinh, giam_gia, thanhtien } = computeTotals();
  const { tamtinh: subtotal, giam_gia: discount, thanhtien: total } = computeTotals();

  const createVnPayAndRedirect = async () => {
    try {
      const toCheckoutRaw = typeof window !== "undefined" ? sessionStorage.getItem("checkout_cart") : null;
      const toCheckout: VatPhamGioHang[] = toCheckoutRaw ? (JSON.parse(toCheckoutRaw) as VatPhamGioHang[]) : cartItems;
      const amount = toCheckout.reduce((s: number, it: ItemThanhToan) => {
        const price = Number(it.product?.gia?.hien_tai ?? it.gia?.hien_tai ?? it.price ?? 0) || 0;
        const soluong = Number(it.soluong ?? it.qty ?? 1) || 1;
        return s + price * soluong;
      }, 0);

      const resp = await fetch(`${API}/api/vnpay/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          gio_hang: toCheckout, 
          tong_tien: amount,
          returnUrl: `${window.location.origin}/hoan-tat-thanh-toan`
        })
      });
      const j = (await resp.json()) as { data?: { vnpUrl?: string } };
      if (!resp.ok || !j?.data?.vnpUrl) throw new Error("Không tạo được payment");
      window.location.href = j.data.vnpUrl!;
    } catch (err) {
      console.error(err);
      alert("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  const createOrderCOD = async () => {
    type CreatedResp = { data?: { orderId?: string; id?: string | number; order_id?: string } };
    try {
      const toCheckoutRaw = typeof window !== "undefined" ? sessionStorage.getItem("checkout_cart") : null;
      const toCheckout: ItemThanhToan[] = toCheckoutRaw ? (JSON.parse(toCheckoutRaw) as ItemThanhToan[]) : (cartItems as ItemThanhToan[]);
      const amount = toCheckout.reduce((s: number, it: ItemThanhToan) => {
        const price = Number(it.product?.gia?.hien_tai ?? it.gia?.hien_tai ?? it.price ?? 0) || 0;
        const soluong = Number(it.soluong ?? it.qty ?? 1) || 1;
        return s + price * soluong;
      }, 0);

      const payload = {
        gio_hang: toCheckout,
        tong_tien: amount,
        phuong_thuc_thanhtoan: "cod",
        returnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/hoan-tat-thanh-toan`
      };

      const endpoints = [
        `${API}/api/toi/donhang`,
        `${API}/api/donhang/create`,
        `${API}/api/orders`,
        `${API}/api/vnpay/create`
      ];

      let created: CreatedResp | null = null;

      // try endpoints via fetch first (broader compatibility)
      for (const url of endpoints) {
        try {
          const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
          });
          const j = await resp.json().catch(() => null) as CreatedResp | null;
          if (j && j.data && (j.data.orderId || j.data.id || j.data.order_id)) {
            created = j;
            break;
          }
        } catch {
          // ignore and try next
        }
      }

      // fallback: use api helper if available
      if (!created) {
        try {
          const j = await api.post("/api/toi/donhang", payload, { credentials: "include" }) as CreatedResp;
          if (j?.data && (j.data.orderId || j.data.id || j.data.order_id)) created = j;
        } catch {
          // ignore
        }
      }

      if (!created) throw new Error("Không tạo được đơn hàng");

      // extract id
      const orderId =
        (created.data?.orderId as string | undefined) ??
        (created.data?.id as string | number | undefined) ??
        (created.data?.order_id as string | undefined);

      // collect ids of items to remove from cart
      const idsToRemove = toCheckout
        .map((it) => (it.id_bienthesp ?? it.product?.id))
        .filter((v): v is string | number => Boolean(v));

      // Attempt to clear cart on server (best-effort)
      if (idsToRemove.length > 0) {
        try {
          // try bulk clear endpoint
          await api.post("/api/toi/giohang/clear", { ids: idsToRemove }, { credentials: "include" });
        } catch {
          // fallback: try deleting each item individually
          for (const id of idsToRemove) {
            try {
              // many mock APIs use DELETE /api/toi/giohang/:id or /api/giohang/:id
              await fetch(`${API}/api/toi/giohang/${encodeURIComponent(String(id))}`, {
                method: "DELETE",
                credentials: "include"
              });
            } catch {
              // ignore per-item failures
            }
          }
        }
      } else {
        // no ids available — try best-effort server-side clear
        try {
          await api.post("/api/toi/giohang/clear", {}, { credentials: "include" });
        } catch {
          // ignore
        }
      }

      // clear local snapshot + state
      try {
        sessionStorage.removeItem("checkout_cart");
      } catch {}
      setCartItems([]);

      // navigate to orders/status page so orders/page.tsx can fetch & show the order
      const idForUrl = typeof orderId === "number" ? String(orderId) : (orderId ?? "");
      const target = idForUrl ? `/orders?order_id=${encodeURIComponent(idForUrl)}` : "/orders";
      router.push(target);
    } catch (err) {
      console.error(err);
      alert("Không thể tạo đơn hàng COD. Vui lòng thử lại.");
    }
  };

  const itemCount = cartItems.length;
  const giftCount = cartItems.filter((it) => {
    const price =
      Number(it.product?.gia?.hien_tai ?? it.gia?.hien_tai ?? it.price ?? it.selling_price ?? it.unit_price ?? 0) || 0;
    return price === 0;
  }).length;

  // khi chưa đăng nhập — loading UI
  if (!isLoggedIn) {
    return (
      <>
        <FullHeader showClassicTopBar={true} showTopNav={false} />
        <div className="container py-20 text-center">
          <p className="text-lg">Đang kiểm tra đăng nhập...</p>
        </div>
      </>
    );
  }

  // address fallback (from profile or user)
  const addrName = (profile?.name as string) ?? (user?.name as unknown as string) ?? "Khách hàng";
  const addrPhone = (profile?.phone as string) ?? (user?.phone as unknown as string) ?? "";
  const addrStreet = (profile?.address_street as string) ?? "";
  const addrDistrict = (profile?.address_district as string) ?? "";
  const addrCity = (profile?.address_city as string) ?? "";
  const addrPostal = (profile?.address_postal as string) ?? "";

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />

      <div className="mb-0 breadcrumb py-26 bg-main-two-50">
        <div className="container container-lg">
          <div className="flex-wrap gap-16 breadcrumb-wrapper flex-between">
            <h6 className="mb-0">Thanh toán</h6>
            <ul className="flex-wrap gap-8 flex-align">
              <li className="text-sm">
                <Link href="/" className="gap-8 text-gray-900 flex-align hover-text-main-600">
                  <i className="ph ph-house"></i> Trang chủ
                </Link>
              </li>
              <li className="flex-align">
                <i className="ph ph-caret-right"></i>
              </li>
              <li className="text-sm text-main-600"> Thanh toán </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="py-40 checkout">
        <div className="container">
          <div className="row">
            {/* Left: Address + items */}
            <div className="col-xl-8 col-lg-8">
              {/* Address */}
              <div className="px-20 py-16 mb-16 border border-gray-100 rounded-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">{addrName} {addrPhone && <span className="text-neutral-600 ms-8">({addrPhone})</span>}</div>
                    <div className="mt-6 text-neutral-600">
                      {addrStreet}{addrStreet && (addrDistrict || addrCity) ? ", " : ""}{addrDistrict}{addrDistrict && addrCity ? ", " : ""}{addrCity}{addrPostal ? ` — ${addrPostal}` : ""}
                    </div>
                  </div>
                  <div>
                    <Link href="/account?tab=profile" className="text-main-600">Thay đổi</Link>
                  </div>
                </div>
              </div>

              <div className="px-20 py-20 border border-gray-100 rounded-8">
                <h5 className="mb-16">Mặt hàng thanh toán</h5>

                {loadingCart ? (
                  <div className="py-24 text-center">Đang tải giỏ hàng...</div>
                ) : cartItems.length === 0 ? (
                  <div className="py-24 text-center">Không có sản phẩm để thanh toán.</div>
                ) : (
                  cartItems.map((it, idx) => {
                    const qty = Number(it.quantity ?? it.qty ?? 1) || 1;
                    const title =
                      (it.ten as string) ??
                      (it.name as string) ??
                      (it.product && ((it.product.ten as string) || (it.product.name as string))) ??
                      "Sản phẩm";
                    const price =
                      Number(
                        it.product?.gia?.hien_tai ??
                          it.gia?.hien_tai ??
                          it.price ??
                          it.selling_price ??
                          it.unit_price ??
                          0
                      ) || 0;
                    const img = (it.product?.mediaurl as string) || "/assets/images/default-avatar.png";

                    return (
                      <div key={idx} className="gap-12 py-12 d-flex align-items-center border-bottom">
                        <div style={{ width: 88, height: 88, flexShrink: 0 }}>
                          <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                        </div>
                        <div className="flex-grow-1 text-start">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-8">{title}</h6>
                              <div className="text-sm text-neutral-600">Số lượng: {qty}</div>
                            </div>
                            <div className="text-end">
                              <div className="fw-semibold">{price.toLocaleString("vi-VN")} đ</div>
                              <div className="text-sm text-neutral-600">Thành: {(price * qty).toLocaleString("vi-VN")} đ</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Summary & payment */}
            <div className="col-xl-4 col-lg-4">
              <div className="px-24 py-40 border border-gray-100 rounded-8">
                <h6 className="mb-12">Thông tin giỏ hàng</h6>
                <div className="mb-12 text-sm text-neutral-600">
                  Đang thanh toán: <span className="fw-semibold">{itemCount} sản phẩm</span>
                  {giftCount > 0 && <span className="ms-8 text-neutral-600"> + {giftCount} quà tặng</span>}
                </div>

                <div className="gap-8 mb-12 flex-between">
                  <span className="text-gray-700">Tạm tính</span>
                  <span className="text-gray-900 fw-bold">{subtotal.toLocaleString()} đ</span>
                </div>
                <div className="gap-8 mb-12 flex-between">
                  <span className="text-gray-700">Giảm giá</span>
                  <span className="fw-bold" style={{ color: "#1ca56e" }}>-{discount.toLocaleString()} đ</span>
                </div>
                <div className="gap-8 mb-0 flex-between">
                  <span className="text-xl text-gray-900 fw-semibold">Tổng</span>
                  <span className="text-xl text-main-600 fw-bold">{total.toLocaleString()} đ</span>
                </div>

                <div className="mt-24">
                  <div className="my-12 form-check">
                    <input id="pm-online" type="radio" name="pm" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                    <label htmlFor="pm-online" className="ms-8">Thanh toán trực tuyến</label>
                  </div>
                  <div className="my-12 form-check">
                    <input id="pm-cod" type="radio" name="pm" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <label htmlFor="pm-cod" className="ms-8">Thanh toán khi nhận hàng (COD)</label>
                  </div>

                  {paymentMethod === "online" ? (
                    <button onClick={createVnPayAndRedirect} className="mt-16 btn btn-main w-100 py-14 rounded-8">
                      Tiến hành thanh toán
                    </button>
                  ) : (
                    <button onClick={createOrderCOD} className="mt-16 btn btn-main w-100 py-14 rounded-8">
                      Tiến hành thanh toán
                    </button>
                  )}

                  <Link href="/" className="mt-12 text-center d-block text-main-600">← Tiếp tục mua sắm</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BenefitsStrip />
    </>
  );
}