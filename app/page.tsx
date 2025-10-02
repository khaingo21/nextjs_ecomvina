"use client";
import React, { useEffect, useState } from "react";
import TopSellingProducts from "@/components/TopSellingProducts";//hot_sales
import TrendingProductsTabs from "@/components/TrendingProductsTabs";//top_categories
import TopBrandsSection from "@/components/TopBrandsSection";//top_brands
import FeaturedProductsSection from "@/components/FeaturedProductsSection";//best_products
import SearchBox from "@/components/SearchBox";
import BannerTwo from "@/components/BannerTwo";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Helper: lấy biến môi trường cho client
  const API_BASE =
    process.env.NEXT_PUBLIC_SERVER_API ??
    "http://127.0.0.1:8000"; // fallback

  // === INIT SLIDERS (jQuery/Slick) - KHÔNG any, KHÔNG mở rộng window ===
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    // Lấy $ và AOS từ window nhưng KHÔNG dùng any
    type JQNode = {
      length: number;
      hasClass?: (c: string) => boolean;
      slick?: (...args: unknown[]) => unknown;
    };
    type WinPick = {
      $?: (selector: string | Element) => unknown;
      AOS?: { init?: (...args: unknown[]) => unknown };
    };
    const w = window as unknown as WinPick;
    const $ = w.$;
    if (!$) return; // không có jQuery thì bỏ qua

    // Cast 1 lần khi dùng
    const sel = (s: string | Element) => ($!(s) as unknown) as JQNode;

    try {
      // 1) .brand-slider
      const brand = sel(".brand-slider");
      if (brand.length && !brand.hasClass?.("slick-initialized")) {
        brand.slick?.({
          slidesToShow: 8,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          dots: false,
          pauseOnHover: true,
          arrows: true,
          draggable: true,
          rtl: document.documentElement.getAttribute("dir") === "rtl",
          speed: 900,
          infinite: true,
          nextArrow: "#brand-next",
          prevArrow: "#brand-prev",
          responsive: [
            { breakpoint: 1599, settings: { slidesToShow: 7, arrows: false } },
            { breakpoint: 1399, settings: { slidesToShow: 6, arrows: false } },
            { breakpoint: 992, settings: { slidesToShow: 5, arrows: false } },
            { breakpoint: 575, settings: { slidesToShow: 4, arrows: false } },
            { breakpoint: 424, settings: { slidesToShow: 3, arrows: false } },
            { breakpoint: 359, settings: { slidesToShow: 2, arrows: false } },
          ],
        });
      }

      // 2) .featured-product-slider
      const featured = sel(".featured-product-slider");
      if (featured.length && !featured.hasClass?.("slick-initialized")) {
        featured.slick?.({
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          dots: false,
          pauseOnHover: true,
          arrows: true,
          draggable: true,
          rtl: document.documentElement.getAttribute("dir") === "rtl",
          speed: 900,
          infinite: true,
          nextArrow: "#featured-products-next",
          prevArrow: "#featured-products-prev",
          responsive: [{ breakpoint: 991, settings: { slidesToShow: 1, arrows: false } }],
        });
      }

      // 3) .top-selling-product-slider
      const initTopSelling = () => {
        const wrap = sel(".top-selling-product-slider");
        if (!wrap.length) return false;
        if (wrap.hasClass?.("slick-initialized")) return true;
        wrap.slick?.({
          slidesToShow: 5,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
          dots: false,
          pauseOnHover: true,
          arrows: true,
          draggable: true,
          rtl: document.documentElement.getAttribute("dir") === "rtl",
          speed: 800,
          infinite: true,
          nextArrow: "#top-selling-next",
          prevArrow: "#top-selling-prev",
          responsive: [
            { breakpoint: 1599, settings: { slidesToShow: 4 } },
            { breakpoint: 1199, settings: { slidesToShow: 3 } },
            { breakpoint: 991, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 575, settings: { slidesToShow: 1, arrows: false } },
          ],
        });
        // setPosition an toàn
        try {
          (wrap.slick as unknown as (arg: string) => void)?.("setPosition");
        } catch {}
        return true;
      };

      if (!initTopSelling()) {
        let tries = 0;
        const t = setInterval(() => {
          tries++;
          const ok = initTopSelling();
          if (ok || tries > 12) clearInterval(t);
        }, 200);
      }

      // Resize -> setPosition
      window.addEventListener("resize", () => {
        try {
          (sel(".top-selling-product-slider").slick as unknown as (arg: string) => void)?.(
            "setPosition"
          );
        } catch {}
      });

      // AOS fallback
      const AOS = w.AOS;
      if (AOS?.init) {
        AOS.init({ once: true, duration: 800, easing: "ease-out" });
      } else {
        document.querySelectorAll("[data-aos]").forEach((el) => {
          el.classList.add("aos-init", "aos-animate");
        });
      }
    } catch {}
  }, [mounted]);

  // === FETCH API ví dụ (dùng NEXT_PUBLIC_SERVER_API) ===
  useEffect(() => {
    if (!mounted) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/sanphams-selection?selection=hot_sales&per_page=10`,
          { headers: { Accept: "application/json" } }
        );
        const json = await res.json();
        // TODO: setState json.data nếu cần
        console.log("hot_sales:", json);
      } catch (e) {
        console.error("Fetch hot_sales failed", e);
      }
    })();
  }, [mounted, API_BASE]);

  if (!mounted) return null;
  return (
    <>

      {/* ======================= Middle Top Mobile Start ========================= */}
      <div className="py-10 header-top bg-main-600 flex-between d-block d-lg-none">
        <div className="container container-lg">
          <div className="gap-8 flex-between">

            <ul className="flex-wrap gap-16 header-top__right flex-align">
              <li className="flex-shrink-0 d-block on-hover-item text-white-6">
                <button className="gap-4 text-sm category__button flex-align text-white-6 rounded-top">
                  <span className="text-sm icon "><i className="ph ph-squares-four"></i></span>
                  <span className="">Danh mục</span>
                </button>

                <div className="p-0 responsive-dropdown on-hover-dropdown common-dropdown nav-submenu submenus-submenu-wrapper">
                  <button
                    className="mt-4 text-xl close-responsive-dropdown rounded-circle position-absolute inset-inline-end-0 inset-block-start-0 me-8 d-lg-none d-flex">
                    <i className="ph ph-x"></i> </button>
                  <div className="px-16 logo d-lg-none d-block">
                    <a href="index.html" className="link">
                      <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
                    </a>
                  </div>
                  <ul className="p-0 py-8 overflow-y-auto scroll-sm w-300 max-h-400">
                    <li className="has-submenus-submenu">
                      <a href="product-details-two.html"
                        className="gap-8 px-16 py-12 text-gray-500 text-15 flex-align rounded-0">
                        <span className="text-xl d-flex"><i className="ph ph-carrot"></i></span>
                        <span>Vegetables &amp; Fruit</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

            </ul>
            <ul className="flex-wrap gap-16 header-top__right flex-align justify-content-end">

              <li className="flex-align">
                <a href="wishlist.html" className="text-sm text-white-6 hover-text-white">
                  <i className="ph-bold ph-shopping-cart"></i>
                  Giỏ hàng
                  <span className="badge bg-success-600 rounded-circle">6</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ======================= Middle Top End ========================= */}

      {/* ======================= Middle Top Start ========================= */}
      <div className="py-10 header-top bg-main-600 flex-between d-none d-lg-block pz100">
        <div className="container container-lg">
          <div className="flex-wrap gap-8 flex-between">

            <ul className="flex-wrap gap-16 header-top__right flex-align">
              <li className="flex-align">
                <a href="" className="text-sm text-center text-white-6 hover-text-white"><i
                  className="ph-bold ph-storefront text-white-6"></i> Truy cập bán hàng</a>
              </li>
              <li className="flex-align">
                <a href="" className="text-sm text-white-6 hover-text-white"><i className="ph-bold ph-handshake text-white-6"></i>
                  Đăng ký đối tác</a>
              </li>
              <li className="flex-align">
                <a href="#" className="text-sm text-white-6 hover-text-white pe-1"><i className="ph-bold ph-info text-white-6"></i>
                  Giới thiệu về Siêu Thị Vina </a>
              </li>
              <li className="flex-align">
                <a href="contact.html" className="text-sm text-white-6 hover-text-white">
                  <i className="ph-bold ph-chat-dots"></i>
                  Liên hệ hỗ trợ
                </a>
              </li>

            </ul>

            <ul className="flex-wrap gap-16 header-top__right flex-align">
              <li className="flex-shrink-0 d-block on-hover-item text-white-6">
                <button className="gap-4 text-sm category__button flex-align text-white-6 rounded-top">
                  <span className="text-sm icon d-md-flex d-none"><i className="ph ph-squares-four"></i></span>
                  <span className="d-sm-flex d-none">Danh mục</span>
                </button>

                <div className="p-0 responsive-dropdown on-hover-dropdown common-dropdown nav-submenu submenus-submenu-wrapper">
                  <button
                    className="mt-4 text-xl close-responsive-dropdown rounded-circle position-absolute inset-inline-end-0 inset-block-start-0 me-8 d-lg-none d-flex">
                    <i className="ph ph-x"></i> </button>
                  <div className="px-16 logo d-lg-none d-block">
                    <a href="index.html" className="link">
                      <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
                    </a>
                  </div>
                  <ul className="p-0 py-8 overflow-y-auto scroll-sm w-300 max-h-400">
                    <li className="has-submenus-submenu">
                      <a href="javascript:void(0)" className="gap-8 px-16 py-12 text-gray-500 text-15 flex-align rounded-0">
                        <span className="text-xl d-flex"><i className="ph ph-carrot"></i></span>
                        <span>Vegetables &amp; Fruit</span>
                      </a>
                    </li>
                  </ul>
                </div>

              </li>

              <li className="flex-align">
                <a href="javascript:void(0)" className="text-sm text-white-6 hover-text-white">
                  <i className="ph-bold ph-notepad"></i>
                  Tra cứu đơn hàng</a>
              </li>

              <li className="flex-align">
                <a href="wishlist.html" className="text-sm text-white-6 hover-text-white">
                  <i className="ph-bold ph-shopping-cart"></i>
                  Giỏ hàng
                  <span className="badge bg-success-600 rounded-circle">6</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ======================= Middle Top End ========================= */}

      {/* ======================= Middle Header Two Start ========================= */}
      <header className="pt-16 pb-10 header border-bottom border-neutral-40 pz99">
        <div className="container container-lg">
          <nav className="gap-16 header-inner flex-between">
            <div className="logo">
              <a href="index.html" className="link">
                <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
              </a>
            </div>

            <div className="header-menu w-50 d-lg-block d-none">
              <div className="mx-20">
                <div className="position-relative w-100 d-md-block d-none">
                  <SearchBox />
                </div>


                <div className="gap-12 mt-10 flex-align title">
                  <a href="#" className="text-sm text-gray-600 link hover-text-main-600 fst-italic">Máy massage</a>
                  <a href="#" className="text-sm text-gray-600 link hover-text-main-600 fst-italic">điện gia dụng</a>
                  <a href="#" className="text-sm text-gray-600 link hover-text-main-600 fst-italic">mẹ và bé</a>
                  <a href="#" className="text-sm text-gray-600 link hover-text-main-600 fst-italic">móc khóa minecraft</a>
                  <a href="#" className="text-sm text-gray-600 link hover-text-main-600 fst-italic">điện nội thất</a>
                </div>
              </div>
            </div>

            <div className="header-right flex-align">
              <div
                className="flex-wrap on-hover-item nav-menu__item has-submenu header-top__right style-two style-three flex-align d-lg-block d-none">
                <a href="javascript:void(0)"
                  className="gap-10 px-10 py-5 text-center text-gray-600 d-flex justify-content-center flex-align align-content-around fw-medium rounded-pill line-height-1 hover-text-main-600">
                  <span className="line-height-1"><img src="/assets/images/thumbs/flag2.png"
                    className="rounded-circle object-fit-cover" style={{ width: '25px', height: '25px' }} alt="" /></span>
                  lyhuu123
                </a>
                <ul className="on-hover-dropdown common-dropdown nav-submenu scroll-sm">
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="cart.html"
                      className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100"><i
                        className="ph-bold ph-heart text-main-600"></i> Yêu thích <span
                          className="badge bg-success-600 rounded-circle">6</span></a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="wishlist.html"
                      className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100"><i
                        className="ph-bold ph-user text-main-600"></i> Tài khoản</a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="checkout.html"
                      className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100"><i
                        className="ph-bold ph-notepad text-main-600"></i> Đơn hàng của tôi</a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="checkout.html"
                      className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100"><i
                        className="ph-bold ph-sign-out text-main-600"></i> Đăng xuất</a>
                  </li>
                </ul>
              </div>
              <button type="button" className="text-4xl text-gray-800 toggle-mobileMenu d-lg-none ms-3n d-flex">
                <i className="ph ph-list"></i>
              </button>
            </div>
          </nav>
        </div>
      </header>
      {/* ======================= Middle Header Two End ========================= */}

      {/* ============================ Banner Section start =============================== */}
      <BannerTwo />
      {/* ============================ Banner Section End =============================== */}

      {/* ============================ promotional banner Start ========================== */}
      <div className="feature" id="featureSection">
        <div className="container container-lg">
          <div className="position-relative arrow-center">
            <div className="flex-align">
              <button type="button" id="feature-item-wrapper-prev"
                className="text-xl bg-white slick-prev slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1">
                <i className="ph ph-caret-left"></i>
              </button>
              <button type="button" id="feature-item-wrapper-next"
                className="text-xl bg-white slick-next slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1">
                <i className="ph ph-caret-right"></i>
              </button>
            </div>
            <div className="feature-item-wrapper">
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="400">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Vegetables</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="600">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Fish & Meats</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="800">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Desserts</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="1000">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Drinks & Juice</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="1200">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Animals Food</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="1400">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Fresh Fruits</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="1600">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Yummy Candy</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="1800">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Fish & Meats</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="2000">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Dairy & Eggs</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="2200">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Snacks</a></h6>

                </div>
              </div>
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" data-aos-duration="2400">
                <div className="feature-item__thumb rounded-circle">
                  <a href="shop.html" className="p-10 w-100 h-100 flex-center">
                    <img src="/assets/images/thumbs/cyber-monday-img1.png" alt="" />
                  </a>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-md"><a href="shop.html" className="text-inherit">Frozen Foods</a></h6>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ============================ promotional banner End ========================== */}

      {/* ========================= Top Selling Products Start ================================ */}
      <section className="pt-20 overflow-hidden top-selling-products">
        <div className="container container-lg">
          <div className="p-24 border border-gray-100 rounded-10 bg-hotsales">
            <div className="mb-24 section-heading">
              <div className="flex-wrap gap-8 flex-between">
                <h6 className="mb-0 text-white wow fadeInLeft">
                  <img src="/assets/images/thumbs/top-deal-sieu-re.png" alt="" className="py-10 w-50" />
                </h6>
                <div className="gap-16 flex-align wow fadeInRight">
                  <a href="shop.html" className="text-sm text-white fw-semibold hover-text-gray-100 hover-text-decoration-underline">Xem tất cả</a>
                  <div className="gap-8 flex-align">
                    <button type="button" id="top-selling-prev" className="text-xl text-white border slick-prev slick-arrow flex-center rounded-circle border-white-100 hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1 ">
                      <i className="ph ph-caret-left"></i>
                    </button>
                    <button type="button" id="top-selling-next" className="text-xl text-white border slick-next slick-arrow flex-center rounded-circle border-white-100 hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1 ">
                      <i className="ph ph-caret-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-12">
              <div className="col-md-12">
                <div className="top-selling-product-slider arrow-style-two">
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Giảm 10%</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Giảm 20%</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-main-600 position-absolute inset-inline-start-0 inset-block-start-0">2 tặng 1</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Extra items copied from public/index.html */}
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Sold</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Giảm 50.000 đ</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50" style={{ height: '180px' }}>
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-main-600 position-absolute inset-inline-start-0 inset-block-start-0">Miễn phí (giới hạn)</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                          <span className="text-xs text-gray-500 fw-medium"> | </span>
                          <span className="text-xs text-gray-500 fw-medium">Còn: 18</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">Miễn phí</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50">
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Sold</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto max-w-unset" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-aos="fade-up" data-aos-duration="1000">
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50">
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">Sold</span>
                        <img src="/assets/images/thumbs/product-two-img7.png" alt="" className="w-auto max-w-unset" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não</a>
                        </h6>
                        <div className="gap-4 mb-5 flex-align">
                          <span className="text-main-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">Siêu thị Vina</span>
                        </div>
                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                          <span className="text-xs text-gray-500 fw-medium">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">(17k)</span>
                        </div>
                        <div className="my-10 product-card__price">
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">400.000 đ</span>
                          <span className="text-heading text-md fw-semibold">350.000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TopSellingProducts variant="hot" title="Top deal • Siêu rẻ" />
      {/* ========================= Top Selling Products End ================================ */}

      {/* ========================= 3 Small Banners Start ================================ */}
      <div className="container mt-10 container-lg mb-70">
        <div className="row">
          <div className="col-lg-4">
            <div className="rounded-5">
              <a href="#" className="p-0 m-0">
                <img src="/assets/images/bg/shopee-04.webp" alt="Banner 1"
                  className="banner-img w-100 h-100 object-fit-cover rounded-10" />
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="rounded-5">
              <a href="#" className="p-0 m-0">
                <img src="/assets/images/bg/shopee-06.jpg" alt="Banner 2"
                  className="banner-img w-100 h-100 object-fit-cover rounded-10" />
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="rounded-5">
              <a href="#" className="p-0 m-0">
                <img src="/assets/images/bg/shopee-07.jpg" alt="Banner 3"
                  className="banner-img w-100 h-100 object-fit-cover rounded-10" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* ========================= 3 Small Banners End ================================== */}

      {/* ========================= Trending Products Start ================================ */}
      <TrendingProductsTabs />
      {/* ========================= Trending Products End ================================ */}

      {/* ========================= Top Brands Start ===================================== */}
      <TopBrandsSection />
      {/* ========================= Top Brands End ======================================= */}

      {/* ========================= Featured Products (Sản phẩm hàng đầu) Start ============================== */}
      <FeaturedProductsSection />
      {/* ========================= Featured Products (Sản phẩm hàng đầu) End ================================= */}

      {/* ========================= Super Discount Start ================================ */}
      <div className="">
        <div className="container container-lg">
          <div className="py-20 border border-dashed border-main-500 bg-main-50 rounded-8 d-flex align-items-center justify-content-evenly">
            <p className="h6 text-main-600 fw-normal">
              Super discount for your{' '}
              <a href="javascript:void(0)" className="fw-bold text-decoration-underline text-main-600 hover-text-decoration-none hover-text-primary-600">first purchase</a>
            </p>
            <div className="position-relative">
              <button className="px-32 py-10 text-white border-0 copy-coupon-btn text-uppercase bg-main-600 rounded-pill hover-bg-main-800">
                FREE25BAC
                <i className="text-lg ph ph-file-text line-height-1"></i>
              </button>
              <span className="px-16 py-6 mb-8 text-xs text-white copy-text bg-main-600 fw-normal position-absolute rounded-pill bottom-100 start-50 translate-middle-x min-w-max"></span>
            </div>
            <p className="text-md text-main-600 fw-normal">
              Use discount code to get <span className="fw-bold text-main-600">20% </span> discount for any item
            </p>
          </div>
        </div>
      </div>
      {/* ========================= Super Discount End ================================== */}

      {/* ========================= Trending Products Start ================================ */}
      <section className="overflow-hidden trending-productss pt-60">
        <div className="container container-lg">
          <div className="p-24 border border-gray-100 rounded-16">
            <div className="mb-24 section-heading">
              <div className="flex-wrap gap-8 flex-between">
                <h6 className="mb-0 wow fadeInLeft"><i className="ph-bold ph-hand-withdraw text-main-600"></i> Có thể bạn quan tâm</h6>
                <ul className="nav common-tab style-two nav-pills wow fadeInRight" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600 active" id="pills-all-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab" aria-controls="pills-all" aria-selected="true">All</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-mobile-tab" data-bs-toggle="pill" data-bs-target="#pills-mobile" type="button" role="tab" aria-controls="pills-mobile" aria-selected="false">Mobile</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-headphone-tab" data-bs-toggle="pill" data-bs-target="#pills-headphone" type="button" role="tab" aria-controls="pills-headphone" aria-selected="false">Headphone</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-usb-tab" data-bs-toggle="pill" data-bs-target="#pills-usb" type="button" role="tab" aria-controls="pills-usb" aria-selected="false">USB</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-camera-tab" data-bs-toggle="pill" data-bs-target="#pills-camera" type="button" role="tab" aria-controls="pills-camera" aria-selected="false">Camera</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-laptop-tab" data-bs-toggle="pill" data-bs-target="#pills-laptop" type="button" role="tab" aria-controls="pills-laptop" aria-selected="false">Laptop</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="text-sm nav-link fw-medium hover-border-main-600" id="pills-accessories-tab" data-bs-toggle="pill" data-bs-target="#pills-accessories" type="button" role="tab" aria-controls="pills-accessories" aria-selected="false">Accessories</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-content" id="pills-tabContent">
              {/* All */}
              <div className="tab-pane fade show active" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`all-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="gap-6 flex-align">
                            <div className="gap-2 flex-align">
                              <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                              <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                              <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                              <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                              <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                            </div>
                            <span className="text-xs text-gray-500 fw-medium">4.8</span>
                            <span className="text-xs text-gray-500 fw-medium">(12K)</span>
                            <span className="px-8 py-2 text-xs rounded-pill text-main-two-600 bg-main-two-50 fw-normal">Apple</span>
                          </div>

                          <div className="mt-16 mb-10 product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">450.000 đ</span>
                            <span className="text-heading text-md fw-semibold">300.000 đ</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-pill flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Mobile */}
              <div className="tab-pane fade" id="pills-mobile" role="tabpanel" aria-labelledby="pills-mobile-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`mobile-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Headphone */}
              <div className="tab-pane fade" id="pills-headphone" role="tabpanel" aria-labelledby="pills-headphone-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`headphone-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* USB */}
              <div className="tab-pane fade" id="pills-usb" role="tabpanel" aria-labelledby="pills-usb-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`usb-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Camera */}
              <div className="tab-pane fade" id="pills-camera" role="tabpanel" aria-labelledby="pills-camera-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`camera-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Laptop */}
              <div className="tab-pane fade" id="pills-laptop" role="tabpanel" aria-labelledby="pills-laptop-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`laptop-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Accessories */}
              <div className="tab-pane fade" id="pills-accessories" role="tabpanel" aria-labelledby="pills-accessories-tab" tabIndex={0}>
                <div className="row g-12">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`accessories-${i}`} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a href="product-details-two.html" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                          <img src="/assets/images/thumbs/product-two-img1.png" alt="" className="w-auto max-w-unset" />
                        </a>
                        <div className="mt-16 product-card__content w-100">
                          <h6 className="my-16 text-lg title fw-semibold">
                            <a href="product-details-two.html" className="link text-line-2" tabIndex={0}>Instax Mini 12 Instant Film Camera - Green</a>
                          </h6>
                          <div className="product-card__price">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$450.00</span>
                            <span className="text-heading text-md fw-semibold">$300.00</span>
                          </div>
                          <a href="cart.html" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium" tabIndex={0}>
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TopSellingProducts variant="recommend" title="Có thể bạn quan tâm" perPage={8} />
      {/* ========================= Trending Products End ================================== */}

      {/* ============================== Top Brand Section Start ==================================== */}
      <div className="py-40 top-brand">
        <div className="container container-lg">
          <div className="p-24 border border-gray-50 rounded-16">
            <div className="mb-24 section-heading">
              <div className="flex-wrap gap-8 flex-between">
                <h6 className="mb-0">Các thương hiệu đối tác</h6>
                <div className="gap-8 flex-align">
                  <button type="button" id="topBrand-prev" className="text-xl border border-gray-100 slick-prev slick-arrow flex-center rounded-circle hover-border-main-two-600 hover-bg-main-two-600 hover-text-white transition-1">
                    <i className="ph ph-caret-left"></i>
                  </button>
                  <button type="button" id="topBrand-next" className="text-xl border border-gray-100 slick-next slick-arrow flex-center rounded-circle hover-border-main-two-600 hover-bg-main-two-600 hover-text-white transition-1">
                    <i className="ph ph-caret-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="top-brand__slider">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="wow bounceIn">
                  <div className="px-8 my-4 top-brand__item flex-center rounded-8 hover-border-main-600 transition-1 box-shadow-7xl">
                    <img src={`assets/images/thumbs/top-brand-img${Math.min(idx + 1, 8)}.png`} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ============================== Top Brand Section End ==================================== */}

      {/* Footer removed as requested */}
    </>
  );
}


