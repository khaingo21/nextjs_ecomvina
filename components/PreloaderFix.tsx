// components/PreloaderFix.tsx
"use client";
import { useEffect } from "react";
export default function PreloaderFix() {
  useEffect(() => {
    const el = document.querySelector(".preloader");
    if (el) (el as HTMLElement).style.display = "none";
  }, []);
  return null;
}
// mục đích: ẩn preloader khi React khởi động xong
// tránh tình trạng preloader vẫn hiện khi React đã khởi động xong
// (do preloader được viết trong HTML tĩnh, không phải React)