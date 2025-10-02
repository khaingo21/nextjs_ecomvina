"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Keyword = { id: number; dulieu: string; soluot: number };

export default function SearchBox() {
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://127.0.0.1:8000";
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Keyword[]>([]);
  const router = useRouter();

  // Debounce fetch gợi ý
  React.useEffect(() => {
    const ctrl = new AbortController();
    if (!q.trim()) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`${API}/api/tukhoas?per_page=5&q=${encodeURIComponent(q.trim())}`, {
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
      })
        .then((r) => r.json())
        .then((res) => setItems(Array.isArray(res?.data) ? res.data : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q, API]);

  const goResult = (kw: string) => {
    // Điều hướng tới trang kết quả (tự chọn path của ní)
    router.push(`/search?q=${encodeURIComponent(kw)}`);
  };

  const onSelect = async (k: Keyword) => {
    // tăng lượt cho keyword đã có
    try {
      await fetch(`${API}/api/tukhoas/${k.id}`, { method: "PUT" });
    } catch {}
    setQ(k.dulieu);
    setOpen(false);
    goResult(k.dulieu);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const kw = q.trim();
    if (!kw) return;

    // Nếu đã có trong danh sách gợi ý, tăng lượt; nếu chưa có, tạo mới
    const existed = items.find((x) => x.dulieu.toLowerCase() === kw.toLowerCase());
    try {
      if (existed) {
        await fetch(`${API}/api/tukhoas/${existed.id}`, { method: "PUT" });
      } else {
        await fetch(`${API}/api/tukhoas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dulieu: kw, soluot: 1 }),
        });
      }
    } catch {}
    setOpen(false);
    goResult(kw);
  };

  return (
    <div className="position-relative w-100">
      <form onSubmit={onSubmit} className="position-relative w-100">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => q && setOpen(true)}
          className="py-10 text-sm shadow-none form-control fw-normal placeholder-italic bg-neutral-30 placeholder-fw-normal placeholder-light ps-30 pe-60"
          placeholder="Thuốc giảm cân dành cho người béo...."
          aria-label="Tìm kiếm sản phẩm"
        />
        <button type="submit"
          className="text-xl position-absolute top-50 translate-middle-y text-main-600 end-0 me-36 line-height-1"
          aria-label="Tìm">
          <i className="ph-bold ph-magnifying-glass"></i>
        </button>
      </form>

      {/* Dropdown gợi ý */}
      {open && (q || loading) && (
        <div
          className="p-8 mt-2 bg-white border border-gray-100 position-absolute w-100 rounded-8"
          style={{ zIndex: 50 }}
          onMouseDown={(e) => e.preventDefault()} // tránh blur khi click
        >
          {loading && <div className="px-8 py-4 text-sm text-gray-600">Đang tìm…</div>}
          {!loading && items.length === 0 && (
            <div className="px-8 py-4 text-sm text-gray-600">Không có gợi ý.</div>
          )}
          {!loading &&
            items.map((k) => (
              <button
                key={k.id}
                type="button"
                className="px-8 py-6 w-100 text-start hover-bg-neutral-50 rounded-6"
                onClick={() => onSelect(k)}
              >
                {k.dulieu} <span className="text-xs text-gray-500">({k.soluot})</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
