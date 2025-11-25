'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Dữ liệu danh mục
const categories = [
    { name: 'Sức khỏe', icon: 'suc-khoe.svg', slug: 'suc-khoe' },
    { name: 'Thực phẩm chức năng', icon: 'thuc-pham-chuc-nang.svg', slug: 'thuc-pham-chuc-nang' },
    { name: 'Chăm sóc cá nhân', icon: 'cham-soc-ca-nhan.svg', slug: 'cham-soc-ca-nhan' },
    { name: 'Làm đẹp', icon: 'lam-dep.svg', slug: 'lam-dep' },
    { name: 'Điện máy', icon: 'dien-may.svg', slug: 'dien-may' },
    { name: 'Thiết bị y tế', icon: 'thiet-bi-y-te.svg', slug: 'thiet-bi-y-te' },
    { name: 'Bách hoá', icon: 'bach-hoa.svg', slug: 'bach-hoa' },
    { name: 'Nội thất - Trang trí', icon: 'noi-that-trang-tri.svg', slug: 'noi-that-trang-tri' },
    { name: 'Mẹ & bé', icon: 'me-va-be.svg', slug: 'me-va-be' },
    { name: 'Thời trang', icon: 'thoi-trang.svg', slug: 'thoi-trang' },
    { name: 'Thực phẩm - đồ ăn', icon: 'thuc-pham-do-an.svg', slug: 'thuc-pham-do-an' },
];

// Dữ liệu sản phẩm quà tặng
const gifts = [
    {
        id: 1,
        title: 'Tặng 1 sản phẩm bách hóa khi mua 3 sản phẩm bất kỳ từ Trung Tâm Bán Hàng nhân ngày sinh nhật 13/10',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '12 tháng 6 ngày',
        link: 'https://sieuthivina.com/qua-tang/tang-1-san-pham-bach-hoa-khi-mua-3-san-pham-bat-ky-tu-trung-tam-ban-hang-nhan-ngay-sinh-nhat-1310',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=stv-trading'
    },
    {
        id: 2,
        title: 'Tặng 1 hộp quà tặng cao cấp từ NEST100 Ngũ Phúc Luxury',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/hop-qua-tang-cao-cap-ngu-phuc-luxury-to-yen-tinh-che-va-yen-chung-nest100-cao-cap-kem-tui-2.webp',
        brand: 'GLOBAL (Yến Sào NEST100)',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/nest100.jpg',
        description: 'Mua bộ 3 sản phẩm khác nhau từ cửa hàng thương hiệu NEST100, tặng 1 hộp quà tặng cao cấp Ngũ Phúc Luxury trị giá ~900.000 VNĐ nhân dịp gần đầu năm 2026',
        timeLeft: '2 tháng 21 ngày',
        link: 'https://sieuthivina.com/qua-tang/tang-1-hop-qua-tang-cao-cap-tu-nest100-ngu-phuc-luxury',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=global-yen-sao-nest100'
    },
    {
        id: 3,
        title: 'Tặng 1 quà Trung Thu khi mua 3 sản phẩm từ Trung Tâm Bán Hàng',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '12 tháng 28 ngày',
        link: 'https://sieuthivina.com/qua-tang/tang-1-qua-trung-thu-khi-mua-3-san-pham-tu-trung-tam-ban-hang',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=stv-trading'
    },
    {
        id: 4,
        title: 'Tặng 1 sản phẩm từ thương hiệu khi thêm 5 sản phẩm bất kỳ trong giỏ hàng của thương hiệu',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/sam-ngoc-linh-truong-sinh-do-thung-24lon-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '10 tháng 28 ngày',
        link: 'https://sieuthivina.com/qua-tang/tang-1-san-pham-tu-thuong-hieu-khi-them-5-san-pham-bat-ky-trong-gio-hang-cua-thuong-hieu',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=stv-trading'
    },
    {
        id: 5,
        title: 'Tặng 1 thiết bị y tế khi 2 sản phẩm y tế khác nhau của thương hiệu y tế ABENA',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/tam-lot-abena-pad-45x45-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '1 tháng 6 ngày',
        link: 'https://sieuthivina.com/qua-tang/tang-1-thiet-bi-y-te-khi-2-san-pham-y-te-khac-nhau-cua-thuong-hieu-y-te-abena',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=stv-trading'
    },
    {
        id: 6,
        title: 'Ưu đãi sinh nhật 13/10 - Tặng 1 sản phẩm bất kỳ',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-2.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Mua 2 sản phẩm từ Trung Tâm Bán Hàng Siêu Thị Vina để nhận được ưu đãi tặng 1 sản phẩm nhân ngày sinh nhật 13/10',
        timeLeft: '11 tháng 25 ngày',
        link: 'https://sieuthivina.com/qua-tang/uu-dai-sinh-nhat-1310-tang-1-san-pham-bat-ky',
        brandLink: 'https://sieuthivina.com/san-pham?thuonghieu=stv-trading'
    }
];

export default function GiftPromotion() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="color-two font-exo header-sticky-style">
            {/* CSS Links */}
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/select2.min.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/slick.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/jquery-ui.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/animate.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/aos.css" />
            <link rel="stylesheet" href="https://sieuthivina.com/assets/client/css/main.css" />

            <div className="overlay"></div>
            <div className="side-overlay"></div>

            {/* Scroll to Top */}
            <div className="progress-wrap">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                </svg>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu scroll-sm d-lg-none d-block ${mobileMenuOpen ? 'active' : ''}`}>
                <button type="button" className="close-button" onClick={() => setMobileMenuOpen(false)}>
                    <i className="ph ph-x"></i>
                </button>
                <div className="mobile-menu__inner logo">
                    <a href="https://sieuthivina.com" className="mobile-menu__logo">
                        <img src="https://sieuthivina.com/assets/client/images/logo/logo_nguyenban.png" alt="Logo" />
                    </a>
                    <div className="mobile-menu__menu">
                        <ul className="nav-menu flex-align nav-menu--mobile">
                            <li className="nav-menu__item">
                                <form action="https://sieuthivina.com/tim-kiem" className="position-relative w-100">
                                    <input type="text" name="query" className="form-control text-sm fw-medium placeholder-italic shadow-none bg-neutral-30 placeholder-fw-medium placeholder-light py-10 ps-20 pe-60" placeholder="Phiền Muộn Của Afratu..." required />
                                    <button type="submit" className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1">
                                        <i className="ph-bold ph-magnifying-glass"></i>
                                    </button>
                                </form>
                            </li>
                            <li className="av-menu__item pt-10">
                                <a href="https://sieuthivina.com/dang-ky" className="nav-menu__link text-heading-two hover-text-main-600"><i className="ph-bold ph-user text-main-600"></i> Đăng ký thành viên</a>
                            </li>
                            <li className="nav-menu__item">
                                <a href="https://sieuthivina.com/tra-cuu-don-hang" className="nav-menu__link text-heading-two hover-text-main-600"><i className="ph-bold ph-notepad text-main-600"></i> Tra cứu đơn hàng</a>
                            </li>
                            <li className="nav-menu__item">
                                <a href="#" className="nav-menu__link text-heading-two hover-text-main-600"><i className="ph-bold ph-info text-main-600"></i> Giới thiệu về Siêu Thị Vina</a>
                            </li>
                            <li className="nav-menu__item">
                                <a href="contact.html" className="nav-menu__link text-heading-two hover-text-main-600"><i className="ph-bold ph-chat-dots text-main-600"></i> Liên hệ hỗ trợ</a>
                            </li>
                            <li className="nav-menu__item pt-10">
                                <a href="https://sieuthivina.com/dang-nhap" className="d-flex justify-content-center align-content-around text-center gap-10 fw-medium text-white py-14 px-24 bg-main-600 rounded-pill line-height-1 hover-bg-main-50 hover-text-main-600">
                                    <span className="d-lg-none d-flex line-height-1"><i className="ph-bold ph-user"></i></span>
                                    Đăng nhập
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Header Top Desktop */}
            <div className="header-top bg-main-600 flex-between py-10 d-none d-lg-block pz100">
                <div className="container container-lg">
                    <div className="flex-between flex-wrap gap-8">
                        <ul className="header-top__right flex-align flex-wrap gap-16">
                            <li className="flex-align"><a href="https://sieuthivina.com/dang-ky" className="text-white-6 text-sm hover-text-white"><i className="ph-bold ph-user text-white-6"></i> Đăng ký thành viên</a></li>
                            <li className="flex-align"><a href="" className="text-white-6 text-sm hover-text-white pe-1"><i className="ph-bold ph-info text-white-6"></i> Giới thiệu về Siêu Thị Vina </a></li>
                            <li className="flex-align"><a href="" className="text-white-6 text-sm hover-text-white"><i className="ph-bold ph-chat-dots"></i> Liên hệ hỗ trợ</a></li>
                        </ul>
                        <ul className="header-top__right flex-align flex-wrap gap-16">
                            <li className=" d-block on-hover-item text-white-6 flex-shrink-0">
                                <button className="category__button flex-align gap-4 text-sm text-white-6 rounded-top">
                                    <span className="icon text-sm d-md-flex d-none"><i className="ph ph-squares-four"></i></span>
                                    <span className="d-sm-flex d-none">Danh mục</span>
                                </button>
                                <div className="responsive-dropdown on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper">
                                    <button className="close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex">
                                        <i className="ph ph-x"></i> </button>
                                    <div className="logo px-16 d-lg-none d-block">
                                        <a href="https://sieuthivina.com" className="link">
                                            <img src="https://sieuthivina.com/assets/client/images/logo/logo_nguyenban.png" alt="Logo" />
                                        </a>
                                    </div>
                                    <ul className="scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto">
                                        {categories.map((cat) => (
                                            <li key={cat.slug} className="has-submenus-submenu">
                                                <a href={`https://sieuthivina.com/san-pham?danhmuc=${cat.slug}`} className="text-gray-600 text-15 py-12 px-16 flex-align gap-4 rounded-0">
                                                    <span className="text-xl d-flex"><img src={`https://sieuthivina.com/assets/client/images/categories/${cat.icon}`} alt={cat.name} width="70%" /></span>
                                                    <span>{cat.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                            <li className="flex-align"><a href="https://sieuthivina.com/tra-cuu-don-hang" className="text-white-6 text-sm hover-text-white"><i className="ph-bold ph-notepad"></i> Tra cứu đơn hàng</a></li>
                            <li className="flex-align"><a href="/gio-hang" className="text-white-6 text-sm hover-text-white"><i className="ph-bold ph-shopping-cart"></i> Giỏ hàng <span className="badge bg-success-600 rounded-4 px-6 py-4"> 0 </span></a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Header Main */}
            <header className="header border-bottom border-neutral-40 pt-16 pb-10 pz99">
                <div className="container container-lg">
                    <nav className="header-inner flex-between gap-16">
                        <div className="logo">
                            <a className="link" aria-label="Trang chủ Siêu Thị Vina" href="/">
                                <img alt="Logo" width="140" height="40" src="https://sieuthivina.com/assets/client/images/logo/logo_nguyenban.png" />
                            </a>
                        </div>
                        <div className="header-menu w-50 d-lg-block d-none">
                            <div className="mx-20">
                                <form className="position-relative w-100 d-md-block d-none">
                                    <input className="form-control text-sm fw-normal placeholder-italic shadow-none bg-neutral-30 placeholder-fw-normal placeholder-light py-10 ps-30 pe-60" placeholder="Sâm Ngọc Linh...." required type="text" name="query" />
                                    <button type="submit" className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1" title="Tìm kiếm">
                                        <i className="ph-bold ph-magnifying-glass"></i>
                                    </button>
                                </form>
                                <div className="flex-align mt-10 gap-12 title">
                                    <a className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=sâm ngọc linh">Sâm Ngọc Linh</a>
                                    <a className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=sách hán ngữ 3">Sách hán ngữ 3</a>
                                    <a className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=móc khóa genshin">Móc khóa genshin</a>
                                    <a className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=đồ chơi minecraft">Đồ chơi minecraft</a>
                                    <a className="text-sm link text-gray-600 hover-text-main-600 fst-italic" href="/shop?query=điện nội thất">Điện nội thất</a>
                                </div>
                            </div>
                        </div>
                        <div className="header-right flex-align">
                            <ul className="header-top__right style-two style-three flex-align flex-wrap d-lg-block d-none">
                                <li className="d-sm-flex d-none">
                                    <a className="d-flex align-content-around gap-10 fw-medium text-main-600 py-14 px-24 bg-main-50 rounded-pill line-height-1 hover-bg-main-600 hover-text-white" href="/dang-nhap">
                                        <span className="d-sm-flex d-none line-height-1"><i className="ph-bold ph-user"></i></span>Đăng nhập
                                    </a>
                                </li>
                            </ul>
                            <button type="button" className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex" onClick={() => setMobileMenuOpen(true)}>
                                <i className="ph ph-list"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="page">
                <div className="breadcrumb mb-0 pt-40 bg-main-two-60">
                    <div className="container container-lg">
                        <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                            <h6 className="mb-0">Ưu đãi quà tặng</h6>
                        </div>
                    </div>
                </div>

                <section className="shop pt-40 pb-120">
                    <div className="container container-lg">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-lg-3">
                                <form className="shop-sidebar" action="https://sieuthivina.com/qua-tang" method="get">
                                    <button type="button" className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600">
                                        <i className="ph ph-x"></i>
                                    </button>
                                    <div className="shop-sidebar__box border border-gray-100 rounded-8 p-26 pb-0 mb-32">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-16 mb-16">Sắp xếp ưu đãi</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            {['popular', 'newest', 'expiring'].map(type => (
                                                <li className="mb-20" key={type}>
                                                    <div className="form-check common-check common-radio">
                                                        <input className="form-check-input" type="radio" name="sort" id={type} value={type} />
                                                        <label className="form-check-label" htmlFor={type}>
                                                            {type === 'popular' ? 'Phổ biến' : type === 'newest' ? 'Mới nhất' : 'Sắp hết hạn'}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="shop-sidebar__box border border-gray-100 rounded-8 p-26 pb-0 mb-32">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-16 mb-24">Nhà cung cấp</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            <li className="mb-16">
                                                <div className="form-check common-check common-radio">
                                                    <input className="form-check-input" type="radio" name="provider" id="provider-1" value="1" />
                                                    <label className="form-check-label" htmlFor="provider-1">STV Trading</label>
                                                </div>
                                            </li>
                                            <li className="mb-16">
                                                <div className="form-check common-check common-radio">
                                                    <input className="form-check-input" type="radio" name="provider" id="provider-4" value="4" />
                                                    <label className="form-check-label" htmlFor="provider-4">GLOBAL (Yến Sào NEST100)</label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="shop-sidebar__box rounded-8 flex-align justify-content-between mb-32">
                                        <a href="https://sieuthivina.com/qua-tang" className="btn border-main-600 text-main-600 hover-bg-main-600 hover-border-main-600 hover-text-white rounded-8 px-32 py-12 w-100">
                                            Xóa bộ lọc
                                        </a>
                                    </div>
                                </form>
                            </div>

                            {/* Product Grid */}
                            <div className="col-lg-9">
                                <div className="flex-between gap-16 flex-wrap mb-40 ">
                                    <span className="text-gray-900">Hiển thị 6 trên 6 kết quả</span>
                                    <div className="position-relative flex-align gap-16 flex-wrap">
                                        <button type="button" className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn">
                                            <i className="ph-bold ph-funnel"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="row g-12">
                                    {gifts.map((gift) => (
                                        <div key={gift.id} className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                                            <div className="product-card h-100 border border-gray-100 hover-border-main-600 rounded-6 position-relative transition-2">
                                                <Link href={`/chi-tiet-qt/${gift.id}`} className="flex-center rounded-8 bg-gray-50 position-relative">
                                                    <Image
                                                        src={gift.image}
                                                        alt={gift.title}
                                                        width={300}
                                                        height={300}
                                                        className="w-100 rounded-top-2"
                                                    />
                                                </Link>
                                                <div className="product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex mt-10 px-10 pb-8">
                                                    <div>
                                                        <div className="flex-align justify-content-between mt-5">
                                                            <div className="flex-align gap-4 w-100">
                                                                <span className="text-main-600 text-md d-flex">
                                                                    <i className="ph-fill ph-storefront"></i>
                                                                </span>
                                                                <span
                                                                    className="text-gray-500 text-xs"
                                                                    title={gift.brand}
                                                                    style={{
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        maxWidth: '100%',
                                                                        display: 'inline-block'
                                                                    }}
                                                                >
                                                                    {gift.brand}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <h6 className="title text-lg fw-semibold mt-2 mb-2">
                                                            <Link href={`/chi-tiet-qt/${gift.id}`} className="link text-line-2" tabIndex={0}>
                                                                {gift.title}
                                                            </Link>
                                                        </h6>
                                                        <div className="flex-align justify-content-between mt-2">
                                                            <div className="flex-align gap-6">
                                                                <span className="text-xs fw-medium text-gray-500">Đánh giá</span>
                                                                <span className="text-xs fw-medium text-gray-500">
                                                                    5.0 <i className="ph-fill ph-star text-warning-600"></i>
                                                                </span>
                                                            </div>
                                                            <div className="flex-align gap-4">
                                                                <span className="text-xs fw-medium text-gray-500">0</span>
                                                                <span className="text-xs fw-medium text-gray-500">Đã bán</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="product-card__price mt-5">
                                                        <div className="flex-align gap-8 p-4 bg-gray-50 rounded-6">
                                                            <span className="text-main-600 text-md d-flex">
                                                                <i className="ph-bold ph-timer"></i>
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                Còn <strong>{gift.timeLeft}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
