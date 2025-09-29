"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/** ==== Types khớp API hot_sales ==== */
type DanhGia = { id: number; diem: number };
type BienThe = { gia: string; giagiam: string; soluong?: number };
type AnhSP = { media: string };
type ApiProduct = {
  id: number;
  ten: string;
  mediaurl?: string | null;
  danhgias?: DanhGia[];
  bienthes?: BienThe[];
  anhsanphams?: AnhSP[];
  thuonghieu?: { ten?: string };
  xuatxu?: string;
};

/** ==== UI type sau khi chuẩn hoá ==== */
type UIProduct = ApiProduct & {
  slug: string;
  original_price: number;
  discount_amount: number;
  selling_price: number;
  discount_type: "Giảm tiền" | "Miễn phí" | "Sold" | null;
  is_free: boolean;
  is_sold: boolean;
  rating_average: number;
  rating_count: number;
  image_url: string;
  product_meta?: string;
};

/** ==== Helpers ==== */
const toVND = (n: number) => n.toLocaleString("vi-VN") + " đ";
const num = (v?: string) => {
  const n = parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
};
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const firstImage = (p: ApiProduct) =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";

const mapToUI = (p: ApiProduct): UIProduct => {
  const gia = num(p.bienthes?.[0]?.gia);
  const giagiam = num(p.bienthes?.[0]?.giagiam);
  const selling_price = giagiam > 0 ? giagiam : gia;

  const rating_count = p.danhgias?.length || 0;
  const rating_sum = (p.danhgias || []).reduce((s, r) => s + (Number(r.diem) || 0), 0);
  const rating_average = rating_count ? Math.round((rating_sum / rating_count) * 10) / 10 : 0;

  const is_sold = (p.bienthes?.[0]?.soluong ?? 0) <= 0;
  const is_free = selling_price === 0;

  let discount_type: UIProduct["discount_type"] = null;
  if (is_sold) discount_type = "Sold";
  else if (is_free) discount_type = "Miễn phí";
  else if (giagiam > 0 && giagiam < gia) discount_type = "Giảm tiền";

  return {
    ...p,
    slug: slugify(p.ten || `sp-${p.id}`),
    original_price: gia,
    discount_amount: giagiam,
    selling_price,
    discount_type,
    is_free,
    is_sold,
    rating_average,
    rating_count,
    image_url: firstImage(p),
    product_meta: [p.thuonghieu?.ten, p.xuatxu].filter(Boolean).join(" • "),
  };
};

export default function TopSellingProducts() {
  const [items, setItems] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // có thể đổi per_page theo nhu cầu
    fetch("http://localhost:8000/api/sanphams-selection?selection=hot_sales&per_page=8")
      .then((res) => res.json())
      .then((res: { status: boolean; data: ApiProduct[] }) => {
        if (mounted && res?.status && Array.isArray(res.data)) {
          setItems(res.data.map(mapToUI));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="overflow-hidden top-selling-products pt-80">
      <div className="container">
        <div className="mb-24 section-heading">
          <div className="flex-wrap gap-8 flex-between">
            <h6 className="mb-0">
              <i className="text-2xl ph-bold ph-fire text-main-600"></i> HOT SALES !
            </h6>
            <div className="gap-16 flex-align">
              <Link
                href="/shop?view=hot"
                className="text-sm text-gray-700 fw-semibold hover-text-main-600 hover-text-decoration-underline"
              >
                Xem đầy đủ
              </Link>
              <div className="gap-8 flex-align">
                <button
                  type="button"
                  id="top-selling-prev"
                  className="text-xl border border-gray-100 slick-prev slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                >
                  <i className="ph ph-caret-left"></i>
                </button>
                <button
                  type="button"
                  id="top-selling-next"
                  className="text-xl border border-gray-100 slick-next slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                >
                  <i className="ph ph-caret-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-gray-500">Đang tải HOT SALES…</div>
        ) : (
          <div className="row g-12">
            {items.map((p) => {
              const percent =
                p.original_price > 0
                  ? Math.round(((p.original_price - p.selling_price) / p.original_price) * 100)
                  : 0;
              const showDiscount = p.discount_type === "Giảm tiền";

              return (
                <div className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6" key={p.id}>
                  <div className="p-16 border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-16 position-relative transition-2">
                    <a
                      href={`/product/${p.slug}-${p.id}`}
                      className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50"
                    >
                      {showDiscount && (
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">
                          Giảm {percent}%
                        </span>
                      )}
                      {p.discount_type === "Miễn phí" && (
                        <span className="px-8 py-4 text-sm text-white product-card__badge bg-primary-600 position-absolute inset-inline-start-0 inset-block-start-0">
                          Miễn phí
                        </span>
                      )}
                      {p.discount_type === "Sold" && (
                        <span className="px-8 py-4 text-sm text-white bg-gray-600 product-card__badge position-absolute inset-inline-start-0 inset-block-start-0">
                          Hết hàng
                        </span>
                      )}

                      {/* Dùng next/image, cho phép chạy ngay với ảnh ngoài domain */}
                      <Image
                        src={p.image_url}
                        alt={p.ten}
                        width={320}
                        height={320}
                        className="w-auto max-w-unset"
                        unoptimized={/^https?:\/\//.test(p.image_url)}
                      />
                    </a>

                    <div className="mt-16 product-card__content w-100">
                      <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                        <a href={`/product/${p.slug}-${p.id}`} className="link text-line-2">
                          {p.ten}
                        </a>
                      </h6>

                      <div className="gap-6 flex-align">
                        <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                        <span className="text-xs text-gray-500 fw-medium">
                          {p.rating_average.toFixed(1)} <i className="ph-fill ph-star text-warning-600"></i>
                        </span>
                        <span className="text-xs text-gray-500 fw-medium">({p.rating_count})</span>
                      </div>

                      <div className="my-10 product-card__price">
                        {showDiscount && (
                          <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through me-8">
                            {toVND(p.original_price)}
                          </span>
                        )}
                        <span className="text-heading text-md fw-semibold">{toVND(p.selling_price)}</span>
                      </div>

                      <a
                        href="/cart"
                        className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-pill flex-center fw-medium"
                      >
                        Thêm <i className="ph ph-shopping-cart"></i>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
