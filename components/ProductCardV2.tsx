"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type BadgeColor = "primary" | "danger" | "warning";

type SoldInfo =
  | string                    // ví dụ "18/35" (giữ tương thích)
  | { current: number; total: number } // sẽ tính % = current/total
  | number;                   // % đã bán (0..100)

type Props = {
  /** Link đích cho thumb + title (fallback: /product-details) */
  href?: string;

  /** Ảnh hiển thị (absolute/relative) */
  img: string;

  /** Tiêu đề sản phẩm */
  title: string;

  /** Giá hiển thị: có thể truyền number (tự format VND) hoặc string đã format */
  price: number | string;

  /** Giá gốc (tuỳ chọn): number (tự format) hoặc string */
  oldPrice?: number | string;

  /** Thông tin đã bán: "18/35" | {current,total} | number(%) */
  sold?: SoldInfo;

  /** Đánh giá: ưu tiên dùng dạng số; fallback: chuỗi cũ */
  ratingAverage?: number; // ví dụ 4.8
  ratingCount?: number;   // ví dụ 17000
  rating?: string;        // fallback cũ: "4.8"
  reviews?: string;       // fallback cũ: "(17k)"

  /** Badge trạng thái (giảm giá/miễn phí/v.v.) */
  badge?: { text: string; color: BadgeColor };
};

const colorMap: Record<BadgeColor, string> = {
  primary: "bg-primary-600",
  danger: "bg-danger-600",
  warning: "bg-warning-600",
};

/** Format VND khi nhận giá dạng number */
const fmtVND = (v: number | string | undefined): string | undefined => {
  if (typeof v === "number") return v.toLocaleString("vi-VN") + " đ";
  return v;
};

/** Tính phần trăm & label cho 'Sold' */
const deriveSold = (sold?: SoldInfo): { percent: number; label: string } => {
  if (sold == null) return { percent: 35, label: "Sold: 18/35" };

  if (typeof sold === "number") {
    const p = Math.max(0, Math.min(100, Math.round(sold)));
    return { percent: p, label: `Sold: ${p}%` };
  }
  if (typeof sold === "string") {
    // cố thử parse "a/b" -> %; nếu không parse được thì để 35%
    const m = sold.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (m) {
      const cur = parseInt(m[1], 10);
      const tot = Math.max(1, parseInt(m[2], 10));
      const p = Math.max(0, Math.min(100, Math.round((cur / tot) * 100)));
      return { percent: p, label: `Sold: ${cur}/${tot}` };
    }
    return { percent: 35, label: `Sold: ${sold}` };
  }
  // {current,total}
  const cur = Math.max(0, Math.round(sold.current));
  const tot = Math.max(1, Math.round(sold.total));
  const p = Math.max(0, Math.min(100, Math.round((cur / tot) * 100)));
  return { percent: p, label: `Sold: ${cur}/${tot}` };
};

export default function ProductCardV2({
  href,
  img,
  title,
  price,
  oldPrice,
  sold,
  ratingAverage,
  ratingCount,
  rating,
  reviews,
  badge,
}: Props) {
  const dest = href || "/product-details";

  const priceText = fmtVND(price)!;
  const oldText = fmtVND(oldPrice);

  // rating/reviews: ưu tiên số -> chuỗi
  const ratingText =
    typeof ratingAverage === "number" ? ratingAverage.toFixed(1) : (rating ?? "4.8");
  const reviewsText =
    typeof ratingCount === "number" ? `(${ratingCount})` : (reviews ?? "(17k)");

  const soldInfo = deriveSold(sold);

  return (
    <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link href={dest} className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
        <Image
          src={img}
          alt={title}
          width={220}
          height={180}
          className="w-auto"
          // hiển thị ngay ảnh ngoài domain (nếu chưa cấu hình next.config.images)
          unoptimized={/^https?:\/\//.test(img)}
        />
        {badge ? (
          <span
            className={`product-card__badge ${colorMap[badge.color]} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}
          >
            {badge.text}
          </span>
        ) : null}
      </Link>

      <div className="mt-16 product-card__content">
        <h6 className="mt-12 mb-8 text-lg title fw-semibold">
          <Link href={dest} className="link text-line-2">
            {title}
          </Link>
        </h6>

        <div className="gap-6 mt-16 mb-20 flex-align">
          <span className="text-xs text-gray-500 fw-medium">{ratingText}</span>
          <span className="text-xs fw-medium text-warning-600 d-flex">
            <i className="ph-fill ph-star"></i>
          </span>
          <span className="text-xs text-gray-500 fw-medium">{reviewsText}</span>
        </div>

        <div className="mt-8">
          <div
            className="h-4 progress w-100 bg-color-three rounded-pill"
            role="progressbar"
            aria-valuenow={soldInfo.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar bg-main-two-600 rounded-pill"
              style={{ width: `${soldInfo.percent}%` }}
            />
          </div>
          <span className="mt-8 text-xs text-gray-900 fw-medium">{soldInfo.label}</span>
        </div>

        <div className="my-20 product-card__price">
          {oldText ? (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
              {" "}{oldText}
            </span>
          ) : null}
          <span className="text-heading text-md fw-semibold ">
            {priceText} <span className="text-gray-500 fw-normal">/Qty</span>
          </span>
        </div>

        <Link
          href="/cart"
          className="gap-8 px-24 product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 rounded-8 flex-center fw-medium"
        >
          Add To Cart <i className="ph ph-shopping-cart"></i>
        </Link>
      </div>
    </div>
  );
}
