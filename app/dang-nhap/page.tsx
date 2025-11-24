"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
// Đã loại bỏ 'getTokenFromResponse' và 'LoginResponse' vì không còn dùng
import { api } from "../../lib/api"; 
import { useRouter } from "next/navigation";
import AuthFooter from "@/components/AuthFooter";
import Cookies from "js-cookie";

// Định nghĩa kiểu cho phản hồi (response) từ API Laravel [cite: 156-160]
type LoginForm = {
  username: string;
  password: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

type ApiError = {
  errors?: Record<string, string[]>;
  message?: string;
  data?: unknown;
};

type MessageState = {
  type: "success" | "error";
  text: string;
};

const isApiError = (err: unknown): err is ApiError =>
  typeof err === "object" && err !== null && ("errors" in err || "message" in err);

export default function Page() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = (): string | null => {
    const u = (form.username ?? "").trim();
    const p = form.password ?? "";
    if (!u) return "Vui lòng nhập Tên đăng nhập";
    if (!/^[A-Za-z0-9_]{1,15}$/.test(u)) return "Username không hợp lệ (chỉ chữ, số, _ , tối đa 15 ký tự)";
    if (!p) return "Vui lòng nhập mật khẩu";
    if (!/^[A-Za-z0-9_]{6,15}$/.test(p)) return "Mật khẩu không hợp lệ (6-15 ký tự, chỉ chữ/số/_)";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    // read values from form element to avoid stale state
    const formEl = e.currentTarget as HTMLFormElement;
    const fd = new FormData(formEl);
    const username = String(fd.get("username") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (!username) {
      setMessage({ type: "error", text: "Vui lòng nhập Tên đăng nhập" });
      return;
    }
    if (!password) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu" });
      return;
    }

    setLoading(true);
    try {
      try { localStorage.removeItem("access_token"); } catch {}

      const payload = { username, password };
      console.debug("LOGIN payload:", payload);

      const rawResp = await fetch("http://148.230.100.215/api/auth/dang-nhap", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const parsed = await rawResp.json().catch(() => ({}));
      console.debug("LOGIN response:", rawResp.status, parsed);

      const resp: ApiResponse = parsed as ApiResponse;

    //   if (resp.success && typeof resp.token === "string" && resp.token.length > 0) {
    //     try { localStorage.setItem("access_token", resp.token); } catch {}
    //     setMessage({ type: "success", text: resp.message ?? "Đăng nhập thành công!" });
    //     router.push("/");
    //     return;
    //   }
    
        if (resp.success && resp.token) {
            Cookies.set("access_token", resp.token, {
                expires: 1,          // 1 ngày
                path: "/",
            });

            setMessage({ type: "success", text: resp.message ?? "Đăng nhập thành công!" });
            router.push("/");
            return;
        }

      if (resp.errors && typeof resp.errors === "object") {
        const firstKey = Object.keys(resp.errors)[0];
        const firstMsg = resp.errors[firstKey]?.[0] ?? resp.message ?? "Dữ liệu không hợp lệ";
        setMessage({ type: "error", text: firstMsg });
        return;
      }

      setMessage({ type: "error", text: resp.message ?? "Thông tin đăng nhập không hợp lệ." });
    } catch (err: unknown) {
      console.error("Login error:", err);
      let msg = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (isApiError(err)) {
        msg = err.message ?? msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };
    // ===============================================
    // KẾT THÚC CẬP NHẬT
    // ===============================================

    return (
        <main className="d-flex flex-column min-vh-100">
            {/* Header trắng */}
            <header className="py-12 bg-white border-bottom border-neutral-40">
                <div className="container container-lg">
                    <div className="flex-between flex-align">
                        <div className="gap-10 d-flex flex-align">
                            <Image
                                src="/assets/images/logo/logo_nguyenban.png"
                                alt="Logo"
                                width={180}
                                height={60}
                                style={{ objectFit: "contain" }}
                                priority
                            />
                            <span className="mb-0 h6 ms-8">Đăng nhập</span>
                        </div>
                        <a href="#" style={{ color: "#ee4d2d" }} className="text-sm">
                            Bạn cần giúp đỡ?
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero nền cam */}
            <section
                className="py-40 flex-grow-1"
                style={{ background: "#FF4500", paddingBottom: 120 }}
            >
                <div className="container container-lg">
                    <div className="row flex-align" style={{ marginTop: 56 }}>
                        {/* Banner trái */}
                        <div className="col-lg-7 d-lg-block d-none">
                            <div
                                className="overflow-hidden position-relative w-100 rounded-10"
                                style={{ height: 420 }}
                            >
                                <Image
                                    src="/assets/images/logo/mau-banner-quang-cao-khuyen-mai.jpg"
                                    alt="Promo"
                                    fill
                                    sizes="(max-width: 1200px) 50vw, 700px"
                                    className="object-fit-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Card đăng nhập */}
                        <div className="col-lg-5 col-12">
                            <div
                                className="p-24 bg-white border rounded-10"
                                style={{ maxWidth: 420, marginLeft: "auto", borderColor: "#e5e5e5", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                            >
                                <div className="mb-8 d-flex flex-between flex-align">
                                    <h5 className="mb-0 text-heading fw-semibold">Đăng nhập</h5>
                                    <button type="button" className="gap-6 bg-white border btn btn-sm rounded-6 d-flex flex-align" style={{ borderColor: "#ffd1c4", color: "#ee4d2d" }}>
                                        <span className="text-sm">Đăng nhập với mã QR</span>
                                        <i className="ph ph-qr-code"></i>
                                    </button>
                                </div>

                                {message && (
                                    <div
                                        className={`mb-16 p-12 rounded-8 ${
                                        message.type === "success"
                                            ? "bg-success-50 text-success-700 border border-success-100"
                                            : "bg-danger-50 text-danger-700 border border-danger-100"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-12">
                                        <input
                                            id="username"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="px-16 bg-white border shadow-none form-control rounded-6"
                                            placeholder="Tên đăng nhập"
                                            type="text"
                                            style={{ height: 46, borderColor: "#e5e5e5", fontSize: 14 }}
                                        />
                                    </div>
                                    <div className="mb-12">
                                        <div className="position-relative">
                                            <input
                                                id="password"
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className="px-16 bg-white border shadow-none form-control rounded-6 pe-40"
                                                placeholder="Mật khẩu"
                                                type="password"
                                                style={{ height: 46, borderColor: "#e5e5e5", fontSize: 14 }}
                                            />
                                            <i className="ph ph-eye-slash position-absolute" style={{ right: 12, top: 12, color: "#bbb" }}></i>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="py-12 text-white btn w-100 rounded-8 text-uppercase fw-semibold"
                                        style={{ background: "#ee4d2d", letterSpacing: 0.5 }}
                                    >
                                        {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                                    </button>

                                    <div className="mt-10 d-flex justify-content-end">
                                        <a href="#" className="text-sm" style={{ color: "#ee4d2d" }}>Quên mật khẩu</a>
                                    </div>

                                    {/* divider */}
                                    <div className="gap-12 my-16 d-flex flex-align justify-content-center">
                                        <span className="border-bottom" style={{ width: "30%", borderBottomColor: "#efefef", borderBottomWidth: 1, display: "inline-block" }}></span>
                                        <span className="text-gray-500" style={{ fontSize: 12, letterSpacing: 1 }}>HOẶC</span>
                                        <span className="border-bottom" style={{ width: "30%", borderBottomColor: "#efefef", borderBottomWidth: 1, display: "inline-block" }}></span>
                                    </div>

                                    {/* Social buttons */}
                                    <div className="gap-12 d-flex">
                                        <button type="button" className="gap-8 py-12 bg-white border btn rounded-8 w-50 d-flex align-items-center justify-content-center hover-bg-neutral-50 social-btn" style={{ borderColor: "#e5e5e5", color: "#222", fontSize: 15, minWidth: 180 }}>
                                            <span className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 24, height: 24, background: "#1877F2" }}>
                                                <i className="text-white ph-fill ph-facebook-logo"></i>
                                            </span>
                                            <strong>Facebook</strong>
                                        </button>
                                        <button type="button" className="gap-8 py-12 bg-white border btn rounded-8 w-50 d-flex align-items-center justify-content-center hover-bg-neutral-50 social-btn" style={{ borderColor: "#e5e5e5", color: "#222", fontSize: 15, minWidth: 180 }}>
                                            <span className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 24, height: 24, background: "#EA4335" }}>
                                                <i className="text-white ph ph-google-logo"></i>
                                            </span>
                                            <strong>Google</strong>
                                        </button>
                                    </div>

                                    {/* Switch to đăng ký */}
                                    <div className="mt-16 text-center">
                                        <span className="text-sm" style={{ color: "#bdbdbd" }}>Bạn mới đến với Siêu Thị Vina? </span>
                                        <Link className="text-sm fw-semibold" href="/dang-ky" style={{ color: "#ee4d2d" }}>Đăng ký</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <AuthFooter />

            <style jsx global>{`
                :root, html, body { background: #fff !important; }
                .bg-overlay::before { display: none !important; }
                .gradient-shadow::before, .gradient-shadow::after { display: none !important; }
            `}</style>
            <style jsx>{`
                .social-btn strong {
                display: inline-block !important;
                margin-left: 8px !important;
                color: #111 !important;
                font-weight: 800 !important;
                font-size: 16px !important;
                letter-spacing: .2px;
                }
            `}</style>
        </main>
    );
}