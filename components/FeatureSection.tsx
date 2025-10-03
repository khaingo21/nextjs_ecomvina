"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ==== Kiểu dữ liệu khớp API danh mục ====
type Category = {
  id: number;
  ten: string;
  slug: string;
  media?: string | null; // có thể rỗng -> dùng ảnh mặc định
};

// ==== Helper ảnh danh mục ====
const buildCategoryImage = (api: string, media?: string | null) => {
  // Nếu backend trả full URL thì cứ trả về media
  if (media && /^https?:\/\//i.test(media)) return media;
  // Nếu chỉ là tên file -> đoán đường dẫn storage; nếu khác, chỉnh lại theo server của bạn
  if (media && media.trim()) return `${api}/storage/${media}`;
  // Ảnh mặc định khi không có media
  return "/assets/images/thumbs/default-danhmuc.png";
};

export default function FeatureSection() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const url = `${API}/api/danhmucs-selection?per_page=10`; // theo spec
    fetch(url, { headers: { Accept: "application/json" } })
      .then(r => r.json())
      .then(res => {
        if (!alive) return;
        // API có thể trả {data: []} hoặc {data: {data: []}} tuỳ paginate
        const data: Category[] = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [API]);

  return (
    <div className="feature" id="featureSection" style={{ marginTop: 50 }}>
      <div className="container container-lg">
        <div className="position-relative arrow-center">
          {/* Giữ nguyên ID 2 nút để slick hiện có của bạn bắt được */}
          <div className="flex-align">
            <button
              type="button"
              id="feature-item-wrapper-prev"
              className="text-xl bg-white slick-prev slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-left"></i>
            </button>
            <button
              type="button"
              id="feature-item-wrapper-next"
              className="text-xl bg-white slick-next slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-right"></i>
            </button>
          </div>

          <div className="feature-item-wrapper">
            {loading && (
              // skeleton đơn giản
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`sk-${i}`} className="text-center feature-item">
                  <div className="bg-gray-100 feature-item__thumb rounded-circle" style={{ width: 120, height: 120 }} />
                  <div className="mt-16 feature-item__content">
                    <div className="w-24 h-16 mx-auto bg-gray-100 rounded" />
                  </div>
                </div>
              ))
            )}

            {!loading &&
              items.map((c) => {
                const img = buildCategoryImage(API, c.media);
                // Trang tổng hợp: lọc theo danh mục → filter=trending (đúng đặc tả “ưu tiên xem/mua cao”)
                const href = `/products?category=${encodeURIComponent(c.slug)}&filter=trending`;
                return (
                  <div className="text-center feature-item wow bounceIn" data-aos="fade-up" key={c.id}>
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
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
