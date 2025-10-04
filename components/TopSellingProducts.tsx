"use client";
import React from "react";
import { useWishlist } from "@/hooks/useWishlist";


/** ==== Kiểu chung cho UI card ==== */
type UIProduct = {
  id: number;
  name: string;
  slug: string;
  img: string;
  price: number | null;
  priceBefore?: number | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  isFree?: boolean;
};

/** ==== Kiểu hot_sales_v2 (những field cần) ==== */
type HotSalesItem = {
  id: number;
  ten: string;
  slug?: string;
  mediaurl?: string | null;

  // các trường normalize sẵn trong v2:
  original_price?: number | null;
  discount_amount?: number | null;
  selling_price?: number | null;
  discount_type?: string | null; // "Miễn phí"
  is_free?: boolean;

  rating_average?: number | null;
  rating_count?: number | null;
};

/** ==== Kiểu recommend_v2 (những field cần) ==== */
type RecommendItem = {
  id: number;
  ten: string;
  slug: string;
  mediaurl?: string | null;
  gia?: {
    current: number;
    before_discount: number | null;
    discount_percent: number;
  } | null;
  rating?: { average: number; count: number } | null;
};

/** ==== 2 mapper về UI chung ==== */
const mapHotToUI = (p: HotSalesItem): UIProduct => {
  const img = p.mediaurl || "/assets/images/thumbs/product-two-img1.png";
  const isFree = Boolean(p.is_free) || p.discount_type === "Miễn phí" || p.selling_price === 0;
  return {
    id: p.id,
    name: p.ten,
    slug: p.slug || String(p.id),
    img,
    isFree,
    price: isFree ? 0 : (p.selling_price ?? null),
    priceBefore: p.original_price ?? null,
    ratingAvg: p.rating_average ?? null,
    ratingCount: p.rating_count ?? null,
  };
};

const mapRecommendToUI = (p: RecommendItem): UIProduct => {
  const img = p.mediaurl || "/assets/images/thumbs/product-two-img1.png";
  const cur = p.gia?.current ?? null;
  const before = p.gia?.before_discount ?? null;
  const isFree = cur === 0;
  return {
    id: p.id,
    name: p.ten,
    slug: p.slug || String(p.id),
    img,
    isFree,
    price: cur,
    priceBefore: before,
    ratingAvg: p.rating?.average ?? null,
    ratingCount: p.rating?.count ?? null,
  };
};

/** ==== props cho TopSellingProducts ==== */
type Props =
  | { variant: "hot"; title?: string; perPage?: number }
  | { variant: "recommend"; title?: string; perPage?: number };

/** ==== Component chính ==== */
export default function TopSellingProducts(props: Props) {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
  const title =
    props.title ?? (props.variant === "hot" ? "Top deal • Siêu rẻ" : "Có thể bạn quan tâm");
  const perPage = props.perPage ?? (props.variant === "hot" ? 10 : 8);

  const url =
    props.variant === "hot"
      ? `${API}/api/sanphams-selection?selection=hot_sales&per_page=${perPage}`
      : `${API}/api/sanphams-selection?selection=recommend&per_page=${perPage}`;
  const viewAllHref =
  props.variant === "hot"
    ? "/products?source=hot_sales&sort=popular"
    : "/products?source=recommend&sort=matches";


  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<UIProduct[]>([]);
  const { isWished, toggle } = useWishlist();


  React.useEffect(() => {
    let alive = true;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => r.json() as Promise<{ status: boolean; data: unknown[] }>)
      .then((res) => {
        if (!alive) return;
        if (res?.status && Array.isArray(res.data)) {
          const mapped =
            props.variant === "hot"
              ? (res.data as HotSalesItem[]).map(mapHotToUI)
              : (res.data as RecommendItem[]).map(mapRecommendToUI);
          setItems(mapped);
        } else {
          setItems([]);
        }
      })
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [url, props.variant]);

  return (
    <section className="pt-20 overflow-hidden top-selling-products">
      <div className="container container-lg">
        <div className="p-24 border border-gray-100 rounded-10 bg-hotsales">
          <div className="mb-12 section-heading">
            <div className="flex-wrap gap-8 flex-between">
              <h6 className="mb-0">
                <i className="ph-bold ph-fire text-main-600" /> {title}
              </h6>
              <div className="gap-16 flex-align">
                <a href={viewAllHref}
                   className="text-sm fw-semibold hover-text-decoration-underline">
                  Xem tất cả
                </a>
                <div className="gap-8 flex-align">
                  <button type="button" id="top-selling-prev" className="slick-prev slick-arrow">
                  <i className="ph ph-caret-left"></i>
                </button>
                <button type="button" id="top-selling-next" className="slick-next slick-arrow">
                  <i className="ph ph-caret-right"></i>
                </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-white">Đang tải…</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-white">Không có sản phẩm.</div>
          ) : (
            <div className="row g-12 top-selling-product-slider arrow-style-two">
              {items.map((p) => {
                const hasSale =
                  p.isFree ||
                  (typeof p.priceBefore === "number" &&
                    typeof p.price === "number" &&
                    p.priceBefore > p.price);
                return (
                  <div key={p.id} data-aos="fade-up" data-aos-duration={1000}>
                    <div className="p-16 bg-white border border-gray-100 product-card hover-card-shadows h-100 hover-border-main-600 rounded-10 position-relative transition-2">
                      <a
                        href={`/product/${p.slug}`}
                        className="product-card__thumb flex-center rounded-8 position-relative bg-gray-50"
                        style={{ height: "180px" }}
                      >
                        {p.isFree && (
                          <span className="px-8 py-4 text-sm text-white product-card__badge bg-success-600 position-absolute inset-inline-start-0 inset-block-start-0">
                            Miễn phí
                          </span>
                        )}
                        {/* ❤️ Wishlist */}
                        <button
                          type="button"
                          aria-label={isWished(p.id) ? "Bỏ yêu thích" : "Yêu thích"}
                          onClick={(e) => { e.preventDefault(); toggle(p.id); }}
                          className={`position-absolute top-8 end-8 w-36 h-36 rounded-circle flex-center
                                      ${isWished(p.id) ? "bg-danger-600 text-white" : "bg-white text-gray-700"}
                                      hover-bg-danger-600 hover-text-white transition-1`}
                          style={{ boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}
                        >
                          <i className={isWished(p.id) ? "ph-fill ph-heart" : "ph ph-heart"} />
                        </button>

                        <img src={p.img} alt={p.name} className="w-auto h-100" />
                      </a>
                      <div className="mt-16 product-card__content w-100">
                        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
                          <a href={`/product/${p.slug}`} className="link text-line-2">
                            {p.name}
                          </a>
                        </h6>

                        <div className="gap-6 flex-align">
                          <span className="text-xs text-gray-500 fw-medium">
                            {p.ratingAvg ?? "—"}
                          </span>
                          <span className="text-xs text-gray-500 fw-medium">
                            <i className="ph-fill ph-star text-warning-600"></i>
                          </span>
                          <span className="text-xs text-gray-500 fw-medium">
                            ({p.ratingCount ?? 0})
                          </span>
                        </div>

                        <div className="my-10 product-card__price">
                          {p.isFree ? (
                            <span className="text-heading text-md fw-semibold">Miễn phí</span>
                          ) : hasSale ? (
                            <>
                              <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through">
                                {p.priceBefore?.toLocaleString("vi-VN")} đ
                              </span>
                              <span className="text-heading text-md fw-semibold ms-8">
                                {p.price?.toLocaleString("vi-VN")} đ
                              </span>
                            </>
                          ) : (
                            <span className="text-heading text-md fw-semibold">
                              {p.price != null ? `${p.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                            </span>
                          )}
                        </div>
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
