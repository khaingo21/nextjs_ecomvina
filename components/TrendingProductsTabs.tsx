"use client";
import React, { useState } from "react";

const TABS = [
  { key: "all", label: "All" },
  { key: "mobile", label: "Mobile" },
  { key: "headphone", label: "Headphone" },
  { key: "usb", label: "USB" },
  { key: "camera", label: "Camera" },
  { key: "laptop", label: "Laptop" },
  { key: "accessories", label: "Accessories" },
];

const products = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  title: `Instax Mini 12 Instant Film Camera - Green #${i + 1}`,
  price: i % 3 === 0 ? "300.000 đ" : "350.000 đ",
  image: `/assets/images/thumbs/product-two-img${(i % 9) + 1}.png`,
  tag: TABS[(i % (TABS.length - 1)) + 1].key, // spread across categories
}));

export default function TrendingProductsTabs() {
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter(p => p.tag === active);
  const visible = filtered.slice(0, 12); // show two rows (6 columns per row at xxl)

  return (
    <section className="trending-productss overflow-hidden">
      <div className="container">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h6 className="mb-0"><i className="ph-bold ph-squares-four text-main-600"></i> Danh mục hàng đầu</h6>
              <ul className="nav common-tab style-two nav-pills" role="tablist">
                {TABS.map(t => (
                  <li className="nav-item" role="presentation" key={t.key}>
                    <button className={`nav-link fw-medium text-sm hover-border-main-600 ${active === t.key ? "active" : ""}`} onClick={() => setActive(t.key)} type="button" role="tab">{t.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tab-content">
            <div className="row g-12">
              {visible.map((p, idx) => (
                <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6" key={p.id}>
                  <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <a href="/product-details-two" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
                      {idx % 6 === 1 && (
                        <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">New</span>
                      )}
                      {idx % 6 === 3 && (
                        <span className="product-card__badge bg-success-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Sold</span>
                      )}
                      <img src={p.image} alt="" className="w-auto max-w-unset" />
                    </a>
                    <div className="product-card__content w-100  mt-16">
                      <span className="text-success-600 bg-success-50 text-sm fw-medium py-4 px-8">19%OFF</span>
                      <h6 className="title text-lg fw-semibold my-16">
                        <a href="/product-details-two" className="link text-line-2">{p.title}</a>
                      </h6>
                      <div className="flex-align gap-6">
                        <div className="flex-align gap-2">
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                        </div>
                        <span className="text-xs fw-medium text-gray-500">4.8</span>
                        <span className="text-xs fw-medium text-gray-500">(12K)</span>
                      </div>

                      <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 mt-16 fw-normal">Fulfilled by Marketpro</span>

                      <div className="product-card__price mt-16 mb-30">
                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                        <span className="text-heading text-md fw-semibold">$14.99 <span className="text-gray-500 fw-normal">/Qty</span></span>
                      </div>
                      <span className="text-neutral-600 text-xs fw-medium">Delivered by <span className="text-main-600">Aug 02</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
