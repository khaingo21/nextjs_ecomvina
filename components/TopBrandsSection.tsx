"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* =======================
   Types khớp API hot_sales (không any)
======================= */
type Review = { id: number; diem: number };
type Variant = { gia: string; giagiam: string; soluong?: number };
type ProductImage = { media: string };
type Brand = { id?: number; ten?: string };

type ApiProduct = {
  id: number;
  ten: string;
  slug?: string | null;
  mediaurl?: string | null;
  anhsanphams?: ProductImage[];
  bienthes?: Variant[];
  danhgias?: Review[];
  thuonghieu?: Brand;
  // (có thể có thêm field khác nhưng không bắt buộc ở đây)
};

type UIProduct = {
  id: number;
  name: string;
  href: string;
  image: string;
  originalPrice: number;
  sellingPrice: number;
  isDiscounted: boolean;
  discountPercent: number;
  ratingAverage: number;
  ratingCount: number;
  brandName: string;
};

type UIBrand = {
  brand: string;              // tên thương hiệu
  sample: UIProduct;          // 1 sản phẩm tiêu biểu để render card
  productCount: number;       // số sp của brand trong hot_sales
  score: number;              // điểm dùng để xếp hạng (discount + rating)
};

/* =======================
   Helpers mapping
======================= */
const asNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") { const n = parseFloat(v); return Number.isFinite(n) ? n : fallback; }
  return fallback;
};

const pickImage = (p: ApiProduct): string =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";

const toUIProduct = (p: ApiProduct): UIProduct => {
  const gia = asNumber(p.bienthes?.[0]?.gia, 0);
  const giagiam = asNumber(p.bienthes?.[0]?.giagiam, 0);
  // Heuristic: giagiam < gia -> giagiam là GIÁ BÁN; ngược lại là SỐ TIỀN GIẢM
  const selling = giagiam > 0 && giagiam < gia ? giagiam : Math.max(gia - giagiam, 0);
  const isDiscounted = gia > 0 && selling < gia;
  const discountPercent = isDiscounted ? Math.round(((gia - selling) / gia) * 100) : 0;

  const reviews = p.danhgias ?? [];
  const ratingCount = reviews.length;
  const ratingAvg = ratingCount
    ? Math.round((reviews.reduce((s, r) => s + asNumber(r.diem, 0), 0) / ratingCount) * 10) / 10
    : 0;

  const brandName = p.thuonghieu?.ten?.trim() || "Khác";

  return {
    id: p.id,
    name: p.ten,
    href: `/product/${encodeURIComponent(p.ten.toLowerCase().replace(/\s+/g, "-"))}-${p.id}`,
    image: pickImage(p),
    originalPrice: gia,
    sellingPrice: selling,
    isDiscounted,
    discountPercent,
    ratingAverage: ratingAvg,
    ratingCount,
    brandName,
  };
};

/* =======================
   Component (UI giữ nguyên bố cục bên trái)
======================= */
export default function TopBrandsSection() {
  const [brands, setBrands] = useState<UIBrand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const viewAllHref = "/products?source=hot_sales&sort=popular";

  useEffect(() => {
    let alive = true;
    const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
    fetch(`${API}/api/sanphams-selection?selection=hot_sales&per_page=60`)
      .then((r) => r.json() as Promise<{ status: boolean; data: ApiProduct[] }>)
      .then((res) => {
        if (!alive) return;
        const list = (res?.status && Array.isArray(res.data)) ? res.data : [];
        const ui = list.map(toUIProduct);

        // Group theo thương hiệu, chọn 1 sản phẩm đại diện có discount% cao nhất -> rating cao
        const grouped = new Map<string, UIBrand>();
        for (const p of ui) {
          const key = p.brandName;
          const cur = grouped.get(key);
          const score = p.discountPercent * 2 + p.ratingAverage * 10; // trọng số: ưu tiên giảm giá + rating
          if (!cur) {
            grouped.set(key, { brand: key, sample: p, productCount: 1, score });
          } else {
            const better = score > cur.score;
            grouped.set(key, {
              brand: key,
              sample: better ? p : cur.sample,
              productCount: cur.productCount + 1,
              score: better ? score : cur.score,
            });
          }
        }

        // Sắp xếp thương hiệu theo score giảm dần, lấy Top 5
        const top = Array.from(grouped.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setBrands(top);
      })
      .finally(() => alive && setLoading(false));
      
    return () => { alive = false; };
  }, []);

  // Tính % thanh tiến độ dựa vào rating (đẹp & ổn định)
  const progress = (b: UIBrand) => Math.min(100, Math.round((b.sample.ratingAverage / 5) * 100));

  return (
    <section className="overflow-hidden top-selling-products pt-80">
      <div className="container">
        <div className="p-24 border border-gray-100 rounded-16">
          <div className="mb-24 section-heading">
            <div className="flex-wrap gap-8 flex-between">
              <h6 className="mb-0">
                <i className="ph-bold ph-storefront text-main-600"></i> Thương hiệu hàng đầu
              </h6>
              <div className="gap-16 flex-align">
                <Link href={viewAllHref} className="text-sm text-gray-700 fw-semibold hover-text-main-600 hover-text-decoration-underline">
                  Xem đầy đủ
                </Link>
                <div className="gap-8 flex-align">
                  <button
                    type="button"
                    id="top-brands-prev"
                    className="text-xl border border-gray-100 slick-prev slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                  >
                    <i className="ph ph-caret-left"></i>
                  </button>
                  <button
                    type="button"
                    id="top-brands-next"
                    className="text-xl border border-gray-100 slick-next slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                  >
                    <i className="ph ph-caret-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-gray-500">Đang tải thương hiệu…</div>
          ) : (
            <div className="row g-12 top-brands-grid">
              {brands.map((b, idx) => {
                const p = b.sample;
                const showDiscount = p.isDiscounted;
                const bestSale = idx === 0 && showDiscount; // thẻ "Best Sale" cho brand top 1 nếu có giảm

                return (
                  <div className="col-xxl-5th col-xl-5th col-lg-4 col-sm-6" key={`${b.brand}-${p.id}`}>
                    <div className="p-16 border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                      <Link href={p.href} className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50">
                        {showDiscount && (
                          <span className="px-8 py-4 text-sm text-white product-card__badge bg-danger-600 position-absolute inset-inline-start-0 inset-block-start-0">
                            Sale {p.discountPercent}%
                          </span>
                        )}
                        {bestSale && (
                          <span className="px-8 py-4 text-sm text-white product-card__badge bg-primary-600 position-absolute inset-inline-start-0 inset-block-start-0">
                            Best Sale
                          </span>
                        )}
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={240}
                          height={200}
                          className="w-auto max-w-unset"
                          unoptimized={/^https?:\/\//.test(p.image)}
                        />
                      </Link>

                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <Link href={p.href} className="link text-line-2">{p.name}</Link>
                        </h6>

                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">{p.ratingAverage.toFixed(1)}</span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs text-gray-500 fw-medium">({p.ratingCount})</span>
                        </div>

                        <div className="gap-4 mt-8 flex-align">
                          <span className="text-tertiary-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-xs text-gray-500">By {b.brand} • {b.productCount} items</span>
                        </div>

                        <div className="mt-8">
                          <div
                            className="h-4 progress w-100 bg-color-three rounded-pill"
                            role="progressbar"
                            aria-label="Top brand rating"
                            aria-valuenow={progress(b)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div className="progress-bar bg-tertiary-600 rounded-pill" style={{ width: `${progress(b)}%` }}></div>
                          </div>
                          <span className="mt-8 text-xs text-gray-900 fw-medium d-block">
                            Rating: {p.ratingAverage.toFixed(1)}/5
                          </span>
                        </div>

                        <div className="my-12 border-gray-100 border-top"></div>
                        <div className="mb-10 d-flex justify-content-end">
                          <a
                            href={`/products?brand=${encodeURIComponent(b.brand)}&sort=popular`}
                            className="text-xs text-gray-600 hover-text-main-600 hover-text-decoration-underline"
                          >
                            Xem tất cả của {b.brand}
                          </a>
                        </div>

                        <div className="my-10 product-card__price">
                          {showDiscount && (
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                              {p.originalPrice.toLocaleString("vi-VN")} đ
                            </span>
                          )}
                          <span className="text-heading text-md fw-semibold ms-8">
                            {p.sellingPrice.toLocaleString("vi-VN")} đ <span className="text-gray-500 fw-normal">/Qty</span>
                          </span>
                        </div>

                        <Link href="/cart" className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-pill flex-center fw-medium">
                          Add To Cart <i className="ph ph-shopping-cart"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
