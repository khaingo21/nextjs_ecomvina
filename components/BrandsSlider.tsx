"use client";

import React from "react";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";

const BRANDS = [
    "top-brand-img1.png",
    "top-brand-img2.png",
    "top-brand-img3.png",
    "top-brand-img4.png",
    "top-brand-img5.png",
    "top-brand-img6.png",
    "top-brand-img7.png",
    "top-brand-img8.png",
];

export default function BrandsSlider() {
    const swiperRef = React.useRef<SwiperType | null>(null);

    return (
        <div className="py-40 top-brand">
            <div className="container container-lg">
                <div className="p-24 border border-gray-50 rounded-16 position-relative">
                    <div className="mb-24 section-heading">
                        <div className="flex-wrap gap-8 flex-between">
                            <h6 className="mb-0">Các thương hiệu đối tác</h6>

                            {/* Navigation buttons */}
                            <div className="gap-8 flex-align">
                                <button
                                    type="button"
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="w-32 h-32 text-lg border border-gray-100 rounded-circle flex-center hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                                    aria-label="Previous"
                                >
                                    <i className="ph ph-caret-left" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="w-32 h-32 text-lg border border-gray-100 rounded-circle flex-center hover-border-neutral-600 hover-bg-neutral-600 hover-text-white transition-1"
                                    aria-label="Next"
                                >
                                    <i className="ph ph-caret-right" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={24}
                        slidesPerView={8}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={BRANDS.length > 8}
                        speed={800}
                        navigation={false}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                            },
                            359: {
                                slidesPerView: 2,
                            },
                            424: {
                                slidesPerView: 3,
                            },
                            575: {
                                slidesPerView: 4,
                            },
                            992: {
                                slidesPerView: 5,
                            },
                            1199: {
                                slidesPerView: 6,
                            },
                            1399: {
                                slidesPerView: 7,
                            },
                            1599: {
                                slidesPerView: 8,
                            },
                        }}
                        className="brands-swiper"
                    >
                        {BRANDS.map((filename, idx) => {
                            const alt = filename.replace(/\.[^/.]+$/, "");
                            const imgPath = `/assets/images/thumbs/${filename}`;

                            return (
                                <SwiperSlide key={`brand-${idx}`}>
                                    <div className="px-6 my-3">
                                        <div
                                            className="top-brand__item flex-center rounded-8 bg-white hover-border-main-600 transition-1 box-shadow-7xl"
                                            style={{
                                                minWidth: "110px",
                                                minHeight: "56px",
                                                padding: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Image
                                                src={imgPath}
                                                alt={alt}
                                                width={100}
                                                height={40}
                                                style={{
                                                    maxHeight: "40px",
                                                    maxWidth: "100%",
                                                    objectFit: "contain"
                                                }}
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
