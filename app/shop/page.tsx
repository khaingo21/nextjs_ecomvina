"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import ProductCardV2 from "@/components/ProductCardV2";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";

// ==== Types khớp API hot_sales ====
type DanhGia = { id: number; diem: number };
type BienThe = { gia: string; giagiam: string; soluong?: number };
type AnhSP = { media: string };

type ApiProduct = {
  id: number;
  ten: string;
  mediaurl?: string | null;
  danhgias?: DanhGia[];
  bienthes?: BienThe[];
  anhsanphams?: AnhSP[];
  thuonghieu?: { ten?: string };
  xuatxu?: string;
  luotxem?: number;
};

// ==== Helpers ====
const toVND = (n: number) => n.toLocaleString("vi-VN") + " đ";
const num = (v?: string) => {
  const n = parseFloat(v || "0");
  return Number.isFinite(n) ? n : 0;
};
const firstImage = (p: ApiProduct) =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";

const firstPrice = (p: ApiProduct) => {
  const gia = num(p.bienthes?.[0]?.gia);
  const giagiam = num(p.bienthes?.[0]?.giagiam);
  const selling = giagiam > 0 ? giagiam : gia;
  return { gia, giagiam, selling };
};

const avgRating = (p: ApiProduct) => {
  const arr = p.danhgias || [];
  if (!arr.length) return 0;
  const sum = arr.reduce((s, r) => s + (Number(r.diem) || 0), 0);
  return Math.round((sum / arr.length) * 10) / 10;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view"); // "hot" nếu bấm từ HOT SALES
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ApiProduct[]>([]);

  useEffect(() => {
    let mounted = true;

    // Nếu view=hot, lấy danh sách HOT SALES lớn hơn để fill toàn trang
    const url =
      view === "hot"
        ? "http://localhost:8000/api/sanphams-selection?selection=hot_sales&per_page=60"
        : // TODO: thay = API all products của bạn khi có
          "http://localhost:8000/api/sanphams-selection?selection=hot_sales&per_page=60";

    fetch(url)
      .then((r) => r.json())
      .then((res: { status: boolean; data: ApiProduct[] }) => {
        if (mounted && res?.status && Array.isArray(res.data)) {
          setItems(res.data);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [view]);

  // ====== SORT logic cho "Xem đầy đủ" (view=hot):
  // Ưu tiên: (1) giảm giá % cao -> (2) luotxem cao -> (3) rating cao
  const sorted = useMemo(() => {
    const cloned = [...items];
    if (view === "hot") {
      cloned.sort((a, b) => {
        const pa = firstPrice(a);
        const pb = firstPrice(b);
        const discA = pa.gia > 0 ? (pa.gia - pa.selling) / pa.gia : 0;
        const discB = pb.gia > 0 ? (pb.gia - pb.selling) / pb.gia : 0;
        const viewsA = a.luotxem || 0;
        const viewsB = b.luotxem || 0;
        const rateA = avgRating(a);
        const rateB = avgRating(b);
        if (discB !== discA) return discB - discA;
        if (viewsB !== viewsA) return viewsB - viewsA;
        return rateB - rateA;
      });
    }
    return cloned;
  }, [items, view]);

  return (
    <>
      {/* Header (no top nav, no categories bar) */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb (VN) */}
      <div className="pt-40 mb-0 breadcrumb bg-main-two-60">
        <div className="container">
          <div className="flex-wrap gap-16 breadcrumb-wrapper flex-between">
            <h6 className="mb-0">
              {view === "hot" ? "Sản phẩm HOT (bán chạy & giảm giá)" : "Danh sách sản phẩm"}
            </h6>
          </div>
        </div>
      </div>

      <section className="py-40 shop">
        <div className="container">
          <div className="row">
            {/* Sidebar giữ nguyên UI mẫu của bạn, có thể nối API sau */}
            <div className="col-lg-3 d-lg-block d-none">
              <div className="shop-sidebar position-relative">
                <div className="shop-sidebar__box rounded-8">
                  <Image
                    src="/assets/images/thumbs/advertise-img1.png"
                    alt="Advertise"
                    width={360}
                    height={420}
                    className="h-auto img-fluid w-100"
                  />
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="col-lg-9">
              {/* Toolbar đơn giản */}
              <div className="flex-wrap gap-16 mb-40 flex-between">
                <span className="text-gray-900">
                  {view === "hot" ? "Ưu tiên: giảm giá cao • bán chạy • đánh giá cao" : "Tất cả sản phẩm"}
                </span>
                <div className="flex-wrap gap-16 position-relative flex-align">
                  <div className="gap-16 list-grid-btns flex-align">
                    <button type="button" className="text-2xl border border-gray-100 w-44 h-44 flex-center rounded-6 list-btn">
                      <i className="ph-bold ph-list-dashes"></i>
                    </button>
                    <button type="button" className="text-2xl text-white border w-44 h-44 flex-center border-main-600 bg-main-600 rounded-6 grid-btn">
                      <i className="ph ph-squares-four"></i>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center text-gray-500">Đang tải sản phẩm…</div>
              ) : (
                <div className="row g-3">
                  {sorted.map((p) => {
                    const { gia, selling } = firstPrice(p);
                    const showDiscount = selling < gia;
                    const percent = gia > 0 ? Math.round(((gia - selling) / gia) * 100) : 0;
                    const href = `/product/${slugify(p.ten)}-${p.id}`;

                    return (
                      <div className="col-sm-6 col-md-4" key={p.id}>
                        <ProductCardV2
                          href={href}
                          img={firstImage(p)}
                          title={p.ten}
                          price={toVND(selling)}
                          oldPrice={showDiscount ? toVND(gia) : undefined}
                          badge={showDiscount ? { text: `Sale ${percent}%`, color: "danger" } : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BenefitsStrip />
    </>
  );
}
