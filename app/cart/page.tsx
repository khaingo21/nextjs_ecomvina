"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";

export default function Page() {
  return (
    <>
      {/* Header (no top nav, no categories bar) */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb Vietnamese */}
      <div className="breadcrumb mb-0 pt-40 bg-main-two-60">
        <div className="container">
          <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
            <h6 className="mb-0">Giỏ hàng của bạn</h6>
          </div>
        </div>
      </div>

      {/* Cart Table (theo mẫu) */}
      <section className="cart py-40">
        <div className="container">
          <div className="row gy-4">
            <div className="col-xl-9 col-lg-8">
              <div className="cart-table border border-gray-100 rounded-8 px-20 pt-20">
                <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table style-three">
                    <thead>
                      <tr>
                        <th className="h6 mb-0 text-lg fw-bold pe-10">Hành động</th>
                        <th className="h6 mb-0 text-lg fw-bold">Sản phẩm</th>
                        <th className="h6 mb-0 text-lg fw-bold">Giá</th>
                        <th className="h6 mb-0 text-lg fw-bold">Số lượng</th>
                        <th className="h6 mb-0 text-lg fw-bold ps-10">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2].map((row) => (
                        <tr key={row}>
                          <td className="py-15 px-5">
                            <button type="button" className="flex-align gap-8 hover-text-danger-600">
                              <i className="ph ph-trash text-2xl d-flex"></i>
                              Xóa
                            </button>
                          </td>
                          <td className="py-15 px-5">
                            <div className="d-flex align-items-center gap-24">
                              <Link href="/product-details-two" className="table-product__thumb border border-gray-100 rounded-8 flex-center">
                                <Image src="/assets/images/thumbs/product-two-img1.png" alt="Taylor Farms Broccoli Florets Vegetables" width={96} height={96} />
                              </Link>
                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  <Link href="/product-details-two" className="link text-line-2">Taylor Farms Broccoli Florets Vegetables</Link>
                                </h6>
                                <div className="flex-align gap-16 mb-16">
                                  <div className="flex-align gap-6">
                                    <span className="text-md fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                                    <span className="text-md fw-semibold text-gray-900">4.8</span>
                                  </div>
                                  <span className="text-sm fw-medium text-gray-200">|</span>
                                  <span className="text-neutral-600 text-sm">128 đánh giá</span>
                                </div>
                                <div className="flex-align gap-16">
                                  <Link href="/cart" className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium">Camera</Link>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-15 px-5">
                            <span className="text-lg h6 mb-0 fw-medium">125.000 đ
                              <h6 className="text-sm text-gray-400 mb-0 fw-medium text-decoration-line-through">425.000 đ</h6>
                            </span>
                          </td>
                          <td className="py-15 px-5">
                            <div className="d-flex rounded-4 overflow-hidden">
                              <button type="button" className="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                                <i className="ph ph-minus"></i>
                              </button>
                              <input type="number" className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4" defaultValue={1} min={1} />
                              <button type="button" className="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white">
                                <i className="ph ph-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td className="py-15 px-5">
                            <span className="text-lg h6 mb-0 fw-semibold text-main-600">125.000 đ</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Sidebar tổng kết giỏ hàng */}
            <div className="col-xl-3 col-lg-4">
              <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-20">
                <h6 className="text-xl mb-32">Thông tin giỏ hàng</h6>
                <div className="bg-color-three rounded-8 p-24">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two">Tạm tính:</span>
                    <span className="text-gray-900 fw-semibold">250.000 đ</span>
                  </div>
                  <div className="flex-between gap-8">
                    <span className="text-gray-900 font-heading-two">Giảm giá:</span>
                    <span className="text-gray-900 fw-semibold">
                      <div className="flex-align text-xs text-main-two-600"><i className="ph-fill ph-seal-percent text-sm"></i> -10%</div>
                      - 25.000 đ
                    </span>
                  </div>
                </div>
                <div className="bg-color-three rounded-8 p-24 mt-24">
                  <div className="flex-between gap-8">
                    <span className="text-gray-900 text-xl fw-semibold">Tổng:</span>
                    <span className="text-gray-900 text-xl fw-semibold">225.000 đ</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn btn-main mt-40 py-18 w-100 rounded-8">Tiến hành thanh toán</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <BenefitsStrip />
      
    </>
  );
}

