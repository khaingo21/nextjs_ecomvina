"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      // Lưu URL hiện tại để redirect sau khi đăng nhập
      const currentPath = window.location.pathname;
      router.push(`/account?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoggedIn, router]);

  // Hiển thị loading khi đang kiểm tra authentication
  if (!isLoggedIn) {
    return (
      <>
        <FullHeader showClassicTopBar={true} showTopNav={false} />
        <div className="container py-20 text-center">
          <p className="text-lg">Đang kiểm tra đăng nhập...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Top bar (original checkout style) - Mobile */}
      <div className="header-top bg-main-600 flex-between py-10 d-block d-lg-none">
        <div className="container">
          <div className="flex-between gap-8">
            <ul className="header-top__right flex-align flex-wrap gap-16">
              <li>
                <a href="#" className="text-white-6 text-sm hover-text-white">
                  <i className="ph-bold ph-storefront"></i>
                  Truy cập bán hàng
                </a>
              </li>
            </ul>
            <ul className="header-top__right flex-align justify-content-end flex-wrap gap-16">
              <li className="flex-align">
                <a href="/wishlist" className="text-white-6 text-sm hover-text-white">
                  <i className="ph-bold ph-shopping-cart"></i>
                  Giỏ hàng
                  <span className="badge bg-success-600 rounded-circle">6</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top bar (original checkout style) - Desktop */}
      <div className="header-top bg-main-600 flex-between py-10 d-none d-lg-block">
        <div className="container">
          <div className="flex-between flex-wrap gap-8">
            <ul className="header-top__right flex-align flex-wrap gap-16">
              <li>
                <a href="" className="text-white-6 text-sm hover-text-white">Truy cập bán hàng</a>
              </li>
              <li>
                <a href="" className="text-white-6 text-sm hover-text-white">Đăng ký cửa hàng</a>
              </li>
              <li>
                <a href="#" className="text-white-6 text-sm hover-text-white pe-1">Theo dõi tại: </a>
                <a href="https://www.facebook.com" className="text-white text-18 ps-1 pe-1 m-0">
                  <i className="ph-duotone ph-facebook-logo"></i>
                </a>
                <a href="https://www.tiktok.com" className="text-white text-18 ps-1 pe-1 m-0">
                  <i className="ph-duotone ph-tiktok-logo"></i>
                </a>
                <a href="https://www.instagram.com" className="text-white text-18 ps-1 pe-1 m-0">
                  <i className="ph-duotone ph-instagram-logo"></i>
                </a>
              </li>
            </ul>

            <ul className="header-top__right flex-align flex-wrap gap-16">
              <li className=" d-block on-hover-item text-white-6 flex-shrink-0">
                <button className="category__button flex-align gap-4 text-sm text-white-6 rounded-top">
                  <span className="icon text-sm d-md-flex d-none"><i className="ph ph-squares-four"></i></span>
                  <span className="d-sm-flex d-none">Danh mục</span>
                </button>
              </li>
              <li className="flex-align">
                <a href="javascript:void(0)" className="text-white-6 text-sm hover-text-white">
                  <i className="ph-bold ph-notepad"></i>
                  Tra cứu đơn hàng
                </a>
              </li>
              <li className="flex-align">
                <a href="/contact" className="text-white-6 text-sm hover-text-white">
                  <i className="ph-bold ph-heart"></i>
                  Yêu thích
                </a>
              </li>
              <li className="flex-align">
                <a href="/wishlist" className="text-white-6 text-sm hover-text-white">
                  <i className="ph-bold ph-shopping-cart"></i>
                  Giỏ hàng
                  <span className="badge bg-success-600 rounded-circle">6</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Main header */}
      <FullHeader showTopNav={false} showCategoriesBar={false} showClassicTopBar={false} />

      {/* ========================= Breadcrumb Start =============================== */}
      <div className="breadcrumb mb-0 py-26 bg-main-two-50">
        <div className="container container-lg">
          <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
            <h6 className="mb-0">Thông tin thanh toán</h6>
            <ul className="flex-align gap-8 flex-wrap">
              <li className="text-sm">
                <Link href="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                  <i className="ph ph-house"></i>
                  Trang chủ
                </Link>
              </li>
              <li className="flex-align">
                <i className="ph ph-caret-right"></i>
              </li>
              <li className="text-sm text-main-600"> Thanh toán </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ========================= Breadcrumb End =============================== */}

      {/* Checkout Section (replicated from public/checkout.html) */}
      <section className="checkout py-40">
        <div className="container">
          <div className="row">
            {/* Left Column - Form */}
            <div className="col-xl-8 col-lg-8">
              <form action="#" className="pe-xl-5">
                <div className="row gy-3">
                  <div className="col-12">
                    <div className="border border-gray-100 rounded-8 px-30 py-20">
                      Tùy chọn địa chỉ nhận hàng:
                      <select
                        className="js-example-basic-single border border-neutral-40 border-end-0 select2-hidden-accessible"
                        name="state"
                        tabIndex={-1}
                        aria-hidden="true"
                        defaultValue="selected"
                      >
                        <option value="1" disabled>
                          Chọn địa chỉ nhận hàng của bạn
                        </option>
                        <option value="1">
                          Cao Kiến Hựu - 0911975996
                        </option>
                        <option value="1">29/7C ấp Trường An, Phường Long Hoa, tỉnh Tây Ninh</option>
                        <option value="1">DHT05, phường Tân Bình, TP.HCM</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xs-6">
                    <input type="text" className="common-input border-gray-100" placeholder="First Name" />
                  </div>
                  <div className="col-sm-6 col-xs-6">
                    <input type="text" className="common-input border-gray-100" placeholder="Last Name" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="common-input border-gray-100" placeholder="Business Name" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="common-input border-gray-100" placeholder="United states (US)" />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="common-input border-gray-100"
                      placeholder="House number and street name"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      className="common-input border-gray-100"
                      placeholder="Apartment, suite, unit, etc. (Optional)"
                    />
                  </div>
                  <div className="col-12">
                    <input type="text" className="common-input border-gray-100" placeholder="City" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="common-input border-gray-100" placeholder="Sans Fransisco" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="common-input border-gray-100" placeholder="Post Code" />
                  </div>
                  <div className="col-12">
                    <input type="number" className="common-input border-gray-100" placeholder="Phone" />
                  </div>
                  <div className="col-12">
                    <input type="email" className="common-input border-gray-100" placeholder="Email Address" />
                  </div>

                  <div className="col-12">
                    <div className="my-40">
                      <h6 className="text-lg mb-24">Additional Information</h6>
                      <input
                        type="text"
                        className="common-input border-gray-100"
                        placeholder="Notes about your order, e.g. special notes for delivery."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-xl-4 col-lg-4">
              <div className="checkout-sidebar mt-0 pt-0">
                <div className="border border-gray-100 rounded-8 px-24 py-40">
                  <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                    <span className="text-gray-900 fw-medium text-xl font-heading-two">Product</span>
                    <span className="text-gray-900 fw-medium text-xl font-heading-two">Subtotal</span>
                  </div>

                  <div className="flex-between gap-24 mb-32">
                    <div className="flex-align gap-12">
                      <span className="text-gray-900 fw-normal text-md font-heading-two w-144">HP Chromebook With Intel Celeron</span>
                      <span className="text-gray-900 fw-normal text-md font-heading-two">
                        <i className="ph-bold ph-x"></i>
                      </span>
                      <span className="text-gray-900 fw-semibold text-md font-heading-two">1</span>
                    </div>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">$250.00</span>
                  </div>
                  <div className="flex-between gap-24 mb-32">
                    <div className="flex-align gap-12">
                      <span className="text-gray-900 fw-normal text-md font-heading-two w-144">HP Chromebook With Intel Celeron</span>
                      <span className="text-gray-900 fw-normal text-md font-heading-two">
                        <i className="ph-bold ph-x"></i>
                      </span>
                      <span className="text-gray-900 fw-semibold text-md font-heading-two">1</span>
                    </div>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">$250.00</span>
                  </div>
                  <div className="flex-between gap-24 mb-32">
                    <div className="flex-align gap-12">
                      <span className="text-gray-900 fw-normal text-md font-heading-two w-144">HP Chromebook With Intel Celeron</span>
                      <span className="text-gray-900 fw-normal text-md font-heading-two">
                        <i className="ph-bold ph-x"></i>
                      </span>
                      <span className="text-gray-900 fw-semibold text-md font-heading-two">1</span>
                    </div>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">$250.00</span>
                  </div>
                  <div className="flex-between gap-24 mb-32">
                    <div className="flex-align gap-12">
                      <span className="text-gray-900 fw-normal text-md font-heading-two w-144">HP Chromebook With Intel Celeron</span>
                      <span className="text-gray-900 fw-normal text-md font-heading-two">
                        <i className="ph-bold ph-x"></i>
                      </span>
                      <span className="text-gray-900 fw-semibold text-md font-heading-two">1</span>
                    </div>
                    <span className="text-gray-900 fw-bold text-md font-heading-two">$250.00</span>
                  </div>

                  <div className="border-top border-gray-100 pt-30  mt-30">
                    <div className="mb-32 flex-between gap-8">
                      <span className="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                      <span className="text-gray-900 font-heading-two text-md fw-bold">$859.00</span>
                    </div>
                    <div className="mb-0 flex-between gap-8">
                      <span className="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                      <span className="text-gray-900 font-heading-two text-md fw-bold">$859.00</span>
                    </div>
                  </div>
                </div>

                <div className="mt-32">
                  <div className="payment-item">
                    <div className="form-check common-check common-radio py-16 mb-0">
                      <input className="form-check-input" type="radio" name="payment" id="payment1" defaultChecked />
                      <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment1">
                        Direct Bank transfer
                      </label>
                    </div>
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment
                        reference. Your order will not be shipped until the funds have cleared in our account.
                      </p>
                    </div>
                  </div>
                  <div className="payment-item">
                    <div className="form-check common-check common-radio py-16 mb-0">
                      <input className="form-check-input" type="radio" name="payment" id="payment2" />
                      <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment2">
                        Check payments
                      </label>
                    </div>
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment
                        reference. Your order will not be shipped until the funds have cleared in our account.
                      </p>
                    </div>
                  </div>
                  <div className="payment-item">
                    <div className="form-check common-check common-radio py-16 mb-0">
                      <input className="form-check-input" type="radio" name="payment" id="payment3" />
                      <label className="form-check-label fw-semibold text-neutral-600" htmlFor="payment3">
                        Cash on delivery
                      </label>
                    </div>
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative">
                      <p className="text-gray-800">
                        Make your payment directly into our bank account. Please use your Order ID as the payment
                        reference. Your order will not be shipped until the funds have cleared in our account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-32 pt-32 border-top border-gray-100">
                  <p className="text-gray-500">
                    Your personal data will be used to process your order, support your experience throughout this
                    website, and for other purposes described in our
                    <a href="#" className="text-main-600 text-decoration-underline"> privacy policy</a>.
                  </p>
                </div>

                <Link href="/checkout" className="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56">
                  Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits strip (match wishlist) */}
      <BenefitsStrip />

      {/* Full Footer removed to use global footer */}
    </>
  );
}


