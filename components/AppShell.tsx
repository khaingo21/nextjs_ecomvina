"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GlobalChrome from "@/components/GlobalChrome";
import GlobalFooter from "@/components/GlobalFooter";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/dangnhap") || pathname?.startsWith("/dangky");

  if (isAuth) {
    // Không render header/footer global ở các trang auth
    return <>{children}</>;
  }

  return (
    <>
      <GlobalChrome />
      {children}
      <GlobalFooter />
    </>
  );
}
