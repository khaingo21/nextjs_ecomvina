"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { useCart, Gia } from "@/hooks/useCart"; 

// --- HELPER FUNCTIONS ---
type PriceInput = number | Gia | undefined | null;

const getPrice = (gia: PriceInput): number => {
  if (typeof gia === "number") return gia;
  return Number(gia?.current ?? 0);
};

const getOriginPrice = (gia: PriceInput): number => {
  if (typeof gia === "object" && gia !== null) {
    return Number(gia.before_discount ?? 0);
  }
  return 0; 
};

export default function GioHangPage() {
  const { 
    items, loading, updateQuantity, removeItem, 
    subtotal, total, discountAmount, 
    appliedVoucher, applyVoucherByCode, removeVoucher 
  } = useCart();

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);

  // TÁCH SẢN PHẨM VÀ QUÀ TẶNG
  const { mainItems, giftItems } = useMemo(() => {
    const main: typeof items = [];
    const gift: typeof items = [];
    items.forEach(item => {
      const price = getPrice(item.product?.gia);
      if (price === 0) gift.push(item);
      else main.push(item);
    });
    return { mainItems: main, giftItems: gift };
  }, [items]);

  // Xử lý áp dụng mã
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    // Gọi hàm applyVoucherByCode (đã có trong useCart mới nhất)
    // Nếu chưa có, bạn có thể dùng tạm logic giả lập ở đây
    if (applyVoucherByCode) {
        await applyVoucherByCode(voucherCode);
    } else {
        alert("Chức năng đang cập nhật");
    }
    setVoucherLoading(false);
    setVoucherCode("");
  };

  // Component render 1 dòng sản phẩm
  const renderRow = (item: typeof items[0], isGift = false) => {
    const sp = item.product || { 
        id: item.id_bienthe, 
        ten: "Đang tải...", 
        name: "Đang tải...",
        mediaurl: "/assets/images/thumbs/placeholder.png", 
        gia: { current: 0, before_discount: 0 } 
    };
    
    const tenHienThi = sp.ten ?? sp.name ?? "Sản phẩm";
    const anhHienThi = sp.mediaurl ?? sp.hinhanh ?? "/assets/images/thumbs/placeholder.png";
    const price = getPrice(sp.gia);
    const origin = getOriginPrice(sp.gia);
    const thanhTien = price * item.quantity;
    const rowKey = item.id_giohang; 

    return (
        <tr key={rowKey} className="py-10 my-10 border-gray-500 border-bottom">
            <td className="px-5 py-20">
                <div className="gap-12 d-flex align-items-center">
                    {!isGift && (
                        <button 
                            type="button" 
                            className="gap-8 flex-align hover-text-danger-600 pe-10"
                            onClick={() => removeItem(item.id_giohang)}
                        >
                            <i className="text-2xl ph ph-trash d-flex"></i>
                        </button>
                    )}
                    <Link href={`/products/${sp.id}`} className="border border-gray-100 rounded-8 flex-center" style={{maxWidth: 100, maxHeight: 100, width: "100%", height: "100%"}}>
                        <Image src={anhHienThi} alt={tenHienThi} width={100} height={100} className="w-100 rounded-8 object-fit-contain" />
                    </Link>
                    <div className="table-product__content text-start">
                        <div className="gap-16 flex-align">
                            <div className="gap-4 mb-5 flex-align">
                                <span className="text-sm text-main-two-600 d-flex"><i className="ph-fill ph-storefront"></i></span>
                                <span className="text-xs text-gray-500">STV Trading</span>
                            </div>
                        </div>
                        <h6 className="mb-0 title text-md fw-semibold">
                            <Link href={`/products/${sp.id}`} className="link text-line-2 fw-medium" title={tenHienThi} style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 250, display: "inline-block"}}>
                                {tenHienThi}
                            </Link>
                        </h6>
                        {/* Label phân loại (Mock tạm) */}
                        <div className="gap-16 mb-6 flex-align">
                            <a href="#" className="gap-8 px-6 py-6 text-xs btn bg-gray-50 text-heading rounded-8 flex-center fw-medium">
                                {sp.category || "Sản phẩm"}
                            </a>
                        </div>
                        
                        <div className="mb-6 product-card__price">
                            <div className="gap-4 text-xs flex-align text-main-two-600">
                                {origin > price && (
                                    <>
                                        <span className="text-sm text-gray-400 fw-semibold text-decoration-line-through me-4">
                                            {origin.toLocaleString("vi-VN")} đ
                                        </span>
                                        {isGift ? (
                                            <a href="#" className="gap-4 text-xs flex-align text-main-two-600">
                                                <i className="text-sm ph-fill ph-seal-percent"></i> Quà tặng miễn phí
                                            </a>
                                        ) : (
                                            <span className="text-danger-600 fw-bold">
                                                -{Math.round(((origin - price) / origin) * 100)}%
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </td>

            {/* Giá (Thêm cột giá theo mẫu mới nếu cần, hoặc ẩn đi như mẫu cũ) */}
            {/* Ở mẫu HTML bạn gửi chỉ có cột Số lượng và Thành tiền, tôi sẽ ẩn cột Giá đơn lẻ đi hoặc gộp vào thông tin sản phẩm như trên */}

            {/* Số lượng */}
            <td className="px-5 py-20">
                <div className="overflow-hidden d-flex rounded-4" style={{width: 'fit-content'}}>
                    {isGift ? (
                        <input type="text" className="w-32 px-4 py-8 text-center bg-gray-100 border quantity__input flex-grow-1 border-start-0 border-end-0" value={`x ${item.quantity}`} readOnly />
                    ) : (
                        <>
                            <button 
                                type="button" 
                                className="flex-shrink-0 w-48 h-48 border border-gray-100 quantity__minus border-end text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                                onClick={() => updateQuantity(item.id_giohang, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                            >
                                <i className="ph ph-minus"></i>
                            </button>
                            <input 
                                type="number" 
                                className="w-32 px-4 text-center border border-gray-100 quantity__input flex-grow-1 border-start-0 border-end-0" 
                                value={item.quantity} 
                                min="1"
                                readOnly
                            />
                            <button 
                                type="button" 
                                className="flex-shrink-0 w-48 h-48 border border-gray-100 quantity__plus border-end text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                                onClick={() => updateQuantity(item.id_giohang, item.quantity + 1)}
                                disabled={loading}
                            >
                                <i className="ph ph-plus"></i>
                            </button>
                        </>
                    )}
                </div>
            </td>

            {/* Thành tiền */}
            <td className="px-5 py-20">
                <span className="mb-0 text-lg h6 fw-semibold text-main-600">
                    {thanhTien.toLocaleString("vi-VN")} đ
                </span>
            </td>
        </tr>
    );
  };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />

      <section className="py-40 cart bg-white-50">
        <div className="container">

          <div className="row gy-4">
            {/* LEFT: Danh sách sản phẩm */}
            <div className="col-xl-9 col-lg-8">
                
                {/* 1. BẢNG SẢN PHẨM CHÍNH */}
                <div className="pb-0 bg-white border border-gray-100 shadow-sm cart-table rounded-8 p-30">
                    <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                        <table className="table style-three">
                            <thead>
                                <tr className="py-10 my-10 border-gray-500 border-bottom">
                                    <th className="gap-24 p-0 pb-10 mb-0 text-lg h6 fw-bold flex-align" colSpan={2}>
                                        <div className="d-flex align-items-center">
                                            <i className="text-lg ph-bold ph-shopping-cart text-main-600 pe-6"></i> 
                                            Giỏ hàng ( {mainItems.length} sản phẩm )
                                        </div>
                                    </th>
                                    <th className="p-0 pb-10 mb-0 text-lg h6 fw-bold">Số lượng</th>
                                    <th className="p-0 pb-10 mb-0 text-lg h6 fw-bold">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mainItems.map(item => renderRow(item, false))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. BẢNG QUÀ TẶNG */}
                {giftItems.length > 0 && (
                    <>
                        <div className="p-10 mt-20 font-semibold text-center text-yellow-800 border-2 border-yellow-500 border-dashed rounded-lg bg-yellow-50">
                            🎉 Bạn nhận được thêm {giftItems.length} sản phẩm Quà Tặng miễn phí trong đơn hàng này!
                        </div>

                        <div className="pb-0 mt-20 bg-white border border-gray-100 shadow-sm cart-table rounded-8 p-30">
                            <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                <table className="table style-three">
                                    <thead>
                                        <tr className="py-10 my-10 border-gray-500 border-bottom">
                                            <th className="gap-6 p-0 pb-10 mb-0 text-lg h6 fw-bold flex-align" colSpan={2}>
                                                <div className="d-flex align-items-center">
                                                    <i className="text-lg ph-bold ph-gift text-main-600 pe-6"></i> 
                                                    Quà tặng nhận được ( {giftItems.length} sản phẩm )
                                                </div>
                                            </th>
                                            <th className="p-0 pb-10 mb-0 text-lg h6 fw-bold">Số lượng</th>
                                            <th className="p-0 pb-10 mb-0 text-lg h6 fw-bold">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {giftItems.map(item => renderRow(item, true))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="col-xl-3 col-lg-4">
                <div className="p-24 bg-white border border-gray-100 shadow-sm cart-sidebar rounded-8">
                    
                    {/* KHỐI VOUCHER (Mới) */}
                    <h6 className="gap-8 mb-20 text-lg flex-align">
                        <i className="text-xl ph-bold ph-ticket text-main-600"></i>Áp dụng Voucher
                    </h6>
                    
                    {appliedVoucher ? (
                        <div className="gap-8 px-12 py-10 mt-10 border-gray-200 border-dashed flex-align flex-between rounded-4 bg-success-50">
                            <span className="gap-8 text-sm text-gray-900 flex-align fw-medium pe-10">
                                <i className="text-2xl ph-bold ph-ticket text-main-600"></i>
                                <div className="text-sm d-flex flex-column">
                                    <span className="text-sm text-gray-900 w-100">
                                        Giảm {appliedVoucher.giatri.toLocaleString("vi-VN")} đ
                                    </span>
                                    <span className="text-xs text-gray-500 w-100">
                                        {appliedVoucher.code}
                                    </span>
                                </div>
                            </span>
                            <span className="gap-8 text-xs text-gray-900 flex-align fw-medium">
                                <button 
                                    onClick={removeVoucher} 
                                    className="p-6 text-xs btn bg-danger-100 hover-bg-danger-200 text-danger-600 rounded-4"
                                >
                                    Bỏ chọn
                                </button>
                            </span>
                        </div>
                    ) : (
                        <div className="gap-8 mb-24 flex-align">
                            <input 
                                type="text" 
                                className="h-40 form-control" 
                                placeholder="Nhập mã..." 
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                            />
                            <button 
                                onClick={handleApplyVoucher}
                                disabled={voucherLoading}
                                className="flex-shrink-0 h-40 px-16 text-sm btn btn-main-two rounded-4"
                            >
                                {voucherLoading ? "..." : "Áp dụng"}
                            </button>
                        </div>
                    )}

                    <div className="my-20 border-gray-200 border-top"></div>

                    <h6 className="gap-8 mb-32 flex-align">
                        <i className="text-xl ph-bold ph-shopping-cart text-main-600"></i>Thông tin giỏ hàng
                    </h6>
                    <p className="mb-20 text-sm text-gray-500">{items.length} sản phẩm</p>

                    <div className="mb-12 flex-between">
                        <span className="text-gray-900">Tạm tính:</span>
                        <span className="text-gray-900 fw-bold">{subtotal.toLocaleString("vi-VN")} đ</span>
                    </div>

                    <div className="mb-24 flex-between">
                        <span className="text-lg text-gray-900 fw-bold">Tổng giá trị:</span>
                        <div className="text-end">
                            <span className="text-xl fw-bold text-main-600">{total.toLocaleString("vi-VN")} đ</span>
                            {discountAmount > 0 && (
                                <span className="mt-4 text-xs d-block text-success-600">
                                    Tiết kiệm: {discountAmount.toLocaleString("vi-VN")} đ
                                </span>
                            )}
                        </div>
                    </div>

                    <Link href="/thanh-toan" className="py-12 btn btn-main w-100 rounded-8 fw-bold">
                        Tiến hành thanh toán
                    </Link>
                    <Link href="/" className="mt-16 text-sm text-center d-block text-main-600 hover-underline">
                        Tiếp tục mua hàng
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
      <BenefitsStrip />
    </>
  );
}