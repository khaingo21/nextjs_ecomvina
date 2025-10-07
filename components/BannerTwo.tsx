'use client';

import React from 'react';
import Image from 'next/image';

// --- Swiper imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

type ApiBanner = {
  id: number;
  vitri?: string | null;
  hinhanh?: string | null;
  duongdan?: string | null;
  tieude?: string | null;
  trangthai?: string | null;
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
function isApiBannerArray(v: unknown): v is ApiBanner[] {
  return Array.isArray(v) && v.every(x => typeof x === "object" && x !== null && "id" in x);
}
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
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<Banner[]>([]);

  // --- refs cho custom prev/next của Swiper ---
  const prevRef = React.useRef<HTMLButtonElement | null>(null);
  const nextRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch(`${API}/api/bannerquangcaos`, { headers: { Accept: "application/json" } })
      .then((r) => r.json() as Promise<ApiResponse<ApiBanner> | unknown>)
      .then((res) => {
        if (!alive) return;
        const raw = pickArrayFromResponse(res);
        const all = raw
          .map(normalizeBanner)
          .filter((x): x is Banner => x !== null)
          .filter((b) => !b.trangthai || b.trangthai === "hoat_dong");

        const rank = (v?: string) => (v === "header" ? 0 : v === "sidebar" ? 1 : 2);
        const sorted = [...all].sort((a, b) => {
          const oa = a.thutu ?? 9999;
          const ob = b.thutu ?? 9999;
          return oa !== ob ? oa - ob : rank(a.vitri) - rank(b.vitri);
        });

        const needed = 5;
        const seed = sorted.slice(0, needed);
        const filled: Banner[] = [];
        for (let i = 0; seed.length && filled.length < needed; i++) {
          filled.push(seed[i % seed.length]);
        }
        setList(filled);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [API]);

  if (loading || list.length === 0) return null;

  // 1 main (header) + 4 side
  const mains: Banner[] = [];
  const sides: Banner[] = [];
  const headers = list.filter((b) => b.vitri === "header");
  if (headers.length) {
    mains.push(headers[0]);
    sides.push(...list.filter((b) => b !== headers[0]).slice(0, 4));
  } else {
    mains.push(list[0]);
    sides.push(...list.slice(1, 5));
  }
  const sideCol1 = sides.slice(0, 2);
  const sideCol2 = sides.slice(2, 4);

  return (
    <div className="banner-two">
      <div className="container container-lg">
        <div className="row g-20">
          {/* Trái: slider lớn (Swiper) */}
          <div className="col-lg-6">
            <div className="banner-two-wrapper d-flex align-items-start">
              <div className="mt-20 mb-0 overflow-hidden banner-item-two-wrapper rounded-5 position-relative arrow-center flex-grow-1 ms-0">
                {/* Nút điều hướng custom */}
                <div className="flex-align">
                  <button
                    type="button"
                    ref={prevRef}
                    className="text-xl bg-white flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
                    aria-label="Previous slide"
                  >
                    <i className="ph-bold ph-caret-left" />
                  </button>
                  <button
                    type="button"
                    ref={nextRef}
                    className="text-xl bg-white flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
                    aria-label="Next slide"
                  >
                    <i className="ph-bold ph-caret-right" />
                  </button>
                </div>

                <Swiper
                  modules={[Autoplay, Pagination, Navigation, EffectFade]}
                  // map từ slick -> swiper:
                  // arrows:false (dùng custom ref), dots:false (có thể bật nếu cần)
                  autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  loop={mains.length > 1}
                  effect="fade"
                  speed={500}
                  slidesPerView={1}
                  pagination={false}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    // gán lại phần tử điều hướng trước khi init
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (swiper.params.navigation as any).prevEl = prevRef.current;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (swiper.params.navigation as any).nextEl = nextRef.current;
                  }}
                  className="banner-item-two__slider"
                >
                  {mains.map((b) => {
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
                            style={{ width: "100%", height: "350px", objectFit: "cover" }}
                            unoptimized
                          />
                          {/* Mobile */}
                          <Image
                            src={img}
                            alt={alt}
                            width={800}
                            height={300}
                            className="d-block d-lg-none rounded-5"
                            style={{ width: "100%", height: "300px", objectFit: "cover" }}
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

          {/* Phải: 4 ô nhỏ (giữ nguyên) */}
          <div className="px-10 mt-20 col-lg-3 col-sm-3">
            {sideCol1.map((b, idx) => {
              const img = buildImgUrl(API, b.hinhanh);
              const href = b.duongdan || "#";
              const alt = b.tieude || "Banner";
              return (
                <div key={`s1-${b.id}-${idx}`} className={idx === 1 ? "mt-24" : ""}>
                  <a href={href} className="p-0 m-0">
                    <Image
                      src={img}
                      alt={alt}
                      width={800}
                      height={320}
                      className="p-0 d-lg-block d-none rounded-5"
                      style={{ width: "100%", height: "163px", objectFit: "cover" }}
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
                <div key={`s2-${b.id}-${idx}`} className={idx === 1 ? "mt-24" : ""}>
                  <a href={href} className="p-0 m-0">
                    <Image
                      src={img}
                      alt={alt}
                      width={800}
                      height={320}
                      className="p-0 d-lg-block d-none rounded-5"
                      style={{ width: "100%", height: "163px", objectFit: "cover" }}
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
