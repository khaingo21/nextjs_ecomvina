import React from "react";
import "./globals.css"; // hoặc ../globals.css nếu file nằm ngoài app/
import Script from "next/script";
import GlobalChrome from "@/components/GlobalChrome";
import GlobalFooter from "@/components/GlobalFooter";
import AnimateBoot from "@/components/AnimateBoot";
import { WishlistProvider } from "@/hooks/useWishlist";

export const metadata = { title: "MarketPro" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="color-two font-exo header-sticky-style">
      <head>
        <link rel="shortcut icon" href="/assets/images/logo/favicon.png" />
        {/* Giữ <link> nếu bạn chưa chuyển sang import ESM */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/select2.min.css" />
        <link rel="stylesheet" href="/assets/css/slick.css" />
        <link rel="stylesheet" href="/assets/css/jquery-ui.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/aos.css" />
      </head>

      <body>
        <WishlistProvider>
          <GlobalChrome />
          {children}
          <GlobalFooter />
        </WishlistProvider>

        {/* JS – đúng thứ tự: jQuery -> Slick -> plugin -> main.js */}
        {/* <Script src="/assets/js/jquery-3.7.1.min.js" strategy="beforeInteractive" /> */}
        <Script src="/assets/js/slick.min.js" strategy="beforeInteractive" />

        <Script src="/assets/js/select2.min.js" strategy="afterInteractive" />
        {/* Nếu dùng AOS qua npm (AnimateBoot) thì bỏ dòng dưới */}
<<<<<<< HEAD
        <Script src="/assets/js/aos.js" strategy="afterInteractive" />

        {/* Đảm bảo đúng tên file theo thư mục thật */}
        <Script src="/assets/js/phosphor-icon.js" strategy="afterInteractive" />
        {/* <Script src="/assets/js/jquery-ui.js" strategy="afterInteractive" /> */}
        <Script src="/assets/js/marquee.min.js" strategy="afterInteractive" />
=======
        {/* <Script src="/assets/js/aos.js" strategy="afterInteractive" />  */}
        <Script src="/assets/js/phosphor-icon.js" strategy="afterInteractive" />
        <Script src="/assets/js/jquery-ui.js" strategy="afterInteractive" />
        <Script src="/assets/js/marque.min.js" strategy="afterInteractive" />
>>>>>>> 6285099065f4dba0a1b7d9ab590fe9b5d1a54d8a
        <Script src="/assets/js/vanilla-tilt.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/counter.min.js" strategy="afterInteractive" />

        {/* Luôn sau cùng để init mọi thứ */}
        <Script src="/assets/js/wow.min.js" strategy="afterInteractive" />
        {/* Cờ điều khiển tính năng của theme */}
        <Script id="theme-flags" strategy="afterInteractive">
        {`window.__THEME__ = { enableGlobalSearch: false };`}
        </Script>
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
