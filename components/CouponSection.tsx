"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { type Coupon } from "@/lib/api";
import { useHomeData } from "@/hooks/useHomeData";

export default function CouponSection() {
    const { data: homeData, loading: homeLoading } = useHomeData();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev">("next");

    const ITEMS_PER_VIEW = 3;

    useEffect(() => {
        if (!homeData) return;

        let alive = true;
        try {
            if (!alive) return;
            const newCoupons = homeData.data?.new_coupon || [];
            // Chỉ lấy coupon đang hoạt động
            const activeCoupons = newCoupons.filter(
                (c) => c.trangthai === "Hoạt động"
            );
            setCoupons(activeCoupons);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            if (alive) setLoading(false);
        }
        return () => {
            alive = false;
        };
    }, [homeData]);

    const handleCopyCoupon = (coupon: Coupon) => {
        // Copy mã giảm giá vào clipboard
        navigator.clipboard.writeText(String(coupon.magiamgia)).then(() => {
            setCopiedId(coupon.id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const totalCoupons = coupons.length;

    const slides = useMemo(() => {
        if (totalCoupons === 0) return [] as Coupon[][];
        const list: Coupon[][] = [];
        // mỗi slide bắt đầu từ index i, chứa 3 coupon liên tiếp (vòng tròn)
        for (let start = 0; start < totalCoupons; start += 1) {
            const slide: Coupon[] = [];
            for (let i = 0; i < ITEMS_PER_VIEW; i++) {
                slide.push(coupons[(start + i) % totalCoupons]);
            }
            list.push(slide);
        }
        return list;
    }, [coupons, totalCoupons]);

    const totalSlides = slides.length;

    useEffect(() => {
        setActiveSlide(0);
    }, [totalSlides]);

    const handleNavigate = useCallback((dir: "next" | "prev") => {
        if (totalSlides <= 1) return;
        setDirection(dir);
        setActiveSlide((prev) => {
            if (dir === "next") {
                return (prev + 1) % totalSlides;
            }
            return (prev - 1 + totalSlides) % totalSlides;
        });
    }, [totalSlides]);

    const canNavigate = totalSlides > 1;

    useEffect(() => {
        if (!canNavigate) return;
        const timer = setInterval(() => {
            handleNavigate("next");
        }, 4000);
        return () => clearInterval(timer);
    }, [canNavigate, handleNavigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    if (loading) return null;
    if (coupons.length === 0) return null;

    return (
        <section className="coupon-section py-20 overflow-hidden">
            <div className="container container-lg">
                <div className="section-heading mb-24">
                    <div className="flex-between flex-wrap gap-8">
                        <div className="flex-align gap-8">
                            <i className="ph-bold ph-ticket text-main-600 text-2xl"></i>
                            <h6 className="mb-0 text-xl fw-bold">Mã giảm giá mới</h6>
                        </div>
                        <div className="flex-align gap-12">
                            <a
                                href="/coupons"
                                className="text-sm fw-semibold text-main-600 hover-text-main-800 hover-text-decoration-underline"
                            >
                                Xem tất cả
                            </a>
                            <div className="flex-align gap-8">
                                <button
                                    type="button"
                                    className="flex-center rounded-circle border border-gray-200 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={() => handleNavigate("prev")}
                                    disabled={!canNavigate}
                                    aria-label="Xem mã trước"
                                >
                                    <i className="ph ph-caret-left"></i>
                                </button>
                                <button
                                    type="button"
                                    className="flex-center rounded-circle border border-gray-200 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={() => handleNavigate("next")}
                                    disabled={!canNavigate}
                                    aria-label="Xem mã tiếp"
                                >
                                    <i className="ph ph-caret-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="coupon-slider__viewport">
                    <div
                        className={`coupon-slider__track slide-${direction}`}
                        style={{
                            transform: `translateX(-${activeSlide * 100}%)`,
                        }}
                    >
                        {slides.map((slide, slideIdx) => (
                            <div
                                className="coupon-slider__slide"
                                key={`coupon-slide-${slideIdx}`}
                            >
                                <div className="row g-16">
                                    {slide.map((coupon) => (
                                        <div key={coupon.id} className="col-lg-4 col-md-6">
                                            <div className="coupon-card border border-gray-200 rounded-12 overflow-hidden hover-shadow-lg transition-2">
                                                {/* Header */}
                                                <div className="coupon-header bg-gradient-main p-16">
                                                    <div className="flex-between">
                                                        <div>
                                                            <div className="text-white text-xs fw-medium mb-4 opacity-90">
                                                                Mã giảm giá
                                                            </div>
                                                            <div className="text-white text-2xl fw-bold">
                                                                {formatCurrency(coupon.giatri)}
                                                            </div>
                                                        </div>
                                                        <div className="coupon-icon">
                                                            <i className="ph-fill ph-seal-percent text-white text-5xl opacity-20"></i>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="coupon-body p-16 bg-white">
                                                    <h6 className="text-md fw-semibold mb-8 text-line-2">
                                                        {coupon.mota}
                                                    </h6>

                                                    <div className="mb-12">
                                                        <div className="flex-align gap-4 text-xs text-gray-600 mb-4">
                                                            <i className="ph ph-info"></i>
                                                            <span>Điều kiện: {coupon.dieukien}</span>
                                                        </div>
                                                        <div className="flex-align gap-4 text-xs text-gray-600">
                                                            <i className="ph ph-calendar"></i>
                                                            <span>
                                                                HSD: {formatDate(coupon.ngaybatdau)} -{" "}
                                                                {formatDate(coupon.ngayketthuc)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Coupon Code & Copy Button */}
                                                    <div className="coupon-code-container flex-between gap-8">
                                                        <div className="coupon-code flex-grow-1 px-12 py-10 bg-gray-50 rounded-8 border-dashed border border-gray-300">
                                                            <div className="text-xs text-gray-500 mb-2">Mã code</div>
                                                            <div className="text-lg fw-bold text-main-600 font-monospace">
                                                                {coupon.magiamgia}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopyCoupon(coupon)}
                                                            className={`btn ${copiedId === coupon.id
                                                                ? "btn-success"
                                                                : "btn-main-600"
                                                                } px-16 py-10 rounded-8 flex-column align-items-center justify-content-center transition-2`}
                                                            style={{ minWidth: "80px", minHeight: "70px" }}
                                                        >
                                                            <i
                                                                className={`${copiedId === coupon.id
                                                                    ? "ph-fill ph-check-circle"
                                                                    : "ph ph-copy"
                                                                    } text-xl mb-4`}
                                                            ></i>
                                                            <span className="text-xs fw-semibold">
                                                                {copiedId === coupon.id ? "Đã copy" : "Copy"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-gradient-main {
          background: linear-gradient(135deg, #f2572b 0%, #ff6b3c 100%);
        }
        .coupon-card {
          transition: all 0.3s ease;
        }
        .coupon-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        .coupon-header {
          position: relative;
        }
        .coupon-icon {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
        }
        .border-dashed {
          border-style: dashed !important;
        }
        .font-monospace {
          font-family: "Courier New", monospace;
        }
        .btn-main-600 {
          background: #f2572b;
          color: white;
          border: none;
        }
        .btn-main-600:hover {
          background: #d94a23;
        }
        .btn-success {
          background: #00b207;
          color: white;
          border: none;
        }
        .hover-shadow-lg:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
      `}</style>
        </section >
    );
}
