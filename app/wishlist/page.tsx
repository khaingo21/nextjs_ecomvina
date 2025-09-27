"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";

export default function Page() {
  return (
    <>
      {/* Header */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb block */}
      <div className="breadcrumb mb-0 py-26 bg-main-two-50">
        <div className="container container-lg">
          <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
            <h6 className="mb-0">My Wishlist</h6>
            <ul className="flex-align gap-8 flex-wrap">
              <li className="text-sm">
                <Link href="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                  <i className="ph ph-house"></i>
                  Home
                </Link>
              </li>
              <li className="flex-align">
                <i className="ph ph-caret-right"></i>
              </li>
              <li className="text-sm text-main-600"> Wishlist </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Wishlist Table */}
      <section className="cart py-80">
        <div className="container container-lg">
          <div className="row gy-4">
            <div className="col-lg-11">
              <div className="cart-table border border-gray-100 rounded-8">
                <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table rounded-8 overflow-hidden">
                    <thead>
                      <tr className="border-bottom border-neutral-100">
                        <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Delete</th>
                        <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Product Name</th>
                        <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Unit Price</th>
                        <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Stock Status</th>
                        <th className="h6 mb-0 text-lg fw-bold px-40 py-32"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2].map((row) => (
                        <tr key={row} className="">
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <button type="button" className="remove-tr-btn flex-align gap-12 hover-text-danger-600">
                              <i className="ph ph-x-circle text-2xl d-flex"></i>
                              Remove
                            </button>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <div className="table-product d-flex align-items-center gap-24">
                              <Link href="/product-details-two" className="table-product__thumb border border-gray-100 rounded-8 flex-center ">
                                <Image src={`/assets/images/thumbs/${row === 1 ? "product-two-img1.png" : "product-two-img3.png"}`} alt="Product" width={96} height={96} />
                              </Link>
                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  <Link href="/product-details-two" className="link text-line-2">
                                    {row === 1 ? "Taylor Farms Broccoli Florets Vegetables" : "Smart Phone With Intel Celeron"}
                                  </Link>
                                </h6>
                                <div className="flex-align gap-16 mb-16">
                                  <div className="flex-align gap-6">
                                    <span className="text-md fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                                    <span className="text-md fw-semibold text-gray-900">4.8</span>
                                  </div>
                                  <span className="text-sm fw-medium text-gray-200">|</span>
                                  <span className="text-neutral-600 text-sm">{row === 1 ? "128 Reviews" : "128 Reviews"}</span>
                                </div>
                                <div className="flex-align gap-16">
                                  <Link href="/cart" className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium">Camera</Link>
                                  <Link href="/cart" className="product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium">Videos</Link>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <span className="text-lg h6 mb-0 fw-semibold">$125.00</span>
                          </td>
                          <td className="px-40 py-32 border-end border-neutral-100">
                            <span className="text-lg h6 mb-0 fw-semibold">In Stock</span>
                          </td>
                          <td className="px-40 py-32">
                            <Link href="/cart" className="btn btn-main-two rounded-8 px-64">
                              Add To Cart <i className="ph ph-shopping-cart"></i> 
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

