"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

export default function TopHeaderBar() {
    const { totalItems } = useCart();

    return (
        <>
            {/* Thanh đỏ trên cùng */}
            <div style={{ background: "rgb(229, 57, 53)", width: "100%", padding: "10px 0px", display: "block" }}>
                <div className="container container-lg">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                        }}
                    >
                        {/* Nhóm trái: Đăng ký / Giới thiệu / Liên hệ */}
                        <ul
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px",
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <li style={{ display: "flex", alignItems: "center" }}>
                                <Link
                                    href="/dangky"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph-bold ph-user"></i> Đăng ký thành viên
                                </Link>
                            </li>
                            <li style={{ display: "flex", alignItems: "center" }}>
                                <a
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph-bold ph-info"></i> Giới thiệu về Siêu Thị Vina
                                </a>
                            </li>
                            <li style={{ display: "flex", alignItems: "center" }}>
                                <a
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph-bold ph-chat-dots"></i> Liên hệ hỗ trợ
                                </a>
                            </li>
                        </ul>

                        {/* Nhóm phải: Danh mục / Tra cứu đơn hàng / Giỏ hàng */}
                        <ul
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px",
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <li style={{ display: "flex", alignItems: "center", position: "relative" }}>
                                <a
                                    href="#"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph ph-squares-four"></i> Danh mục
                                </a>
                            </li>
                            <li style={{ display: "flex", alignItems: "center" }}>
                                <Link
                                    href="/orders"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph-bold ph-notepad"></i> Tra cứu đơn hàng
                                </Link>
                            </li>
                            <li style={{ display: "flex", alignItems: "center" }}>
                                <Link
                                    href="/gio-hang"
                                    style={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontSize: "14px",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <i className="ph-bold ph-shopping-cart"></i> Giỏ hàng
                                    <span
                                        style={{
                                            background: "rgb(0, 230, 118)",
                                            color: "rgb(255, 255, 255)",
                                            borderRadius: "4px",
                                            padding: "2px 6px",
                                            marginLeft: "4px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {totalItems}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Header chính */}
            <header className="header border-bottom border-neutral-40 pt-16 pb-10" style={{ zIndex: 99 }}>
                <div className="container container-lg">
                    <nav className="header-inner flex-between gap-16">
                        <div className="logo">
                            <Link className="link" aria-label="Trang chủ Siêu Thị Vina" href="/">
                                <Image
                                    alt="Logo"
                                    width={140}
                                    height={40}
                                    src="/assets/images/logo/logo_nguyenban.png"
                                />
                            </Link>
                        </div>
                        <div className="header-menu w-50 d-lg-block d-none">
                            <div className="mx-20">
                                <form className="position-relative w-100 d-md-block d-none">
                                    <input
                                        className="form-control text-sm fw-normal placeholder-italic shadow-none bg-neutral-30 placeholder-fw-normal placeholder-light py-10 ps-30 pe-60"
                                        placeholder="Sâm Ngọc Linh...."
                                        required
                                        type="text"
                                        name="query"
                                    />
                                    <button
                                        type="submit"
                                        className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1"
                                        title="Tìm kiếm"
                                    >
                                        <i className="ph-bold ph-magnifying-glass"></i>
                                    </button>
                                </form>
                                <div className="flex-align mt-10 gap-12 title">
                                    <Link className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=sâm ngọc linh">
                                        Sâm Ngọc Linh
                                    </Link>
                                    <Link className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=sách hán ngữ 3">
                                        Sách hán ngữ 3
                                    </Link>
                                    <Link className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=móc khóa genshin">
                                        Móc khóa genshin
                                    </Link>
                                    <Link className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=đồ chơi minecraft">
                                        Đồ chơi minecraft
                                    </Link>
                                    <Link className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=điện nội thất">
                                        Điện nội thất
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="header-right flex-align">
                            <ul className="header-top__right style-two style-three flex-align flex-wrap d-lg-block d-none">
                                <li className="d-sm-flex d-none">
                                    <Link
                                        className="d-flex align-content-around gap-10 fw-medium text-main-600 py-14 px-24 bg-main-50 rounded-pill line-height-1 hover-bg-main-600 hover-text-white"
                                        href="/account"
                                    >
                                        <span className="d-sm-flex d-none line-height-1">
                                            <i className="ph-bold ph-user"></i>
                                        </span>
                                        Đăng nhập
                                    </Link>
                                </li>
                            </ul>
                            <button
                                type="button"
                                className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex"
                            >
                                <i className="ph ph-list"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
}
