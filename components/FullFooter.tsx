"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function FullFooter() {
  return (
    <>
      <footer className="footer py-120">
        <div className="container">
          <div className="footer-item-wrapper d-flex align-items-start flex-wrap">
            <div className="footer-item" data-aos="fade-up" data-aos-duration="200">
              <div className="max-w-340">
                <div className="footer-item__logo">
                  <Link href="/">
                    <Image src="/assets/images/logo/logo.png" alt="Marketpro" width={160} height={42} />
                  </Link>
                </div>
                <p className="mb-28 text-heading">We&apos;re Grocery Shop, an innovative team of food supliers.</p>
                <div className="d-flex flex-column gap-8">
                  <p className="text-heading fw-medium">2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
                  <a href="mailto:support@example.com" className="text-heading fw-medium hover-text-main-600">support@example.com</a>
                  <a href="tel:+(406)555-0120" className="text-heading fw-medium hover-text-main-600">+ (406) 555-0120</a>
                </div>
              </div>
            </div>

            <div className="footer-item" data-aos="fade-up" data-aos-duration="400">
              <h6 className="footer-item__title">Information</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Become a Vendor</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Affiliate Program</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Privacy Policy</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Our Suppliers</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Extended Plan</Link></li>
                <li className=""><Link href="/shop" className="text-heading hover-text-main-600">Community</Link></li>
              </ul>
            </div>

            <div className="footer-item" data-aos="fade-up" data-aos-duration="600">
              <h6 className="footer-item__title">Customer Support</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Help Center</Link></li>
                <li className="mb-16"><Link href="/contact" className="text-heading hover-text-main-600">Contact Us</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Report Abuse</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Submit and Dispute</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Policies & Rules</Link></li>
                <li className=""><Link href="/shop" className="text-heading hover-text-main-600">Online Shopping</Link></li>
              </ul>
            </div>

            <div className="footer-item" data-aos="fade-up" data-aos-duration="800">
              <h6 className="footer-item__title">My Account</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">My Account</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Order History</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Shoping Cart</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Compare</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Help Ticket</Link></li>
                <li className=""><Link href="/shop" className="text-heading hover-text-main-600">Wishlist</Link></li>
              </ul>
            </div>

            <div className="footer-item" data-aos="fade-up" data-aos-duration="1000">
              <h6 className="footer-item__title">Daily Groceries</h6>
              <ul className="footer-menu">
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Dairy & Eggs</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Meat & Seafood</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Breakfast Food</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Household Supplies</Link></li>
                <li className="mb-16"><Link href="/shop" className="text-heading hover-text-main-600">Bread & Bakery</Link></li>
                <li className=""><Link href="/shop" className="text-heading hover-text-main-600">Pantry Staples</Link></li>
              </ul>
            </div>

            <div className="footer-item" data-aos="fade-up" data-aos-duration="1200">
              <h6 className="">Shop on The Go</h6>
              <p className="mb-16">MarketPro App is available.  Get it now</p>
              <div className="my-32">
                <div className="flex-align gap-8">
                  <div className="bg-white rounded-10 p-1 box-shadow-5xl">
                    <Image src="/assets/images/thumbs/qr-code.png" alt="QR Code" width={84} height={84} />
                  </div>
                  <div className="d-flex flex-column gap-16">
                    <a href="https://www.apple.com/app-store" className="py-14 px-32 d-flex justify-content-center align-items-center gap-8 fw-medium text-heading text-sm hover-bg-main-600 hover-text-white box-shadow-6xl rounded-6">
                      <i className="ph-fill ph-apple-logo"></i>
                      Google play
                    </a>
                    <a href="https://play.google.com/" className="py-14 px-32 d-flex justify-content-center align-items-center gap-8 fw-medium text-heading text-sm hover-bg-main-600 hover-text-white box-shadow-6xl rounded-6">
                      <i className="ph-fill ph-google-logo"></i>
                      Google play
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-24">
                <Image src="/assets/images/thumbs/payment-method.png" alt="Payments" width={220} height={28} />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* bottom Footer */}
      <div className="bottom-footer bg-color-three py-8">
        <div className="container">
          <div className="bottom-footer__inner flex-between flex-wrap gap-16 py-16">
            <p className="bottom-footer__text">Copyright © 2025 Ui-drops All Rights Reserved</p>
            <div className="flex-align gap-16">
              <a href="https://www.facebook.com" className="text-main-600 text-2xl d-flex"><i className="ph-fill ph-facebook-logo"></i></a>
              <a href="https://www.twitter.com" className="text-main-600 text-2xl d-flex"><i className="ph-fill ph-twitter-logo"></i></a>
              <a href="https://www.instagram.com" className="text-main-600 text-2xl d-flex"><i className="ph-fill ph-instagram-logo"></i></a>
              <a href="https://www.linkedin.com" className="text-main-600 text-2xl d-flex"><i className="ph-fill ph-linkedin-logo"></i></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
