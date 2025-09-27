"use client";
import React from "react";
import Image from "next/image";

export default function FeaturedProductsSection() {
  return (
    <section className="featured-products overflow-hidden py-80">
      <div className="container">
        <div className="row g-4">
          {/* Left: product grid in bordered box */}
          <div className="col-xxl-8">
            <div className="border border-gray-100 p-24 rounded-16 h-100">
              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h6 className="mb-0"><i className="ph-bold ph-package text-main-600"></i> Sản phẩm hàng đầu</h6>
                  <div className="flex-align gap-16">
                    <a href="/shop" className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline">Xem đầy đủ</a>
                    <div className="flex-align gap-8">
                      <button type="button" id="featured-products-prev" className="slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"><i className="ph ph-caret-left"></i></button>
                      <button type="button" id="featured-products-next" className="slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1"><i className="ph ph-caret-right"></i></button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {[
                  "/assets/images/thumbs/product-two-img2.png",
                  "/assets/images/thumbs/product-two-img3.png",
                  "/assets/images/thumbs/product-two-img4.png",
                  "/assets/images/thumbs/product-two-img5.png",
                ].map((src, i) => (
                  <div className="col-md-6" key={i}>
                    <div className="product-card d-flex gap-16 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                      <a href="/product-details-two" className="product-card__thumb flex-center h-unset rounded-8 position-relative w-unset flex-shrink-0 p-24">
                        {i === 2 && (
                          <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">Best Sale</span>
                        )}
                        <Image src={src} alt="Product" width={180} height={180} />
                      </a>
                      <div className="product-card__content w-100  my-20 flex-grow-1">
                        <h6 className="title text-lg fw-semibold mb-12">
                          <a href="/product-details-two" className="link text-line-2">iPhone 15 Pro Warp Charge 30W Power Adapter</a>
                        </h6>
                        <div className="flex-align gap-6 mb-12">
                          <span className="text-xs fw-medium text-gray-500">4.8</span>
                          <span className="text-xs fw-medium text-warning-600 d-flex"><i className="ph-fill ph-star"></i></span>
                          <span className="text-xs fw-medium text-gray-500">(17k)</span>
                        </div>
                        <div className="flex-align gap-4">
                          <span className="text-main-two-600 text-md d-flex"><i className="ph-fill ph-storefront"></i></span>
                          <span className="text-gray-500 text-xs">By Lucky Supermarket</span>
                        </div>
                        <div className="product-card__price my-20">
                          <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">$28.99</span>
                          <span className="text-heading text-md fw-semibold">$14.99 <span className="text-gray-500 fw-normal">/Qty</span></span>
                        </div>
                        <a href="/cart" className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium">Add To Cart <i className="ph ph-shopping-cart"></i></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Banner phải - tinh chỉnh theo mẫu */}
          <div className="col-xxl-4">
            <div
              className="h-100 overflow-hidden position-relative p-24"
              style={{
                borderRadius: 20,
                background:
                  "radial-gradient(60% 50% at 50% 16%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 100%), linear-gradient(180deg, #4B39F0 0%, #4053F1 40%, #2AC0A2 100%)"
              }}
            >
              {/* Glow overlay */}
              <div
                className="position-absolute start-50 translate-middle-x"
                style={{ top: 60, width: 320, height: 180, borderRadius: 160, filter: 'blur(40px)', background: 'rgba(255,255,255,0.18)', opacity: 0.7 }}
              />
              {/* Nội dung chữ (căn giữa) */}
              <div className="position-relative z-1 text-center" style={{ maxWidth: '360px', margin: '0 auto' }}>
                <h6 className="text-white fw-semibold" style={{ fontSize: '20px', marginBottom: '12px', letterSpacing: '0.03em', wordSpacing: '0.03em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>iPhone Smart Phone - Red</h6>
                <div className="d-flex justify-content-center align-items-center gap-10" style={{ marginBottom: '16px' }}>
                  <span className="text-white fw-semibold" style={{ fontSize: '12px', letterSpacing: '0.06em', opacity: .95 }}>FROM</span>
                  <span className="text-white fw-bold" style={{ fontSize: '36px', lineHeight: 1 }}>$890</span>
                  <span className="badge bg-success-600 text-white fw-normal" style={{ fontSize: '12px', padding: '2px 8px' }}>20% off</span>
                </div>
                <a
                  href="/shop"
                  className="btn bg-white text-heading rounded-pill px-24 py-10 d-inline-flex align-items-center gap-6 fw-medium"
                  style={{ fontSize: '14px', boxShadow: '0 10px 18px rgba(0,0,0,0.12)' }}
                >
                  Shop Now <i className="ph ph-arrow-right text-main-600"></i>
                </a>
              </div>

              { }
              <div className="position-absolute bottom-0 start-50 translate-middle-x" style={{ width: '280px' }}>
                <Image
                  src="/assets/images/thumbs/featured-product-img.png"
                  alt="iPhone"
                  width={260}
                  height={250}
                  className="img-fluid"
                  style={{ objectFit: 'contain', height: 'auto', filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.28))' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
