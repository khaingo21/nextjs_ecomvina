"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type ServerProduct = {
  id?: number | string;
  ten?: string;
  tensanpham?: string;
  name?: string;
  hinhanh?: string;
  mediaurl?: string;
  giaban?: number;
  giagoc?: number;
  [key: string]: unknown;
};

type ServerBienthe = {
  id?: number | string;
  giagoc?: number;
  soluong_kho?: number;
  loaibienthe?: { id?: number; ten?: string };
  sanpham?: ServerProduct;
  detail?: ServerProduct;
  [key: string]: unknown;
};

type ServerChitiet = {
  id?: number;
  soluong?: number;
  dongia?: number;
  trangthai?: string;
  tong_tien?: number;
  bienthe?: ServerBienthe;
  [key: string]: unknown;
};

type ServerDonhang = {
  id?: number;
  madon?: string;
  tongsoluong?: number;
  tamtinh?: number;
  thanhtien?: number;
  trangthaithanhtoan?: string;
  trangthai?: string;
  chitietdonhang?: ServerChitiet[];
  created_at?: string; // thêm kiểu cho created_at thay vì dùng any
  [key: string]: unknown;
};

type ServerGroup = {
  label?: string;
  trangthai?: string;
  soluong?: number;
  donhang?: ServerDonhang[];
};

type ApiResponse = {
  status?: boolean;
  message?: string;
  data?: ServerGroup[];
  [key: string]: unknown;
};

export default function OrderLookupResult() {
  const search = useSearchParams();
  const code = search?.get("madon")?.trim() ?? "";
  const { token } = useAuth();
  const [order, setOrder] = useState<ServerDonhang | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [expanded, setExpanded] = useState<boolean>(false);

  const formatVND = (n?: number) =>
    typeof n === "number" ? n.toLocaleString("vi-VN") + " đ" : "0 đ";

  useEffect(() => {
    if (!code) {
      setOrder(null);
      setError(null);
      return;
    }
    let mounted = true;

    const findOrderInGroups = (groups: ServerGroup[] | undefined, target: string): ServerDonhang | null => {
      if (!groups) return null;
      for (const g of groups) {
        const list = g.donhang ?? [];
        for (const dh of list) {
          if ((dh.madon ?? "").toString() === target) return dh;
        }
      }
      return null;
    };

    (async () => {
      setLoading(true);
      setError(null);
      setOrder(null);
      try {
        const API = process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // Try main endpoint (returns groups)
        const tryUrl = `${API}/api/toi/theodoi-donhang?madon=${encodeURIComponent(code)}`;
        let res = await fetch(tryUrl, { credentials: "include", headers });
        let j: ApiResponse | null = null;
        if (res.ok) {
          j = await res.json().catch(() => null);
        }

        let found: ServerDonhang | null = null;
        if (j) {
          found = findOrderInGroups(j.data, code);
        }

        // fallback: try /api/toi/theodoi-donhang/{madon}
        if (!found) {
          const tryUrl2 = `${API}/api/toi/theodoi-donhang/${encodeURIComponent(code)}`;
          res = await fetch(tryUrl2, { credentials: "include", headers });
          if (res.ok) {
            const j2 = await res.json().catch(() => null);

            if (j2) {
              // nếu j2.data là groups -> search
              if (Array.isArray((j2 as ApiResponse).data)) {
                found = findOrderInGroups((j2 as ApiResponse).data, code);
              } else if (Array.isArray(j2)) {
                // nếu trả array, duyệt các entry (type: unknown)
                const entries = j2 as unknown[];
                for (const entry of entries) {
                  if (!entry || typeof entry !== "object") continue;
                  const obj = entry as Record<string, unknown>;
                  // nếu entry là order
                  if (typeof obj["madon"] === "string" || typeof obj["madon"] === "number") {
                    if (String(obj["madon"]) === code) {
                      found = obj as ServerDonhang;
                      break;
                    }
                  }
                  // nếu entry là nhóm có donhang
                  if (Array.isArray(obj["donhang"])) {
                    const maybeGroups: ServerGroup[] = [obj as ServerGroup];
                    const tmp = findOrderInGroups(maybeGroups, code);
                    if (tmp) { found = tmp; break; }
                  }
                }
              } else if (typeof j2 === "object" && j2 !== null) {
                const obj = j2 as Record<string, unknown>;
                if ((typeof obj["madon"] === "string" || typeof obj["madon"] === "number") && String(obj["madon"]) === code) {
                  found = j2 as ServerDonhang;
                }
              }
            }
          }
        }

        if (mounted) {
          if (found) setOrder(found);
          else setError("Không tìm thấy đơn hàng.");
        }
      } catch (err) {
        if (mounted) setError("Không tìm thấy đơn hàng hoặc lỗi kết nối");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [code, token]);

  if (!code) return null;

  return (
    <div className="mb-20">
      {loading && <div className="p-12 bg-white border rounded-8">Đang tải thông tin đơn hàng...</div>}
      {error && <div className="p-12 border bg-warning-50 rounded-8 text-danger">{error}</div>}

      {order && (
        <div className="p-16 bg-white border border-gray-100 rounded-12">
          <div className="flex-wrap d-flex justify-content-between align-items-start" style={{ gap: 12 }}>
            <div style={{ display: "flex", gap: 12, minWidth: 0, flex: 1 }}>
              <div style={{ width: 72, height: 72, flex: "0 0 72px" }}>
                {/* thumbnail from first item */}
                <img
                  src={String((order.chitietdonhang?.[0]?.bienthe?.sanpham?.hinhanh) ?? "/assets/images/thumbs/default.png")}
                  alt="thumb"
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="gap-8 d-flex align-items-center" style={{ marginBottom: 6 }}>
                  <div className="fw-semibold text-truncate">Đơn #{order.madon ?? order.id}</div>
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      background: "#fff2cc",
                    }}
                  >
                    {order.trangthai ?? order.trangthaithanhtoan}
                  </span>
                </div>
                <div className="text-sm text-gray-600" style={{ marginBottom: 8 }}>
                  {order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : ""}
                </div>
                {order.chitietdonhang && order.chitietdonhang[0] && (
                  <div>
                    <div className="fw-medium text-truncate" title={order.chitietdonhang[0].bienthe?.sanpham?.ten}>
                      {order.chitietdonhang[0].bienthe?.sanpham?.ten ?? "Sản phẩm"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.tongsoluong && order.tongsoluong > 1 ? `x${order.tongsoluong}` : `Số lượng: ${order.chitietdonhang[0].soluong ?? 1}`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ textAlign: "right", flex: "0 0 auto" }}>
              <div className="text-sm text-gray-600">Tổng tiền</div>
              <div className="fw-bold text-primary fs-6">{formatVND(order.thanhtien ?? order.tamtinh)}</div>
              <div className="gap-8 d-flex justify-content-end align-items-center" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-outline-main-two btn-sm"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? "Thu gọn" : "Chi tiết"}
                </button>
              </div>
            </div>
          </div>

          {expanded && Array.isArray(order.chitietdonhang) && (
            <div className="pt-12 mt-12 border-top">
              {order.chitietdonhang.map((it) => {
                const prod = it.bienthe?.sanpham ?? it.bienthe?.detail;
                const name = prod?.ten ?? prod?.tensanpham ?? "Sản phẩm";
                const img = prod?.hinhanh ?? prod?.mediaurl ?? "/assets/images/thumbs/placeholder.png";
                const qty = it.soluong ?? 1;
                const price = it.dongia ?? it.tong_tien ?? it.bienthe?.giagoc ?? 0;
                return (
                  <div key={String(it.id)} className="gap-3 p-3 mb-3 border rounded d-flex align-items-center bg-light">
                    <img src={String(img)} alt={name} width={50} height={50} className="rounded" style={{ objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div className="text-sm fw-medium">{name}</div>
                      <div className="text-xs text-muted">x{qty}</div>
                    </div>
                    <div className="text-sm fw-bold">{formatVND(price)}</div>
                  </div>
                );
              })}

              <div className="mt-2 text-sm text-end">
                <span className="text-muted me-2">Thanh toán:</span>
                <span className={order.trangthaithanhtoan === "Đã thanh toán" ? "text-success fw-bold" : "text-warning fw-bold"}>
                  {order.trangthaithanhtoan ?? "Chưa thanh toán"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
 }