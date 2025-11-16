"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import FeaturedProductsSection from "@/components/FeaturedProductsSection"; // best_products
import LatestProductsSection from "@/components/LatestProductsSection";
import MostInterestedSection from "@/components/MostInterestedSection";
import BannerTwo from "@/components/BannerTwo";
import FeatureSection from "@/components/FeatureSection";
import FullHeader from "@/components/FullHeader";
import PreloaderFix from "@/components/PreloaderFix";
import OverlayLayers from "@/components/OverlayLayers";
import ScrollTopProgress from "@/components/ScrollTopProgress";
import SearchOverlay from "@/components/SearchOverlay";
import MobileMenu from "@/components/MobileMenu";
import Reveal from "@/components/Reveal";
import { motion } from "framer-motion";
import TopDealsSection from "@/components/TopDealsSection";
import GiftEventsSection from "@/components/GiftEventsSection";
import TopBrandsSection from "@/components/TopBrandsSection";

// types for jQuery-like object (minimal)
// Loại bỏ các kiểu tạm cho jQuery slick (đã chuyển sang Swiper)

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // UI state: overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // (Không còn dùng API fetch hay jQuery slick ở Top Deals)


  // =========== Swiper Settings =============
  // Ref Swiper với kiểu rõ ràng để tránh 'any'
  const swiperRef = useRef<SwiperType | null>(null);


  // Body scroll lock when overlays open
  useEffect(() => {
    if (!mounted) return;
    const lock = isSearchOpen || isMobileMenuOpen;
    const prev = document.body.style.overflow;
    document.body.style.overflow = lock ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, isSearchOpen, isMobileMenuOpen]);

  // Delegated open triggers (optional)
  useEffect(() => {
    if (!mounted) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest?.(".js-open-search")) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (target.closest?.(".js-open-menu")) {
        e.preventDefault();
        setIsMobileMenuOpen(true);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [mounted]);

  // Dọn cảnh báo: loại bỏ BRANDS, handleImgError, cartCount vì không dùng trong trang này

  if (!mounted) return null;

  return (
    <>
      {/* Overlay, preloader, scroll, search, mobile menu giữ nguyên, KHÔNG render logo/tìm kiếm/tài khoản ở đầu trang nữa */}
      <PreloaderFix />
      <OverlayLayers
        showOverlay={isSearchOpen}
        showSideOverlay={isMobileMenuOpen}
        onOverlayClick={() => setIsSearchOpen(false)}
        onSideOverlayClick={() => setIsMobileMenuOpen(false)}
      />
      <ScrollTopProgress />
      <SearchOverlay visible={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu visible={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Chỉ render header template sau thanh top đỏ */}
      <FullHeader showClassicTopBar={true} showTopNav={false} showCategoriesBar={false} />

      <main id="main-content" role="main" className="home-two">

        {/* ============================ Banner Section =============================== */}
        <BannerTwo />
        {/* ============================ Banner Section End =============================== */}

        {/* ============================ promotional banner Start ========================== */}
        <FeatureSection />
        {/* ============================ promotional banner End ========================== */}

        {/* ========================= TOP DEALS * SIÊU RẺ ================================ */}
        
        <TopDealsSection title="Top deal • Siêu rẻ" perPage={10} />
        {/* ========================= TOP DEALS * SIÊU RẺ End ================================ */}

        {/* ========================= QUÀ TẶNG ================================ */}
        <GiftEventsSection />
        {/* ========================= QUÀ TẶNG End ================================ */}

        {/* ========================= 3 Small Banners ============================== */}
        <div className="container mt-10 container-lg mb-70">
          <div className="row">
            <div className="col-lg-4">
              <div className="rounded-5">
                <a href="#" className="p-0 m-0">
                  <img
                    src="/assets/images/bg/shopee-04.webp"
                    alt="Banner 1"
                    className="banner-img w-100 h-100 object-fit-cover rounded-10"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="rounded-5">
                <a href="#" className="p-0 m-0">
                  <img
                    src="/assets/images/bg/shopee-06.jpg"
                    alt="Banner 2"
                    className="banner-img w-100 h-100 object-fit-cover rounded-10"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="rounded-5">
                <a href="#" className="p-0 m-0">
                  <img
                    src="/assets/images/bg/shopee-07.jpg"
                    alt="Banner 3"
                    className="banner-img w-100 h-100 object-fit-cover rounded-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= DANH MỤC HÀNG ĐẦU ================================ */}
        <section className="mt-10 overflow-hidden trending-productss fix-scale-80">
          <div className="container px-0 container-lg">
            <div className="p-24 border border-gray-100 rounded-8">
              <div className="mb-24 section-heading">
                <div className="flex-wrap gap-8 flex-between flex-align">
                  <h6 className="mb-0 wow fadeInLeft">
                    <i className="ph-bold ph-squares-four text-main-600"></i> Danh mục hàng đầu
                  </h6>
                  <ul className="m-0 nav common-tab style-two nav-pills wow fadeInRight" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="text-sm nav-link fw-medium hover-border-main-600 active" id="tab-7" data-bs-toggle="pill" data-bs-target="#content-7" type="button" role="tab" aria-controls="content-7" aria-selected="true">
                        Bách hóa
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="text-sm nav-link fw-medium hover-border-main-600" id="tab-11" data-bs-toggle="pill" data-bs-target="#content-11" type="button" role="tab" aria-controls="content-11" aria-selected="false">
                        Thực phẩm - đồ ăn
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="text-sm nav-link fw-medium hover-border-main-600" id="tab-6" data-bs-toggle="pill" data-bs-target="#content-6" type="button" role="tab" aria-controls="content-6" aria-selected="false">
                        Thiết bị y tế
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="text-sm nav-link fw-medium hover-border-main-600" id="tab-4" data-bs-toggle="pill" data-bs-target="#content-4" type="button" role="tab" aria-controls="content-4" aria-selected="false">
                        Làm đẹp
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="text-sm nav-link fw-medium hover-border-main-600" id="tab-2" data-bs-toggle="pill" data-bs-target="#content-2" type="button" role="tab" aria-controls="content-2" aria-selected="false">
                        Thực phẩm chức năng
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="tab-content" id="pills-tabContent">
                {/* Tab 1: Bách hóa */}
                <div className="tab-pane fade show active" id="content-7" role="tabpanel" aria-labelledby="tab-7" tabIndex={0}>
                  <div className="row g-12">
                    {/* Product 1 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g-1.webp" alt="Hạt điều rang muối" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/hat-dieu-rang-muoi-loai-1-con-vo-lua-happy-nuts-500g" className="link text-line-2" tabIndex={0}>
                                Hạt điều rang muối loại 1 (còn vỏ lụa) Happy Nuts 500g
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">782</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <div className="gap-4 flex-align text-main-two-600">
                              <i className="text-sm ph-fill ph-seal-percent"></i> -10%
                              <span className="text-sm text-gray-400 fw-semibold text-decoration-line-through">282.000 đ</span>
                            </div>
                            <span className="text-lg text-heading fw-semibold">253.800 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product 2 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra-1.webp" alt="Bánh Trung Thu" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/banh-trung-thu-2025-thu-an-nhien-banh-chay-hop-2-banh-1-tra" className="link text-line-2" tabIndex={0}>
                                Bánh Trung Thu 2025 - Thu An Nhiên (bánh chay hộp 2 bánh 1 trà)
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">472</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <div className="gap-4 flex-align text-main-two-600">
                              <i className="text-sm ph-fill ph-seal-percent"></i> -70%
                              <span className="text-sm text-gray-400 fw-semibold text-decoration-line-through">369.000 đ</span>
                            </div>
                            <span className="text-lg text-heading fw-semibold">110.700 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product 3 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g-1.webp" alt="Kẹo Quả Sâm" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/keo-qua-sam-khong-duong-free-suger-ginseng-berry-s-candy-200g" className="link text-line-2" tabIndex={0}>
                                Kẹo Quả Sâm không đường Free Suger Ginseng Berry S candy 200g
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">187</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <div className="gap-4 flex-align text-main-two-600">
                              <i className="text-sm ph-fill ph-seal-percent"></i> -25%
                              <span className="text-sm text-gray-400 fw-semibold text-decoration-line-through">249.000 đ</span>
                            </div>
                            <span className="text-lg text-heading fw-semibold">186.750 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product 4 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml-1.webp" alt="Nước rửa bát" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/nuoc-rua-bat-bio-formula-bo-va-lo-hoi-tui-500ml" className="link text-line-2" tabIndex={0}>
                                Nước rửa bát Bio Formula - Bơ và Lô Hội (Túi 500ml)
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">142</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <span className="text-lg text-heading fw-semibold">90.000 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product 5 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit-1.webp" alt="Nước rửa chén" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/nuoc-rua-chen-sa-chanh-come-on-lam-sach-bat-dia-an-toan-da-tay-1-lit" className="link text-line-2" tabIndex={0}>
                                Nước rửa chén sả chanh COME ON làm sạch bát đĩa, an toàn da tay 1 lít
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">76</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <span className="text-lg text-heading fw-semibold">69.000 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product 6 */}
                    <div className="col-xxl-2 col-xl-3 col-lg-4 col-xs-6">
                      <div className="border border-gray-100 product-card h-100 hover-border-main-600 rounded-6 position-relative transition-2">
                        <a href="/product-details-two/bot-matcha-gao-rang-nhat-ban-onelife-goi-100g" className="flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/bot-matcha-gao-rang-nhat-ban-onelife-goi-100g-1.webp" alt="Bột Matcha" className="w-100 rounded-top-2" />
                        </a>
                        <div className="px-10 pb-8 mt-10 product-card__content w-100 h-100 align-items-stretch flex-column justify-content-between d-flex">
                          <div>
                            <h6 className="mt-2 mb-2 text-lg title fw-semibold">
                              <a href="/product-details-two/bot-matcha-gao-rang-nhat-ban-onelife-goi-100g" className="link text-line-2" tabIndex={0}>
                                Bột Matcha Gạo Rang Nhật Bản ONELIFE (Gói 100g)
                              </a>
                            </h6>
                            <div className="mt-2 flex-align justify-content-between">
                              <div className="gap-6 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                                <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                              </div>
                              <div className="gap-4 flex-align">
                                <span className="text-xs text-gray-500 fw-medium">17</span>
                                <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 product-card__price">
                            <span className="text-lg text-heading fw-semibold">220.800 đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto text-center w-100">
                    <a href="/san-pham?sortby=top-bach-hoa" className="px-32 py-12 mt-40 btn border-main-600 text-main-600 hover-bg-main-600 hover-border-main-600 hover-text-white rounded-8">
                      Xem thêm sản phẩm
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ========================= DANH MỤC HÀNG ĐẦU End ================================ */}

        {/* ========================= Banner Image ============================== */}
        <div className="container px-0 mt-10 container-lg">
          <div className="rounded-10">
            <a href="#" className="p-0 m-0 d-block">
              <img
                src="/assets/images/bg/shopee-05.jpg"
                alt="Banner"
                className="banner-img w-100 object-fit-cover rounded-10"
              />
            </a>
          </div>
        </div>
        {/* ========================= Banner Image End ============================== */}

        {/* ========================= THƯƠNG HIỆU HÀNG ĐẦU ================================ */}
        <TopBrandsSection />
        {/* ========================= THƯƠNG HIỆU HÀNG ĐẦU End ================================ */}

        {/* ========================= Featured Products ============================ */}
        <FeaturedProductsSection />

        {/* ========================= Super Discount =============================== */}
        <div className="">
          <div className="container px-0 container-lg">
            <div className="py-20 border border-dashed border-main-500 bg-main-50 rounded-8 d-flex align-items-center justify-content-evenly">
              <p className="h6 text-main-600 fw-normal">
                Áp dụng mã giảm giá ưu đãi cho{" "}
                <a
                  href="#"
                  className="fw-bold text-decoration-underline text-main-600 hover-text-decoration-none hover-text-primary-600"
                >
                  thành viên mới
                </a>
              </p>
              <div className="position-relative">
                <button className="px-32 py-10 text-white border-0 copy-coupon-btn text-uppercase bg-main-600 rounded-pill hover-bg-main-800">
                  SIEUTHIVINA2025
                  <i className="text-lg ph ph-file-text line-height-1"></i>
                </button>
                <span className="px-16 py-6 mb-8 text-xs text-white copy-text bg-main-600 fw-normal position-absolute rounded-pill bottom-100 start-50 translate-middle-x min-w-max" style={{ display: "none" }}></span>
              </div>
              <p className="text-md text-main-600 fw-normal">
                Áp dụng giảm giá đến{" "}
                <span className="fw-bold text-main-600">20% </span>
                tổng giá trị mỗi đơn hàng
              </p>
            </div>
          </div>
        </div>

        {/* Hàng mới chào sân */}
        <LatestProductsSection />

        {/* Được quan tâm nhiều nhất */}
        <MostInterestedSection />
      </main>
    </>
  );
}
