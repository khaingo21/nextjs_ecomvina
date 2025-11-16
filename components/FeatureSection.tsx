"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ==== Swiper ====
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// ==== Kiểu dữ liệu khớp API danh mục ====
type Category = {
  id: number;
  ten: string;
  slug: string;
  media?: string | null;
};

// (no image helper needed; we render text inside circle)

export default function FeatureSection() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ref để control Swiper trực tiếp
  const swiperRef = useRef<any>(null);

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

  // Luôn hiển thị đủ 10 mục: nếu API trả ít hơn thì pad bằng placeholder
  const targetCount = 10;
  const placeholders = [
    "Vegetables", "Fish & Meats", "Desserts", "Drinks & Juice",
    "Animals Food", "Fresh Fruits", "Yummy Candy", "Dairy & Eggs",
    "Snacks", "Beverages",
  ];
  // Map tên placeholder sang ảnh riêng
  const placeholderImages: Record<string, string> = {
    "Vegetables": "/assets/images/categories/bach-hoa.svg",
    "Fish & Meats": "/assets/images/categories/cham-soc-ca-nhan.svg",
    "Desserts": "/assets/images/categories/dien-may.svg",
    "Drinks & Juice": "/assets/images/categories/lam-dep.svg",
    "Animals Food": "/assets/images/categories/me-va-be.svg",
    "Fresh Fruits": "/assets/images/categories/noi-that-trang-tri.svg",
    "Yummy Candy": "/assets/images/categories/suc-khoe.svg",
    "Dairy & Eggs": "/assets/images/categories/thiet-bi-y-te.svg",
    "Snacks": "/assets/images/categories/thoi-trang.svg",
    "Beverages": "/assets/images/categories/thuc-pham-chuc-nang.svg",
    "Other": "/assets/images/categories/thuc-pham-do-an.svg",
  };
  const fillCount = Math.max(0, targetCount - items.length);
  const displayItems: Category[] =
    fillCount === 0
      ? items
      : items.concat(
        Array.from({ length: fillCount }).map((_, i) => ({
          id: -1 - i,
          ten: placeholders[i % placeholders.length],
          slug: placeholders[i % placeholders.length].toLowerCase().replace(/\s+/g, "-"),
          media: placeholderImages[placeholders[i % placeholders.length]],
        }))
      );

  return (
    <div className="feature" id="featureSection" style={{ marginTop: 8, marginBottom: 4 }}>
      <div className="container container-lg">
        <div className="position-relative" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 1200, position: 'relative' }} className="ftr-swiper-container">
            {/* Arrows overlay - click để chuyển slide */}
            {displayItems.length > 3 && (
              <>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="ftr-arrow ftr-arrow-left"
                  aria-label="Prev"
                >
                  <i className="ph ph-caret-left"></i>
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="ftr-arrow ftr-arrow-right"
                  aria-label="Next"
                >
                  <i className="ph ph-caret-right"></i>
                </button>
              </>
            )}
            <Swiper
              modules={[Autoplay]}
              ref={(node) => { if (node) swiperRef.current = node; }}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={true}
              speed={500}
              spaceBetween={16}
              breakpoints={{
                "0": { slidesPerView: 4, spaceBetween: 8 },
                "480": { slidesPerView: 5, spaceBetween: 8 },
                "640": { slidesPerView: 6, spaceBetween: 12 },
                "768": { slidesPerView: 8, spaceBetween: 16 },
                "1024": { slidesPerView: 10, spaceBetween: 20 },
              }}
              className="ftr-swiper"
            >
              {displayItems.map((c) => {
                const href = `/products?category=${encodeURIComponent(c.slug)}&filter=trending`;
                let img = c.media || "/assets/images/thumbs/product-two-img1.png";
                if (c.ten === "Máy massage") {
                  img = "/assets/images/categories/thuc-pham-chuc-nang.svg";
                }
                if (c.ten === "Điện gia dụng") {
                  img = "/assets/images/categories/thuc-pham-do-an.svg";
                }
                if (c.ten === "Mẹ & Bé") {
                  img = "/assets/images/categories/thoi-trang.svg";
                }
                return (
                  <SwiperSlide key={c.id}>
                    <div className="text-center feature-item">
                      <Link href={href} className="d-inline-block">
                        <div className="feature-item__thumb rounded-circle" style={{ background: "#e9f7ee", width: 64, height: 64, margin: "0 auto", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <Image src={img} alt={c.ten} width={36} height={36} style={{ objectFit: "contain" }} unoptimized />
                          </div>
                        </div>
                      </Link>
                      <div className="mt-8 feature-item__content">
                        <h6 className="mb-4 text-md fw-semibold" style={{ fontSize: 12, lineHeight: 1.2 }}>
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
      <style jsx global>{`
        .ftr-swiper .feature-item { opacity: 1; display: flex; flex-direction: column; align-items: center; width: 80px; }
        .ftr-swiper .feature-item__thumb { width: 48px !important; height: 48px !important; margin-bottom: 4px; }
        .ftr-swiper .feature-item__content h6 { margin: 0; font-weight: 700; color: #0f172a; font-size: 12px !important; line-height: 1.2; text-align: center; }
        .ftr-swiper { gap: 32px !important; }
        .ftr-swiper-container .ftr-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          z-index: 10;
          border: none;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ftr-swiper-container:hover .ftr-arrow {
          opacity: 1;
        }
        .ftr-arrow-left {
          left: -32px;
        }
        .ftr-arrow-right {
          right: -32px;
        }
        .ftr-arrow:hover {
          background: #ff9800;
          color: #fff;
        }
        @media (min-width: 1024px) {
          .ftr-swiper .feature-item { width: 80px; }
          .ftr-swiper .feature-item__content h6 { font-size: 13px !important; }
        }
      `}</style>
    </div>
  );
}
