"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function ProductCard({
  href = "/product-details-two",
  title,
  price,
  image = "/assets/images/thumbs/product-two-img1.png",
}: {
  href?: string;
  title: string;
  price: string;
  image?: string;
}) {
  return (
    <div className="border border-gray-100 rounded-12 p-12 h-100 d-flex flex-column">
      <Link href={href} className="rounded-8 overflow-hidden border border-gray-100 d-block">
        <Image src={image} alt={title} width={400} height={300} style={{ width: "100%", height: 180, objectFit: "cover" }} />
      </Link>
      <h6 className="mt-12 mb-8">{title}</h6>
      <div className="mt-auto d-flex align-items-center justify-content-between">
        <span className="fw-semibold text-main-600">{price}</span>
        <Link href="/cart" className="btn btn-main-two rounded-8 px-16 py-6">Thêm</Link>
      </div>
    </div>
  );
}
