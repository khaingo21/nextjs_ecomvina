"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const categories = [
    { label: "Sức khỏe", img: "/assets/images/categories/suc-khoe.svg" },
    { label: "Thực phẩm chức năng", img: "/assets/images/categories/thuc-pham-chuc-nang.svg" },
    { label: "Chăm sóc cá nhân", img: "/assets/images/categories/cham-soc-ca-nhan.svg" },
    { label: "Làm đẹp", img: "/assets/images/categories/lam-dep.svg" },
    { label: "Điện máy", img: "/assets/images/categories/dien-may.svg" },
    { label: "Thiết bị y tế", img: "/assets/images/categories/thiet-bi-y-te.svg" },
    { label: "Bách hóa", img: "/assets/images/categories/bach-hoa.svg" },
    { label: "Nội thất - Trang trí", img: "/assets/images/categories/noi-that-trang-tri.svg" },
    { label: "Mẹ & bé", img: "/assets/images/categories/me-va-be.svg" },
    { label: "Thời trang", img: "/assets/images/categories/thoi-trang.svg" },
    { label: "Thực phẩm - đồ ăn", img: "/assets/images/categories/thuc-pham-do-an.svg" },
];

export default function CategoriesSlider() {
    return (
        <section className="categories-slider py-24">
            <div className="container container-lg">
                <div className="p-24 border border-gray-100 rounded-16">
                    <div className="mb-16 section-heading d-flex flex-between align-items-center">
                        <h6 className="mb-0">
                            <i className="ph-bold ph-squares-four text-main-600"></i> Danh mục nổi bật
                        </h6>
                    </div>

                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={12}
                        slidesPerView={8}
                        navigation
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={categories.length > 8}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            424: { slidesPerView: 3 },
                            575: { slidesPerView: 4 },
                            992: { slidesPerView: 6 },
                            1200: { slidesPerView: 8 },
                        }}
                        className="categories-swiper"
                    >
                        {categories.map((c) => (
                            <SwiperSlide key={c.label}>
                                <div className="d-flex flex-column align-items-center text-center p-12">
                                    <div className="category-circle mb-12">
                                        <Image src={c.img} alt={c.label} width={64} height={64} unoptimized />
                                    </div>
                                    <div className="text-sm fw-medium text-gray-900 text-line-2">{c.label}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
