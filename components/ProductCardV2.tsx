"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string; // <-- NEW: link đích cho thumb + title
  img: string;
  title: string;
  price: string;
  oldPrice?: string;
  sold?: string;
  rating?: string;
  reviews?: string;
  badge?: { text: string; color: "primary" | "danger" | "warning" };
};

const colorMap: Record<"primary" | "danger" | "warning", string> = {
  primary: "bg-primary-600",
  danger: "bg-danger-600",
  warning: "bg-warning-600",
};

export default function ProductCardV2({
  href,
  img,
  title,
  price,
  oldPrice,
  sold = "18/35",
  rating = "4.8",
  reviews = "(17k)",
  badge,
}: Props) {
  const dest = href || "/product-details"; // fallback nếu chưa truyền

  return (
    <div className="p-16 border border-gray-100 product-card h-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link href={dest} className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
        <Image
          src={img}
          alt={title}
          width={220}
          height={180}
          className="w-auto"
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
          <span className="text-xs text-gray-500 fw-medium">{rating}</span>
          <span className="text-xs fw-medium text-warning-600 d-flex">
            <i className="ph-fill ph-star"></i>
          </span>
          <span className="text-xs text-gray-500 fw-medium">{reviews}</span>
        </div>

        <div className="mt-8">
          <div className="h-4 progress w-100 bg-color-three rounded-pill" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar bg-main-two-600 rounded-pill" style={{ width: "35%" }}></div>
          </div>
          <span className="mt-8 text-xs text-gray-900 fw-medium">Sold: {sold}</span>
        </div>

        <div className="my-20 product-card__price">
          {oldPrice ? (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through"> {oldPrice}</span>
          ) : null}
          <span className="text-heading text-md fw-semibold ">
            {price} <span className="text-gray-500 fw-normal">/Qty</span>
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
