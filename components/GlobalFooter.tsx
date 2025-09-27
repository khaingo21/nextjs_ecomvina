"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function GlobalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/product-details-two")) return null;
  return <Footer />;
}
