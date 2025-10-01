"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function FeatureSection() {
  return (
    <div className="feature" id="featureSection" style={{ marginTop: 50 }}>
      <div className="container">
        <div className="position-relative arrow-center gradient-shadow">
          <div className="flex-align">
            <button
              type="button"
              id="feature-item-wrapper-prev"
              className="text-xl bg-white slick-prev slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-left"></i>
            </button>
            <button
              type="button"
              id="feature-item-wrapper-next"
              className="text-xl bg-white slick-next slick-arrow flex-center rounded-circle hover-bg-main-600 hover-text-white transition-1"
            >
              <i className="ph ph-caret-right"></i>
            </button>
          </div>
          <div className="feature-item-wrapper">
            {[
              { img: "/assets/images/thumbs/popular-img1.png", title: "Vegetables", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img2.png", title: "Fish & Meats", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img3.png", title: "Desserts", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img4.png", title: "Drinks & Juice", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img5.png", title: "Animals Food", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img6.png", title: "Fresh Fruits", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img7.png", title: "Yummy Candy", count: "125+ Products" },
              { img: "/assets/images/thumbs/popular-img8.png", title: "Dairy & Eggs", count: "125+ Products" },
              { img: "/assets/images/thumbs/product-two-img1.png", title: "Snacks", count: "125+ Products" },
              { img: "/assets/images/thumbs/product-two-img2.png", title: "Frozen Foods", count: "125+ Products" },
            ].map((item, idx) => (
              <div className="text-center feature-item wow bounceIn" data-aos="fade-up" key={idx}>
                <div className="feature-item__thumb rounded-circle">
                  <Link href="/shop" className="w-100 h-100 flex-center">
                    <Image src={item.img} alt={item.title} width={100} height={100} />
                  </Link>
                </div>
                <div className="mt-16 feature-item__content">
                  <h6 className="mb-8 text-lg">
                    <Link href="/shop" className="text-inherit">
                      {item.title}
                    </Link>
                  </h6>
                  <span className="text-sm text-gray-400">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
