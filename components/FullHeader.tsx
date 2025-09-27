"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type FullHeaderProps = {
  showTopNav?: boolean;
  showCategoriesBar?: boolean;
  showClassicTopBar?: boolean;
};

export default function FullHeader({ showTopNav = true, showCategoriesBar = true, showClassicTopBar = true }: FullHeaderProps) {
  return (
    <>
      {/* Header Middle with main nav */}
      {showTopNav && (
        <header className="header-middle border-bottom border-neutral-40 py-20" style={{ overflow: "visible", position: "relative", zIndex: 300 }}>
          <div className="container container-lg">
            <nav className="header-inner flex-between align-items-center gap-8">
              {/* Logo */}
              <div className="logo">
                <Link href="/" className="link">
                  <Image src="/assets/images/logo/logo-two.png" alt="Logo" width={120} height={32} />
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="header-menu d-lg-block d-none">
                <ul className="nav-menu flex-align ">
                  <li className="on-hover-item nav-menu__item has-submenu activePage">
                    <a href="javascript:void(0)" className="nav-menu__link text-heading-two">Home</a>
                  </li>
                  <li className="on-hover-item nav-menu__item has-submenu">
                    <a href="javascript:void(0)" className="nav-menu__link text-heading-two">Shop</a>
                  </li>
                  <li className="on-hover-item nav-menu__item has-submenu">
                    <span className="badge-notification bg-warning-600 text-white text-sm py-2 px-8 rounded-4">New</span>
                    <a href="javascript:void(0)" className="nav-menu__link text-heading-two">Pages</a>
                  </li>
                  <li className="on-hover-item nav-menu__item has-submenu">
                    <span className="badge-notification bg-tertiary-600 text-white text-sm py-2 px-8 rounded-4">New</span>
                    <a href="javascript:void(0)" className="nav-menu__link text-heading-two">Vendors</a>
                  </li>
                  <li className="on-hover-item nav-menu__item has-submenu">
                    <a href="javascript:void(0)" className="nav-menu__link text-heading-two">Blog</a>
                  </li>
                  <li className="nav-menu__item">
                    <Link href="/contact" className="nav-menu__link text-heading-two">Contact Us</Link>
                  </li>
                </ul>
              </div>

              {/* Right side: language/currency/tracking + mobile toggle */}
              <div className="header-right flex-align">
                <ul className="header-top__right style-two style-three flex-align flex-nowrap gap-16 d-lg-flex d-none">
                  <li className="on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white">
                    <a href="javascript:void(0)" className="selected-text selected-text text-neutral-500 fw-semibold text-sm py-8 text-nowrap">Eng</a>
                    {/* Language Dropdown */}
                    <ul className="selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8" style={{ zIndex: 400 }}>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag1.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          English
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag2.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          Japan
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag3.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          French
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag4.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          Germany
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag6.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          Bangladesh
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag5.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          South Korea
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white">
                    <a href="javascript:void(0)" className="selected-text selected-text text-neutral-500 fw-semibold text-sm py-8 text-nowrap">USD</a>
                    {/* Currency Dropdown */}
                    <ul className="selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8" style={{ zIndex: 400 }}>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag1.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          USD
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag2.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          Yen
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag3.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          Franc
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag4.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          EURO
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag6.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          BDT
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" className="hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/images/thumbs/flag5.png" alt="" className="w-16 h-12 rounded-4 border border-gray-100" />
                          WON
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="d-sm-flex d-none">
                    <a href="javascript:void(0)" className="selected-text selected-text text-neutral-500 fw-semibold text-sm py-8 hover-text-heading text-nowrap">Order Tracking</a>
                  </li>
                </ul>
                <button type="button" className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex">
                  <i className="ph ph-list"></i>
                </button>
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* Second header */}
      {showTopNav ? (
        showCategoriesBar ? (
        // Keep full categories/search/actions for pages like Contact
        <header className="header bg-white pt-24" style={{ overflow: "visible", zIndex: 100 }}>
          <div className="container container-lg">
            <nav className="header-inner d-flex justify-content-between gap-16">
              <div className="d-flex flex-grow-1">
                {/* Category Button (hidden on smaller screens as in HTML) */}
                <div className="category-two h-100 d-lg-block flex-shrink-0 on-hover-item">
                  <button type="button" className="category__button flex-align gap-8 fw-medium bg-main-two-600 py-16 px-20 text-white h-100 md-rounded-top">
                    <span className="icon text-2xl d-md-flex d-none"><i className="ph ph-squares-four"></i></span>
                    <span className="d-lg-flex d-none">All</span>  Categories
                    <span className="arrow-icon text-md d-flex ms-auto"><i className="ph ph-caret-down"></i></span>
                  </button>

                  {/* Desktop Dropdown */}
                  <div className="responsive-dropdown on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper">
                    <ul className="scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto">
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Vegetables &amp; Fruit</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Vegetables &amp; Fruit</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Potato &amp; Tomato</a></li>
                            <li><a href="/shop">Cucumber &amp; Capsicum</a></li>
                            <li><a href="/shop">Leafy Vegetables</a></li>
                            <li><a href="/shop">Root Vegetables</a></li>
                            <li><a href="/shop">Beans &amp; Okra</a></li>
                            <li><a href="/shop">Cabbage &amp; Cauliflower</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Beverages</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Beverages</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Soft Drinks</a></li>
                            <li><a href="/shop">Juices</a></li>
                            <li><a href="/shop">Tea &amp; Coffee</a></li>
                            <li><a href="/shop">Energy Drinks</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Meats &amp; Seafood</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Meats &amp; Seafood</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Beef</a></li>
                            <li><a href="/shop">Chicken</a></li>
                            <li><a href="/shop">Pork</a></li>
                            <li><a href="/shop">Fish</a></li>
                            <li><a href="/shop">Shrimp</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Breakfast &amp; Dairy</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Breakfast &amp; Dairy</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Milk &amp; Yogurt</a></li>
                            <li><a href="/shop">Cheese</a></li>
                            <li><a href="/shop">Butter &amp; Margarine</a></li>
                            <li><a href="/shop">Breakfast Cereal</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Frozen Foods</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Frozen Foods</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Frozen Vegetables</a></li>
                            <li><a href="/shop">Frozen Meat</a></li>
                            <li><a href="/shop">Ice Cream</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Biscuits &amp; Snacks</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Biscuits &amp; Snacks</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Biscuits</a></li>
                            <li><a href="/shop">Chips</a></li>
                            <li><a href="/shop">Namkeen</a></li>
                          </ul>
                        </div>
                      </li>
                      <li className="has-submenus-submenu">
                        <a href="javascript:void(0)" className="text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0">
                          <span>Grocery &amp; Staples</span>
                          <span className="icon text-md d-flex ms-auto"><i className="ph ph-caret-right"></i></span>
                        </a>
                        <div className="submenus-submenu py-16">
                          <h6 className="text-lg px-16 submenus-submenu__title">Grocery &amp; Staples</h6>
                          <ul className="submenus-submenu__list max-h-300 overflow-y-auto scroll-sm">
                            <li><a href="/shop">Atta &amp; Other Flours</a></li>
                            <li><a href="/shop">Rice &amp; other grains</a></li>
                            <li><a href="/shop">Dals &amp; Pulses</a></li>
                            <li><a href="/shop">Edible Oils</a></li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Search Bar */}
                <form action="#" className="position-relative ms-20 w-100 d-md-block d-none me-16">
                  <input
                    type="text"
                    className="form-control py-16 ps-30 pe-60 bg-neutral-30 placeholder-italic placeholder-light"
                    placeholder="Search for products, categories or brands..."
                  />
                  <button type="submit" className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1">
                    <i className="ph-bold ph-magnifying-glass"></i>
                  </button>
                </form>
              </div>

              {/* Right side actions */}
              <div className="d-flex align-items-center gap-16 flex-nowrap">
                <Link href="/compare" className="d-flex align-items-center gap-8 text-gray-900 text-nowrap">
                  <span className="position-relative d-inline-flex">
                    <i className="ph-bold ph-git-compare"></i>
                    <span className="badge bg-success-600 rounded-circle position-absolute top-0 start-100 translate-middle">2</span>
                  </span>
                  <span className="text-nowrap">Compare</span>
                </Link>
                <Link href="/cart" className="d-flex align-items-center gap-8 text-gray-900 text-nowrap">
                  <span className="position-relative d-inline-flex">
                    <i className="ph-bold ph-shopping-cart"></i>
                    <span className="badge bg-success-600 rounded-circle position-absolute top-0 start-100 translate-middle">2</span>
                  </span>
                  <span className="text-nowrap">Cart</span>
                </Link>
                <Link href="/account" className="d-flex align-items-center gap-8 text-danger-600 btn bg-danger-50 hover-bg-danger-600 hover-text-white py-10 px-16 rounded-8 text-nowrap">
                  <i className="ph-bold ph-user"></i>
                  <span>Account</span>
                </Link>
              </div>
            </nav>
          </div>
        </header>
        ) : null
      ) : (
        // Classic simple header: top red bar + logo/search/user pill
        <>
          {/* Top thin red bar (index style) */}
          {showClassicTopBar && (
          <div className="header-top bg-main-600 flex-between py-10 d-none d-lg-block">
            <div className="container">
              <div className="flex-between flex-wrap gap-16">
                <ul className="flex-align flex-wrap gap-16">
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-storefront"></i>
                      Truy cập bán hàng
                    </a>
                  </li>
                  <li className="text-white-6">•</li>
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-hand-heart"></i>
                      Đăng ký đối tác
                    </a>
                  </li>
                  <li className="text-white-6">•</li>
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-info"></i>
                      Giới thiệu về Siêu Thị Vina
                    </a>
                  </li>
                  <li className="text-white-6">•</li>
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-headset"></i>
                      Liên hệ hỗ trợ
                    </a>
                  </li>
                </ul>
                <ul className="flex-align flex-wrap gap-16">
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-squares-four"></i>
                      Danh mục
                    </a>
                  </li>
                  <li className="text-white-6">•</li>
                  <li>
                    <a href="#" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-notepad"></i>
                      Tra cứu đơn hàng
                    </a>
                  </li>
                  <li className="text-white-6">•</li>
                  <li>
                    <a href="/wishlist" className="text-white-6 text-sm hover-text-white flex-align gap-8">
                      <i className="ph-bold ph-shopping-cart"></i>
                      Giỏ hàng
                      <span className="badge bg-success-600 rounded-circle">6</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          )}


        <header className="header border-bottom border-neutral-40 pt-14 pb-14">
          <div className="container">
            <nav className="header-inner flex-between gap-16">
              {/* Logo */}
              <div className="logo">
                <Link href="/" className="link">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
                </Link>
              </div>

              {/* Search */}
              <div className="header-menu w-50 d-lg-block d-none">
                <form action="#" className="position-relative ms-20 w-100 d-md-block d-none">
                  <input
                    type="text"
                    className="form-control fw-medium placeholder-italic shadow-none bg-neutral-30 placeholder-fw-medium placeholder-light py-16 ps-30 pe-60"
                    placeholder="Tìm kiếm sản phẩm, danh mục hoặc cửa hàng..."
                  />
                  <button type="submit" className="position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 text-xl line-height-1">
                    <i className="ph-bold ph-magnifying-glass"></i>
                  </button>
                </form>
              </div>

              {/* Right user pill */}
              <div className="header-right flex-align">
                <div className="on-hover-item nav-menu__item has-submenu header-top__right style-two style-three flex-align flex-wrap d-lg-block d-none">
                  <a
                    href="javascript:void(0)"
                    className="d-flex justify-content-center flex-align align-content-around text-center gap-10 fw-medium text-white py-10 px-20 bg-success-600 rounded-pill line-height-1 hover-bg-success-500 hover-text-white"
                  >
                    <span className="line-height-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/images/thumbs/flag2.png" className="rounded-circle object-fit-cover" style={{ width: 25, height: 25 }} alt="" />
                    </span>
                    lyhuu123
                  </a>
                  {/* Dropdown for user */}
                  <ul className="on-hover-dropdown common-dropdown nav-submenu scroll-sm">
                    <li className="common-dropdown__item nav-submenu__item">
                      <Link href="/cart" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                        <i className="ph-bold ph-heart text-main-600"></i>
                        Yêu thích
                        <span className="badge bg-success-600 rounded-circle ms-8">6</span>
                      </Link>
                    </li>
                    <li className="common-dropdown__item nav-submenu__item">
                      <Link href="/wishlist" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                        <i className="ph-bold ph-user text-main-600"></i>
                        Tài khoản
                      </Link>
                    </li>
                    <li className="common-dropdown__item nav-submenu__item">
                      <Link href="/checkout" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                        <i className="ph-bold ph-notepad text-main-600"></i>
                        Đơn hàng của tôi
                      </Link>
                    </li>
                    <li className="common-dropdown__item nav-submenu__item">
                      <Link href="/checkout" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                        <i className="ph-bold ph-sign-out text-main-600"></i>
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                </div>
                <button type="button" className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex">
                  <i className="ph ph-list"></i>
                </button>
              </div>
            </nav>
          </div>
        </header>
        </>
      )}
    </>
  );
}

