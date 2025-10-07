"use client";
import React from "react";

export default function GlobalChrome() {
  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <img src="/assets/images/icon/preloader.gif" alt="Loading" />
      </div>

      {/* Overlay layers */}
      <div className="overlay"></div>
      <div className="side-overlay"></div>

      {/* Scroll to top progress */}
      <div className="progress-wrap">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>


      {/* Mobile Menu (matches index.html) */}
      <div className="mobile-menu scroll-sm d-lg-none d-block">
        <button type="button" className="close-button">
          <i className="ph ph-x"></i>
        </button>
        <div className="mobile-menu__inner logo">
          <a href="index.html" className="mobile-menu__logo">
            <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
          </a>
          <div className="mobile-menu__menu">
            <ul className="nav-menu flex-align nav-menu--mobile">
              <li className="nav-menu__item">
                <form action="#" className="position-relative w-100">
                  <input
                    type="text"
                    className="py-10 text-sm shadow-none form-control fw-medium placeholder-italic bg-neutral-30 placeholder-fw-medium placeholder-light ps-20 pe-60"
                    placeholder="Tìm kiếm sản phẩm, danh mục hoặc cửa hàng..."
                  />
                  <button
                    type="submit"
                    className="text-xl position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 line-height-1"
                  >
                    <i className="ph-bold ph-magnifying-glass"></i>
                  </button>
                </form>
              </li>
              <li className="pt-10 nav-menu__item">
                <a href="#" className="nav-menu__link text-heading-two hover-text-main-600">
                  <i className="ph-bold ph-notepad text-main-600"></i> Tra cứu đơn hàng
                </a>
              </li>
              <li className="nav-menu__item">
                <a href="#" className="nav-menu__link text-heading-two hover-text-main-600">
                  <i className="ph-bold ph-storefront text-main-600"></i> Truy cập bán hàng
                </a>
              </li>
              <li className="nav-menu__item">
                <a href="#" className="nav-menu__link text-heading-two hover-text-main-600">
                  <i className="ph-bold ph-handshake text-main-600"></i> Đăng ký đối tác
                </a>
              </li>
              <li className="nav-menu__item">
                <a href="#" className="nav-menu__link text-heading-two hover-text-main-600">
                  <i className="ph-bold ph-info text-main-600"></i> Giới thiệu về Siêu Thị Vina
                </a>
              </li>
              <li className="nav-menu__item">
                <a href="contact.html" className="nav-menu__link text-heading-two hover-text-main-600">
                  <i className="ph-bold ph-chat-dots text-main-600"></i> Liên hệ hỗ trợ
                </a>
              </li>
              <li className="pt-10 nav-menu__item">
                <a
                  href="javascript:void(0)"
                  className="gap-10 px-24 text-center text-white d-flex justify-content-center align-content-around fw-medium py-14 bg-main-600 rounded-pill line-height-1 hover-bg-main-50 hover-text-main-600"
                >
                  <span className="d-lg-none d-flex line-height-1">
                    <i className="ph-bold ph-user"></i>
                  </span>
                  Đăng nhập / Đăng ký
                </a>
              </li>
              <li className="pt-10 on-hover-item nav-menu__item has-submenu">
                <a
                  href="javascript:void(0)"
                  className="gap-10 px-20 py-10 text-center text-white d-flex justify-content-center flex-align align-content-around fw-medium bg-success-600 rounded-pill line-height-1 hover-bg-success-500"
                >
                  <span className="d-lg-none d-flex line-height-1">
                    <img
                      src="/assets/images/thumbs/method.png"
                      className="rounded-circle object-fit-cover"
                      style={{ width: '25px', height: '25px' }}
                      alt=""
                    />
                  </span>
                  lyhuu123
                </a>
                <ul className="on-hover-dropdown common-dropdown nav-submenu scroll-sm">
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="cart.html" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                      <i className="ph-bold ph-heart text-main-600"></i> Yêu thích <span className="badge bg-success-600 rounded-circle">6</span>
                    </a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="wishlist.html" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                      <i className="ph-bold ph-user text-main-600"></i> Tài khoản
                    </a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="checkout.html" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                      <i className="ph-bold ph-notepad text-main-600"></i> Đơn hàng của tôi
                    </a>
                  </li>
                  <li className="common-dropdown__item nav-submenu__item">
                    <a href="checkout.html" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                      <i className="ph-bold ph-sign-out text-main-600"></i> Đăng xuất
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Top Header removed (handled in page) */}
    </>
  );
}
