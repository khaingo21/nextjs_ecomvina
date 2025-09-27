"use client";
import React from "react";
import Link from "next/link";
import ProductCardV2 from "@/components/ProductCardV2";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
// Removed TopBrandsSection and PartnerBrands to match shop.html layout

export default function Page() {
  return (
    <>
      {/* Header (no top nav, no categories bar) */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb (VN) */}
      <div className="breadcrumb mb-0 pt-40 bg-main-two-60">
        <div className="container">
          <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
            <h6 className="mb-0">Danh sách sản phẩm</h6>
          </div>
        </div>
      </div>

      {/* Removed TopBrandsSection and PartnerBrands for parity with shop.html */}

      <section className="shop py-40">
        <div className="container">
          <div className="row">
            {/* Sidebar Start */}
            <div className="col-lg-3 d-lg-block d-none">
              <div className="shop-sidebar position-relative">
                {/* Categories */}
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Product Category</h6>
                  <ul className="max-h-540 overflow-y-auto scroll-sm">
                    {[
                      "Mobile & Accessories (12)",
                      "Laptop (12)",
                      "Electronics (12)",
                      "Smart Watch (12)",
                      "Storage (12)",
                      "Portable Devices (12)",
                      "Action Camera (12)",
                      "Smart Gadget (12)",
                      "Monitor  (12)",
                      "Smart TV (12)",
                      "Camera (12)",
                      "Monitor Stand (12)",
                      "Headphone (12)",
                    ].map((label, i) => (
                      <li key={i} className={i === 12 ? "mb-0" : "mb-24"}>
                        <Link href="/product-details-two" className="text-gray-900 hover-text-main-600">{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter by Price (static UI) */}
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Price</h6>
                  <div className="custom--range">
                    <div id="slider-range" />
                    <div className="flex-between flex-wrap-reverse gap-8 mt-24 ">
                      <button type="button" className="btn btn-main h-40 flex-align">Filter </button>
                      <div className="custom--range__content flex-align gap-8">
                        <span className="text-gray-500 text-md flex-shrink-0">Price:</span>
                        <input type="text" className="custom--range__prices text-neutral-600 text-start text-md fw-medium" readOnly defaultValue="$0 - $999" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter by Rating (static UI) */}
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Rating</h6>
                  {[{ w: 70, c: 124, stars: [1, 1, 1, 1, 1] }, { w: 50, c: 52, stars: [1, 1, 1, 1, 0] }, { w: 30, c: 31, stars: [1, 1, 1, 0, 0] }].map((it, idx) => (
                    <div className="flex-align gap-8 position-relative mb-20" key={idx}>
                      <div className="common-check common-radio mb-0">
                        <input className="form-check-input" type="radio" name="ratingFilter" />
                      </div>
                      <div className="progress w-100 bg-gray-100 rounded-pill h-8" role="progressbar" aria-valuenow={it.w} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar bg-main-600 rounded-pill" style={{ width: `${it.w}%` }} />
                      </div>
                      <div className="flex-align gap-4">
                        {it.stars.map((s, i) => (
                          <span key={i} className={`text-xs fw-medium ${s ? "text-warning-600" : "text-gray-400"} d-flex`}><i className="ph-fill ph-star"></i></span>
                        ))}
                      </div>
                      <span className="text-gray-900 flex-shrink-0">{it.c}</span>
                    </div>
                  ))}
                </div>

                {/* Filter by Color */}
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Color</h6>
                  <ul className="max-h-540 overflow-y-auto scroll-sm">
                    {[
                      { id: "color1", label: "Black (12)", extra: "checked-black" },
                      { id: "color2", label: "Blue (12)", extra: "checked-primary" },
                      { id: "color3", label: "Gray (12)", extra: "checked-gray" },
                      { id: "color4", label: "Green (12)", extra: "checked-success" },
                      { id: "color5", label: "Red (12)", extra: "checked-danger" },
                      { id: "color6", label: "White (12)", extra: "checked-white" },
                      { id: "color7", label: "Purple (12)", extra: "checked-purple", last: true },
                    ].map((c) => (
                      <li key={c.id} className={c.last ? "mb-0" : "mb-24"}>
                        <div className={`form-check common-check common-radio ${c.extra}`}>
                          <input className="form-check-input" type="radio" name="color" id={c.id} />
                          <label className="form-check-label" htmlFor={c.id}>{c.label}</label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter by Brand */}
                <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                  <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">Filter by Brand</h6>
                  <ul className="max-h-540 overflow-y-auto scroll-sm">
                    {[
                      { id: "brand1", label: "Apple" },
                      { id: "brand2", label: "Samsung" },
                      { id: "brand3", label: "Microsoft" },
                      { id: "brand4", label: "Apple" },
                      { id: "brand5", label: "HP" },
                      { id: "DELL", label: "DELL" },
                      { id: "Redmi", label: "Redmi", last: true },
                    ].map((b) => (
                      <li key={b.id} className={b.last ? "mb-0" : "mb-24"}>
                        <div className="form-check common-check common-radio">
                          <input className="form-check-input" type="radio" name="brand" id={b.id} />
                          <label className="form-check-label" htmlFor={b.id}>{b.label}</label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advertise image */}
                <div className="shop-sidebar__box rounded-8">
                  <Image src="/assets/images/thumbs/advertise-img1.png" alt="Advertise" width={360} height={420} className="img-fluid w-100 h-auto" />
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="col-lg-9">
              {/* Top toolbar */}
              <div className="flex-between gap-16 flex-wrap mb-40">
                <span className="text-gray-900">Showing 1-20 of 85 result</span>
                <div className="position-relative flex-align gap-16 flex-wrap">
                  <div className="list-grid-btns flex-align gap-16">
                    <button type="button" className="w-44 h-44 flex-center border border-gray-100 rounded-6 text-2xl list-btn">
                      <i className="ph-bold ph-list-dashes"></i>
                    </button>
                    <button type="button" className="w-44 h-44 flex-center border border-main-600 text-white bg-main-600 rounded-6 text-2xl grid-btn">
                      <i className="ph ph-squares-four"></i>
                    </button>
                  </div>
                  <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                    <label htmlFor="sorting" className="text-inherit flex-shrink-0">Sort by: </label>
                    <select className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto" id="sorting" defaultValue="Popular">
                      <option value="Popular">Popular</option>
                      <option value="Latest">Latest</option>
                      <option value="Trending">Trending</option>
                      <option value="Matches">Matches</option>
                    </select>
                  </div>
                  <button type="button" className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn">
                    <i className="ph-bold ph-funnel"></i>
                  </button>
                </div>
              </div>

              <div className="row g-3">
                {(
                  [
                    { img: "/assets/images/thumbs/product-two-img1.png", badge: { text: "Best Sale", color: "primary" } },
                    { img: "/assets/images/thumbs/product-two-img2.png" },
                    { img: "/assets/images/thumbs/product-two-img3.png" },
                    { img: "/assets/images/thumbs/product-two-img4.png", badge: { text: "Sale 50%", color: "danger" } },
                    { img: "/assets/images/thumbs/product-two-img5.png" },
                    { img: "/assets/images/thumbs/product-two-img6.png" },
                    { img: "/assets/images/thumbs/product-two-img7.png" },
                    { img: "/assets/images/thumbs/product-two-img8.png" },
                    { img: "/assets/images/thumbs/product-two-img9.png", badge: { text: "Sale 50%", color: "danger" } },
                    { img: "/assets/images/thumbs/product-two-img10.png" },
                    { img: "/assets/images/thumbs/product-two-img11.png" },
                    { img: "/assets/images/thumbs/product-two-img12.png", badge: { text: "New", color: "warning" } },
                    // add 8 more to make 20
                    { img: "/assets/images/thumbs/product-two-img13.png" },
                    { img: "/assets/images/thumbs/product-two-img14.png" },
                    { img: "/assets/images/thumbs/product-two-img15.png", badge: { text: "Best Sale", color: "primary" } },
                    { img: "/assets/images/thumbs/product-two-img4.png", badge: { text: "Sale 50%", color: "danger" } },
                    { img: "/assets/images/thumbs/product-two-img1.png" },
                    { img: "/assets/images/thumbs/product-two-img6.png" },
                    { img: "/assets/images/thumbs/product-two-img8.png" },
                    { img: "/assets/images/thumbs/product-two-img12.png", badge: { text: "New", color: "warning" } },
                  ] as { img: string; badge?: { text: string; color: "primary" | "danger" | "warning" } }[]
                ).map((p, i) => (
                  <div className="col-sm-6 col-md-4" key={i}>
                    <ProductCardV2
                      img={p.img}
                      title="Taylor Farms Broccoli Florets Vegetables"
                      price="$14.99"
                      oldPrice="$28.99"
                      badge={p.badge}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
          {/* Pagination across full container */}
          <div className="d-flex justify-content-center mt-40 w-100">
            <ul className="pagination flex-center flex-wrap gap-16">
              <li className="page-item">
                <a className="page-link h-44 w-44 flex-center text-xl rounded-8 fw-medium text-neutral-600 border border-gray-100" href="#">
                  <i className="ph-bold ph-arrow-left"></i>
                </a>
              </li>
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className={`page-item ${i === 0 ? "active" : ""}`}>
                  <a className={`page-link h-44 w-44 flex-center rounded-8 fw-medium ${i === 0 ? "bg-main-600 text-white" : "border border-gray-100 text-gray-900"}`} href="#">
                    {i === 0 ? "01" : String(i + 1)}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link h-44 w-44 flex-center text-xl rounded-8 fw-medium text-neutral-600 border border-gray-100" href="#">
                  <i className="ph-bold ph-arrow-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <BenefitsStrip />
      
    </>
  );
}

