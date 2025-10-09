"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type Gia = { current: number; before_discount: number | string | null; discount_percent: number };
type Rating = { average: number; count: number };
type Store = { name: string; icon_url?: string | null };
type Prod = {
  id: number;
  ten: string;
  slug: string;
  mediaurl?: string | null;
  gia?: Gia;
  rating?: Rating;
  store?: Store;
};

export default function FeaturedProductsSection() {
  const [items, setItems] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
  const viewAllHref = "/products?source=best_products&sort=popular";

  useEffect(() => {
    (async () => {
      try {
        // Tránh fetch khi chạy trực tiếp file:// (mở file build từ ổ đĩa)
        if (typeof window !== "undefined" && window.location.protocol === "file:") {
          console.warn("Skip fetch on file:// protocol. Set NEXT_PUBLIC_SERVER_API hoặc chạy Next server.");
          setItems([]);
          return;
        }

        // Chuẩn hoá URL và thêm timeout an toàn
        const base = (API || "").replace(/\/$/, "");
        const url = `${base}/api/sanphams-selection?selection=best_products&per_page=8`;
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000); // 10s

        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          mode: "cors",
          signal: ctrl.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); // { status, message, data: Prod[] }
        setItems(Array.isArray(json?.data) ? json.data : []);
      } catch (e) {
        console.error("Fetch best_products failed", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [API]);

  const fmt = (n?: number | string | null) =>
    typeof n === "number"
      ? n.toLocaleString("vi-VN")
      : typeof n === "string"
      ? Number(n).toLocaleString("vi-VN")
      : null;

  const grid = items.slice(0, 4); // hiển thị 4 ô trái giống layout cũ

  return (
    <section className="overflow-hidden featured-products py-80">
      <div className="container">
        <div className="row g-4">
          {/* Left: product grid in bordered box */}
          <div className="col-xxl-8">
            <div className="p-24 border border-gray-100 rounded-16 h-100">
              <div className="mb-24 section-heading">
                <div className="flex-wrap gap-8 flex-between">
                  <h6 className="mb-0">
                    <i className="ph-bold ph-package text-main-600"></i> Sản phẩm hàng đầu
                  </h6>
                  <div className="gap-16 flex-align">
                    <a
                      href={viewAllHref}
                      className="text-sm text-gray-700 fw-medium hover-text-main-600 hover-text-decoration-underline"
                    >
                      Xem đầy đủ
                    </a>
                    <div className="gap-8 flex-align">
                      <button
                        type="button"
                        id="featured-products-prev"
                        className="text-xl border border-gray-100 slick-prev slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                      >
                        <i className="ph ph-caret-left"></i>
                      </button>
                      <button
                        type="button"
                        id="featured-products-next"
                        className="text-xl border border-gray-100 slick-next slick-arrow flex-center rounded-circle hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                      >
                        <i className="ph ph-caret-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {loading && <div className="p-12 text-gray-600">Đang tải...</div>}

              {!loading && (
                <div className="row g-3">
                  {grid.map((p, i) => {
                    const price = p.gia?.current ?? null;
                    const before = p.gia?.before_discount ?? null;
                    const hasDiscount =
                      (typeof p.gia?.discount_percent === "number" && p.gia.discount_percent > 0) ||
                      (typeof before === "number" && typeof price === "number" && before > price);
                    const img = p.mediaurl || "/assets/images/thumbs/product-two-img2.png";
                    const external = /^https?:\/\//i.test(img);

                    return (
                      <div className="col-md-6" key={p.id}>
                        <div className="gap-16 p-16 border border-gray-100 product-card d-flex hover-border-main-600 rounded-16 position-relative transition-2">
                          <a
                            href={`/product/${p.slug || p.id}`}
                            className="flex-shrink-0 p-24 product-card__thumb flex-center h-unset rounded-8 position-relative w-unset"
                          >
                            {hasDiscount && (
                              <span className="px-8 py-4 text-sm text-white product-card__badge bg-primary-600 position-absolute inset-inline-start-0 inset-block-start-0">
                                Best Sale
                              </span>
                            )}
                            <Image
                              src={img}
                              alt={p.ten}
                              width={180}
                              height={180}
                              unoptimized={external} // khỏi cần cấu hình images.domains
                            />
                          </a>

                          <div className="my-20 product-card__content w-100 flex-grow-1">
                            <h6 className="mb-12 text-lg title fw-semibold">
                              <a href={`/product/${p.slug || p.id}`} className="link text-line-2">
                                {p.ten}
                              </a>
                            </h6>

                            <div className="gap-6 mb-12 flex-align">
                              <span className="text-xs text-gray-500 fw-medium">
                                {p.rating?.average ?? "—"}
                              </span>
                              <span className="text-xs fw-medium text-warning-600 d-flex">
                                <i className="ph-fill ph-star"></i>
                              </span>
                              <span className="text-xs text-gray-500 fw-medium">
                                ({p.rating?.count ?? 0})
                              </span>
                            </div>

                            <div className="gap-4 flex-align">
                              <span className="text-main-two-600 text-md d-flex">
                                <i className="ph-fill ph-storefront"></i>
                              </span>
                              <span className="text-xs text-gray-500">
                                By {p.store?.name ?? "—"}
                              </span>
                            </div>

                            <div className="my-20 product-card__price">
                              {hasDiscount && before ? (
                                <>
                                  <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                    {fmt(before)} đ
                                  </span>
                                  <span className="text-heading text-md fw-semibold ms-8">
                                    {fmt(price)} đ <span className="text-gray-500 fw-normal">/Qty</span>
                                  </span>
                                </>
                              ) : (
                                <span className="text-heading text-md fw-semibold">
                                  {fmt(price) ?? "Liên hệ"}{" "}
                                  <span className="text-gray-500 fw-normal">/Qty</span>
                                </span>
                              )}
                            </div>

                            <a
                              href="/cart"
                              className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium"
                            >
                              Add To Cart <i className="ph ph-shopping-cart"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Banner phải giữ nguyên */}
          <div className="col-xxl-4">
            {/* ... banner như cũ  */}
          </div>
        </div>
      </div>
    </section>
  );
}
