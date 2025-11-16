"use client";

import React from "react";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";




type ApiBanner = {
  id: number;
  vitri?: string | null;      // "HomeBannerSlider" | "ProdudctBanner-2..5"
  hinhanh?: string | null;
  duongdan?: string | null;
  tieude?: string | null;
  trangthai?: string | null;  // "hoat_dong" | ...
  thutu?: number | null;
};
type ApiResponse<T> = T[] | { data: T[] };

type Banner = {
  id: number;
  vitri?: string;
  hinhanh: string;
  duongdan?: string | null;
  tieude?: string | null;
  trangthai?: string | null;
  thutu?: number | null;
};

const FALLBACK_IMG = "/assets/images/bg/shopee-06.jpg";

const POS = {
  HOME: "HomeBannerSlider",
  B2: "ProdudctBanner-2",
  B3: "ProdudctBanner-3",
  B4: "ProdudctBanner-4",
  B5: "ProdudctBanner-5",
} as const;

const isApiBannerArray = (v: unknown): v is ApiBanner[] =>
  Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && "id" in x);

function pickArrayFromResponse(res: ApiResponse<ApiBanner> | unknown): ApiBanner[] {
  if (isApiBannerArray(res)) return res;
  if (typeof res === "object" && res !== null && "data" in res) {
    const data = (res as { data: unknown }).data;
    if (isApiBannerArray(data)) return data;
  }
  return [];
}

function normalizeBanner(b: ApiBanner): Banner | null {
  if (!Number.isFinite(b.id)) return null;
  const img = b.hinhanh && b.hinhanh.trim() ? b.hinhanh : FALLBACK_IMG;
  return {
    id: b.id,
    vitri: b.vitri ?? undefined,
    hinhanh: img,
    duongdan: b.duongdan ?? "#",
    tieude: b.tieude ?? "Banner",
    trangthai: b.trangthai ?? null,
    thutu: typeof b.thutu === "number" ? b.thutu : null,
  };
}

const buildImgUrl = (apiBase: string, file: string) => {
  if (/^https?:\/\//i.test(file) || file.startsWith("/")) return file;
  return `${apiBase.replace(/\/$/, "")}/${file.replace(/^\/+/, "")}`;
};

export default function BannerTwo() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";

  const [loading, setLoading] = React.useState(true);
  const [homeSlides, setHomeSlides] = React.useState<Banner[]>([]);
  const [sideBoxes, setSideBoxes] = React.useState<Banner[]>([]); // đúng 4 ô

  // refs cho prev/next và swiper instance
  const prevRef = React.useRef<HTMLButtonElement | null>(null);
  const nextRef = React.useRef<HTMLButtonElement | null>(null);
  const swiperRef = React.useRef<SwiperType | null>(null);

  React.useEffect(() => {
    let alive = true;

    const sortByOrder = (a: Banner, b: Banner) =>
      (a.thutu ?? 9999) - (b.thutu ?? 9999) || a.id - b.id;

    // Add cache-busting parameter để tránh cache
    const timestamp = new Date().getTime();
    fetch(`${API}/api/bannerquangcaos?_t=${timestamp}`, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    })
      .then((r) => r.json() as Promise<ApiResponse<ApiBanner> | unknown>)
      .then((res) => {
        if (!alive) return;

        const raw = pickArrayFromResponse(res)
          .map(normalizeBanner)
          .filter((x): x is Banner => x !== null)
          .filter((b) => !b.trangthai || b.trangthai === "hoat_dong");

        // Tách theo "vitri" như backend quy định
        const home = raw.filter((b) => b.vitri === POS.HOME).sort(sortByOrder);

        const wantedOrder = [POS.B2, POS.B3, POS.B4, POS.B5];
        const sidesPicked: Banner[] = [];

        for (const key of wantedOrder) {
          const found = raw.find((b) => b.vitri === key);
          if (found) sidesPicked.push(found);
        }

        // Fallback: nếu thiếu ô bên phải, bổ sung những banner còn lại (không trùng)
        if (sidesPicked.length < 4) {
          const used = new Set<number>([
            ...home.map((x) => x.id),
            ...sidesPicked.map((x) => x.id),
          ]);
          const rest = raw.filter((b) => !used.has(b.id)).sort(sortByOrder);
          for (const x of rest) {
            if (sidesPicked.length >= 4) break;
            sidesPicked.push(x);
          }
        }

        // Chỉ hiển thị banner HomeBannerSlider, không fallback
        setHomeSlides(home);
        setSideBoxes(sidesPicked.slice(0, 4));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [API]);

  if (loading) return null;

  // Chia 4 ô nhỏ thành 2 cột
  const sideCol1 = sideBoxes.slice(0, 2);
  const sideCol2 = sideBoxes.slice(2, 4);

  return (
    <div className="banner-two">
      <div className="container container-lg">
        <div className="row g-12">
          {/* Trái: Slider lớn */}
          <div className="col-lg-6">
            <div className="banner-two-wrapper d-flex align-items-start">
              <div className="mt-12 mb-0 overflow-hidden banner-item-two-wrapper rounded-5 position-relative flex-grow-1 ms-0">
                {/* Prev/Next custom */}
                <button
                  type="button"
                  ref={prevRef}
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-40 h-40 text-xl bg-white rounded-circle flex-center hover-bg-main-600 hover-text-white transition-1 position-absolute top-50 translate-middle-y start-0 ms-8"
                  aria-label="Previous slide"
                  style={{ zIndex: 10 }}
                >
                  <i className="ph-bold ph-caret-left" />
                </button>
                <button
                  type="button"
                  ref={nextRef}
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-40 h-40 text-xl bg-white rounded-circle flex-center hover-bg-main-600 hover-text-white transition-1 position-absolute top-50 translate-middle-y end-0 me-8"
                  aria-label="Next slide"
                  style={{ zIndex: 10 }}
                >
                  <i className="ph-bold ph-caret-right" />
                </button>

                <Swiper
                  modules={[Autoplay, Pagination, Navigation, EffectFade]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={homeSlides.length > 1}
                  effect="fade"
                  speed={600}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation={false}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  className="banner-item-two__slider"
                  style={{ paddingBottom: 0 }}
                >
                  {homeSlides.map((b) => {
                    const img = buildImgUrl(API, b.hinhanh);
                    const href = b.duongdan || "#";
                    const alt = b.tieude || "Banner";
                    return (
                      <SwiperSlide key={`main-${b.id}`}>
                        <a href={href} className="d-block">
                          {/* PC */}
                          <Image
                            src={img}
                            alt={alt}
                            width={1600}
                            height={500}
                            className="d-lg-block d-none rounded-5"
                            style={{
                              width: "100%",
                              height: "340px",
                              objectFit: "cover",
                            }}
                            unoptimized
                          />
                          {/* Mobile */}
                          <Image
                            src={img}
                            alt={alt}
                            width={800}
                            height={300}
                            className="d-block d-lg-none rounded-5"
                            style={{
                              width: "100%",
                              height: "300px",
                              objectFit: "cover",
                            }}
                            unoptimized
                          />
                        </a>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Phải: 4 ô nhỏ */}
          <div className="px-10 mt-20 col-lg-3 col-sm-3">
            {sideCol1.map((b, idx) => {
              const img = buildImgUrl(API, b.hinhanh);
              const href = b.duongdan || "#";
              const alt = b.tieude || "Banner";
              return (
                <div key={`s1-${b.id}-${idx}`} className={idx === 1 ? "mt-28" : ""}>
                  <a href={href} className="p-0 m-0">
                    <Image
                      src={img}
                      alt={alt}
                      width={800}
                      height={320}
                      className="p-0 d-lg-block d-none rounded-5"
                      style={{ width: "100%", height: "156px", objectFit: "cover" }}
                      unoptimized
                    />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="px-10 mt-20 col-lg-3">
            {sideCol2.map((b, idx) => {
              const img = buildImgUrl(API, b.hinhanh);
              const href = b.duongdan || "#";
              const alt = b.tieude || "Banner";
              return (
                <div key={`s2-${b.id}-${idx}`} className={idx === 1 ? "mt-28" : ""}>
                  <a href={href} className="p-0 m-0">
                    <Image
                      src={img}
                      alt={alt}
                      width={800}
                      height={320}
                      className="p-0 d-lg-block d-none rounded-5"
                      style={{ width: "100%", height: "156px", objectFit: "cover" }}
                      unoptimized
                    />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
