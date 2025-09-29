import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "example.com" },
      // thêm các domain ảnh thật sự dùng
      {
        protocol: "http",          // vì đang là http
        hostname: "localhost",
        port: "8000",              // cổng API
        pathname: "/**",           // cho phép mọi đường dẫn ảnh
      },
    ],
  },
};

export default nextConfig;
