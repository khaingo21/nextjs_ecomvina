"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useCart, Gia } from "@/hooks/useCart"; 

type PriceInput = number | Gia | undefined | null;

const getPrice = (gia: PriceInput): number => {
  if (typeof gia === "number") return gia;
  // Dùng optional chaining (?.) và nullish coalescing (??) để an toàn
  return Number(gia?.current ?? 0);
};

const getOriginPrice = (gia: PriceInput): number => {
  if (typeof gia === "object" && gia !== null) {
    return Number(gia.before_discount ?? 0);
  }
  // Nếu giá là số hoặc null/undefined thì giá gốc mặc định là 0 (hoặc logic khác tùy bạn)
  return 0; 
};

export default function Page() {
  const { 
    items, 
    loading, 
    updateQuantity, 
    removeItem, 
    subtotal, 
    discountAmount, 
    total, 
    applyVoucher, 
    removeVoucher, 
    appliedVoucher 
  } = useCart();

  // State cục bộ cho ô nhập voucher
  const [voucherCode, setVoucherCode] = useState("");

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    // Mock logic: Gọi hàm applyVoucher với object voucher giả lập
    // Thực tế bạn sẽ gọi API check voucher ở đây
    applyVoucher({ id: 1, code: voucherCode, giatri: 50000, mota: "Giảm 50k" });
    setVoucherCode("");
  };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />

      <section className="py-40 cart">
        <div className="container">
          <div className="mb-20">
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.25rem" }}>Giỏ hàng của bạn</h5>
            <p className="text-neutral-500">
               Có {items.length} sản phẩm trong giỏ hàng
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-24 text-center border border-gray-100 rounded-8">
              Giỏ hàng trống. <Link href="/" className="text-main-600">Tiếp tục mua sắm</Link>
            </div>
          ) : (
            <div className="row gy-4">
              {/* LEFT: Bảng sản phẩm */}
              <div className="col-xl-9 col-lg-8">
                <div className="px-20 pt-20 border border-gray-100 cart-table rounded-8">
                  <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                    <table className="table style-three">
                      <thead>
                        <tr>
                          <th className="mb-0 text-lg h6 fw-bold pe-10">Hành động</th>
                          <th className="mb-0 text-lg h6 fw-bold">Sản phẩm</th>
                          <th className="mb-0 text-lg h6 fw-bold">Giá</th>
                          <th className="mb-0 text-lg h6 fw-bold">Số lượng</th>
                          <th className="mb-0 text-lg h6 fw-bold ps-10">Thành tiền</th>
                        </tr>
                      </thead>

                      <tbody>
                        {items.map((row) => {
                          // Sử dụng fallback an toàn, không ép kiểu as Product
                          const p = row.product || {}; 
                          const img = p.mediaurl || "/assets/images/thumbs/placeholder.png";
                          const title = p.ten || "Đang tải...";
                          const category = p.category || "Sản phẩm";
                          const rowId = row.id_giohang ?? "";
                          
                          const price = Number(p.gia?.current ?? 0);
                          const origin = Number(p.gia?.before_discount ?? 0);
                          const qty = Number(row.quantity || 0);
                          const lineTotal = price * qty;

                          return (
                            <tr key={row.id_bienthe}>
                              <td className="px-5 py-15">
                                <button
                                  type="button"
                                  className="gap-8 flex-align hover-text-danger-600"
                                  onClick={() => removeItem(rowId)}
                                  disabled={loading}
                                  title="Xóa"
                                >
                                  <i className="text-2xl ph ph-trash d-flex"></i>
                                </button>
                              </td>

                              <td className="px-5 py-15">
                                <div className="gap-24 d-flex align-items-center">
                                  <Link href={`/products/${p.id || row.id_bienthe}`} className="border border-gray-100 table-product__thumb rounded-8 flex-center">
                                    <Image src={img} alt={title} width={96} height={96} objectFit="contain" />
                                  </Link>

                                  <div className="table-product__content text-start">
                                    <h6 className="mb-8 text-lg title fw-semibold">
                                      <Link href={`/products/${p.id || row.id_bienthe}`} className="link text-line-2">
                                        {title}
                                      </Link>
                                    </h6>
                                    <span className="text-sm text-neutral-600">{category}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-15">
                                <span className="mb-0 text-lg h6 fw-medium">
                                  {price.toLocaleString("vi-VN")} đ
                                  {origin > price && (
                                    <span className="text-sm text-gray-400 d-block text-decoration-line-through">
                                      {origin.toLocaleString("vi-VN")} đ
                                    </span>
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-15">
                                <div className="overflow-hidden border border-gray-100 d-flex rounded-4" style={{ width: 'fit-content' }}>
                                  <button
                                    type="button"
                                    className="px-12 py-8 hover-bg-gray-100 border-end"
                                    onClick={() => updateQuantity(rowId, Math.max(1, qty - 1))}
                                    disabled={loading || qty <= 1}
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    readOnly
                                    value={qty}
                                    className="w-40 text-center border-0"
                                    style={{ outline: 'none' }}
                                  />
                                  <button
                                    type="button"
                                    className="px-12 py-8 hover-bg-gray-100 border-start"
                                    onClick={() => updateQuantity(rowId, qty + 1)}
                                    disabled={loading}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

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
                </div>
              </div>

              {/* RIGHT: Sidebar tổng tiền */}
              <div className="col-xl-3 col-lg-4">
                <div className="px-24 py-20 border border-gray-100 cart-sidebar rounded-8">
                  <h6 className="mb-32 text-xl">Thông tin đơn hàng</h6>

                  {/* --- VOUCHER UI --- */}
                  <div className="mb-24">
                    <label className="mb-8 text-sm fw-semibold">Mã giảm giá</label>
                    {appliedVoucher ? (
                        <div className="p-10 border rounded d-flex justify-content-between align-items-center bg-success-50 border-success-200">
                            <span className="text-success-600 fw-medium">{appliedVoucher.code}</span>
                            <button onClick={removeVoucher} className="text-sm text-danger-600 hover-underline">Xóa</button>
                        </div>
                    ) : (
                        <div className="gap-8 d-flex">
                            <input 
                                type="text" 
                                className="text-sm form-control" 
                                placeholder="Nhập mã..." 
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                            />
                            <button 
                                onClick={handleApplyVoucher}
                                className="px-16 py-8 text-sm btn btn-main-two rounded-4"
                            >
                                Áp dụng
                            </button>
                        </div>
                    )}
                  </div>

                  <div className="p-24 bg-color-three rounded-8">
                    <div className="gap-8 mb-16 flex-between">
                      <span className="text-gray-900">Tạm tính:</span>
                      <span className="text-gray-900 fw-semibold">
                        {subtotal.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    {/* Hiển thị giảm giá nếu có */}
                    {discountAmount > 0 && (
                        <div className="gap-8 mb-16 flex-between text-success-600">
                        <span>Giảm giá:</span>
                        <span className="fw-semibold">
                            - {discountAmount.toLocaleString("vi-VN")} đ
                        </span>
                        </div>
                    )}

                    <div className="my-16 border-gray-200 border-top"></div>

                    <div className="gap-8 flex-between">
                      <span className="text-lg text-gray-900 fw-bold">Tổng cộng:</span>
                      <span className="text-xl text-main-600 fw-bold">
                        {total.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  {/* Link đến trang Thanh Toán */}
                  <Link href="/thanh-toan" className="mt-24 btn btn-main w-100 py-18 rounded-8">
                    Tiến hành thanh toán
                  </Link>
                </div>

                <Link href="/" className="mt-16 text-center d-block text-main-600 hover-text-decoration-underline">
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