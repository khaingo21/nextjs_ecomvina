'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Mock data matching the 6 items from the previous page
// In a real app, this would come from an API or database
const giftsData = [
    {
        id: 1,
        title: 'Tặng 1 sản phẩm bách hóa khi mua 3 sản phẩm bất kỳ từ Trung Tâm Bán Hàng nhân ngày sinh nhật 13/10',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '2025-10-13', // Example date
        giftProduct: {
            name: 'Nước rửa bát Bio Formula',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp',
            unit: 'Túi 500ml',
            quantity: 1
        },
        condition: 'Mua 3 sản phẩm để nhận quà'
    },
    {
        id: 2,
        title: 'Tặng 1 hộp quà tặng cao cấp từ NEST100 Ngũ Phúc Luxury',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/hop-qua-tang-cao-cap-ngu-phuc-luxury-to-yen-tinh-che-va-yen-chung-nest100-cao-cap-kem-tui-2.webp',
        brand: 'GLOBAL (Yến Sào NEST100)',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/nest100.jpg',
        description: 'Mua bộ 3 sản phẩm khác nhau từ cửa hàng thương hiệu NEST100, tặng 1 hộp quà tặng cao cấp Ngũ Phúc Luxury trị giá ~900.000 VNĐ nhân dịp gần đầu năm 2026',
        timeLeft: '2026-01-01',
        giftProduct: {
            name: 'Hộp quà tặng Ngũ Phúc Luxury',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/hop-qua-tang-cao-cap-ngu-phuc-luxury-to-yen-tinh-che-va-yen-chung-nest100-cao-cap-kem-tui-2.webp',
            unit: 'Hộp',
            quantity: 1
        },
        condition: 'Mua bộ 3 sản phẩm để nhận quà'
    },
    {
        id: 3,
        title: 'Tặng 1 quà Trung Thu khi mua 3 sản phẩm từ Trung Tâm Bán Hàng',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '2025-09-15',
        giftProduct: {
            name: 'Bánh Trung Thu 2025',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp',
            unit: 'Hộp',
            quantity: 1
        },
        condition: 'Mua 3 sản phẩm để nhận quà'
    },
    {
        id: 4,
        title: 'Tặng 1 sản phẩm từ thương hiệu khi thêm 5 sản phẩm bất kỳ trong giỏ hàng của thương hiệu',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/sam-ngoc-linh-truong-sinh-do-thung-24lon-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '2026-10-23',
        giftProduct: {
            name: 'Mật ong Tây Bắc đông trùng hạ thảo X3 (Hũ 240g)',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/mat-ong-tay-bac-dong-trung-ha-thao-x3-hu-240g-1.webp',
            unit: 'Hộp',
            quantity: 1
        },
        condition: 'Mua 5 sản phẩm để nhận quà'
    },
    {
        id: 5,
        title: 'Tặng 1 thiết bị y tế khi 2 sản phẩm y tế khác nhau của thương hiệu y tế ABENA',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/tam-lot-abena-pad-45x45-1.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Không có thông tin',
        timeLeft: '2025-12-31',
        giftProduct: {
            name: 'Thiết bị y tế ABENA',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/tam-lot-abena-pad-45x45-1.webp',
            unit: 'Cái',
            quantity: 1
        },
        condition: 'Mua 2 sản phẩm y tế khác nhau để nhận quà'
    },
    {
        id: 6,
        title: 'Ưu đãi sinh nhật 13/10 - Tặng 1 sản phẩm bất kỳ',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-2.webp',
        brand: 'STV Trading',
        brandLogo: 'https://sieuthivina.com/assets/client/images/brands/trung-tam-ban-hang-sieu-thi-vina.png',
        description: 'Mua 2 sản phẩm từ Trung Tâm Bán Hàng Siêu Thị Vina để nhận được ưu đãi tặng 1 sản phẩm nhân ngày sinh nhật 13/10',
        timeLeft: '2025-10-13',
        giftProduct: {
            name: 'Sản phẩm bất kỳ',
            image: 'https://sieuthivina.com/assets/client/images/thumbs/thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-2.webp',
            unit: 'Hộp',
            quantity: 1
        },
        condition: 'Mua 2 sản phẩm để nhận quà'
    }
];

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

// Related products data (could be dynamic but hardcoded for now based on template)
const relatedProducts = [
    {
        id: 1,
        name: 'Hạt điều rang muối loại 1 (còn vỏ lụa) Happy Nuts 500g',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g-1.webp',
        price: 253800,
        originalPrice: 282000,
        discount: 10,
        sold: 782,
        rating: 4.8
    },
    {
        id: 2,
        name: 'Thực phẩm bảo vệ sức khỏe: Midu MenaQ7 180mcg',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/thuc-pham-bao-ve-suc-khoe-midu-menaq7-180mcg-1.webp',
        price: 324000,
        originalPrice: 360000,
        discount: 10,
        sold: 28,
        rating: 4.8
    },
    {
        id: 3,
        name: 'Tấm lót giường Abena Pad (giặt được) 85x90cm',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/tam-lot-giuong-abena-pad-giat-duoc-85x90cm-1.webp',
        price: 490000,
        originalPrice: 0,
        discount: 0,
        sold: 193,
        rating: 4.8
    },
    {
        id: 4,
        name: 'Hũ Hít Thảo Dược Nhị Thiên Đường - Hũ 5g',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/hu-hit-thao-duoc-nhi-thien-duong-hu-5g-1.webp',
        price: 42000,
        originalPrice: 0,
        discount: 0,
        sold: 3,
        rating: 4.8
    },
    {
        id: 5,
        name: 'Tấm lót Abena Pad (45x45)',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/tam-lot-abena-pad-45x45-1.webp',
        price: 290000,
        originalPrice: 0,
        discount: 0,
        sold: 74,
        rating: 4.8
    },
    {
        id: 6,
        name: 'Kẹo Quả Sâm không đường Free Suger Ginseng Berry S candy 200g',
        image: 'https://sieuthivina.com/assets/client/images/thumbs/keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g-1.webp',
        price: 186750,
        originalPrice: 249000,
        discount: 25,
        sold: 191,
        rating: 4.8
    }
];

export default function GiftDetail() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Default to the first gift if no ID or invalid ID
    const [gift, setGift] = useState(giftsData[3]); // Defaulting to item 4 which matches the template provided
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (id) {
            const foundGift = giftsData.find(g => g.id === parseInt(id));
            if (foundGift) {
                setGift(foundGift);
            }
        }
    }, [id]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(gift.timeLeft) - +new Date();
            let timeLeft: { days: number; hours: number; minutes: number; seconds: number };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }
            return timeLeft;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [gift]);

    return (
        <div className="page">
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

            {/* Breadcrumb */}
            {/* Assuming global header is handled by layout, if not, we might need to add it or handle spacing */}

            <section className="product-details pt-40 pb-80 fix-scale-40">
                <div className="container container-lg">
                    <form action="#" method="post" className="row gy-4">
                        <div className="col-xl-9">
                            <div className="row gy-4">
                                <div className="col-xl-6">
                                    <div className="product-details__left">
                                        <div className="product-details__thumb-slider rounded-16 p-0 slick-initialized slick-slider slick-vertical">
                                            <div className="slick-list draggable">
                                                <div className="slick-track" style={{ opacity: 1, transform: 'translate3d(0px, 0px, 0px)' }}>
                                                    <div className="slick-slide slick-current slick-active" aria-hidden="false" style={{ width: '100%' }}>
                                                        <div>
                                                            <div className="" style={{ width: '100%', display: 'inline-block' }}>
                                                                <div className="product-details__thumb flex-center h-100">
                                                                    <img
                                                                        className="rounded-10"
                                                                        src={gift.image}
                                                                        alt={gift.title}
                                                                        style={{ width: '100%', height: '450px', objectFit: 'cover', objectPosition: 'center' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="product-details__content">
                                        <div className="flex-center mb-24 flex-wrap gap-16 bg-color-one rounded-8 py-16 px-24 position-relative z-1">
                                            <img
                                                src="https://sieuthivina.com/assets/client/images/bg/bg-hotsale.png"
                                                alt=""
                                                className="position-absolute inset-block-start-0 inset-inline-start-0 rounded-8 w-100 z-n1 object-fit-cover"
                                                style={{ height: '60px', objectPosition: 'center' }}
                                            />
                                            <div className="flex-align gap-16">
                                                <h6 className="text-white text-md fw-medium m-0 p-0">Thời gian còn lại:</h6>
                                            </div>
                                            <div className="countdown" id="countdown-quatang">
                                                <ul className="countdown-list flex-align flex-wrap">
                                                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium w-28 h-28 rounded-4 p-0 flex-center">
                                                        <span className="days">{timeLeft.days || 0}</span>
                                                    </li>
                                                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium w-28 h-28 rounded-4 p-0 flex-center">
                                                        <span className="hours">{timeLeft.hours || 0}</span>
                                                    </li>
                                                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium w-28 h-28 rounded-4 p-0 flex-center">
                                                        <span className="minutes">{timeLeft.minutes || 0}</span>
                                                    </li>
                                                    <li className="countdown-list__item text-heading flex-align gap-4 text-sm fw-medium w-28 h-28 rounded-4 p-0 flex-center">
                                                        <span className="seconds">{timeLeft.seconds || 0}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h5 className="mb-4">{gift.title}</h5>
                                        <span className="text-md fst-italic fw-normal text-gray-600">
                                            {gift.description}
                                        </span>
                                        <div className="flex-align flex-wrap gap-12 mt-10">
                                            <div className="flex-align gap-8">
                                                <span className="text-md fw-medium text-neutral-600">người xem</span>
                                                <span className="text-md fw-medium text-gray-500">11</span>
                                            </div>
                                        </div>
                                        <span className="mt-10 mb-10 text-gray-700 border-top border-gray-100 d-block"></span>
                                        <span className="flex-align mb-10 mt-10 text-gray-900 text-md fw-medium">
                                            <i className="ph-bold ph-gift text-main-600 text-lg pe-4"></i>Quà tặng bạn nhận được:
                                        </span>
                                        <div className="d-flex align-items-center gap-12">
                                            <a href="#" className="border border-gray-100 rounded-8 flex-center" style={{ maxWidth: '80px', maxHeight: '80px', width: '100%', height: '100%' }}>
                                                <img
                                                    src={gift.giftProduct.image}
                                                    alt={gift.giftProduct.name}
                                                    className="w-100 rounded-8"
                                                />
                                            </a>
                                            <div className="table-product__content text-start">
                                                <h6 className="title text-md fw-semibold mb-0">
                                                    <a href="#" className="link text-line-2" title={gift.giftProduct.name} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '350px', display: 'inline-block' }}>
                                                        {gift.giftProduct.name}
                                                    </a>
                                                </h6>
                                                <div className="flex-align gap-16 mb-6">
                                                    <a href="#" className="btn bg-gray-50 text-heading text-xs py-4 px-6 rounded-8 flex-center gap-8 fw-medium">
                                                        {gift.giftProduct.unit}
                                                    </a>
                                                </div>
                                                <div className="product-card__price mb-6">
                                                    <div className="flex-align gap-24">
                                                        <span className="text-heading text-sm fw-medium ">Số lượng: {gift.giftProduct.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="mt-10 mb-20 text-gray-700 border-top border-gray-100 d-block"></span>
                                        <div className="mt-8">
                                            <div className="flex-align">
                                                <div className="progress w-100 bg-color-three rounded-pill h-20" role="progressbar" aria-label="Basic example" aria-valuenow={1} aria-valuemin={0} aria-valuemax={2}>
                                                    <div className="progress-bar bg-main-600 rounded-pill text-center" style={{ width: '0%' }}> + 0 </div>
                                                </div>
                                            </div>
                                            <span className="text-gray-900 text-sm fw-medium">{gift.condition}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3">
                            <div className="product-details__sidebar py-30 px-20 border border-gray-100 rounded-16">
                                <div className="">
                                    <h6 className="mb-8 text-heading fw-semibold d-block">Nhà cung cấp</h6>
                                    <span className="text-xl d-flex">
                                        <i className="ph ph-location"></i>
                                    </span>
                                </div>
                                <div className="mt-10">
                                    <a href="https://sieuthivina.com/san-pham?thuonghieu=stv-trading" className="px-16 py-8 bg-main-50 rounded-8 flex-between gap-12 mb-0" style={{ justifyContent: 'start' }}>
                                        <span className="bg-white text-main-600 rounded-circle flex-center text-xl flex-shrink-0 p-4" style={{ width: '40px', height: '40px' }}>
                                            <img src={gift.brandLogo} alt={gift.brand} className="w-100" />
                                        </span>
                                        <span className="text-sm text-neutral-600"><span className="fw-semibold">{gift.brand}</span></span>
                                    </a>
                                </div>
                                <div className="mt-32">
                                    <div className="px-32 py-16 rounded-8 border border-gray-100 flex-between gap-8">
                                        <a href="#" className="d-flex text-main-600 text-28"><i className="ph-fill ph-chats-teardrop"></i></a>
                                        <span className="h-26 border border-gray-100"></span>
                                        <div className="dropdown on-hover-item">
                                            <button className="d-flex text-main-600 text-28" type="button">
                                                <i className="ph-fill ph-share-network"></i>
                                            </button>
                                            <div className="on-hover-dropdown common-dropdown border-0 inset-inline-start-auto inset-inline-end-0">
                                                <ul className="flex-align gap-16">
                                                    <li>
                                                        <a href="https://www.facebook.com" className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                                            <i className="ph-fill ph-facebook-logo"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.twitter.com" className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                                            <i className="ph-fill ph-twitter-logo"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.linkedin.com" className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                                            <i className="ph-fill ph-instagram-logo"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="https://www.pinterest.com" className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white">
                                                            <i className="ph-fill ph-linkedin-logo"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="my-20">
                        <div className="flex-between flex-wrap gap-2">
                            <h6 className="mb-0 wow fadeInLeft gap-4" style={{ display: 'flex', alignItems: 'flex-start', visibility: 'visible', animationName: 'fadeInLeft' }}>
                                <i className="ph-bold ph-archive text-main-600"></i>
                                <div>Lựa chọn sản phẩm để nhận quà tặng <div className="text-sm text-gray-600 fw-medium">* Lưu ý điều kiện quà tặng chỉ áp dụng từng sản phẩm</div></div>
                            </h6>
                            <div className="flex-align gap-16">
                                <div className="flex-align gap-8">
                                    <button type="button" id="new-arrival-prev" className="slick-prev flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                                        <i className="ph ph-caret-left"></i>
                                    </button>
                                    <button type="button" id="new-arrival-next" className="slick-next flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1">
                                        <i className="ph ph-caret-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="new-arrival__slider arrow-style-two mt-20">
                            <div className="row g-3">
                                {relatedProducts.map((product) => (
                                    <div key={product.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                                        <div className="product-card h-100 border border-gray-100 hover-border-main-600 rounded-6 position-relative transition-2">
                                            <a href="#" className="flex-center rounded-8 bg-gray-50 position-relative">
                                                <img src={product.image} alt={product.name} className="w-100 rounded-top-2" />
                                            </a>
                                            <div className="product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex mt-10 px-10 pb-8">
                                                <div>
                                                    <div className="flex-align justify-content-between mt-5">
                                                        <div className="flex-align gap-4 w-100">
                                                            <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                                                            <a href="#" className="text-gray-500 text-xs" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', display: 'inline-block' }} title={gift.brand}>{gift.brand}</a>
                                                        </div>
                                                    </div>
                                                    <h6 className="title text-lg fw-semibold mt-2 mb-2">
                                                        <a href="#" className="link text-line-2" tabIndex={0}>{product.name}</a>
                                                    </h6>
                                                    <div className="flex-align gap-16 mb-6">
                                                        <a href="#" className="btn bg-gray-50 text-line-2 text-xs text-gray-900 py-4 px-6 rounded-8 flex-align gap-8 fw-medium">
                                                            Hộp
                                                        </a>
                                                    </div>
                                                    <div className="flex-align justify-content-between mt-2">
                                                        <div className="flex-align gap-6">
                                                            <span className="text-xs fw-medium text-gray-500">Đánh giá</span>
                                                            <span className="text-xs fw-medium text-gray-500">{product.rating} <i className="ph-fill ph-star text-warning-600"></i></span>
                                                        </div>
                                                        <div className="flex-align gap-4">
                                                            <span className="text-xs fw-medium text-gray-500">{product.sold}</span>
                                                            <span className="text-xs fw-medium text-gray-500">Đã bán</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-card__price mt-5">
                                                    {product.discount > 0 && (
                                                        <div className="flex-align gap-4 text-main-two-600">
                                                            <i className="ph-fill ph-seal-percent text-sm"></i> -{product.discount}%
                                                            <span className="text-gray-400 text-sm fw-semibold text-decoration-line-through">
                                                                {product.originalPrice.toLocaleString()} đ
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-heading text-lg fw-semibold">
                                                        {product.price.toLocaleString()} đ
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-100">
                                                <button type="button" className="mt-6 rounded-bottom-2 bg-gray-50 text-sm text-gray-900 w-100 hover-bg-main-600 hover-text-white py-6 px-24 flex-center gap-8 fw-medium transition-1" tabIndex={0}>
                                                    <i className="ph ph-shopping-cart"></i> Thêm vào giỏ hàng
                                                </button>
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
    );
}
