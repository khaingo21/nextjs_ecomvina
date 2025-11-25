"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const OrderLookupForm = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [searchMadon, setSearchMadon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const code = (searchMadon || "").trim();
    if (!code) return;
    setLoading(true);
    try {
      // 1) fetch API directly (fast path) and cache result to sessionStorage
      const API = process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";
      const headers: Record<string, string> = { Accept: "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = `${API}/api/toi/theodoi-donhang?madon=${encodeURIComponent(code)}`;
      const res = await fetch(url, { credentials: "include", headers });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json) {
          try {
            sessionStorage.setItem(`order_lookup:${code}`, JSON.stringify(json));
          } catch (e) {
            // ignore storage errors
          }
        }
      }
      // 2) navigate to page (OrderLookupResult will read sessionStorage first then fallback to fetch)
      router.push(`/tra-cuu-don-hang?madon=${encodeURIComponent(code)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="gap-8 px-16 py-16 mb-20 border border-gray-200 d-flex flex-column rounded-8"
    >
      <label className="pb-2 text-lg text-gray-900 fw-semibold" htmlFor="madon">
        Tra cứu đơn hàng
      </label>

      <input
        id="madon"
        name="madon"
        value={searchMadon}
        onChange={(e) => setSearchMadon(e.target.value)}
        placeholder="Nhập mã đơn hàng (không bao gồm dấu #)... "
        className="px-16 py-12 text-sm text-gray-900 border-gray-300 common-input w-100 rounded-4"
        autoComplete="off"
      />

      <button
        type="submit"
        className="px-16 py-12 text-sm text-white border bg-main-600 hover-bg-white hover-text-main-900 hover-border-main-600 rounded-4 w-100 transition-1 fw-medium"
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? "Đang tra cứu…" : "Tra cứu"}
      </button>
    </form>
  );
};

export default OrderLookupForm;