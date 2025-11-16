"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type ProductHotDeal = {
  id: number | string;
  slug?: string | null;
  ten?: string | null;
  mediaurl?: string | null;
  selling_price?: number | null;
  original_price?: number | null;
  shop_name?: string | null;
  rating?: number | null;
  sold?: number | null;
  discount_percent?: number | null;
};

export default function TopDealsSection({
  title = "Top deal • Siêu rẻ",
  perPage = 10,
}: {
  title?: string;
  perPage?: number;
}) {
  const [items, setItems] = React.useState<ProductHotDeal[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const API = (process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:4000").replace(/\/$/, "");
  const url = `${API}/api/sanphams-selection?selection=hot_sales&per_page=${perPage}`;

  // track/slide layout (transform-based carousel)
  const HEADER_LEFT = 18;
  const HEADER_WIDTH = 334; // header image size you confirmed
  const HEADER_SPACING = 35;
  const HEADER_MARGIN_LEFT = HEADER_LEFT + HEADER_WIDTH + HEADER_SPACING; // space between header and slides
  const PRODUCT_TOP_OFFSET = 35; //khoảng cách từ header đến sản phẩm
  const SLIDE_WIDTH = 236; // px per slide (matches screenshot inspector)
  const SLIDE_GAP = 16;
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState<number>(0);
  const autoplayRef = React.useRef<number | null>(null);
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
        const res = (await r.json()) as unknown;
        if (!alive) return;

        // Robust parsing: handle multiple payload shapes returned by mock
        const tryExtract = (payload: unknown): ProductHotDeal[] => {
          if (!payload) return [];
          if (Array.isArray(payload)) return payload as ProductHotDeal[];

          if (typeof payload === "object" && payload !== null) {
            const obj = payload as Record<string, unknown>;
            if (Array.isArray(obj.data)) return obj.data as ProductHotDeal[];
            if (typeof obj.data === "object" && obj.data !== null) {
              const dataObj = obj.data as Record<string, unknown>;
              if (Array.isArray(dataObj.original)) return dataObj.original as ProductHotDeal[];
            }
            if (Array.isArray(obj.rows)) return obj.rows as ProductHotDeal[];
          }
          return [];
        };

        let parsed = tryExtract(res);

        // fallback: try direct db resource if nothing found
        if (parsed.length === 0) {
          try {
            const fb = await fetch(`${API}/api_sanphams_selection_hot_sales?_limit=${perPage}`, { cache: "no-store" });
            const fbj = (await fb.json()) as unknown;
            if (Array.isArray(fbj)) parsed = fbj as ProductHotDeal[];
            else if (typeof fbj === "object" && fbj !== null) {
              const obj = fbj as Record<string, unknown>;
              if (Array.isArray(obj.data)) parsed = obj.data as ProductHotDeal[];
              else if (typeof obj.data === "object" && obj.data !== null) {
                const d = obj.data as Record<string, unknown>;
                if (Array.isArray(d.original)) parsed = d.original as ProductHotDeal[];
              }
            }
          } catch {
            // ignore
          }
        }

        setItems(parsed.slice(0, perPage));
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [url]);

  // autoplay (advance index), pause on hover
  React.useEffect(() => {
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (isHover || items.length === 0) return;
        setIndex((i) => (i + 1) % items.length);
      }, 3000);
    };
    const stop = () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
    start();
    return stop;
  }, [items.length, isHover]);

  // Keep index within bounds after items change
  React.useEffect(() => {
    if (index >= items.length && items.length > 0) setIndex(0);
  }, [items.length, index]);

  const prev = () => {
    setIndex((i) => (i - 1 + items.length) % (items.length || 1));
  };
  const next = () => {
    setIndex((i) => (i + 1) % (items.length || 1));
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.onerror = null;
    img.src = "/assets/images/thumbs/placeholder.png";
  };

  const navigateTo = (href: string) => {
    if (!href) return;
    try {
      if (href.startsWith("http")) window.location.href = href;
      else window.location.assign(href);
    } catch {
      window.location.href = href;
    }
  };

  // compute transform/width for track
  const slideTotal = SLIDE_WIDTH + SLIDE_GAP;
  const trackWidth = Math.max(0, items.length * slideTotal) - SLIDE_GAP; // last gap removed
  const translateX = Math.min(Math.max(0, index * slideTotal), Math.max(0, trackWidth - slideTotal * 1)); // keep bounds

  return (
    <section className="pt-24 mt-16 overflow-hidden">
      <div className="container container-lg">
        <div
          className="p-12 p-md-20 rounded-20 position-relative"
          style={{
            background: "linear-gradient(90deg,#f2572b 0%,#ff6b3c 100%)",
            overflow: "hidden",
          }}
        >
          {/* decorative header image at top-left */}
          <Image
            src="/assets/images/thumbs/top-deal-sieu-re.png"
            alt="Top deal"
            width={334}
            height={60}
            priority
            style={{
              position: "absolute",
              left: 18,
              top: 18,
              objectFit: "contain",
              opacity: 1,
              pointerEvents: "none",
            }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null;
              img.style.display = "none";
            }}
          />

          {/* controls (no title text) */}
          <div className="mb-8 mb-md-12 section-heading" style={{ marginLeft: HEADER_MARGIN_LEFT }}>
            <div className="flex-wrap gap-8 flex-between align-items-center">
              <div /> {/* spacer */}
              <div className="gap-16 flex-align">
                <Link href={`/products?source=hot_sales&per_page=${perPage}`} className="text-sm text-white fw-semibold hover-text-decoration-underline">
                  Xem tất cả
                </Link>
                <div className="gap-8 flex-align ms-8">
                  <button
                    type="button"
                    onClick={prev}
                    className="text-white bg-transparent w-36 h-36 rounded-circle flex-center"
                    style={{ border: "1px solid rgba(255,255,255,.6)" }}
                    aria-label="Previous slide"
                  >
                    <i className="ph ph-caret-left" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="text-white bg-transparent w-36 h-36 rounded-circle flex-center"
                    style={{ border: "1px solid rgba(255,255,255,.6)" }}
                    aria-label="Next slide"
                  >
                    <i className="ph ph-caret-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-white" style={{ marginLeft: HEADER_MARGIN_LEFT }}>
              Đang tải…
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-white" style={{ marginLeft: HEADER_MARGIN_LEFT }}>
              Không có sản phẩm.
            </div>
          ) : (
            <div
              style={{
                marginLeft: 15, //điểm sản phẩm chạy tới sát với header
                marginTop: PRODUCT_TOP_OFFSET,
                overflow: "hidden",
                position: "relative",
                paddingBottom: 6,
              }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {/* track (wide image strip) */}
              <div
                ref={trackRef}
                role="list"
                style={{
                  width: trackWidth,
                  display: "flex",
                  gap: `${SLIDE_GAP}px`,
                  transform: `translate3d(-${translateX}px, 0, 0)`,
                  transition: "transform 600ms cubic-bezier(.22,.9,.36,1)",
                  willChange: "transform",
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") next();
                  if (e.key === "ArrowLeft") prev();
                }}
              >
                {items.map((product, idx) => {
                  const image =
                    product?.mediaurl && typeof product.mediaurl === "string"
                      ? product.mediaurl.startsWith("http")
                        ? product.mediaurl
                        : `${API}/${product.mediaurl.replace(/^\/+/, "")}`
                      : "/assets/images/thumbs/placeholder.png";
                  const name = product?.ten ?? "(Không có tên)";
                  const shop = product?.shop_name ?? "Cửa hàng";
                  const rating = product?.rating ?? null;
                  const sold = product?.sold ?? 0;
                  const originalPrice = product?.original_price ?? 0;
                  const price = product?.selling_price ?? 0;
                  const href = product?.slug ? `/product-details-two?slug=${encodeURIComponent(String(product.slug))}` : `/product-details-two?slug=${String(product?.id ?? "")}`;
                  const discount =
                    product?.discount_percent ?? (originalPrice ? Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100)) : 0);

                  return (
                    <div
                      key={String(product.id)}
                      role="listitem"
                      aria-label={`${name}`}
                      style={{
                        width: SLIDE_WIDTH,
                        minWidth: SLIDE_WIDTH,
                        boxSizing: "border-box",
                        flex: "0 0 auto",
                      }}
                    >
                      <div className="bg-white product-card hover-card-shadows rounded-10 position-relative transition-2" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => navigateTo(href)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") navigateTo(href);
                          }}
                          className="thumbhover flex-center rounded-10 position-relative bg-gray-50 w-100"
                          aria-label={name}
                          style={{ height: 260, overflow: "hidden" }}
                        >
                          <span className="px-8 py-4 text-sm text-white product-card__badge bg-main-600 position-absolute inset-inline-start-0 inset-block-start-0 rounded-tl-10 rounded-br-10">
                            Giảm {discount}%
                          </span>
                          {/* image fills entire slide area (width 100%) */}
                          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={handleImgError} />
                        </div>

                        <div className="px-12 pb-12 mt-4 product-card__content w-100" style={{ flex: "1 0 auto" }}>
                          <div className="mt-2 flex-align justify-content-between">
                            <div className="gap-4 flex-align w-100">
                              <span className="text-main-600 text-md d-flex">
                                <i className="ph-fill ph-storefront" />
                              </span>
                              <span className="text-xs text-gray-500 text-truncate" title={shop}>
                                {shop}
                              </span>
                            </div>
                          </div>

                          <h6 className="mt-6 mb-6 text-md title fw-semibold">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => navigateTo(href)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") navigateTo(href);
                              }}
                              className="link text-line-2"
                            >
                              {name}
                            </div>
                          </h6>

                          <div className="flex-wrap mt-2 flex-align justify-content-between">
                            <div className="gap-6 flex-align">
                              <span className="text-xs text-gray-500 fw-medium">Đánh giá</span>
                              <span className="text-xs text-gray-500 fw-medium">
                                {rating === null ? "N/A" : String(rating)}
                                {rating !== null && <i className="ph-fill ph-star text-warning-600 ms-1" />}
                              </span>
                            </div>
                            <div className="gap-4 flex-align">
                              <span className="text-xs text-gray-500 fw-medium">Đã bán</span>
                              <span className="text-xs text-gray-500 fw-medium">{sold}</span>
                            </div>
                          </div>

                          <div className="mt-6 product-card__price">
                            {originalPrice ? (
                              <span className="text-xs text-gray-400 fw-semibold text-decoration-line-through me-2">
                                {originalPrice.toLocaleString("vi-VN")} ₫
                              </span>
                            ) : null}
                            <span className="text-heading text-md fw-semibold">{price.toLocaleString("vi-VN")} ₫</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}