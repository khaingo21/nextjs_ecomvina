"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import ProductCardV2 from "@/components/ProductCardV2";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useWishlist } from "@/hooks/useWishlist";


/* =======================
   Types khớp API
======================= */
type DanhGia = { id: number; diem: number };
type BienThe = { gia: string; giagiam: string; soluong?: number };
type AnhSP = { media: string };
type Brand = { ten?: string };

type ApiProduct = {
  id: number;
  ten: string;
  slug?: string | null;
  mediaurl?: string | null;
  danhgias?: DanhGia[];
  bienthes?: BienThe[];
  anhsanphams?: AnhSP[];
  thuonghieu?: Brand;
  xuatxu?: string;
  luotxem?: number;
};

/* =======================
   Helpers
======================= */
const num = (v?: string): number => {
  const n = parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};

const slugify = (s: string, fallback: string) =>
  (s || fallback)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallback;

const firstImage = (p: ApiProduct) =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";

const firstPrice = (p: ApiProduct) => {
  const gia = num(p.bienthes?.[0]?.gia);
  const giagiam = num(p.bienthes?.[0]?.giagiam);

  // Heuristic: giagiam < gia => giagiam là GIÁ BÁN; ngược lại là SỐ TIỀN GIẢM
  const selling = giagiam > 0 && giagiam < gia ? giagiam : Math.max(gia - giagiam, 0);
  return { gia, giagiam, selling };
};

const avgRating = (p: ApiProduct) => {
  const arr = p.danhgias || [];
  if (!arr.length) return { avg: 0, count: 0 };
  const sum = arr.reduce((s, r) => s + (Number(r.diem) || 0), 0);
  return { avg: Math.round((sum / arr.length) * 10) / 10, count: arr.length };
};

const toHref = (p: ApiProduct) => `/product/${slugify(p.ten, `sp-${p.id}`)}-${p.id}`;

/* =======================
   Page
======================= */
export default function Page() {
  const searchParams = useSearchParams();

  // ===== ADDED: base API & đọc mọi tham số query =====
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";

  // GIỮ TƯƠNG THÍCH CŨ: view=hot  → source=hot_sales (không phá link cũ)
  const source   = (searchParams.get("source") || (searchParams.get("view") === "hot" ? "hot_sales" : "")).toLowerCase(); // ADDED
  const category = (searchParams.get("category") || "").toLowerCase();   // ADDED
  const brand    = (searchParams.get("brand") || "").toLowerCase();      // ADDED
  const q        = searchParams.get("q") || "";                          // ADDED
  const sort     = (searchParams.get("sort") || "popular").toLowerCase();// ADDED
  const filter  = (searchParams.get("filter") || (searchParams.get("sort") || "popular")).toLowerCase();
  const userId  = searchParams.get("user_id") || "";

  const page     = Number(searchParams.get("page") || 1) || 1;           // ADDED
  const perPage  = Number(searchParams.get("per_page") || 20) || 20;     // CHANGED (giữ default 20 nhưng hỗ trợ query)

  // ADDED: hàm dựng URL theo ngữ cảnh (selection hoặc all)
  const buildUrl = () => {
    if (source === "hot_sales" || source === "recommend" || source === "best_products") {
      const p = new URLSearchParams({
        selection: source,
        per_page: String(perPage),
        page: String(page),
        sort,
      });
      return `${API}/api/sanphams-selection?${p.toString()}`;
    }
    const p = new URLSearchParams({
    filter,                     // popular|latest|trending|matches
    per_page: String(perPage),
    page: String(page),
    });
    if (q)        p.set("q", q);
    if (category) p.set("category", category);  
    if (brand) p.set("brand", brand);
    if (filter === "matches" && userId) p.set("user_id", userId); // matches có thể cần user_id

    return `${API}/api/sanphams-all?${p.toString()}`;
  };

  // ADDED: tiêu đề breadcrumb theo ngữ cảnh
  const pageTitle =
    source === "hot_sales" || searchParams.get("view") === "hot"
      ? "Sản phẩm HOT (bán chạy & giảm giá)"
      : source === "recommend"
      ? "Có thể bạn quan tâm"
      : category
      ? `Danh mục: ${category}`
      : brand
      ? `Thương hiệu: ${brand}`
      : q
      ? `Kết quả cho “${q}”`
      : "Danh sách sản phẩm";
  // ===== /ADDED =====

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ApiProduct[]>([]);
  const { isWished, toggle } = useWishlist();

  // ===== CHANGED: fetch theo buildUrl() (không đụng URL cũ) =====
  useEffect(() => {
    let mounted = true;
    const url = buildUrl();


    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((res) => {
        if (!mounted) return;
        // dữ liệu có thể nằm ở data[] hoặc data.data[] (paginate)
        const data = Array.isArray(res?.data) ? res.data : res?.data?.data;
        if (Array.isArray(data)) setItems(data as ApiProduct[]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, category, brand, q, sort, page, perPage, filter, userId]);
  // ===== /CHANGED =====

  // ===== CHANGED: sort hiểu 4 tiêu chí + giữ logic HOT cũ =====
  const sorted = useMemo(() => {
    const arr = [...items];

    const discountPct = (p: ApiProduct) => {
      const { gia, selling } = firstPrice(p);
      return gia > 0 ? (gia - selling) / gia : 0;
    };

    const cmpHot = (a: ApiProduct, b: ApiProduct) => {
      const discA = discountPct(a);
      const discB = discountPct(b);
      if (discB !== discA) return discB - discA;
      const viewsA = a.luotxem || 0;
      const viewsB = b.luotxem || 0;
      if (viewsB !== viewsA) return viewsB - viewsA;
      return avgRating(b).avg - avgRating(a).avg;
    };

    const cmpPopular  = (a: ApiProduct, b: ApiProduct) => (b.luotxem || 0) - (a.luotxem || 0);
    const cmpLatest   = (a: ApiProduct, b: ApiProduct) => (Number(b.id) || 0) - (Number(a.id) || 0); // tạm coi id ~ mới nhất
    const cmpTrending = (a: ApiProduct, b: ApiProduct) => (b.luotxem || 0) - (a.luotxem || 0);
    const cmpMatches  = (a: ApiProduct, b: ApiProduct) => {
      const d = discountPct(b) - discountPct(a);
      if (d !== 0) return d;
      return avgRating(b).avg - avgRating(a).avg;
    };

    // Nếu là HOT (giữ tương thích cũ): sort=popular => cmpHot
    if (source === "hot_sales" || searchParams.get("view") === "hot") {
      if (sort === "popular") arr.sort(cmpHot);
      else if (sort === "latest") arr.sort(cmpLatest);
      else if (sort === "trending") arr.sort(cmpTrending);
      else if (sort === "matches") arr.sort(cmpMatches);
      return arr;
    }

    // Các trường hợp khác theo sort chung
    switch (sort) {
      case "latest":   arr.sort(cmpLatest); break;
      case "trending": arr.sort(cmpTrending); break;
      case "matches":  arr.sort(cmpMatches); break;
      default:         arr.sort(cmpPopular); break;
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, source, sort]);
  // ===== /CHANGED =====

  return (
    <>
      {/* Header (no top nav, no categories bar) */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb (VN) */}
      <div className="pt-40 mb-0 breadcrumb bg-main-two-60">
        <div className="container">
          <div className="flex-wrap gap-16 breadcrumb-wrapper flex-between">
            {/* CHANGED: dùng pageTitle thay vì view === 'hot' */}
            <h6 className="mb-0">{pageTitle}</h6>
          </div>
        </div>
      </div>

      <section className="py-40 shop">
        <div className="container">
          <div className="row">
            {/* Sidebar Start (UI giữ nguyên) */}
            <div className="col-lg-3 d-lg-block d-none">
              <div className="shop-sidebar position-relative">
                {/* Categories */}
                <div className="p-32 mb-32 border border-gray-100 shop-sidebar__box rounded-8">
                  <h6 className="pb-24 mb-24 text-xl border-gray-100 border-bottom">Product Category</h6>
                  <ul className="overflow-y-auto max-h-540 scroll-sm">
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
                        <Link href="/product-details-two" className="text-gray-900 hover-text-main-600">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Filter by Price (static UI) */}
                <div className="p-32 mb-32 border border-gray-100 shop-sidebar__box rounded-8">
                  <h6 className="pb-24 mb-24 text-xl border-gray-100 border-bottom">Filter by Price</h6>
                  <div className="custom--range">
                    <div id="slider-range" />
                    <div className="flex-wrap-reverse gap-8 mt-24 flex-between ">
                      <button type="button" className="h-40 btn btn-main flex-align">Filter </button>
                      <div className="gap-8 custom--range__content flex-align">
                        <span className="flex-shrink-0 text-gray-500 text-md">Price:</span>
                        <input
                          type="text"
                          className="custom--range__prices text-neutral-600 text-start text-md fw-medium"
                          readOnly
                          defaultValue="$0 - $999"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter by Rating (static UI) */}
                <div className="p-32 mb-32 border border-gray-100 shop-sidebar__box rounded-8">
                  <h6 className="pb-24 mb-24 text-xl border-gray-100 border-bottom">Filter by Rating</h6>
                  {[
                    { w: 70, c: 124, stars: [1, 1, 1, 1, 1] },
                    { w: 50, c: 52, stars: [1, 1, 1, 1, 0] },
                    { w: 30, c: 31, stars: [1, 1, 1, 0, 0] },
                  ].map((it, idx) => (
                    <div className="gap-8 mb-20 flex-align position-relative" key={idx}>
                      <div className="mb-0 common-check common-radio">
                        <input className="form-check-input" type="radio" name="ratingFilter" />
                      </div>
                      <div
                        className="h-8 bg-gray-100 progress w-100 rounded-pill"
                        role="progressbar"
                        aria-valuenow={it.w}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar bg-main-600 rounded-pill" style={{ width: `${it.w}%` }} />
                      </div>
                      <div className="gap-4 flex-align">
                        {it.stars.map((s, i) => (
                          <span
                            key={i}
                            className={`text-xs fw-medium ${s ? "text-warning-600" : "text-gray-400"} d-flex`}
                          >
                            <i className="ph-fill ph-star"></i>
                          </span>
                        ))}
                      </div>
                      <span className="flex-shrink-0 text-gray-900">{it.c}</span>
                    </div>
                  ))}
                </div>

                {/* Filter by Color */}
                <div className="p-32 mb-32 border border-gray-100 shop-sidebar__box rounded-8">
                  <h6 className="pb-24 mb-24 text-xl border-gray-100 border-bottom">Filter by Color</h6>
                  <ul className="overflow-y-auto max-h-540 scroll-sm">
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
                <div className="p-32 mb-32 border border-gray-100 shop-sidebar__box rounded-8">
                  <h6 className="pb-24 mb-24 text-xl border-gray-100 border-bottom">Filter by Brand</h6>
                  <ul className="overflow-y-auto max-h-540 scroll-sm">
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
                  <Image
                    src="/assets/images/thumbs/advertise-img1.png"
                    alt="Advertise"
                    width={360}
                    height={420}
                    className="h-auto img-fluid w-100"
                  />
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="col-lg-9">
              {/* Top toolbar */}
              <div className="flex-wrap gap-16 mb-40 flex-between">
                <span className="text-gray-900">
                  {loading
                    ? "Loading…"
                    : `Showing 1-${Math.min(sorted.length, perPage)} of ${sorted.length} result`}
                </span>
                <div className="flex-wrap gap-16 position-relative flex-align">
                  <div className="gap-16 list-grid-btns flex-align">
                    <button type="button" className="text-2xl border border-gray-100 w-44 h-44 flex-center rounded-6 list-btn">
                      <i className="ph-bold ph-list-dashes"></i>
                    </button>
                    <button type="button" className="text-2xl text-white border w-44 h-44 flex-center border-main-600 bg-main-600 rounded-6 grid-btn">
                      <i className="ph ph-squares-four"></i>
                    </button>
                  </div>
                  <div className="gap-4 text-gray-500 position-relative flex-align text-14">
                    <label htmlFor="sorting" className="flex-shrink-0 text-inherit">Sort by: </label>
                    {/* NOTE: dropdown này hiện chưa nối state sort; nếu muốn đồng bộ URL, có thể đọc/ghi searchParams */}
                    <select className="w-auto form-control common-input px-14 py-14 text-inherit rounded-6" id="sorting" defaultValue="Popular">
                      <option value="Popular">Popular</option>
                      <option value="Latest">Latest</option>
                      <option value="Trending">Trending</option>
                      <option value="Matches">Matches</option>
                    </select>
                  </div>
                  <button type="button" className="text-2xl border border-gray-100 w-44 h-44 d-lg-none d-flex flex-center rounded-6 sidebar-btn">
                    <i className="ph-bold ph-funnel"></i>
                  </button>
                </div>
              </div>

              {/* GRID: dùng dữ liệu thật thay mock */}
              {loading ? (
                <div className="py-24 text-center text-gray-500">Đang tải sản phẩm…</div>
              ) : (
                <div className="row g-3">
                  {sorted.map((p) => {
                    const { gia, selling } = firstPrice(p);
                    const { avg, count } = avgRating(p);
                    const showDiscount = selling < gia;
                    const percent = gia > 0 ? Math.round(((gia - selling) / gia) * 100) : 0;

                    return (
                      <div className="col-sm-6 col-md-4" key={p.id}>
                        <ProductCardV2
                          href={toHref(p)}
                          img={firstImage(p)}
                          title={p.ten}
                          price={selling}                        // number → tự format VND
                          oldPrice={showDiscount ? gia : undefined}
                          ratingAverage={avg}
                          ratingCount={count}
                          badge={showDiscount ? { text: `Sale ${percent}%`, color: "danger" } : undefined}
                          showHeart
                          isWished={isWished(p.id)}
                          onToggleWish={() => toggle(p.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pagination (giữ UI như file cũ, chưa nối API phân trang) */}
          <div className="mt-40 d-flex justify-content-center w-100">
            <ul className="flex-wrap gap-16 pagination flex-center">
              <li className="page-item">
                <a className="text-xl border border-gray-100 page-link h-44 w-44 flex-center rounded-8 fw-medium text-neutral-600" href="#">
                  <i className="ph-bold ph-arrow-left"></i>
                </a>
              </li>
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className={`page-item ${i === 0 ? "active" : ""}`}>
                  <a
                    className={`page-link h-44 w-44 flex-center rounded-8 fw-medium ${
                      i === 0 ? "bg-main-600 text-white" : "border border-gray-100 text-gray-900"
                    }`}
                    href="#"
                  >
                    {i === 0 ? "01" : String(i + 1)}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="text-xl border border-gray-100 page-link h-44 w-44 flex-center rounded-8 fw-medium text-neutral-600" href="#">
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
