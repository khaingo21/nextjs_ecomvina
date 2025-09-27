"use client";
import React from "react";

export default function TopSellingProducts() {
  const items = Array.from({ length: 8 }).map((_, i) => ({
    title: `Thuốc hoạt huyết Nhất Nhất - tăng cường lưu thông máu lên não #${i + 1}`,
    price: "350.000 đ",
    image: "/assets/images/thumbs/product-two-img7.png",
  }));

  return (
    <section className="top-selling-products pt-80 overflow-hidden">
      <div className="container">
        <div className="section-heading mb-24">
          <div className="flex-between flex-wrap gap-8">
            <h6 className="mb-0">
              <i className="ph-bold ph-fire text-main-600 text-2xl"></i> HOT SALES !
            </h6>
            <div className="flex-align gap-16">
              <a href="/shop" className="text-sm fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline">
                Xem đầy đủ
              </a>
              <div className="flex-align gap-8">
                <button
                  type="button"
                  id="top-selling-prev"
                  className="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"
                >
                  <i className="ph ph-caret-left"></i>
                </button>
                <button
                  type="button"
                  id="top-selling-next"
                  className="slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"
                >
                  <i className="ph ph-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-12">
          {items.map((p, idx) => (
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6" key={idx}>
              <div className="product-card hover-card-shadows h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                <a href="/product-details-two" className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50">
                  {/* Badge demo */}
                  {idx % 3 === 0 && (
                    <span className="product-card__badge bg-success-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Giảm 10%</span>
                  )}
                  <img src={p.image} alt="" className="w-auto max-w-unset" />
                </a>
                <div className="product-card__content w-100  mt-16">
                  <h6 className="title text-lg fw-semibold mt-12 mb-8">
                    <a href="/product-details-two" className="link text-line-2">{p.title}</a>
                  </h6>
                  <div className="flex-align gap-6">
                    <span className="text-xs fw-medium text-gray-500">Đánh giá</span>
                    <span className="text-xs fw-medium text-gray-500">4.8 <i className="ph-fill ph-star text-warning-600"></i></span>
                    <span className="text-xs fw-medium text-gray-500">(17k)</span>
                  </div>
                  <div className="product-card__price my-10">
                    <span className="text-gray-400 text-xs fw-semibold text-decoration-line-through">400.000 đ</span>
                    <span className="text-heading text-md fw-semibold">{p.price}</span>
                  </div>
                  <a
                    href="/cart"
                    className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-center gap-8 fw-medium"
                  >
                    Thêm <i className="ph ph-shopping-cart"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
