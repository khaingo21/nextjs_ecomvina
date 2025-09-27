"use client";
import React from "react";
// No ProductCard here; use template's product-card markup for exact styling

export default function TopBrandsSection() {
  const items = [
    { image: "/assets/images/thumbs/product-two-img7.png", title: "Taylor Farms Broccoli Florets Vegetables", price: "$14.99" },
    { image: "/assets/images/thumbs/product-two-img8.png", title: "Taylor Farms Broccoli Florets Vegetables", price: "$14.99" },
    { image: "/assets/images/thumbs/product-two-img9.png", title: "Taylor Farms Broccoli Florets Vegetables", price: "$14.99" },
    { image: "/assets/images/thumbs/product-two-img10.png", title: "Taylor Farms Broccoli Florets Vegetables", price: "$14.99" },
    { image: "/assets/images/thumbs/product-two-img8.png", title: "Taylor Farms Broccoli Florets Vegetables", price: "$14.99" },
  ];

  return (
    <section className="top-selling-products pt-80 overflow-hidden">
      <div className="container">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h6 className="mb-0"><i className="ph-bold ph-storefront text-main-600"></i> Thương hiệu hàng đầu</h6>
              <div className="flex-align gap-16">
                <a href="/shop" className="text-sm fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline">Xem đầy đủ</a>
                <div className="flex-align gap-8">
                  <button type="button" id="top-brands-prev" className="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"><i className="ph ph-caret-left"></i></button>
                  <button type="button" id="top-brands-next" className="slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"><i className="ph ph-caret-right"></i></button>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-12 top-brands-grid">
            {items.map((p, idx) => (
              <div className="col-xxl-5th col-xl-5th col-lg-4 col-sm-6" key={idx}>
                <div className="product-card hover-card-shadows h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                  <a href="/product-details-two" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50">
                    {idx === 1 && (
                      <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Sale 50%</span>
                    )}
                    {idx === 4 && (
                      <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Best Sale</span>
                    )}
                    <img src={p.image} alt="Brand product" className="w-auto max-w-unset" />
                  </a>
                  <div className="product-card__content w-100  mt-16">
                    <h6 className="title text-lg fw-semibold mt-12 mb-8">
                      <a href="/product-details-two" className="link text-line-2">{p.title}</a>
                    </h6>
                    <div className="flex-align gap-6">
                      <span className="text-xs fw-medium text-gray-500">4.8</span>
                      <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                      <span className="text-xs fw-medium text-gray-500">(17k)</span>
                    </div>
                    <div className="flex-align gap-4 mt-8">
                      <span className="text-tertiary-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                      <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                    </div>
                    <div className="mt-8">
                      <div className="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-label="Top brand sold" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar bg-tertiary-600 rounded-pill" style={{ width: "35%" }}></div>
                      </div>
                      <span className="text-gray-900 text-xs fw-medium mt-8 d-block">Sold: 18/35</span>
                    </div>
                    <div className="border-top border-gray-100 my-12"></div>
                    <div className="product-card__price my-10">
                      <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                      <span className="text-heading text-md fw-semibold">{p.price} <span className="text-gray-500 fw-normal">/Qty</span></span>
                    </div>
                    <a href="/cart" className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-center gap-8 fw-medium">Add To Cart <i className="ph ph-shopping-cart"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
