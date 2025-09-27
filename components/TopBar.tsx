"use client";
import React from "react";

export default function TopBar() {
  return (
    <div
      style={{
        background: "#e6583e", // orange-red from sample
        color: "#fff",
        fontSize: 13,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left links */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <a href="#" style={linkStyle}>Truy cập bán hàng</a>
          <span style={sepStyle}>•</span>
          <a href="#" style={linkStyle}>Đăng ký đối tác</a>
          <span style={sepStyle}>•</span>
          <a href="#" style={linkStyle}>Giới thiệu về Siêu Thị Vina</a>
          <span style={sepStyle}>•</span>
          <a href="#" style={linkStyle}>Liên hệ hỗ trợ</a>
        </div>

        {/* Right links */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <a href="#" style={linkStyle}>Danh mục</a>
          <span style={sepStyle}>•</span>
          <a href="#" style={linkStyle}>Tra cứu đơn hàng</a>
          <span style={sepStyle}>•</span>
          <a href="#" style={linkStyle}>Giỏ hàng</a>
        </div>
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  opacity: 0.95,
};

const sepStyle: React.CSSProperties = {
  opacity: 0.7,
};
