"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ==== Swiper ====
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// ==== Kiểu dữ liệu khớp API danh mục ====
type Category = {
  id: number;
  ten: string;
  slug: string;
  media?: string | null;
};

// ==== Helper ảnh danh mục ====
const buildCategoryImage = (api: string, media?: string | null) => {
  if (media && /^https?:\/\//i.test(media)) return media;
  if (media && media.trim()) return `${api.replace(/\/$/, "")}/storage/${media.replace(/^\/+/, "")}`;
  return "/assets/images/thumbs/default-danhmuc.png";
};

export default function FeatureSection() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // refs cho nút điều hướng custom của Swiper
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let alive = true;

    const url = `${API}/api/danhmucs-selection?per_page=10`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        const data: Category[] = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [API]);

  if (loading) {
    // skeleton đơn giản khi đang tải
    return (
      <div className="feature" id="featureSection" style={{ marginTop: 50 }}>
        <div className="container container-lg">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`} className="text-center feature-item">
                <div className="bg-gray-100 rounded-full feature-item__thumb" style={{ width: 120, height: 120, margin: "0 auto" }} />
                <div className="mt-16 feature-item__content">
                  <div className="w-24 h-4 mx-auto bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="feature" id="featureSection" style={{ marginTop: 50 }}>
      <div className="container container-lg">
        <div className="position-relative arrow-center">
          {/* Nút điều hướng custom (thay vì id slick, ta dùng ref cho Swiper) */}
          <div className="flex-align">
            <button
              type="button"
              ref={prevRef}
              className="text-xl bg-white flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
              aria-label="Prev"
            >
              <i className="ph ph-caret-left"></i>
            </button>
            <button
              type="button"
              ref={nextRef}
              className="text-xl bg-white flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
              aria-label="Next"
            >
              <i className="ph ph-caret-right"></i>
            </button>
          </div>

          {/* Swiper thay cho .feature-item-wrapper + slick */}
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={items.length > 6}
            speed={500}
            spaceBetween={16}
            // gắn custom prev/next
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // gắn ref trước khi init
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (swiper.params.navigation as any).prevEl = prevRef.current;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (swiper.params.navigation as any).nextEl = nextRef.current;
            }}
            // giống responsive của slick: 2-3-6 item
            breakpoints={{
              0: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
            className="feature-item-wrapper"
          >
            {items.map((c) => {
              const img = buildCategoryImage(API, c.media);
              const href = `/products?category=${encodeURIComponent(c.slug)}&filter=trending`;
              return (
                <SwiperSlide key={c.id}>
                  <div className="text-center feature-item wow bounceIn" data-aos="fade-up">
                    <div className="feature-item__thumb rounded-circle">
                      <Link href={href} className="p-10 w-100 h-100 flex-center">
                        <Image
                          src={img}
                          alt={c.ten}
                          width={120}
                          height={120}
                          className="object-cover rounded-circle"
                        />
                      </Link>
                    </div>
                    <div className="mt-16 feature-item__content">
                      <h6 className="mb-8 text-md">
                        <Link href={href} className="text-inherit">
                          {c.ten}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
