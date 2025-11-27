"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

// ---- Types (loại bỏ any)
type Gia = { current?: number; before_discount?: number };
type Product = {
  id?: string | number;
  ten?: string;
  category?: string;
  mediaurl?: string;
  gia?: Gia;
  ratingAverage?: number;
  ratingCount?: number;
};
type CartItem = {
  id_bienthesp: string | number;
  gia?: Gia;
  product?: {
    id?: string | number;
    ten?: string;
    mediaurl?: string;
    gia?: { current?: number; before_discount?: number };
    ratingAverage?: number;
    ratingCount?: number;
    category?: string;
  };
  quantity: number;
};

export default function Page() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { items, loading, updateQuantity, removeItem } = useCart() as {
    items: CartItem[];
    loading: boolean;
    updateQuantity: (id: CartItem["id_bienthesp"], q: number) => void;
    removeItem: (id: CartItem["id_bienthesp"]) => void;
  };

  // selected item ids
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(() => new Set());

  // keep selection in sync when items change (remove ids that no longer exist)
  useEffect(() => {
    if (!items || !items.length) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds((prev) => {
      const s = new Set(prev);
      const valid = new Set(items.map((it) => it.id_bienthesp));
      let changed = false;
      for (const id of Array.from(s)) {
        if (!valid.has(id)) {
          s.delete(id);
          changed = true;
        }
      }
      return changed ? s : prev;
    });
  }, [items]);

  const anySelected = selectedIds.size > 0;
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(items.map((it) => it.id_bienthesp)));
  };

  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    const ids = Array.from(selectedIds);
    // remove sequentially to keep mock server stable
    for (const id of ids) {
      try {
        await removeItem(id);
      } catch {
        // ignore
      }
    }
    setSelectedIds(new Set());
  };

  // compute totals based on selection (if none selected => use all)
  const usedItems = useMemo(() => {
    if (selectedIds.size === 0) return items;
    return items.filter((it) => selectedIds.has(it.id_bienthesp));
  }, [items, selectedIds]);

  const money = useMemo(() => {
    let subtotal = 0;
    let discount = 0;
    for (const it of usedItems) {
      const p = it.product ?? ({} as Product);
      const price = Number(p.gia?.current ?? 0);
      const origin = Number(p.gia?.before_discount ?? 0);
      subtotal += price * (it.quantity || 0);
      if (origin > price) discount += (origin - price) * (it.quantity || 0);
    }
    return { subtotal, discount, total: Math.max(0, subtotal) };
  }, [usedItems]);

  // counts to show in sidebar / header
  const itemCount = items.reduce((s, it) => s + (it.quantity || 0), 0); // total quantity across cart
  const giftCount = items.filter((it) => {
    const price = Number(it.product?.gia?.current ?? it.gia?.current ?? 0);
    return price === 0;
  }).reduce((s, it) => s + (it.quantity || 0), 0);
  const selectedCount = usedItems.reduce((s, it) => s + (it.quantity || 0), 0);

  const proceedToCheckout = () => {
    // if none selected, proceed with all items (keeps previous behaviour)
    const toCheckout = (selectedIds.size === 0 ? items : items.filter((it) => selectedIds.has(it.id_bienthesp))).map(
      (it) => ({
        id_bienthesp: it.id_bienthesp,
        product: it.product,
        quantity: it.quantity,
      })
    );
    try {
      sessionStorage.setItem("checkout_cart", JSON.stringify(toCheckout));
    } catch { }
    router.push("/thanh-toan");
  };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />

      <section className="py-40 cart">
        <div className="container">
          <div className="mb-20 d-flex align-items-center justify-content-between">
            <div className="gap-12 d-flex align-items-center">
              <i className="ph ph-shopping-cart text-main-600" style={{ fontSize: 22 }} aria-hidden />
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>
                Giỏ hàng ({itemCount} sản phẩm)
              </h5>
            </div>
            <div>
              {/* optional user tag */}
              {/* <p className="text-neutral-500">{authUser?.name ? `@${authUser.name}` : `Bạn đang có ${items.length} sản phẩm`}</p> */}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="p-24 text-center border border-gray-100 rounded-8">
              Giỏ hàng trống. <Link href="/" className="text-main-600">Tiếp tục mua sắm</Link>
            </div>
          ) : (
            <div className="row gy-4">
              {/* LEFT: Bảng sản phẩm */}
              <div className="col-xl-8 col-lg-8">
                <div className="px-20 pt-20 border border-gray-100 cart-table rounded-8">
                  <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                    <table className="table style-three">
                      <thead>
                        <tr>
                          <th className="mb-0 text-lg h6 fw-bold pe-10">
                            <label style={{ cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                aria-label="Chọn tất cả"
                                style={{ marginRight: 8 }}
                              />
                              Hành động
                            </label>
                          </th>
                          <th className="mb-0 text-lg h6 fw-bold">Sản phẩm</th>
                          <th className="mb-0 text-lg h6 fw-bold">Giá</th>
                          <th className="mb-0 text-lg h6 fw-bold">Số lượng</th>
                          <th className="mb-0 text-lg h6 fw-bold ps-10">Thành tiền</th>
                        </tr>
                      </thead>

                      <tbody>
                        {items.map((row) => {
                          const p = row.product ?? ({} as Product);
                          const img = p.mediaurl || "/assets/images/thumbs/placeholder.png";
                          const title = p.ten || "Sản phẩm";
                          const category = p.category || "Camera";
                          const price = Number(p.gia?.current ?? 0);
                          const origin = Number(p.gia?.before_discount ?? 0);
                          const qty = Number(row.quantity || 0);
                          const lineTotal = price * qty;
                          const checked = selectedIds.has(row.id_bienthesp);

                          return (
                            <tr key={String(row.id_bienthesp)}>
                              {/* Hành động */}
                              <td className="px-5 py-15">
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleSelect(row.id_bienthesp)}
                                    aria-label={`Chọn ${title}`}
                                  />
                                  <button
                                    type="button"
                                    className="gap-8 flex-align hover-text-danger-600"
                                    onClick={() => removeItem(row.id_bienthesp)}
                                    disabled={loading}
                                    title="Xóa"
                                  >
                                    <i className="text-2xl ph ph-trash d-flex"></i>
                                    Xóa
                                  </button>
                                </div>
                              </td>

                              {/* Sản phẩm */}
                              <td className="px-5 py-15">
                                <div className="gap-24 d-flex align-items-center">
                                  <Link
                                    href={`/products/${String(p.id ?? row.id_bienthesp)}`}
                                    className="border border-gray-100 table-product__thumb rounded-8 flex-center"
                                  >
                                    <Image src={img} alt={title} width={96} height={96} />
                                  </Link>

                                  <div className="table-product__content text-start">
                                    <h6 className="mb-8 text-lg title fw-semibold">
                                      <Link
                                        href={`/products/${String(p.id ?? row.id_bienthesp)}`}
                                        className="link text-line-2"
                                      >
                                        {title}
                                      </Link>
                                    </h6>

                                    <div className="gap-16 mb-16 flex-align">
                                      <div className="gap-6 flex-align">
                                        <span className="text-md fw-medium text-warning-600 d-flex">
                                          <i className="ph-fill ph-star"></i>
                                        </span>
                                        <span className="text-gray-900 text-md fw-semibold">
                                          {Number(p.ratingAverage ?? 4.8).toFixed(1)}
                                        </span>
                                      </div>
                                      <span className="text-sm text-gray-200 fw-medium">|</span>
                                      <span className="text-sm text-neutral-600">
                                        {Number(p.ratingCount ?? 128)} đánh giá
                                      </span>
                                    </div>

                                    <div className="gap-16 flex-align">
                                      <Link
                                        href="/cart"
                                        className="gap-8 px-8 text-sm product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-7 rounded-8 flex-center fw-medium"
                                      >
                                        {category}
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Giá */}
                              <td className="px-5 py-15">
                                <span className="mb-0 text-lg h6 fw-medium">
                                  {price.toLocaleString("vi-VN")} đ
                                  {origin > price && (
                                    <h6 className="mb-0 text-sm text-gray-400 fw-medium text-decoration-line-through">
                                      {origin.toLocaleString("vi-VN")} đ
                                    </h6>
                                  )}
                                </span>
                              </td>

                              {/* Số lượng */}
                              <td className="px-5 py-15">
                                <div className="overflow-hidden d-flex rounded-4">
                                  <button
                                    type="button"
                                    className="flex-shrink-0 w-48 h-48 border border-gray-100 quantity__minus border-end text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                                    onClick={() => updateQuantity(row.id_bienthesp, Math.max(1, qty - 1))}
                                    disabled={loading || qty <= 1}
                                  >
                                    <i className="ph ph-minus"></i>
                                  </button>

                                  <input
                                    type="number"
                                    readOnly
                                    value={qty}
                                    min={1}
                                    className="w-32 px-4 text-center border border-gray-100 quantity__input flex-grow-1 border-start-0 border-end-0"
                                  />

                                  <button
                                    type="button"
                                    className="flex-shrink-0 w-48 h-48 border border-gray-100 quantity__plus border-end text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                                    onClick={() => updateQuantity(row.id_bienthesp, qty + 1)}
                                    disabled={loading}
                                  >
                                    <i className="ph ph-plus"></i>
                                  </button>
                                </div>
                              </td>

                              {/* Thành tiền */}
                              <td className="px-5 py-15">
                                <span className="mb-0 text-lg h6 fw-semibold text-main-600">
                                  {lineTotal.toLocaleString("vi-VN")} đ
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* controls: select all + delete selected */}
                  <div className="mt-16 d-flex justify-content-between align-items-center">
                    <div className="gap-12 d-flex align-items-center">
                      <label style={{ cursor: "pointer" }}>
                        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={{ marginRight: 8 }} />
                        Chọn tất cả
                      </label>
                      <button className="btn btn-ghost text-danger" onClick={deleteSelected} disabled={!anySelected}>
                        Xóa mục đã chọn ({selectedIds.size})
                      </button>
                    </div>

                    <div>
                      <Link href="/" className="text-main-600">← Tiếp tục mua sắm</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Sidebar tổng tiền */}
              <div className="col-xl-4 col-lg-4">
                <div className="px-24 py-20 border border-gray-100 cart-sidebar rounded-8">
                  {/* header: icon + title (counts dưới tiêu đề, kiểu chữ nhỏ, không in đậm) */}
                  <div className="mb-12">
                    <div className="d-flex align-items-center" style={{ gap: 12 }}>
                      <i className="ph ph-shopping-cart text-main-600" style={{ fontSize: 20 }} aria-hidden />
                      <h6 className="mb-0" style={{ fontSize: "0.95rem", whiteSpace: "nowrap", margin: 0 }}>
                        Thông tin giỏ hàng
                      </h6>
                    </div>

                    <div className="mt-8 text-sm text-neutral-600" style={{ lineHeight: 1 }}>
                      {selectedIds.size === 0 ? itemCount : selectedCount} sản phẩm
                      {giftCount > 0 && <span className="ms-8">+ {giftCount} quà tặng</span>}
                    </div>
                  </div>

                  <div className="p-24 bg-color-three rounded-8">
                    <div className="gap-8 mb-16 flex-between">
                      <span className="text-gray-900 font-heading-two">Tạm tính:</span>
                      <span className="text-gray-900 fw-semibold">
                        {money.subtotal.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="gap-8 mb-16 flex-between align-items-center">
                      <span className="text-gray-900 font-heading-two">Giảm giá:</span>
                      <span className="fw-bold" style={{ color: "#1ca56e" }}>
                        {money.discount > 0 ? `- ${money.discount.toLocaleString("vi-VN")} đ` : "0 đ"}
                      </span>
                    </div>

                    <div className="gap-8 mb-8 flex-between">
                      <span className="text-lg text-gray-900 fw-semibold">Tổng:</span>
                      <span className="text-lg text-main-600 fw-bold">
                        {money.total.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {money.discount > 0 && (
                      <div className="mt-4 text-sm" style={{ color: "#1ca56e" }}>
                        Tiết kiệm được {money.discount.toLocaleString("vi-VN")} đ
                      </div>
                    )}
                  </div>

                  <button onClick={proceedToCheckout} className="mt-24 btn btn-main w-100 py-18 rounded-8">
                    Tiến hành thanh toán
                  </button>
                </div>

                <Link href="/" className="mt-16 text-center d-block text-main-600">
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <BenefitsStrip />
    </>
  );
}