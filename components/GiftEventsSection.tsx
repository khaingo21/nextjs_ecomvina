"use client";
import React from "react";
import Link from "next/link";

type GiftEvent = {
  id: number | string;
  title?: string;
  slug?: string;
  mediaurl?: string;
  valid_until?: string;
  cta_link?: string;
};

export default function GiftEventsSection({ title = "Quà tặng" }: { title?: string }) {
  const API = (process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:4000").replace(/\/$/, "");
  const url = `${API}/api/gift_events`;

  const [items, setItems] = React.useState<GiftEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const autoplayRef = React.useRef<number | null>(null);
  const [isHover, setIsHover] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        if (Array.isArray(res)) setItems(res);
        else if (Array.isArray(res?.data)) setItems(res.data);
        else setItems([]);
      })
      .catch(() => {
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [url]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!el || isHover) return;
        el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
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

  const scrollPrev = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.max(el.clientWidth * 0.9, 200), behavior: "smooth" });
  };
  const scrollNext = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(el.clientWidth * 0.9, 200), behavior: "smooth" });
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget as HTMLImageElement;
    img.onerror = null;
    img.src = "/assets/images/thumbs/placeholder.png";
  };

  if (loading) {
    return <div className="p-12 text-center">Đang tải…</div>;
  }

  if (!items.length) {
    return <div className="p-12 text-center">Không có chương trình.</div>;
  }

  return (
    <section className="pt-10 overflow-hidden deals-week fix-scale-30">
      <div className="container px-0 container-lg">
        <div>
          <div className="mb-24 section-heading">
            <div className="flex-wrap gap-8 flex-between flex-align w-100">
              <h6 className="gap-8 mb-0 flex-align">
                <i className="ph-bold ph-gift text-main-600" /> {title}
              </h6>
              <div className="gap-16 flex-align">
                <Link href="/san-pham?filter=gift" className="text-sm fw-semibold text-main-600 hover-text-main-600 hover-text-decoration-underline">
                  Xem tất cả
                </Link>
                <div className="gap-8 flex-align">
                  <button type="button" onClick={scrollPrev} aria-label="Previous gift" className="text-xl border border-gray-100 rounded-circle flex-center">
                    <i className="ph ph-caret-left" />
                  </button>
                  <button type="button" onClick={scrollNext} aria-label="Next gift" className="text-xl border border-gray-100 rounded-circle flex-center">
                    <i className="ph ph-caret-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex gap-6 px-2 py-6 overflow-x-auto"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scrollNext();
              if (e.key === "ArrowLeft") scrollPrev();
            }}
          >
            {items.map((it) => {
              const image =
                it.mediaurl && typeof it.mediaurl === "string"
                  ? it.mediaurl.startsWith("http")
                    ? it.mediaurl
                    : `${API}/${it.mediaurl.replace(/^\/+/, "")}`
                  : "/assets/images/thumbs/placeholder.png";
              const href = it.cta_link ?? `/san-pham?promo=${encodeURIComponent(String(it.slug ?? it.id))}`;
              return (
                <div key={String(it.id)} className="border border-gray-100 product-card p-card rounded-16 position-relative transition-2" style={{ minWidth: 300, flex: "0 0 auto", scrollSnapAlign: "start" }}>
                  <a href={href} className="d-block rounded-16 position-relative" onClick={(e) => { e.preventDefault(); window.location.href = href; }}>
                    <div className="rounded-16" style={{ position: "relative", width: "100%", height: 260, backgroundImage: `url('${image}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                      <div className="card-overlay rounded-16 transition-1" />
                    </div>
                    <div className="card-content mt-210 p-14 w-100">
                      <div className="mt-5 mb-5 text-lg title text-white-500 fw-semibold">
                        <div className="link text-line-2" style={{ color: "white" }} tabIndex={0}>
                          {it.title ?? "Chương trình"}
                        </div>
                      </div>
                      <div className="gap-4 p-5 flex-align bg-gray-50 rounded-8">
                        <span className="text-main-600 text-md d-flex">
                          <i className="ph-bold ph-timer" />
                        </span>
                        <span className="text-xs text-gray-500">
                          {it.valid_until ? `Đến ${new Date(it.valid_until).toLocaleDateString("vi-VN")}` : "Thời hạn chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}