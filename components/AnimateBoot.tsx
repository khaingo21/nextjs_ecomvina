"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos"; // dùng bản NPM

export default function AnimateBoot() {
  const pathname = usePathname();

  // khởi tạo AOS 1 lần
  useEffect(() => {
    AOS.init({ duration: 800 });
    // nếu có WOW (file rời) thì init
    if (typeof window !== "undefined" && window.WOW) {
      new window.WOW().init();
    }
  }, []);

  // refresh AOS khi điều hướng client-side
  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
