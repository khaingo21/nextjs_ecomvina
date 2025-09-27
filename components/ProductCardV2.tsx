"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
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

export default function ProductCardV2({ img, title, price, oldPrice, sold = "18/35", rating = "4.8", reviews = "(17k)", badge }: Props) {
  return (
    <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
      <Link href="/product-details" className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative">
        <Image src={img} alt={title} width={220} height={180} className="w-auto" />
        {badge ? (
          <span className={`product-card__badge ${colorMap[badge.color]} px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0`}>{badge.text}</span>
        ) : null}
      </Link>
      <div className="product-card__content mt-16">
        <h6 className="title text-lg fw-semibold mt-12 mb-8">
          <Link href="/product-details" className="link text-line-2">{title}</Link>
        </h6>
        <div className="flex-align mb-20 mt-16 gap-6">
          <span className="text-xs fw-medium text-gray-500">{rating}</span>
          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
          <span className="text-xs fw-medium text-gray-500">{reviews}</span>
        </div>
        <div className="mt-8">
          <div className="progress w-100 bg-color-three rounded-pill h-4" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar bg-main-two-600 rounded-pill" style={{ width: "35%" }}></div>
          </div>
          <span className="text-gray-900 text-xs fw-medium mt-8">Sold: {sold}</span>
        </div>

        <div className="product-card__price my-20">
          {oldPrice ? (
            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through"> {oldPrice}</span>
          ) : null}
          <span className="text-heading text-md fw-semibold ">{price} <span className="text-gray-500 fw-normal">/Qty</span> </span>
        </div>

        <Link href="/cart" className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium">
          Add To Cart <i className="ph ph-shopping-cart"></i>
        </Link>
      </div>
    </div>
  );
}
