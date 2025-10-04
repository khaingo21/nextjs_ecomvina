"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";

/* =======================
   Kiểu dữ liệu (khớp tối thiểu với BE)
======================= */
// Product rút gọn (đủ để hiển thị trong bảng)
type BienThe = { gia: string; giagiam: string; soluong?: number };
type AnhSP   = { media: string };
type DanhGia = { diem: number };
type ApiProduct = {
  id: number;
  ten: string;
  mediaurl?: string | null;
  anhsanphams?: AnhSP[];
  bienthes?: BienThe[];
  danhgias?: DanhGia[];
  conhang?: boolean; // nếu BE có
};

// Mục wishlist có thể là product trực tiếp HOẶC { product: ApiProduct }
type WishlistItem = ApiProduct | { product: ApiProduct };

/* =======================
   Helpers
======================= */
const num = (v?: string): number => {
  const n = parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};
const firstImage = (p: ApiProduct) =>
  p.mediaurl || p.anhsanphams?.[0]?.media || "/assets/images/thumbs/product-two-img7.png";
const firstPrice = (p: ApiProduct) => {
  const gia = num(p.bienthes?.[0]?.gia);
  const giagiam = num(p.bienthes?.[0]?.giagiam);
  // giagiam < gia => giagiam là GIÁ BÁN; ngược lại là số tiền giảm
  const selling = giagiam > 0 && giagiam < gia ? giagiam : Math.max(gia - giagiam, 0);
  return { gia, selling };
};
const avgRating = (p: ApiProduct) => {
  const arr = p.danhgias || [];
  if (!arr.length) return { avg: 0, count: 0 };
  const sum = arr.reduce((s, r) => s + (Number(r.diem) || 0), 0);
  return { avg: Math.round((sum / arr.length) * 10) / 10, count: arr.length };
};
const unwrap = (w: WishlistItem): ApiProduct => ("product" in w ? w.product : w);

/* =======================
   Page
======================= */
export default function Page() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000"; // ADDED

  const [loading, setLoading] = useState(true); // ADDED
  const [rows, setRows] = useState<ApiProduct[]>([]); // ADDED

  // ADDED: tải danh sách yêu thích
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API}/api/yeuthichs`, {
          headers: { Accept: "application/json" },
          credentials: "include", // nếu dùng session/cookie
        });
        const json = await res.json();
        // data có thể là mảng product hoặc mảng {product: {...}}
        const arr: WishlistItem[] = Array.isArray(json?.data)
          ? json.data
          : json?.data?.data || [];
        const products = (arr as WishlistItem[]).map(unwrap);
        if (alive) setRows(products);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [API]);

  // ADDED: xoá khỏi wishlist (DELETE)
  const removeFromWishlist = async (pid: number) => {
    // lạc quan: cập nhật UI trước
    setRows((prev) => prev.filter((p) => p.id !== pid));
    try {
      await fetch(`${API}/api/yeuthichs/${pid}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
    } catch {
      // thất bại thì… (tuỳ) khôi phục; để đơn giản bỏ qua
    }
  };

  // CHANGED: chuẩn bị dữ liệu hiển thị
  const tableData = useMemo(() => {
    return rows.map((p) => {
      const { gia, selling } = firstPrice(p);
      const { avg, count } = avgRating(p);
      const inStock =
        typeof p.conhang === "boolean" ? p.conhang : (p.bienthes?.[0]?.soluong ?? 0) > 0;
      return {
        id: p.id,
        name: p.ten,
        img: firstImage(p),
        price: selling,
        oldPrice: gia > selling ? gia : undefined,
        rating: { avg, count },
        stockLabel: inStock ? "In Stock" : "Out of Stock",
        detailsHref: `/product/sp-${p.id}-${encodeURIComponent(p.ten)}`,
      };
    });
  }, [rows]);

  return (
    <>
      {/* Header */}
      <FullHeader showTopNav={false} showCategoriesBar={false} />

      {/* Breadcrumb block */}
      <div className="mb-0 breadcrumb py-26 bg-main-two-50">
        <div className="container container-lg">
          <div className="flex-wrap gap-16 breadcrumb-wrapper flex-between">
            <h6 className="mb-0">My Wishlist</h6>
            <ul className="flex-wrap gap-8 flex-align">
              <li className="text-sm">
                <Link href="/" className="gap-8 text-gray-900 flex-align hover-text-main-600">
                  <i className="ph ph-house"></i>
                  Home
                </Link>
              </li>
              <li className="flex-align">
                <i className="ph ph-caret-right"></i>
              </li>
              <li className="text-sm text-main-600"> Wishlist </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Wishlist Table */}
      <section className="cart py-80">
        <div className="container container-lg">
          <div className="row gy-4">
            <div className="col-lg-11">
              <div className="border border-gray-100 cart-table rounded-8">
                <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table overflow-hidden rounded-8">
                    <thead>
                      <tr className="border-bottom border-neutral-100">
                        <th className="px-40 py-32 mb-0 text-lg h6 fw-bold border-end border-neutral-100">Delete</th>
                        <th className="px-40 py-32 mb-0 text-lg h6 fw-bold border-end border-neutral-100">Product Name</th>
                        <th className="px-40 py-32 mb-0 text-lg h6 fw-bold border-end border-neutral-100">Unit Price</th>
                        <th className="px-40 py-32 mb-0 text-lg h6 fw-bold border-end border-neutral-100">Stock Status</th>
                        <th className="px-40 py-32 mb-0 text-lg h6 fw-bold"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* CHANGED: render data thật hoặc trạng thái trống */}
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-40 py-32 text-center text-gray-500">
                            Đang tải danh sách yêu thích…
                          </td>
                        </tr>
                      ) : tableData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-40 py-32 text-center text-gray-500">
                            Bạn chưa yêu thích sản phẩm nào.
                          </td>
                        </tr>
                      ) : (
                        tableData.map((row) => (
                          <tr key={row.id}>
                            <td className="px-40 py-32 border-end border-neutral-100">
                              <button
                                type="button"
                                onClick={() => removeFromWishlist(row.id)}
                                className="gap-12 remove-tr-btn flex-align hover-text-danger-600"
                                aria-label={`Remove ${row.name} from wishlist`}
                              >
                                <i className="text-2xl ph ph-x-circle d-flex"></i>
                                Remove
                              </button>
                            </td>

                            <td className="px-40 py-32 border-end border-neutral-100">
                              <div className="gap-24 table-product d-flex align-items-center">
                                <Link
                                  href={row.detailsHref}
                                  className="border border-gray-100 table-product__thumb rounded-8 flex-center "
                                >
                                  <Image src={row.img} alt={row.name} width={96} height={96} />
                                </Link>
                                <div className="table-product__content text-start">
                                  <h6 className="mb-8 text-lg title fw-semibold">
                                    <Link href={row.detailsHref} className="link text-line-2">
                                      {row.name}
                                    </Link>
                                  </h6>
                                  <div className="gap-16 mb-16 flex-align">
                                    <div className="gap-6 flex-align">
                                      <span className="text-md fw-medium text-warning-600 d-flex">
                                        <i className="ph-fill ph-star"></i>
                                      </span>
                                      <span className="text-gray-900 text-md fw-semibold">
                                        {row.rating.avg.toFixed(1)}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-200 fw-medium">|</span>
                                    <span className="text-sm text-neutral-600">
                                      {row.rating.count} Reviews
                                    </span>
                                  </div>
                                  {/* (tuỳ) tags/thuộc tính… */}
                                </div>
                              </div>
                            </td>

                            <td className="px-40 py-32 border-end border-neutral-100">
                              {row.oldPrice ? (
                                <div className="d-flex flex-column">
                                  <span className="text-sm text-gray-500 text-decoration-line-through">
                                    {row.oldPrice.toLocaleString("vi-VN")} đ
                                  </span>
                                  <span className="mb-0 text-lg h6 fw-semibold">
                                    {row.price.toLocaleString("vi-VN")} đ
                                  </span>
                                </div>
                              ) : (
                                <span className="mb-0 text-lg h6 fw-semibold">
                                  {row.price.toLocaleString("vi-VN")} đ
                                </span>
                              )}
                            </td>

                            <td className="px-40 py-32 border-end border-neutral-100">
                              <span className="mb-0 text-lg h6 fw-semibold">{row.stockLabel}</span>
                            </td>

                            <td className="px-40 py-32">
                              <Link href="/cart" className="px-64 btn btn-main-two rounded-8">
                                Add To Cart <i className="ph ph-shopping-cart"></i>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* (tuỳ chọn) phân trang thật: đọc res.meta & res.links từ BE*/}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <BenefitsStrip />
    </>
  );
}
