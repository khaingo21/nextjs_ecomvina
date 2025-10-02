"use client";
import React from "react";
import Image from "next/image";

type Banner = {
  id: number;
  vitri?: "header" | "sidebar" | "footer" | string;
  hinhanh: string;           // tên file hoặc URL đầy đủ
  duongdan?: string | null;  // URL click
  tieude?: string | null;
  trangthai?: string | null; // "hoat_dong"
  thutu?: number | null;     // (nếu server có)
};

const buildImgUrl = (apiBase: string, file: string) => {
  if (/^https?:\/\//i.test(file)) return file;
  return `${apiBase}/${file.replace(/^\/+/, "")}`;
};

export default function BannerTwo() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState<Banner[]>([]);

  React.useEffect(() => {
    let alive = true;
    fetch(`${API}/api/bannerquangcaos`, { headers: { Accept: "application/json" } })
      .then((r) => r.json() as Promise<{ data: Banner[] }>)
      .then((res) => {
        if (!alive) return;
        const all = (Array.isArray(res?.data) ? res.data : [])
          .filter((b) => !b.trangthai || b.trangthai === "hoat_dong");

        // Ưu tiên sắp xếp: thutu ASC -> vitri header -> sidebar -> khác
        const sorted = [...all].sort((a, b) => {
          const orderA = a.thutu ?? 9999;
          const orderB = b.thutu ?? 9999;
          if (orderA !== orderB) return orderA - orderB;
          const rank = (v?: string) =>
            v === "header" ? 0 : v === "sidebar" ? 1 : 2;
          return rank(a.vitri) - rank(b.vitri);
        });

        // Lấy tối đa 5
        const needed = 5;
        const take = sorted.slice(0, needed);

        // Nếu thiếu thì lặp lại cho đủ 5
        const filled: Banner[] = [];
        let i = 0;
        while (filled.length < needed && take.length > 0) {
          filled.push(take[i % take.length]);
          i++;
        }
        setList(filled);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [API]);

  if (loading) return null;

  // Phân bố: 1 ảnh lớn (mains) + 4 ảnh nhỏ (sides)
  // - mains: các banner vitri = header (nếu có), ít nhất 1; ở đây ta lấy 1 cái đầu cho phù hợp layout cũ
  // - sides: 4 cái còn lại chia 2 cột
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
          {/* Cột trái: 1 ảnh lớn (giữ slider markup để hợp với JS hiện có) */}
          <div className="col-lg-6">
            <div className="banner-two-wrapper d-flex align-items-start">
              <div className="mt-20 mb-0 overflow-hidden banner-item-two-wrapper rounded-5 position-relative arrow-center flex-grow-1 ms-0">
                <div className="flex-align">
                  <button type="button" id="banner-prev" className="text-xl bg-white slick-prev flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1 slick-arrow">
                    <i className="ph-bold ph-caret-left" />
                  </button>
                  <button type="button" id="banner-next" className="text-xl bg-white slick-next flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1 slick-arrow">
                    <i className="ph-bold ph-caret-right" />
                  </button>
                </div>

                <div className="banner-item-two__slider">
                  {mains.map((b) => {
                    const img = buildImgUrl(API, b.hinhanh);
                    const href = b.duongdan || "#";
                    const alt = b.tieude || "Banner";
                    return (
                      <a key={`main-${b.id}`} href={href} className="flex-wrap-reverse gap-32 d-flex align-items-center justify-content-between flex-sm-nowrap">
                        <Image
                          src={img}
                          alt={alt}
                          width={1600}
                          height={500}
                          className="d-lg-block d-none rounded-5"
                          style={{ width: "100%", height: "350px", objectFit: "cover" }}
                          unoptimized
                        />
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: 4 ô nhỏ = 2 cột, mỗi cột 2 ảnh */}
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
