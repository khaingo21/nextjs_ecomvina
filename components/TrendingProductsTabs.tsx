"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper/types";

/** =========================
 *  Types (đổi cho khớp API của bạn)
 *  ========================= */
type Tab = { id: string; label: string };
type UIProduct = {
  id: number | string;
  name: string;
  href: string;
  image: string;
  price?: number | null;
  before?: number | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
};

/** =========================
 *  Component
 *  ========================= */
export default function TrendingProductsTabs() {
  /** ====== A) Lấy dữ liệu tabs + items theo tab ======
   *  TH1 (gợi ý): nếu bạn đã có code fetch sẵn, chỉ cần:
   *   - setTabs([...])
   *   - setItemsByTab({[tabId]: UIProduct[]})
   *
   *  TH2: Bản demo dưới đây tạo dữ liệu giả để bạn copy-paste chạy ngay.
   */
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [itemsByTab, setItemsByTab] = useState<Record<string, UIProduct[]>>({});
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // TODO: thay bằng fetch thực tế của bạn
    const mockTabs: Tab[] = [
      { id: "trend", label: "Xu hướng" },
      { id: "sale", label: "Giảm giá" },
      { id: "fresh", label: "Hàng mới" },
    ];
    const demoItems = (prefix: string): UIProduct[] =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `${prefix}-${i + 1}`,
        name: `${prefix} Product ${i + 1}`,
        href: `/product/${prefix}-${i + 1}`,
        image: "/assets/images/thumbs/product-two-img2.png",
        price: 199000 + i * 10000,
        before: i % 2 ? 249000 + i * 10000 : null,
        ratingAvg: 4.3,
        ratingCount: 120 + i,
      }));

    setTabs(mockTabs);
    setItemsByTab({
      trend: demoItems("trend"),
      sale: demoItems("sale"),
      fresh: demoItems("fresh"),
    });
    setActive("trend");
  }, []);

  /** ====== B) Chuẩn bị dữ liệu của tab đang chọn ====== */
  const currentItems = useMemo(() => itemsByTab[active] ?? [], [itemsByTab, active]);

  /** ====== C) Swiper refs cho tab hiện tại (không any) ====== */
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  // Gắn navigation mỗi khi items/tab thay đổi
  useEffect(() => {
    const s = swiperRef.current;
    if (!s) return;
    if (typeof s.params.navigation === "object") {
      s.params.navigation.prevEl = prevRef.current;
      s.params.navigation.nextEl = nextRef.current;
      s.navigation.init();
      s.navigation.update();
    }
  }, [active, currentItems.length]);

  return (
    <section className="pt-40">
      <div className="container container-lg">
        {/* Header + Tabs */}
        <div className="flex-wrap gap-12 mb-16 section-heading flex-between">
          <h6 className="m-0">
            <i className="ph-bold ph-trend-up text-main-600" /> Đang thịnh hành
          </h6>

          <div className="flex items-center gap-8 tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`px-12 py-8 rounded-8 text-sm fw-semibold ${
                  active === t.id ? "bg-main-50 text-main-700" : "bg-transparent text-gray-700"
                }`}
                aria-pressed={active === t.id}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}

            {/* Prev/Next for current tab */}
            <div className="flex items-center gap-8 ms-8">
              <button
                ref={prevRef}
                type="button"
                aria-label="Prev"
                className="text-xl border border-gray-200 rounded-full w-36 h-36 flex-center hover:bg-neutral-600 hover:text-white"
              >
                <i className="ph ph-caret-left" />
              </button>
              <button
                ref={nextRef}
                type="button"
                aria-label="Next"
                className="text-xl border border-gray-200 rounded-full w-36 h-36 flex-center hover:bg-neutral-600 hover:text-white"
              >
                <i className="ph ph-caret-right" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Panel — Swiper theo tab */}
        {currentItems.length === 0 ? (
          <div className="p-16 text-gray-600">Không có sản phẩm.</div>
        ) : (
          <Swiper
            key={active} // đổi tab -> remount cho sạch state
            modules={[Autoplay, Navigation]}
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            navigation
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={currentItems.length > 4}
            speed={500}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="trending-tabs-swiper"
          >
            {currentItems.map((p) => (
              <SwiperSlide key={p.id}>
                <article className="p-16 border border-gray-100 rounded-12 hover-border-main-600 transition-2 h-100">
                  <Link
                    href={p.href}
                    className="block overflow-hidden bg-gray-50 rounded-8 flex-center"
                    style={{ height: 180 }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={220}
                      height={180}
                      className="object-contain w-auto h-full"
                      unoptimized={/^https?:\/\//.test(p.image)}
                    />
                  </Link>

                  <h6 className="mt-12 mb-6 text-md fw-semibold line-clamp-2">
                    <Link href={p.href} className="link">
                      {p.name}
                    </Link>
                  </h6>

                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <span>{p.ratingAvg ?? "—"}</span>
                    <span className="text-warning-600 d-flex">
                      <i className="ph-fill ph-star" />
                    </span>
                    <span>({p.ratingCount ?? 0})</span>
                  </div>

                  <div className="mt-10">
                    {typeof p.before === "number" && typeof p.price === "number" && p.before > p.price ? (
                      <>
                        <span className="text-xs text-gray-400 line-through fw-semibold">
                          {p.before.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="ms-8 text-heading fw-semibold">
                          {p.price.toLocaleString("vi-VN")} đ
                        </span>
                      </>
                    ) : (
                      <span className="text-heading fw-semibold">
                        {p.price != null ? `${p.price.toLocaleString("vi-VN")} đ` : "Liên hệ"}
                      </span>
                    )}
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
