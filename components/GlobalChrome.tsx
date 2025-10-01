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

      {/* Search Box */}
      <form action="#" className="search-box">
        <button
          type="button"
          className="search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
        >
          <i className="ph ph-x"></i>
        </button>
        <div className="container container-lg">
          <div className="position-relative">
            <input
              type="text"
              className="form-control py-16 px-24 text-xl rounded-pill pe-64"
              placeholder="Search for a product or brand"
            />
            <button
              type="submit"
              className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
            >
              <i className="ph ph-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </form>

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
                    className="form-control text-sm fw-medium placeholder-italic shadow-none bg-neutral-30 placeholder-fw-medium placeholder-light py-10 ps-20 pe-60"
                    placeholder="Tìm kiếm sản phẩm, danh mục hoặc cửa hàng..."
                  />
                  <button
                    type="submit"
                    className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1"
                  >
                    <i className="ph-bold ph-magnifying-glass"></i>
                  </button>
                </form>
              </li>
              <li className="nav-menu__item pt-10">
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
              <li className="nav-menu__item pt-10">
                <a
                  href="javascript:void(0)"
                  className="d-flex justify-content-center align-content-around text-center gap-10 fw-medium text-white py-14 px-24 bg-main-600 rounded-pill line-height-1 hover-bg-main-50 hover-text-main-600"
                >
                  <span className="d-lg-none d-flex line-height-1">
                    <i className="ph-bold ph-user"></i>
                  </span>
                  Đăng nhập / Đăng ký
                </a>
              </li>
              <li className="on-hover-item nav-menu__item has-submenu pt-10">
                <a
                  href="javascript:void(0)"
                  className="d-flex justify-content-center flex-align align-content-around text-center gap-10 fw-medium text-white py-10 px-20 bg-success-600 rounded-pill line-height-1 hover-bg-success-500"
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
