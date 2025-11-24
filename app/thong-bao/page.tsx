"use client";

import React, { JSX } from "react";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";
import AccountShell from "@/components/AccountShell";

type ThongBao = {
  id: string;
  loai: "giaohang" | "khuyenmai" | "dat_hang_thanh_cong";
  tieu_de: string;
  noi_dung?: string;
  lienket?: string;
  active?: boolean;
  created_at?: string;
};

export default function ThongBaoPage(): JSX.Element {
  const [list, setList] = React.useState<ThongBao[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [tab, setTab] = React.useState<ThongBao["loai"]>("giaohang");
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/thongbao");
      const j = await res.json().catch(() => null);
      setList(Array.isArray(j?.data) ? j.data : []);
    } catch (e) {
      console.error("fetch thongbao", e);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const visible = list.filter((t) => t.loai === tab && t.active !== false);

  // small dropdown like header-notifications (recent 5)
  const recent = list.slice(0, 5);

  return (
    <>
      <FullHeader showClassicTopBar={true} showTopNav={false} />

      <AccountShell title="Thông báo" current="thongbao" user={undefined}>
        <div className="mb-16 d-flex align-items-center justify-content-between">
          <h2 className="m-0">Thông báo</h2>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowDropdown((s) => !s)}
              aria-expanded={showDropdown}
            >
              <i className="ph ph-bell" /> Thông Báo Mới
            </button>

            {showDropdown && (
              <div
                className="p-12 card"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 360,
                  zIndex: 50,
                }}
              >
                <div className="mb-8 fw-bold">Thông Báo Mới Nhận</div>
                {recent.length === 0 ? (
                  <div className="text-muted">Không có thông báo mới</div>
                ) : (
                  recent.map((r) => (
                    <div key={r.id} className="gap-12 mb-8 d-flex">
                      <div style={{ width: 56, height: 56, background: "#f4f4f6", borderRadius: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div className="fw-bold">{r.tieu_de}</div>
                        {r.noi_dung && <div className="text-muted small">{r.noi_dung}</div>}
                      </div>
                    </div>
                  ))
                )}
                <div className="pt-8 text-center">
                  <button className="btn btn-link" onClick={() => { setShowDropdown(false); }}>
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="gap-8 mb-12 d-flex">
          <button className={`btn ${tab === "giaohang" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("giaohang")}>
            Tiến độ giao hàng
          </button>
          <button className={`btn ${tab === "khuyenmai" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("khuyenmai")}>
            Khuyến mãi
          </button>
          <button
            className={`btn ${tab === "dat_hang_thanh_cong" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setTab("dat_hang_thanh_cong")}
          >
            Đặt hàng thành công
          </button>
        </div>

        <div className="p-16 card">
          {loading ? (
            <div>Đang tải...</div>
          ) : visible.length === 0 ? (
            <div>Không có thông báo.</div>
          ) : (
            <div>
              {visible.map((t) => (
                <div key={t.id} className="gap-12 py-12 d-flex align-items-start" style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 90, height: 90, background: "#fafafa", borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{t.tieu_de}</div>
                        {t.noi_dung && <div className="mt-6 text-muted small">{t.noi_dung}</div>}
                      </div>
                      <div className="text-muted small">{t.created_at ? new Date(t.created_at).toLocaleString() : ""}</div>
                    </div>
                    {t.lienket && (
                      <div className="mt-8">
                        <a className="text-primary" href={t.lienket}>
                          Xem chi tiết
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccountShell>

      <BenefitsStrip />
    </>
  );
}