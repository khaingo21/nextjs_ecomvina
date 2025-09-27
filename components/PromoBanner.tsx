"use client";
import React from "react";

export default function PromoBanner() {
  return (
    <div className="container">
      <div className="rounded-16 overflow-hidden flex-between position-relative my-80">
        <img
          src="/assets/images/bg/trending-products-bg-gradient.png"
          alt=""
          className="banner-img position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 z-n1 object-fit-cover rounded-24"
        />
        <div className="trending-products-box__content px-4 d-block w-100 text-center py-72">
          <h5 className="mb-0 trending-products-box__title text-white fw-semibold">
            Laptop Pro 20% off All Time On Order Now $980
          </h5>
        </div>
      </div>
    </div>
  );
}
