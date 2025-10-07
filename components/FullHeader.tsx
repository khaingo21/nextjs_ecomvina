"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBox from "@/components/SearchBox";

/**
 * NOTE:
 * - Không dùng jQuery, không dùng "javascript:void(0)".
 * - Dùng <button> cho trigger dropdown để tăng accessibility.
 * - Đóng mở bằng React state; auto-close khi click ra ngoài / nhấn Esc.
 * - Mobile menu toggle thuần React (không cần main.js).
 */

type FullHeaderProps = {
  showTopNav?: boolean;
  showCategoriesBar?: boolean;
  showClassicTopBar?: boolean;
};

function useClickAway<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onAway: () => void
) {
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;                         // <- kiểm tra null
      if (!el.contains(e.target as Node)) onAway();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onAway();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onEsc);
    };
  }, [ref, onAway]);
}

export default function FullHeader({
  showTopNav = true,
  showCategoriesBar = true,
  showClassicTopBar = true,
}: FullHeaderProps) {
  // header dropdown states
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const langRef = useRef<HTMLLIElement>(null);
  const currRef = useRef<HTMLLIElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useClickAway(langRef, () => setLangOpen(false));
  useClickAway(currRef, () => setCurrOpen(false));
  useClickAway(userRef, () => setUserOpen(false));
  useClickAway(catRef, () => setCatOpen(false));

  // đóng các dropdown khác khi mở 1 cái
  function openOnly(which: "lang" | "curr" | "user" | "cat") {
    setLangOpen(which === "lang");
    setCurrOpen(which === "curr");
    setUserOpen(which === "user");
    setCatOpen(which === "cat");
  }

  return (
    <>
      {/* HEADER MIDDLE */}
      {showTopNav && (
        <header
          className="py-20 header-middle border-bottom border-neutral-40"
          style={{ overflow: "visible", position: "relative", zIndex: 300 }}
        >
          <div className="container container-lg">
            <nav className="gap-8 header-inner flex-between align-items-center">
              {/* Logo */}
              <div className="logo">
                <Link href="/" className="link" aria-label="Home">
                  <Image src="/assets/images/logo/logo-two.png" alt="Logo" width={120} height={32} />
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="header-menu d-lg-block d-none">
                <ul className="nav-menu flex-align">
                  <li className="nav-menu__item has-submenu activePage">
                    <Link href="/" className="nav-menu__link text-heading-two">Home</Link>
                  </li>
                  <li className="nav-menu__item has-submenu">
                    <Link href="/shop" className="nav-menu__link text-heading-two">Shop</Link>
                  </li>
                  <li className="nav-menu__item has-submenu">
                    <span className="px-8 py-2 text-sm text-white badge-notification bg-warning-600 rounded-4">New</span>
                    <Link href="/pages" className="nav-menu__link text-heading-two">Pages</Link>
                  </li>
                  <li className="nav-menu__item has-submenu">
                    <span className="px-8 py-2 text-sm text-white badge-notification bg-tertiary-600 rounded-4">New</span>
                    <Link href="/vendors" className="nav-menu__link text-heading-two">Vendors</Link>
                  </li>
                  <li className="nav-menu__item has-submenu">
                    <Link href="/blog" className="nav-menu__link text-heading-two">Blog</Link>
                  </li>
                  <li className="nav-menu__item">
                    <Link href="/contact" className="nav-menu__link text-heading-two">Contact Us</Link>
                  </li>
                </ul>
              </div>

              {/* Right side + Mobile toggle */}
              <div className="header-right flex-align">
                <ul className="gap-16 header-top__right style-two style-three flex-align flex-nowrap d-lg-flex d-none">
                  {/* Language */}
                  <li ref={langRef} className="on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white position-relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={langOpen}
                      onClick={() => (langOpen ? setLangOpen(false) : openOnly("lang"))}
                      className="py-8 text-sm selected-text text-neutral-500 fw-semibold text-nowrap btn-reset"
                    >
                      Eng
                    </button>
                    {langOpen && (
                      <ul
                        role="menu"
                        className="px-0 py-8 selectable-text-list common-dropdown common-dropdown--sm max-h-200 scroll-sm position-absolute"
                        style={{ zIndex: 400 }}
                      >
                        {[
                          { flag: "/assets/images/thumbs/flag1.png", label: "English" },
                          { flag: "/assets/images/thumbs/flag2.png", label: "Japan" },
                          { flag: "/assets/images/thumbs/flag3.png", label: "French" },
                          { flag: "/assets/images/thumbs/flag4.png", label: "Germany" },
                          { flag: "/assets/images/thumbs/flag6.png", label: "Bangladesh" },
                          { flag: "/assets/images/thumbs/flag5.png", label: "South Korea" },
                        ].map((it) => (
                          <li key={it.label} role="none">
                            <button
                              role="menuitem"
                              className="gap-8 px-16 py-6 text-xs text-gray-500 hover-bg-gray-100 flex-align rounded-0 w-100 text-start btn-reset"
                              onClick={() => setLangOpen(false)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={it.flag} alt="" className="w-16 h-12 border border-gray-100 rounded-4" />
                              {it.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  {/* Currency */}
                  <li ref={currRef} className="on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white position-relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={currOpen}
                      onClick={() => (currOpen ? setCurrOpen(false) : openOnly("curr"))}
                      className="py-8 text-sm selected-text text-neutral-500 fw-semibold text-nowrap btn-reset"
                    >
                      USD
                    </button>
                    {currOpen && (
                      <ul
                        role="menu"
                        className="px-0 py-8 selectable-text-list common-dropdown common-dropdown--sm max-h-200 scroll-sm position-absolute"
                        style={{ zIndex: 400 }}
                      >
                        {["USD", "Yen", "Franc", "EURO", "BDT", "WON"].map((label) => (
                          <li key={label} role="none">
                            <button
                              role="menuitem"
                              className="gap-8 px-16 py-6 text-xs text-gray-500 hover-bg-gray-100 flex-align rounded-0 w-100 text-start btn-reset"
                              onClick={() => setCurrOpen(false)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/assets/images/thumbs/flag1.png" alt="" className="w-16 h-12 border border-gray-100 rounded-4" />
                              {label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  <li className="d-sm-flex d-none">
                    <Link href="/tracking" className="py-8 text-sm selected-text text-neutral-500 fw-semibold hover-text-heading text-nowrap">
                      Order Tracking
                    </Link>
                  </li>
                </ul>

                <button
                  type="button"
                  aria-label="Toggle mobile menu"
                  className="text-4xl text-gray-800 d-lg-none ms-3n d-flex btn-reset"
                  onClick={() => setMobileOpen((s) => !s)}
                >
                  <i className="ph ph-list"></i>
                </button>
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* SECOND HEADER (categories/search/actions) */}
      {showTopNav ? (
        showCategoriesBar ? (
          <header className="pt-24 bg-white header" style={{ overflow: "visible", zIndex: 100 }}>
            <div className="container container-lg">
              <nav className="gap-16 header-inner d-flex justify-content-between">
                <div className="d-flex flex-grow-1">
                  {/* Category Button */}
                  <div ref={catRef} className="flex-shrink-0 category-two h-100 d-lg-block position-relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={catOpen}
                      onClick={() => (catOpen ? setCatOpen(false) : openOnly("cat"))}
                      className="gap-8 px-20 py-16 text-white category__button flex-align fw-medium bg-main-two-600 h-100 md-rounded-top"
                    >
                      <span className="text-2xl d-md-flex d-none"><i className="ph ph-squares-four" /></span>
                      <span className="d-lg-flex d-none">All</span> Categories
                      <span className="text-md d-flex ms-auto"><i className="ph ph-caret-down" /></span>
                    </button>

                    {/* Desktop Dropdown (React-controlled) */}
                    {catOpen && (
                      <div
                        role="menu"
                        className="p-0 bg-white rounded-md shadow responsive-dropdown common-dropdown nav-submenu submenus-submenu-wrapper position-absolute"
                      >
                        <ul className="p-0 py-8 overflow-y-auto scroll-sm w-300 max-h-400">
                          {[
                            {
                              title: "Vegetables & Fruit",
                              sub: ["Potato & Tomato", "Cucumber & Capsicum", "Leafy Vegetables", "Root Vegetables", "Beans & Okra", "Cabbage & Cauliflower"],
                            },
                            { title: "Beverages", sub: ["Soft Drinks", "Juices", "Tea & Coffee", "Energy Drinks"] },
                            { title: "Meats & Seafood", sub: ["Beef", "Chicken", "Pork", "Fish", "Shrimp"] },
                            { title: "Breakfast & Dairy", sub: ["Milk & Yogurt", "Cheese", "Butter & Margarine", "Breakfast Cereal"] },
                            { title: "Frozen Foods", sub: ["Frozen Vegetables", "Frozen Meat", "Ice Cream"] },
                            { title: "Biscuits & Snacks", sub: ["Biscuits", "Chips", "Namkeen"] },
                            { title: "Grocery & Staples", sub: ["Atta & Other Flours", "Rice & other grains", "Dals & Pulses", "Edible Oils"] },
                          ].map((grp) => (
                            <li key={grp.title} className="position-relative">
                              <div className="gap-8 px-16 py-12 text-gray-700 text-15 d-flex align-items-center">
                                <span>{grp.title}</span>
                              </div>
                              <div className="py-16 border-top">
                                <h6 className="px-16 text-lg">{grp.title}</h6>
                                <ul className="overflow-y-auto max-h-300 scroll-sm">
                                  {grp.sub.map((s) => (
                                    <li key={s}>
                                      <Link href="/shop" className="px-16 py-8 d-block hover-bg-neutral-100">
                                        {s}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Search */}
                  <form action="#" className="position-relative ms-20 w-100 d-md-block d-none me-16" role="search">
                    <input
                      type="text"
                      className="py-16 form-control ps-30 pe-60 bg-neutral-30 placeholder-italic placeholder-light"
                      placeholder="Search for products, categories or brands..."
                      aria-label="Search products"
                    />
                    <button type="submit" className="text-xl position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 line-height-1" aria-label="Search">
                      <i className="ph-bold ph-magnifying-glass"></i>
                    </button>
                  </form>
                </div>

                {/* Right actions */}
                <div className="gap-16 d-flex align-items-center flex-nowrap">
                  <Link href="/compare" className="gap-8 text-gray-900 d-flex align-items-center text-nowrap">
                    <span className="position-relative d-inline-flex">
                      <i className="ph-bold ph-git-compare"></i>
                      <span className="top-0 badge bg-success-600 rounded-circle position-absolute start-100 translate-middle">2</span>
                    </span>
                    <span className="text-nowrap">Compare</span>
                  </Link>
                  <Link href="/cart" className="gap-8 text-gray-900 d-flex align-items-center text-nowrap">
                    <span className="position-relative d-inline-flex">
                      <i className="ph-bold ph-shopping-cart"></i>
                      <span className="top-0 badge bg-success-600 rounded-circle position-absolute start-100 translate-middle">2</span>
                    </span>
                    <span className="text-nowrap">Cart</span>
                  </Link>
                  <div ref={userRef} className="flex-wrap on-hover-item nav-menu__item has-submenu header-top__right style-two style-three flex-align d-lg-block d-none position-relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={userOpen}
                      onClick={() => (userOpen ? setUserOpen(false) : openOnly("user"))}
                      className="gap-10 px-20 py-10 text-center text-white d-flex justify-content-center flex-align align-content-around fw-medium bg-success-600 rounded-pill line-height-1 hover-bg-success-500 hover-text-white btn-reset"
                    >
                      <span className="line-height-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/images/thumbs/flag2.png"
                          className="rounded-circle object-fit-cover"
                          style={{ width: 25, height: 25 }}
                          alt=""
                        />
                      </span>
                      lyhuu123
                    </button>
                    {userOpen && (
                      <ul role="menu" className="bg-white rounded-md shadow common-dropdown nav-submenu scroll-sm position-absolute">
                        <li className="common-dropdown__item nav-submenu__item" role="none">
                          <Link href="/cart" role="menuitem" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                            <i className="ph-bold ph-heart text-main-600"></i>
                            Yêu thích
                            <span className="badge bg-success-600 rounded-circle ms-8">6</span>
                          </Link>
                        </li>
                        <li className="common-dropdown__item nav-submenu__item" role="none">
                          <Link href="/wishlist" role="menuitem" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                            <i className="ph-bold ph-user text-main-600"></i>
                            Tài khoản
                          </Link>
                        </li>
                        <li className="common-dropdown__item nav-submenu__item" role="none">
                          <Link href="/checkout" role="menuitem" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                            <i className="ph-bold ph-notepad text-main-600"></i>
                            Đơn hàng của tôi
                          </Link>
                        </li>
                        <li className="common-dropdown__item nav-submenu__item" role="none">
                          <Link href="/logout" role="menuitem" className="common-dropdown__link nav-submenu__link text-heading-two hover-bg-neutral-100">
                            <i className="ph-bold ph-sign-out text-main-600"></i>
                            Đăng xuất
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </nav>

              {/* Mobile menu drawer (simple) */}
              {mobileOpen && (
                <div className="mt-12 d-lg-none">
                  <div className="p-16 bg-white border rounded-8">
                    <ul className="flex flex-col gap-8">
                      <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
                      <li><Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link></li>
                      <li><Link href="/pages" onClick={() => setMobileOpen(false)}>Pages</Link></li>
                      <li><Link href="/vendors" onClick={() => setMobileOpen(false)}>Vendors</Link></li>
                      <li><Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link></li>
                      <li><Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
                      <li className="mt-8">
                        <SearchBox />
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </header>
        ) : null
      ) : (
        // CLASSIC HEADER (giữ cấu trúc cũ, nhưng không jQuery)
        <>
          {showClassicTopBar && (
            <div className="py-10 header-top bg-main-600 d-none d-lg-block">
              <div className="container">
                <div className="flex-wrap gap-16 flex-between">
                  <ul className="flex-wrap gap-16 flex-align">
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-storefront"></i> Truy cập bán hàng</Link></li>
                    <li className="text-white-6">•</li>
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-hand-heart"></i> Đăng ký đối tác</Link></li>
                    <li className="text-white-6">•</li>
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-info"></i> Giới thiệu về Siêu Thị Vina</Link></li>
                    <li className="text-white-6">•</li>
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-headset"></i> Liên hệ hỗ trợ</Link></li>
                  </ul>
                  <ul className="flex-wrap gap-16 flex-align">
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-squares-four"></i> Danh mục</Link></li>
                    <li className="text-white-6">•</li>
                    <li><Link href="#" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-notepad"></i> Tra cứu đơn hàng</Link></li>
                    <li className="text-white-6">•</li>
                    <li><Link href="/wishlist" className="gap-8 text-sm text-white-6 hover-text-white flex-align"><i className="ph-bold ph-shopping-cart"></i> Giỏ hàng <span className="badge bg-success-600 rounded-circle">6</span></Link></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <header className="header border-bottom border-neutral-40 pt-14 pb-14">
            <div className="container">
              <nav className="gap-16 header-inner flex-between">
                <div className="logo">
                  <Link href="/" className="link" aria-label="Home">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/images/logo/logo_nguyenban.png" alt="Logo" />
                  </Link>
                </div>
                <div className="header-menu w-50 d-lg-block d-none">
                  <div className="relative mx-20">
                    <SearchBox />
                  </div>
                </div>
                <div className="header-right flex-align">
                  <div className="d-lg-block d-none position-relative">
                    <Link
                      href="/account"
                      className="gap-10 px-20 py-10 text-center text-white d-flex justify-content-center flex-align fw-medium bg-success-600 rounded-pill hover-bg-success-500"
                    >
                      <i className="ph-bold ph-user"></i>
                      Tài khoản
                    </Link>
                  </div>
                  <button
                    type="button"
                    aria-label="Toggle mobile menu"
                    className="text-4xl text-gray-800 d-lg-none ms-3n d-flex btn-reset"
                    onClick={() => setMobileOpen((s) => !s)}
                  >
                    <i className="ph ph-list"></i>
                  </button>
                </div>
              </nav>
              {mobileOpen && (
                <div className="mt-12 d-lg-none">
                  <div className="p-16 bg-white border rounded-8">
                    <ul className="flex flex-col gap-8">
                      <li><Link href="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link></li>
                      <li><Link href="/shop" onClick={() => setMobileOpen(false)}>Cửa hàng</Link></li>
                      <li><Link href="/wishlist" onClick={() => setMobileOpen(false)}>Yêu thích</Link></li>
                      <li><Link href="/cart" onClick={() => setMobileOpen(false)}>Giỏ hàng</Link></li>
                      <li className="mt-8"><SearchBox /></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </header>
        </>
      )}
    </>
  );
}
