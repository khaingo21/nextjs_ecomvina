"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

type Product = {
    id: number;
    ten: string;
    slug: string;
    mediaurl?: string;
    selling_price: number;
    original_price: number;
    discount_amount?: number;
    discount_percent?: number;
    rating_average: number;
    rating_count: number;
    total_sold?: number;
    is_mall?: boolean;
    is_flash_sale?: boolean;
};

export default function ProductCardSearch({ product }: { product: Product }) {
    const href = `/san-pham/${product.slug}`;
    const image = product.mediaurl || "/assets/images/thumbs/product-two-img1.png";

    // Tính % giảm giá
    const discountPercent = product.discount_percent ||
        (product.discount_amount && product.original_price > 0
            ? Math.round((product.discount_amount / product.original_price) * 100)
            : 0);

    return (
        <div className="border border-gray-100 rounded-12 p-12 h-100 d-flex flex-column hover-shadow-sm transition-2">
            {/* Image */}
            <Link href={href} className="position-relative rounded-8 overflow-hidden border border-gray-100 d-block">
                <Image
                    src={image}
                    alt={product.ten}
                    width={400}
                    height={300}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                    unoptimized
                />

                {/* Badges */}
                <div className="position-absolute top-0 start-0 p-8 d-flex flex-column gap-4">
                    {product.is_mall && (
                        <span className="px-8 py-4 text-xs badge bg-danger text-white">Mall</span>
                    )}
                    {product.is_flash_sale && (
                        <span className="px-8 py-4 text-xs badge bg-warning text-white">Flash Sale</span>
                    )}
                    {discountPercent > 0 && (
                        <span className="px-8 py-4 text-xs badge bg-main-600 text-white">-{discountPercent}%</span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="mt-12 d-flex flex-column flex-grow-1">
                <Link href={href}>
                    <h6 className="mb-8 text-sm line-clamp-2" style={{ minHeight: "2.5rem" }}>
                        {product.ten}
                    </h6>
                </Link>

                {/* Rating */}
                <div className="mb-8 d-flex align-items-center gap-8">
                    <div className="d-flex align-items-center">
                        <span className="text-xs text-warning">★</span>
                        <span className="text-xs fw-medium ms-4">{product.rating_average.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-gray-500">
                        Đã bán {product.total_sold || 0}
                    </span>
                </div>

                {/* Price */}
                <div className="mt-auto">
                    <div className="d-flex align-items-center gap-8">
                        <span className="fw-bold text-main-600">
                            {product.selling_price.toLocaleString('vi-VN')}₫
                        </span>
                        {product.original_price > product.selling_price && (
                            <span className="text-xs text-gray-400 text-decoration-line-through">
                                {product.original_price.toLocaleString('vi-VN')}₫
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
