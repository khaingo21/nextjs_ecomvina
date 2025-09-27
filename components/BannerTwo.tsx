"use client";
import React from "react";
import Image from "next/image";

export default function BannerTwo() {
  return (
    <div className="banner-two">
      <div className="container">
        <div className="banner-two-wrapper d-flex align-items-start">
          <div className="banner-item-two-wrapper rounded-10 overflow-hidden position-relative arrow-center flex-grow-1 mb-0 mt-20 ms-0">
            <div className="banner-item-two__slider">
              <div className="bnws d-flex align-items-center justify-content-between flex-wrap-reverse flex-sm-nowrap gap-32">
                <a href="#">
                  <span className="d-lg-block d-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-3.jpg" alt="Thumb" width={1600} height={500} style={{ width: "100%", height: 500, objectFit: "cover" }} />
                  </span>
                  <span className="d-block d-lg-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-3.jpg" alt="Thumb" width={800} height={300} style={{ width: "100%", height: 300, objectFit: "cover" }} />
                  </span>
                </a>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap-reverse flex-sm-nowrap gap-32">
                <a href="#">
                  <span className="d-lg-block d-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-2.jpg" alt="Thumb" width={1600} height={500} style={{ width: "100%", height: 500, objectFit: "cover" }} />
                  </span>
                  <span className="d-block d-lg-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-2.jpg" alt="Thumb" width={800} height={300} style={{ width: "100%", height: 300, objectFit: "cover" }} />
                  </span>
                </a>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap-reverse flex-sm-nowrap gap-32">
                <a href="#">
                  <span className="d-lg-block d-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-1.jpg" alt="Thumb" width={1600} height={500} style={{ width: "100%", height: 500, objectFit: "cover" }} />
                  </span>
                  <span className="d-block d-lg-none rounded-20 overflow-hidden w-100" style={{ display: "block" }}>
                    <Image src="/assets/images/bg/shopee-1.jpg" alt="Thumb" width={800} height={300} style={{ width: "100%", height: 300, objectFit: "cover" }} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
