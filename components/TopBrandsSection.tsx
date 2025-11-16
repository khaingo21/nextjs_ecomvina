"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type ApiTopBrand = {
  id: number | string;
  name?: string;
  slug?: string;
  logo?: string;
  link?: string;
};

type ApiProduct = {
  id: number;
  ten?: string;
  slug?: string | null;
  mediaurl?: string | null;
  anhsanphams?: { media?: string }[];
  bienthes?: { gia?: string | number; giagiam?: string | number }[];
  thuonghieu?: { ten?: string };
};

type UIBrand = {
  id: string;
  name: string;
  logo: string;
  link: string;
};

const pickProductImage = (p: ApiProduct): string =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";

export default function TopBrandsSection({ title = "Thương hiệu hàng đầu" }: { title?: string }) {
  const API_ROOT = (process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:4000").replace(/\/$/, "");
  const [brands, setBrands] = React.useState<UIBrand[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const autoplayRef = React.useRef<number | null>(null);
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_ROOT}/api/top_brands`, { headers: { Accept: "application/json" }, cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        const data: ApiTopBrand[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        if (data.length > 0) {
          const ui = data.map((b) => ({
            id: String(b.id ?? b.slug ?? b.name ?? Math.random()),
            name: b.name ?? b.slug ?? "Thương hiệu",
            logo: b.logo ?? "/assets/images/brands/default.png",
            link: b.link ?? (b.slug ? `/shop/${encodeURIComponent(b.slug)}` : `/shop/${encodeURIComponent(String(b.id))}`),
          }));
          setBrands(ui);
          setLoading(false);
          return;
        }
      } catch {
        // fallback next
      }

      // fallback: group from hot_sales products
      try {
        const pRes = await fetch(`${API_ROOT}/api/sanphams-selection?selection=hot_sales&per_page=60`, { headers: { Accept: "application/json" }, cache: "no-store" });
        const pJson = await pRes.json();
        if (!alive) return;
        const list: ApiProduct[] = Array.isArray(pJson) ? pJson : Array.isArray(pJson?.data) ? pJson.data : [];
        const map = new Map<string, UIBrand>();
        for (const p of list) {
          const brandName = p.thuonghieu?.ten?.trim() || "Khác";
          if (!map.has(brandName)) {
            map.set(brandName, {
              id: String(brandName),
              name: brandName,
              logo: pickProductImage(p),
              link: `/products?brand=${encodeURIComponent(brandName)}`,
            });
          }
        }
        setBrands(Array.from(map.values()).slice(0, 12));
      } catch {
        setBrands([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [API_ROOT]);

  // autoplay scroll
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!el || isHover) return;
        const step = Math.max(el.clientWidth * 0.9, 300);
        el.scrollBy({ left: step, behavior: "smooth" });
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
  }, [brands.length, isHover]);

  const scrollPrev = () => {
    const el = containerRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.9, 300);
    el.scrollBy({ left: -step, behavior: "smooth" });
  };
  const scrollNext = () => {
    const el = containerRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.9, 300);
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="overflow-hidden top-selling-products pt-80">
        <div className="container">
          <div className="p-24 border border-gray-100 rounded-16">
            <div className="mb-24 section-heading">
              <div className="flex-wrap gap-8 flex-between">
                <h6 className="mb-0">
                  <i className="ph-bold ph-storefront text-main-600" /> {title}
                </h6>
              </div>
            </div>
            <div className="py-24 text-center text-gray-500">Đang tải thương hiệu…</div>
          </div>
        </div>
      </section>
    );
  }

  if (!brands.length) {
    return (
      <section className="overflow-hidden top-selling-products pt-80">
        <div className="container">
          <div className="p-24 border border-gray-100 rounded-16">
            <div className="mb-24 section-heading">
              <div className="flex-wrap gap-8 flex-between">
                <h6 className="mb-0">
                  <i className="ph-bold ph-storefront text-main-600" /> {title}
                </h6>
              </div>
            </div>
            <div className="py-24 text-center text-gray-500">Không có thương hiệu hiển thị.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden top-selling-products pt-80">
      <div className="container">
        <div className="p-24 border border-gray-100 rounded-16">
          <div className="mb-24 section-heading">
            <div className="flex-wrap gap-8 flex-between">
              <h6 className="mb-0">
                <i className="ph-bold ph-storefront text-main-600" /> {title}
              </h6>
              <div className="gap-16 flex-align">
                <Link href="/products?source=hot_sales&sort=popular" className="text-sm text-gray-700 fw-semibold hover-text-main-600 hover-text-decoration-underline">
                  Xem đầy đủ
                </Link>
                <div className="gap-8 flex-align">
                  <button type="button" onClick={scrollPrev} aria-label="Prev brands" className="text-xl border border-gray-100 rounded-circle flex-center">
                    <i className="ph ph-caret-left" />
                  </button>
                  <button type="button" onClick={scrollNext} aria-label="Next brands" className="text-xl border border-gray-100 rounded-circle flex-center">
                    <i className="ph ph-caret-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex px-2 py-6 overflow-x-auto"
            style={{
              gap: 22, // each gap = 22px -> total spacing for 5 items = 88px => 5*220 + 88 = 1188
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
             onMouseEnter={() => setIsHover(true)}
             onMouseLeave={() => setIsHover(false)}
             tabIndex={0}
             onKeyDown={(e) => {
               if (e.key === "ArrowRight") scrollNext();
               if (e.key === "ArrowLeft") scrollPrev();
             }}
           >
            {brands.map((b) => (
              <div
                key={b.id}
                className="border border-gray-100 rounded-12 position-relative transition-2"
                style={{
                  width: 220, // fixed block width
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                  padding: 12,
                  boxSizing: "border-box",
                }}
              >
                <Link
                  href={b.link}
                  className="product-card__thumb rounded-8 position-relative bg-gray-50 d-block"
                  aria-label={b.name}
                  style={{
                    height: 128, // image block height
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: 8,
                  }}
                >
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={220}
                    height={128}
                    className="object-contain"
                    unoptimized={!b.logo.startsWith("/")}
                  />
                </Link>

                <div className="mt-10 product-card__content w-100" style={{ paddingLeft: 4, paddingRight: 4 }}>
                  <h6 className="mb-0 text-sm fw-semibold" style={{ lineHeight: "1.1", height: 36, overflow: "hidden" }}>
                    <Link href={b.link} className="link text-line-2">
                      {b.name}
                    </Link>
                  </h6>
                  <div className="mt-6 d-flex justify-content-end">
                    <Link href={`/products?brand=${encodeURIComponent(b.name)}&sort=popular`} className="text-xs text-gray-600 hover-text-main-600 hover-text-decoration-underline">
                      Xem tất cả
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}