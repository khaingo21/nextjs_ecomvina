"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import { api } from "@/lib/api";
import Link from "next/link";
import { getTrangThaiDonHang, getPhuongThucThanhToan } from "@/utils/chitietdh"

type StatusPayload = {
  id: string;
  status: "cash_on_delivery" | "online_payment" | "pending";
  rawStatus?: string;
  amount?: number;
  paymentMethod?: string;
  paid_at?: string | null;
};

type ApiResp<T> = { status?: boolean; data?: T; message?: string };

type ServerOrder = {
  id: string;
  amount?: number;
  status: 'pending' | 'paid' | 'failed' | 'cod_created';
  paymentMethod: 'online' | 'cod';
  paid_at?: string | null;
};

export default function Page() {
  const sp = useSearchParams();
  const orderId = sp.get("order_id") || "";
  const result = sp.get("result"); // 'success' | 'fail' | null

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<StatusPayload | null>(null);

  useEffect(() => {
  (async () => {
    try {
      if (!orderId) {
        setInfo(null);
        setLoading(false);
        return;
      }
      
      const res = await api.get<ApiResp<ServerOrder>>(
        `/api/orders/${encodeURIComponent(orderId)}`,
        { credentials: "include" }
      );

      if (res?.status && res?.data) {
        const o = res.data;
        const normalized: StatusPayload["status"] =
          o.paymentMethod === "cod"
            ? "cash_on_delivery"
            : o.status === "paid"
            ? "online_payment"
            : "pending";

        setInfo({
          id: o.id,
          status: normalized,
          rawStatus: o.status,
          amount: o.amount,
          paymentMethod: o.paymentMethod,
          paid_at: o.paid_at ?? null,
        });
      } else {
        setInfo(null);
      }
    } catch {
      setInfo(null);
    } finally {
      setLoading(false);
    }
  })();
}, [orderId]);


  const title =
    result === "fail"
      ? "Thanh toán thất bại"
      : info?.status === "cash_on_delivery"
      ? "Đặt hàng thành công (Thanh toán COD)"
      : info?.status === "online_payment"
      ? "Thanh toán trực tuyến thành công"
      : "Đang xác minh thanh toán...";

      // const getOrderStatusLabel = (status: string): string => {
      //   switch (status) {
      //     case 'paid':
      //       return 'Đã thanh toán';
      //     case 'pending':
      //       return 'Chờ thanh toán';
      //     case 'shipped':
      //       return 'Đang vận chuyển';
      //     case 'delivered':
      //       return 'Đã giao hàng';
      //     case 'Đã đặt':
      //       return 'Đã đặt hàng';
      //     default:
      //       return 'Chưa rõ trạng thái';
      //   }
      // };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />
      <div className="container py-20 text-center">
        <h2 className="mb-8 text-lg">{title}</h2>

        {loading && <div>Đang tải thông tin đơn hàng...</div>}

        {!loading && !info && (
          <div className="text-danger-600">Không tìm thấy thông tin đơn hàng.</div>
        )}

        {!loading && info && (
          <div className="mx-auto" style={{ maxWidth: 560 }}>
            <div className="p-16 border rounded-8 text-start">
              <div className="mb-8"><b>Mã đơn:</b> {info.id}</div>
              <div className="mb-8"><b>Trạng thái:</b> {info.status} {info.rawStatus ? `(${info.rawStatus})` : ""}</div>
              {typeof info.amount === "number" && (
                <div className="mb-8"><b>Số tiền:</b> {info.amount.toLocaleString("vi-VN")} đ</div>
              )}
              {info.paid_at && <div className="mb-8"><b>Thanh toán lúc:</b> {new Date(info.paid_at).toLocaleString("vi-VN")}</div>}
              <Link href="/" className="text-white btn btn-main-600">Tiếp tục mua sắm</Link>
            </div>
          </div>
        )}
      </div>
      <BenefitsStrip />
    </>
  );
}
