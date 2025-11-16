"use client";

import React from "react";
import Link from "next/link";
import FullHeader from "@/components/FullHeader";
import { useRouter } from "next/navigation";

export type AccountShellProps = {
  title?: string;
  current?: "wishlist" | "cart" | "orders" | "profile" | string;
  children: React.ReactNode;
  // optional: pass user from /account/page.tsx so AccountShell shows exact values from that page
  user?: {
    username: string;
    fullname: string;
    avatar?: string;
  };
};

export default function AccountShell({
  title = "Tài khoản",
  current = "wishlist",
  children,
  user: userProp,
}: AccountShellProps) {
  const router = useRouter();

  // Prefer user passed from /account/page.tsx (userProp).
  // Fallback: try to read from localStorage when client-side.
  const user = React.useMemo(() => {
    if (userProp && userProp.username) return userProp;
    if (typeof window !== "undefined") {
      return {
        username: localStorage.getItem("username") ?? "hotb",
        fullname: localStorage.getItem("fullname") ?? "Trần Bá Hộ",
        avatar: localStorage.getItem("avatar") ?? "/assets/images/default-avatar.png",
      };
    }
    return { username: "hotb", fullname: "Trần Bá Hộ", avatar: "/assets/images/default-avatar.png" };
  }, [userProp]);

  // Notification counts - replace with real values from API/state
  const notifications = {
    unread: 1,
    orders: 0,
    vouchers: 0,
    news: 0,
  };

  const tabs: { key: AccountShellProps["current"]; label: string; href: string; icon: string }[] = [
    { key: "profile", label: "Thông tin cá nhân", href: "/account", icon: "ph ph-user" },
    { key: "notifications", label: "Hiện thông báo", href: "/account/notifications", icon: "ph ph-bell" },
    { key: "orders", label: "Đơn hàng của tôi", href: "/orders", icon: "ph ph-notepad" },
    { key: "addresses", label: "Sổ địa chỉ", href: "/account/addresses", icon: "ph ph-map-pin" },
    { key: "reviews", label: "Đánh giá sản phẩm", href: "/account/reviews", icon: "ph ph-star" },
    { key: "wishlist", label: "Sản phẩm yêu thích", href: "/wishlist", icon: "ph ph-heart" },
    { key: "cart", label: "Giỏ hàng", href: "/cart", icon: "ph ph-shopping-cart" },
    { key: "support", label: "Hỗ trợ khách hàng", href: "/account/support", icon: "ph ph-headset" },
  ];

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("fullname");
      }
    } catch {}
    router.push("/");
  };

  return (
    <>
      <section className="py-24">
        <div className="container container-lg">
          <div className="gap-8 mb-16 text-sm text-gray-600 d-flex align-items-center">
            <Link href="/" className="link">Trang chủ</Link>
            <span>/</span>
            <span>{title}</span>
          </div>

          <div className="row g-16">
            <aside className="col-lg-3">
              <div className="p-12 bg-white border border-gray-100 rounded-12 d-flex flex-column" style={{ minHeight: 420 }}>
                {/* User card - emphasized */}
                <div
                  className="mb-12 d-flex align-items-center"
                  style={{
                    padding: 1,
                    borderRadius: 10,
                    background: "#f6f9fb",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt="avatar"
                    width={72}
                    height={72}
                    style={{
                      borderRadius: 12, // more rounded to separate from the card
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      flex: "0 0 72px",
                    }}
                  />
                  <div style={{ minWidth: 0, marginLeft: 12 }}>
                    <div className="fw-bold" style={{ fontSize: 16, lineHeight: 1 }}>{user.fullname}</div>
                    <div className="text-sm text-muted" style={{ marginTop: 2 }}>@{user.username}</div>
                  </div>
                </div>

                {/* Tabs list */}
                <nav className="gap-8 mb-8 d-grid" aria-label="Account navigation">
                  {tabs.map((t) => {
                    const isCurrent = current === t.key;
                    return (
                      <Link
                        key={t.key}
                        href={t.href}
                        className={`btn w-100 d-flex align-items-center justify-content-between ${isCurrent ? "bg-main-600 text-white" : "bg-main-50 text-main-700"}`}
                        style={{
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: isCurrent ? "var(--main-600)" : "var(--main-200,#e6e6e6)",
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      >
                        <span className="d-flex align-items-center">
                          <i className={t.icon} style={{ width: 18 }} />
                          <span className="ms-6" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>
                        </span>

                        <span className="d-flex align-items-center">
                          {t.key === "notifications" && notifications.unread > 0 && (
                            <span className="text-white badge bg-danger" style={{ fontSize: 12, minWidth: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
                              {notifications.unread > 9 ? "9+" : notifications.unread}
                            </span>
                          )}

                          {isCurrent && <i className="ph ph-caret-right ms-8" />}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <div style={{ flex: 1 }} />

                
              </div>
              {/* Logout button */}
              <div>
                <button type="button" onClick={handleLogout} className="btn w-100 btn-danger">{/* outline- xuất hiện ở giữa btn-danger khiến nút này bị ẩn cho đến khi hover */}
                  <i className="ph ph-sign-out" /> <span className="ms-8">Đăng xuất</span>
                </button>
              </div>
            </aside>
            

            <main className="col-lg-9">
              <div className="p-16 bg-white border border-gray-100 rounded-12">
                {children}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}