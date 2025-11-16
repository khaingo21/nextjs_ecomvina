"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";

/* =======================
   THEME — tuỳ chỉnh màu badge & icon theo UI bên trái
======================= */
const THEME = {
  sectionTitle: "Danh mục hàng đầu",
  tabsVariantClass: "nav common-tab style-two nav-pills", // nhóm tab
  cardWrapClass:
    "product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2",
  thumbClass: "product-card__thumb flex-center rounded-8 bg-gray-50 position-relative",
  titleClass: "title text-lg fw-semibold my-16",
  priceWrapClass: "product-card__price mt-16 mb-30",
  starIconClass: "ph-fill ph-star text-warning-600",
  saleBadgeClass: "bg-danger-600",
  freeBadgeClass: "bg-primary-600",
  soldBadgeClass: "bg-gray-600",
  // Badge khi hiển thị danh mục
  catSoldBadgeClass: "bg-success-600",
};

/* =======================
   Types theo API (không any)
======================= */
type Review = { id: number; diem: number };
type Variant = { id: number; gia: string; giagiam: string; soluong?: number };
type ProductImage = { media: string };
type Brand = { id: number; ten: string };

export type ApiProduct = {
  id: number;
  ten: string;
  slug?: string | null;
  mediaurl?: string | null;
  image_url?: string | null;
  luotxem?: number;
  thuonghieu?: Brand;
  bienthes?: Variant[];
  anhsanphams?: ProductImage[];
  danhgias?: Review[];
  // fields đã chuẩn hoá (nếu có)
  original_price?: number | string | null;
  discount_amount?: number | string | null;
  selling_price?: number | null;
  discount_type?: "Miễn phí" | "Giảm tiền" | "Sold" | null | string;
  is_free?: boolean;
  is_sold?: boolean;
  rating_average?: number;
  rating_count?: number;
  seller_name?: string;
};
export type ApiCategory = {
  id: number;
  ten: string;
  slug: string;
  total_sold: number;
  sanphams: ApiProduct[];
};
type ApiResponseTopCategories = { status: boolean; data: { original: ApiCategory[] } };

type UIProduct = {
  id: number;
  name: string;
  href: string;
  image: string;
  originalPrice: number;
  sellingPrice: number;
  isDiscounted: boolean;
  discountPercent: number;
  isFree: boolean;
  isSold: boolean;
  ratingAverage: number;
  ratingCount: number;
  sellerName?: string;
};

/* =======================
   Helpers mapping
======================= */
const asNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const slugify = (s: string, fallback: string): string =>
  (s || fallback)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallback;

const pickImage = (p: ApiProduct): string => {
  const raw = p.image_url || p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img1.png";
  if (typeof raw !== "string") return "/assets/images/thumbs/product-two-img1.png";
  if (/^https?:\/\//.test(raw) || raw.startsWith('/')) return raw;
  // Nếu là tên file trần (vd: "yensaonest100_70ml_2.jpg") thì thêm leading '/'
  return `/${raw}`;
};

const computePrices = (p: ApiProduct): { original: number; selling: number; isDiscounted: boolean; percent: number } => {
  let original = asNumber(p.original_price, NaN);
  let selling = asNumber(p.selling_price, NaN);

  if (!Number.isFinite(original) || !Number.isFinite(selling)) {
    const v = p.bienthes?.[0];
    const gia = asNumber(v?.gia, 0);
    const giagiam = asNumber(v?.giagiam, 0);
    if (giagiam > 0 && giagiam < gia) {
      original = gia;
      selling = giagiam;
    } else {
      original = gia;
      selling = Math.max(gia - giagiam, 0);
    }
  }
  const isDiscounted = original > 0 && selling < original;
  const percent = isDiscounted ? Math.round(((original - selling) / original) * 100) : 0;
  return { original, selling, isDiscounted, percent };
};

const computeRating = (p: ApiProduct): { avg: number; count: number } => {
  const avgApi = asNumber(p.rating_average, NaN);
  const countApi = asNumber(p.rating_count, NaN);
  if (Number.isFinite(avgApi) && Number.isFinite(countApi)) return { avg: avgApi, count: countApi };
  const arr = p.danhgias ?? [];
  if (!arr.length) return { avg: 0, count: 0 };
  const sum = arr.reduce((s, r) => s + asNumber(r.diem, 0), 0);
  const avg = Math.round((sum / arr.length) * 10) / 10;
  return { avg, count: arr.length };
};

const toUI = (p: ApiProduct): UIProduct => {
  const { original, selling, isDiscounted, percent } = computePrices(p);
  const { avg, count } = computeRating(p);
  const slug = p.slug ? String(p.slug) : slugify(p.ten, `sp-${p.id}`);
  return {
    id: p.id,
    name: p.ten,
    href: `/products/${slug}-${p.id}`,
    image: pickImage(p),
    originalPrice: original,
    sellingPrice: selling,
    isDiscounted,
    discountPercent: percent,
    isFree: selling === 0 || p.is_free === true,
    isSold: Boolean(p.is_sold) || (p.bienthes?.[0]?.soluong ?? 1) <= 0,
    ratingAverage: avg,
    ratingCount: count,
    sellerName: p.seller_name ?? p.thuonghieu?.ten,
  };
};

/* =======================
   Component
======================= */
export default function TrendingProductsTabs() {
  // Lưu danh mục (để render view "Xem đầy đủ")
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  // Tabs động: "Xem đầy đủ" + mỗi danh mục
  const [tabs, setTabs] = useState<{ key: string; label: string }[]>([{ key: "all", label: "All" }]);
  // Map sản phẩm theo tab
  const [byTab, setByTab] = useState<Record<string, UIProduct[]>>({ all: [] });
  const [active, setActive] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Swiper refs for navigation
  const swiperRef = React.useRef<SwiperType | null>(null);

  useEffect(() => {
    let alive = true;
    const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
    fetch(`${API}/api/sanphams-selection?selection=top_categories&per_page=6`)
      .then((r) => r.json() as Promise<ApiResponseTopCategories>)
      .then((res) => {
        if (!alive) return;
        const cats = res?.data?.original ?? [];

        const nextTabs: { key: string; label: string }[] = [
          { key: "all", label: "All" },
          ...cats.map((c) => ({ key: c.slug, label: c.ten })),
        ];

        const map: Record<string, UIProduct[]> = { all: [] };
        cats.forEach((c) => {
          const list = (c.sanphams || []).map(toUI);
          map[c.slug] = list;
          map.all = map.all.concat(list);
        });

        setCategories(cats);
        setTabs(nextTabs);
        setByTab(map);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Danh mục bán chạy theo total_sold (cao -> thấp)
  const topCategories: ApiCategory[] = useMemo(() => {
    const cloned = [...categories];
    cloned.sort((a, b) => (b.total_sold || 0) - (a.total_sold || 0));
    return cloned;
  }, [categories]);

  // Sản phẩm của tab hiện tại
  const products: UIProduct[] = useMemo(() => byTab[active] || [], [byTab, active]);

  // Link "Xem tất cả" tương ứng tab hiện tại
  const viewAllHref =
    active === "all"
      ? "/products?sort=trending"
      : `/products?category=${encodeURIComponent(active)}&sort=trending`;

  // Giới hạn hiển thị (giống bố cục bên trái: 6/12 card)
  const visibleCats: ApiCategory[] = topCategories.slice(0, 12);
  const visibleProds: UIProduct[] = products.slice(0, 12);

  // Ảnh đại diện danh mục: ảnh sp đầu tiên
  const catThumb = (c: ApiCategory): string => {
    const p = c.sanphams?.[0];
    return p ? pickImage(p) : "/assets/images/thumbs/product-two-img1.png";
  };

  return (
    <section className="overflow-hidden trending-productss">
      <div className="container">
        <div className="p-24 border border-gray-100 rounded-16">
          <div className="mb-24 section-heading">
            <div className="flex-wrap gap-8 flex-between">
              <h6 className="mb-0">
                <i className="ph-bold ph-squares-four text-main-600" /> {THEME.sectionTitle}
              </h6>

              <div className="gap-16 flex-align">
                <a href={viewAllHref} className="text-sm fw-semibold hover-text-decoration-underline">Xem đầy đủ</a>
                {active === "all" && (
                  <div className="gap-8 flex-align">
                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slidePrev()}
                      className="w-32 h-32 text-lg border border-gray-100 rounded-circle flex-center hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                      aria-label="Prev"
                    >
                      <i className="ph ph-caret-left"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => swiperRef.current?.slideNext()}
                      className="w-32 h-32 text-lg border border-gray-100 rounded-circle flex-center hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                      aria-label="Next"
                    >
                      <i className="ph ph-caret-right"></i>
                    </button>
                  </div>
                )}
                <ul className={THEME.tabsVariantClass} role="tablist">
                  {tabs.map((t) => (
                    <li className="nav-item" role="presentation" key={t.key}>
                      <button
                        className={`nav-link fw-medium text-sm hover-border-main-600 ${active === t.key ? "active" : ""}`}
                        type="button"
                        role="tab"
                        onClick={() => setActive(t.key)}
                      >
                        {t.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          {loading ? (
            <div className="py-24 text-center text-gray-500">Đang tải danh mục…</div>
          ) : active === "all" ? (
            // ======= VIEW "All": HIỂN THỊ CÁC DANH MỤC TOP SOLD VỚI SWIPER =======
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={12}
              slidesPerView={6}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={visibleCats.length > 6}
              speed={600}
              navigation={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                575: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1600: {
                  slidesPerView: 6,
                },
              }}
              className="categories-swiper-tabs"
            >
              {visibleCats.map((c) => {
                const href = `/products?category=${c.slug}&sort=trending`;
                const img = catThumb(c);
                return (
                  <SwiperSlide key={c.id}>
                    <div className={THEME.cardWrapClass}>
                      <Link href={href} className={THEME.thumbClass}>
                        <span
                          className={`product-card__badge ${THEME.catSoldBadgeClass} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
                        >
                          Đã bán {c.total_sold.toLocaleString("vi-VN")}
                        </span>
                        <Image
                          src={img}
                          alt={c.ten}
                          width={220}
                          height={180}
                          className="w-auto max-w-unset"
                          unoptimized={/^https?:\/\//.test(img)}
                        />
                      </Link>

                      <div className="mt-16 product-card__content w-100">
                        <h6 className={THEME.titleClass}>
                          <Link href={href} className="link text-line-2">
                            {c.ten}
                          </Link>
                        </h6>
                        <div className="text-xs text-gray-600">Top danh mục theo lượt bán • Nhấn để xem sản phẩm</div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            // ======= VIEW DANH MỤC CỤ THỂ: HIỂN THỊ SẢN PHẨM =======
            <div className="row g-12">
              {visibleProds.map((p) => (
                <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6" key={p.id}>
                  <div className={THEME.cardWrapClass}>
                    <Link href={p.href} className={THEME.thumbClass}>
                      {p.isDiscounted && (
                        <span
                          className={`product-card__badge ${THEME.saleBadgeClass} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
                        >
                          Top deal
                        </span>
                      )}
                      {p.isFree && (
                        <span
                          className={`product-card__badge ${THEME.freeBadgeClass} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
                        >
                          Miễn phí
                        </span>
                      )}
                      {p.isSold && (
                        <span
                          className={`product-card__badge ${THEME.soldBadgeClass} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
                        >
                          Hết hàng
                        </span>
                      )}
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={220}
                        height={180}
                        className="w-auto max-w-unset"
                        unoptimized={/^https?:\/\//.test(p.image)}
                      />
                    </Link>

                    <div className="mt-16 product-card__content w-100">
                      <h6 className={THEME.titleClass}>
                        <Link href={p.href} className="link text-line-2">
                          {p.name}
                        </Link>
                      </h6>

                      <div className="mb-6 text-xs text-gray-600">
                        <span className="me-6 text-warning-600">
                          <i className={THEME.starIconClass} />
                        </span>
                        <span className="fw-semibold">{p.ratingAverage.toFixed(1)}</span>
                        <span className="ms-4">({p.ratingCount >= 1000 ? `${Math.round(p.ratingCount / 100) / 10}k` : p.ratingCount})</span>
                      </div>

                      <div className="mb-6 gap-6 flex-align text-gray-500">
                        <i className="ph-bold ph-storefront text-main-600"></i>
                        <span className="text-xs">Siêu thị Vina</span>
                      </div>

                      <div className={THEME.priceWrapClass}>
                        {p.isDiscounted && (
                          <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-8">
                            {p.originalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                        <span className="text-heading text-md fw-semibold">
                          {p.sellingPrice.toLocaleString("vi-VN")} đ{" "}
                          {/* <span className="text-gray-500 fw-normal">/Qty</span> */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
