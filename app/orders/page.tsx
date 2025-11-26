"use client";

import React from "react";
import AccountShell from "@/components/AccountShell";
import FullHeader from "@/components/FullHeader";
import { useRouter } from "next/navigation";
import { getTrangThaiDonHang } from "@/utils/chitietdh";

// --- 1. Định nghĩa Type cho Frontend (Dùng để hiển thị) ---
type OrderItem = {
  id: number;
  name?: string;
  quantity?: number;
  price?: number; // Đã map từ dongia
  image?: string; // Đã map từ bienthe.sanpham.hinhanh
};

type ShippingInfo = {
  provider?: string;
  tracking?: string;
  tracking_url?: string;
  trangthai?: string;
  address?: string;
};

type Order = {
  id: number;
  madon?: string; // Code đơn hàng
  created_at?: string;
  trangthai?: string; // Status tiếng Anh (pending, shipping...)
  trangthai_goc?: string; // Status tiếng Việt (để hiển thị)
  total?: number;
  chitietdonhang?: OrderItem[];
  shipping?: ShippingInfo;
  paid?: boolean;
  reviewed?: boolean;
};

// --- 2. Định nghĩa Type cho API Response (Để tránh lỗi 'any') ---
// Cấu trúc dựa trên file docx bạn cung cấp: bienthe -> sanpham -> ten/hinhanh

interface ApiSanpham {
  ten: string;
  hinhanh: string;
}

interface ApiBienthe {
  sanpham: ApiSanpham;
}

interface ApiChiTietItem {
  id: number;
  soluong: number;
  dongia: number;
  bienthe?: ApiBienthe; // Có thể null/undefined nên để ?
}

interface ApiDonHang {
  id: number;
  madon: string;
  thanhtien: number;
  trangthai: string;
  trangthaithanhtoan: string;
  chitietdonhang: ApiChiTietItem[];
  created_at?: string;
}

interface ApiGroup {
  label: string;
  trangthai: string;
  donhang: ApiDonHang[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiGroup[];
}

type FilterStatus = "all" | "pending" | "processing" | "shipping" | "completed" | "cancelled";
type FilterPayment = "all" | "paid" | "unpaid";

export default function OrdersPage() {
  // Lưu ý: Khi deploy lên server thật, hãy đổi NEXT_PUBLIC_SERVER_API trong .env
  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";
  const router = useRouter();

  const [searchMadon, setSearchMadon] = React.useState<string>("");
  const [searchAccount, setSearchAccount] = React.useState<string>("");

  const mapApiGroupsToOrders = (groupList: ApiGroup[] = []): Order[] => {
    return groupList.flatMap((group: ApiGroup) => {
      return (group.donhang || []).map((d: ApiDonHang) => ({
        id: d.id,
        madon: d.madon,
        created_at: d.created_at || new Date().toISOString(),
        trangthai: mapStatus(d.trangthai),
        trangthai_goc: d.trangthai,
        total: d.thanhtien,
        paid: d.trangthaithanhtoan === "Đã thanh toán" || d.trangthaithanhtoan === "Đã hoàn tiền",
        chitietdonhang: (d.chitietdonhang || []).map((item: ApiChiTietItem) => ({
          id: item.id,
          name: item.bienthe?.sanpham?.ten || "Sản phẩm không tên",
          quantity: item.soluong,
          price: item.dongia,
          image: item.bienthe?.sanpham?.hinhanh || "/assets/images/thumbs/default.png"
        })),
        shipping: { trangthai: d.trangthai }
      }));
    });
  };
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);

  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [filterPayment, setFilterPayment] = React.useState<FilterPayment>("all");

  // --- Hàm chuyển đổi trạng thái tiếng Việt sang tiếng Anh dùng cho filter ---
  const mapStatus = (vnStatus: string): FilterStatus => {
    const s = (vnStatus || "").toLowerCase();
    if (s.includes("chờ xử lý") || s.includes("chờ thanh toán") || s.includes("đang xác nhận") || s.includes("chờ thanh toán")) return "pending";
    // "xác nhận" (Đã xác nhận) -> xử lý
    if (s.includes("xác nhận")) return "processing";
    if (s.includes("đang giao") || s.includes("đang đóng gói") || s.includes("đang chuẩn bị")) return "shipping";
    if (s.includes("đã giao") || s.includes("hoàn tất")) return "completed";
    if (s.includes("hủy")) return "cancelled";
    return "processing";
  };

  React.useEffect(() => {
    let alive = true;

    const fetchListAndMaybeSingle = async () => {
      try {
        // --- XỬ LÝ AUTHORIZATION TẠI ĐÂY ---
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

        const headers: HeadersInit = {
          "Accept": "application/json",
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // 1) Thử endpoint API có auth (/api/toi/theodoi-donhang)
        const res: Response = await fetch(`${API}/api/toi/theodoi-donhang`, { headers });

        type ApiResult = ApiResponse | ApiGroup[] | { needAuth?: true; rawText?: string } | null;
        let j: ApiResult = null;

        if (res.ok) {
          j = (await res.json()) as ApiResponse | ApiGroup[];
        } else {
          // nếu trả 401 hoặc body chứa "Cần đăng nhập" => thử fallback
          try {
            const txt = await res.text();
            if (res.status === 401 || /cần đăng nhập/i.test(txt)) {
              j = { needAuth: true, rawText: txt };
            } else {
              // cố parse json nếu có
              j = JSON.parse(txt || "{}") as ApiResponse | ApiGroup[] | Record<string, unknown>;
            }
          } catch {
            j = { needAuth: true };
          }
        }

        // Type guards (không dùng any)
        const isAuthNeeded = (x: ApiResult): x is { needAuth: true; rawText?: string } =>
          !!x && typeof x === "object" && "needAuth" in x && (x as { needAuth?: true }).needAuth === true;

        const isApiResponse = (x: ApiResult): x is ApiResponse =>
          !!x && typeof x === "object" && "status" in x && Array.isArray((x as ApiResponse).data);

        // 2) Nếu cần auth và có query string username/madon thì thử gọi endpoint web public
        if (isAuthNeeded(j)) {
          if (typeof window !== "undefined") {
            const sp = new URLSearchParams(window.location.search);
            const username = sp.get("username") || (localStorage.getItem("username_auth") || "");
            const madon = sp.get("madon") || (localStorage.getItem("madon_auth") || "");
            if (username && madon) {
              try {
                const url = `${API}/toi/theodoi-donhang?username=${encodeURIComponent(username)}&madon=${encodeURIComponent(madon)}`;
                const r2 = await fetch(url, { headers: { Accept: "application/json" } });
                if (r2.ok) {
                  j = await r2.json() as ApiGroup[] | ApiResponse;
                }
              } catch (e) {
                console.debug("fallback public fetch failed", e);
              }
            }
          }
        }

        // Nếu vẫn null hoặc không đúng shape => bail out
        const groupList: ApiGroup[] = isApiResponse(j)
          ? j.data
          : Array.isArray(j)
            ? (j as ApiGroup[])
            : [];
        let allOrders: Order[] = [];

        if (Array.isArray(groupList)) {
          // allOrders = groupList.flatMap((group: ApiGroup) => {
          //   return (group.donhang || []).map((d: ApiDonHang) => ({
          //     id: d.id,
          //     madon: d.madon,
          //     created_at: d.created_at || new Date().toISOString(),
          //     trangthai: mapStatus(d.trangthai),
          //     trangthai_goc: d.trangthai,
          //     total: d.thanhtien,
          //     paid: d.trangthaithanhtoan === "Đã thanh toán" || d.trangthaithanhtoan === "Đã hoàn tiền",
          //     chitietdonhang: (d.chitietdonhang || []).map((item: ApiChiTietItem) => ({
          //       id: item.id,
          //       name: item.bienthe?.sanpham?.ten || "Sản phẩm không tên",
          //       quantity: item.soluong,
          //       price: item.dongia,
          //       image: item.bienthe?.sanpham?.hinhanh || "/assets/images/thumbs/default.png"
          //     })),
          //     shipping: { trangthai: d.trangthai }
          //   }));
          // });
          allOrders = mapApiGroupsToOrders(groupList);
        }

        if (!alive) return;
        allOrders.sort((a, b) => b.id - a.id);
        setOrders(allOrders);

      } catch (e) {
        console.error("Fetch error:", e);
        if (alive) setOrders([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchListAndMaybeSingle();
    return () => { alive = false; };
  }, [API]);


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchMadon && !searchAccount) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchMadon) params.set("madon", searchMadon.trim());
      if (searchAccount) {
        const a = searchAccount.trim();
        const isEmail = /\S+@\S+\.\S+/.test(a);
        params.set(isEmail ? "email" : "username", a);
      }
      const url = `${API}/toi/theodoi-donhang?${params.toString()}`;
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (!r.ok) {
        // try fallback without username/email if server requires different params
        console.debug("Search request failed", r.status);
        setOrders([]);
        return;
      }
      const data = await r.json();
      // data may be ApiGroup[] or ApiResponse-like; normalize
      const groups: ApiGroup[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const mapped = mapApiGroupsToOrders(groups);
      setOrders(mapped.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Search error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const handleClearSearch = async () => {
    setSearchMadon("");
    setSearchAccount("");
    setLoading(true);
    // re-run initial list fetch by calling effect handler (simple: trigger by fetching same endpoint)
    try {
      const r = await fetch(`${API}/api/toi/theodoi-donhang`, { headers: { Accept: "application/json" } });
      const j = r.ok ? await r.json() : [];
      const groups: ApiGroup[] = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : [];
      setOrders(mapApiGroupsToOrders(groups).sort((a, b) => b.id - a.id));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  // ... Các phần logic filter, pagination giữ nguyên ...
  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus !== "all" && o.trangthai !== filterStatus) return false;

      if (filterPayment !== "all") {
        const isPaid = Boolean(o.paid);
        if (filterPayment === "paid" && !isPaid) return false;
        if (filterPayment === "unpaid" && isPaid) return false;
      }
      return true;
    });
  }, [orders, filterStatus, filterPayment]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const start = (page - 1) * pageSize;
  const current = filteredOrders.slice(start, start + pageSize);

  const toggle = (id: number) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const formatVND = (n?: number) => (typeof n === "number" ? n.toLocaleString("vi-VN") + " đ" : "0 đ");

  const handleCancel = async (orderId: number) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn này?")) return;

    // Optimistic update
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, trangthai: "cancelled", trangthai_goc: "Đã hủy" } : o)));

    // Lấy token để gọi API hủy
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    };

    // Thử các endpoint hủy có thể có
    const endpoints = [
      `${API}/api/orders/${orderId}`, // Endpoint chuẩn REST
      `${API}/api/toi/donhang/${orderId}` // Endpoint dự phòng
    ];

    let succeeded = false;
    for (const url of endpoints) {
      try {
        const r = await fetch(url, {
          method: "PATCH", // Hoặc PUT tùy backend
          headers: headers,
          body: JSON.stringify({ trangthai: "Đã hủy" }) // Gửi trạng thái tiếng Việt hoặc Anh tùy BE quy định
        });
        if (r.ok) { succeeded = true; break; }
      } catch { }
    }

    if (!succeeded) {
      alert("Lưu ý: Không thể cập nhật trạng thái trên server (API lỗi hoặc chưa hỗ trợ cancel).");
    } else {
      alert("Đã hủy đơn thành công.");
    }
  };

  const handleReorder = (o: Order) => { alert("Tính năng mua lại đang phát triển"); };
  const handleReview = (o: Order) => { alert("Tính năng đánh giá đang phát triển"); };
  const handleChangeAddress = (orderId: number) => { alert(`Thay đổi địa chỉ cho đơn ${orderId} (tạm)`); };

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />
      <AccountShell title="Đơn hàng của tôi" current="orders">

        {/* Search box: tìm theo mã đơn + username/email */}
        {/* <div className="p-12 mb-12 bg-white border rounded-8">
          <form className="row gy-3" onSubmit={handleSearch}>
            <div className="col-5">
              <input value={searchMadon} onChange={(ev) => setSearchMadon(ev.target.value)} placeholder="Mã đơn (VNA...)" className="common-input" />
            </div>
            
            <div className="col-2 d-flex" style={{ gap: 8 }}>
              <button type="submit" className="btn btn-main-two" disabled={loading}>{loading ? "Tìm..." : "Tìm"}</button>
              <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>Xóa</button>
            </div>
          </form>
        </div> */}
        {/* Filter Tabs */}
        <div className="p-12 mb-16 bg-white border rounded-8" style={{ marginTop: 4 }}>
          <div className="flex-wrap d-flex align-items-center justify-content-between" style={{ gap: 8 }}>
            <div className="flex-wrap gap-8 d-flex">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => { setFilterStatus(opt.key); setPage(1); }}
                  className={`btn btn-sm ${filterStatus === opt.key ? "btn-main-two" : "btn-outline-main-two"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="gap-8 d-flex align-items-center">
              <div className="text-sm text-muted me-8">Thanh toán:</div>
              <button type="button" className={`btn btn-sm ${filterPayment === "all" ? "btn-main-two" : "btn-outline-main-two"}`} onClick={() => setFilterPayment("all")}>Tất cả</button>
              <button type="button" className={`btn btn-sm ${filterPayment === "paid" ? "btn-main-two" : "btn-outline-main-two"}`} onClick={() => setFilterPayment("paid")}>Đã thanh toán</button>
              <button type="button" className={`btn btn-sm ${filterPayment === "unpaid" ? "btn-main-two" : "btn-outline-main-two"}`} onClick={() => setFilterPayment("unpaid")}>Chưa thanh toán</button>
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div style={{ marginTop: 8 }}>
          {loading ? (
            <div className="p-5 text-center">Đang tải đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-5 text-center bg-white border rounded">Không tìm thấy đơn hàng phù hợp.</div>
          ) : (
            <div className="gap-16 vstack" style={{ marginTop: 8 }}>
              {current.map((o) => (
                <div key={o.id} className="p-16 bg-white border border-gray-100 rounded-12">
                  <div className="flex-wrap d-flex justify-content-between align-items-start">
                    {/* Left: order header + first product preview */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="gap-12 d-flex align-items-start">
                        {/* Thumbnail */}
                        <div style={{ width: 72, height: 72, flex: "0 0 72px" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={(Array.isArray(o.chitietdonhang) && o.chitietdonhang[0]?.image) || "/assets/images/thumbs/default.png"}
                            alt="Product"
                            width={72}
                            height={72}
                            style={{ objectFit: "cover", borderRadius: 8, width: "72px", height: "72px" }}
                          />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="gap-8 mb-1 d-flex align-items-center">
                            <div className="fw-semibold text-truncate">Đơn #{o.madon || o.id}</div>
                            <span
                              style={{
                                marginLeft: 8,
                                padding: "4px 8px",
                                borderRadius: 12,
                                fontSize: 12,
                                background: o.trangthai === "completed" ? "#d1f7e7" : o.trangthai === "cancelled" ? "#ffd8d8" : "#fff2cc",
                                color: "#1a1a1a",
                              }}
                            >
                              {o.trangthai_goc || o.trangthai}
                            </span>
                          </div>
                          <div className="mb-2 text-sm text-gray-600">
                            {o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : ""}
                          </div>

                          {/* Product name preview */}
                          {Array.isArray(o.chitietdonhang) && o.chitietdonhang[0] && (
                            <div>
                              <div className="fw-medium text-truncate" title={o.chitietdonhang[0].name}>
                                {o.chitietdonhang[0].name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {o.chitietdonhang.length > 1 ? `và ${o.chitietdonhang.length - 1} sản phẩm khác` : `Số lượng: ${o.chitietdonhang[0].quantity}`}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Total + Actions */}
                    <div style={{ marginLeft: 16, flex: "0 0 auto", textAlign: "right" }}>
                      <div className="text-sm text-gray-600">Tổng tiền</div>
                      <div className="fw-bold text-primary fs-6">{formatVND(o.total)}</div>

                      <div className="gap-2 mt-12 d-flex justify-content-end align-items-center">
                        {/* Các nút hành động */}
                        {o.trangthai === "pending" && (
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(o.id)}>
                            Hủy đơn
                          </button>
                        )}
                        <button className="btn btn-outline-main-two btn-sm" onClick={() => toggle(o.id)}>
                          {expanded.has(o.id) ? "Thu gọn" : "Chi tiết"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {expanded.has(o.id) && Array.isArray(o.chitietdonhang) && (
                    <div className="pt-12 mt-12 border-top">
                      {o.chitietdonhang.map((it) => (
                        <div key={it.id} className="gap-3 p-2 mb-3 border rounded d-flex align-items-center bg-light">
                          <img src={it.image || ""} alt="" width={50} height={50} className="rounded" style={{ objectFit: "cover" }} />
                          <div className="flex-grow-1">
                            <div className="text-sm fw-medium">{it.name}</div>
                            <div className="text-xs text-muted">x{it.quantity}</div>
                          </div>
                          <div className="text-sm fw-bold">{formatVND(it.price)}</div>
                        </div>
                      ))}
                      <div className="mt-2 text-sm text-end">
                        <span className="text-muted me-2">Thanh toán:</span>
                        <span className={o.paid ? "text-success fw-bold" : "text-warning fw-bold"}>
                          {o.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <span className="text-sm text-gray-600">Trang {page}/{totalPages}</span>
                <div className="gap-8 d-flex">
                  <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Trước</button>
                  <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Sau</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccountShell>
    </>
  );
}

const STATUS_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Đang chờ" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã hủy" },
];