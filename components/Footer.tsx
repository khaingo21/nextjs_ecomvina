"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="footer py-40 overflow-hidden">
        <div className="container container-lg">
          <div className="footer-item-two-wrapper d-flex align-items-start justify-content-center flex-wrap gap-48">
            {/* Brand & contact */}
            <div className="footer-item max-w-275" data-aos="fade-up" data-aos-duration="200">
              <div className="footer-item__logo mb-16">
                <Link href="/">
                  <Image src="/assets/images/logo/logo_nguyenban.png" alt="Siêu Thị Vina" width={160} height={42} />
                </Link>
              </div>
              <p className="mb-24">
                Trang thương mại điện tử Siêu Thị Vina cung cấp các sản phẩm đa dạng đến với khách hàng và đăng ký đối tác với các cửa hàng.
              </p>
              <div className="flex-align gap-16 mb-16">
                <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                  <i className="ph-fill ph-phone-call"></i>
                </span>
                <a href="tel:+884911975996" className="text-md text-gray-900 hover-text-main-600">+884 0911 975 996</a>
              </div>
              <div className="flex-align gap-16 mb-16">
                <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                  <i className="ph-fill ph-envelope"></i>
                </span>
                <a href="mailto:hotro@sieuthivina.com" className="text-md text-gray-900 hover-text-main-600">hotro@sieuthivina.com</a>
              </div>
              <div className="flex-align gap-16 mb-16">
                <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                  <i className="ph-fill ph-map-pin"></i>
                </span>
                <span className="text-md text-gray-900">No.XXXX Fengshi.rd, Shigang - Taichung, Taiwan</span>
              </div>
            </div>

            {/* Về chúng tôi */}
            <div className="footer-item" data-aos="fade-up" data-aos-duration="400">
              <h6 className="footer-item__title">Về chúng tôi</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/about" className="text-gray-600 hover-text-main-600">Giới thiệu về Siêu thị Vina</Link></li>
                <li className="mb-16"><Link href="/contact" className="text-gray-600 hover-text-main-600">Liên hệ hỗ trợ</Link></li>
                <li className="mb-16"><Link href="/terms" className="text-gray-600 hover-text-main-600">Điều khoản sử dụng</Link></li>
                <li className="mb-16"><Link href="/policy/purchase" className="text-gray-600 hover-text-main-600">Chính sách mua hàng</Link></li>
                <li className="mb-16"><Link href="/policy/user" className="text-gray-600 hover-text-main-600">Chính sách người dùng</Link></li>
                <li className="mb-16"><Link href="/policy/store" className="text-gray-600 hover-text-main-600">Chính sách cửa hàng</Link></li>
              </ul>
            </div>

            {/* Tài khoản */}
            <div className="footer-item" data-aos="fade-up" data-aos-duration="600">
              <h6 className="footer-item__title">Tài khoản</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/account" className="text-gray-600 hover-text-main-600">Truy cập tài khoản</Link></li>
                <li className="mb-16"><Link href="/orders" className="text-gray-600 hover-text-main-600">Lịch sử đơn hàng</Link></li>
                <li className="mb-16"><Link href="/wishlist" className="text-gray-600 hover-text-main-600">Danh sách yêu thích</Link></li>
                <li className="mb-16"><Link href="/cart" className="text-gray-600 hover-text-main-600">Giỏ hàng của bạn</Link></li>
              </ul>
            </div>

            {/* Thông tin khác */}
            <div className="footer-item" data-aos="fade-up" data-aos-duration="800">
              <h6 className="footer-item__title">Thông tin khác</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/shop" className="text-gray-600 hover-text-main-600">Danh sách sản phẩm</Link></li>
                <li className="mb-16"><Link href="/stores" className="text-gray-600 hover-text-main-600">Các cửa hàng</Link></li>
              </ul>
            </div>

            {/* Kết nối & theo dõi */}
            <div className="footer-item" data-aos="fade-up" data-aos-duration="1000">
              <h6 className="">Kết nối & theo dõi</h6>
              <p className="mb-16">Truy cập các nền tảng mạng xã hội<br/>của chúng tôi.</p>
              <ul className="flex-align gap-16">
                <li>
                  <a href="https://www.facebook.com" className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"><i className="ph-fill ph-facebook-logo"></i></a>
                </li>
                <li>
                  <a href="https://www.twitter.com" className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"><i className="ph-fill ph-twitter-logo"></i></a>
                </li>
                <li>
                  <a href="https://www.instagram.com" className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"><i className="ph-fill ph-instagram-logo"></i></a>
                </li>
                <li>
                  <a href="https://www.linkedin.com" className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"><i className="ph-fill ph-linkedin-logo"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* bottom Footer */}
      <div className="bottom-footer bg-color-three py-8">
        <div className="container container-lg">
          <div className="bottom-footer__inner d-flex justify-content-center align-items-center flex-wrap gap-16 py-16 text-center">
            <p className="bottom-footer__text">Siêu Thị Vina © 2024. All Rights Reserved</p>
            <div className="flex-align gap-8 flex-wrap justify-content-center">
              <span className="text-heading text-sm">Chấp nhận thanh toán</span>
              <Image src="/assets/images/thumbs/payment-method.png" alt="Payment methods" width={220} height={28} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
