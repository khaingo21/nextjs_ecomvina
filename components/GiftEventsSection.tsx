"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { type GiftEvent } from "@/lib/api";
import { useHomeData } from "@/hooks/useHomeData";

export default function GiftEventsSection() {
  const { data: homeData, loading: homeLoading } = useHomeData();
  const [gifts, setGifts] = useState<GiftEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!homeData) return;

    let alive = true;
    try {
      if (!alive) return;
      const hotGifts = homeData.data?.hot_gift || [];
      console.log("✅ Quà tặng từ API:", hotGifts.length, "items");
      console.log("Hiển thị:", itemsPerPage, "items");
      console.log("Có mũi tên?", hotGifts.length > itemsPerPage);
      setGifts(hotGifts);
    } catch (error) {
      console.error("Error fetching gift events:", error);
    } finally {
      if (alive) setLoading(false);
    }
    return () => {
      alive = false;
    };
  }, [homeData]);

  if (loading) {
    return (
      <section className="deals-weeek pt-10 overflow-hidden fix-scale-30">
        <div className="container container-lg px-0">
          <div className="text-center py-5">Đang tải chương trình quà tặng...</div>
        </div>
      </section>
    );
  }

  if (gifts.length === 0) return null;

  // Tính toán items hiển thị (5 items)
  const displayedGifts = gifts.slice(currentIndex, currentIndex + itemsPerPage);

  // Nếu không đủ 5 items, lấy thêm từ đầu (circular)
  if (displayedGifts.length < itemsPerPage && gifts.length >= itemsPerPage) {
    const remaining = itemsPerPage - displayedGifts.length;
    displayedGifts.push(...gifts.slice(0, remaining));
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      // Quay vòng: nếu < 0 thì về cuối
      return newIndex < 0 ? gifts.length - 1 : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      // Quay vòng: nếu vượt quá thì về đầu
      return newIndex >= gifts.length ? 0 : newIndex;
    });
  };

  // Luôn cho phép navigation nếu có nhiều hơn 5 items (để chuyển ảnh)
  const showNavigation = gifts.length > itemsPerPage;

  return (
    <section className="deals-weeek pt-10 overflow-hidden fix-scale-30">
      <div className="container container-lg px-0">
        <div className="">
          <div className="section-heading mb-24">
            <div className="flex-between flex-align flex-wrap gap-8 w-100">
              <h6 className="mb-0 wow fadeInLeft flex-align gap-8" style={{ visibility: "visible", animationName: "fadeInLeft" }}>
                <i className="ph-bold ph-gift text-main-600"></i> Quà tặng
              </h6>
              <div className="border-bottom border-2 border-main-600 mb-0 mt-4" style={{ width: "77%" }}></div>
              <div className="flex-align gap-16 wow fadeInRight" style={{ visibility: "visible", animationName: "fadeInRight" }}>
                <Link href="/qua-tang" className="text-sm fw-semibold text-main-600 hover-text-main-600 hover-text-decoration-underline">
                  Xem tất cả
                </Link>
                {showNavigation && (
                  <div className="flex-align gap-8">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="slick-prev flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <i className="ph ph-caret-left"></i>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="slick-next flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <i className="ph ph-caret-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="gift-event-slider arrow-style-two">
            <div className="d-flex flex-wrap" style={{ gap: "12px" }}>
              {displayedGifts.map((gift) => (
                <div key={gift.id} className="gift-col-5">
                  <div className="product-card p-card border border-gray-100 rounded-16 position-relative transition-2" style={{ height: "380px", overflow: "hidden" }}>
                    <Link href={`/chi-tiet-qt`}>
                      <div
                        className="rounded-16"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url('${gift.hinhanh}')`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          zIndex: 1,
                          backgroundPosition: "center"
                        }}
                      >
                        {/* Overlay gradient để dễ đọc chữ hơn */}
                        <div
                          className="card-overlay rounded-16 transition-1"
                          style={{
                            position: "absolute",
                            top: 0, left: 0, width: "100%", height: "100%",
                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)"
                          }}
                        ></div>
                      </div>
                    </Link>

                    {/* Nội dung đè lên ảnh, nằm ở đáy, CANH GIỮA */}
                    <div
                      className="gift-card-content position-absolute w-100 p-16 d-flex flex-column align-items-center justify-content-end"
                      style={{ bottom: 0, left: 0, zIndex: 2, height: "100%" }}
                    >
                      <div className="gift-card-title title text-white text-lg fw-bold mb-12 text-shadow-sm text-center w-100">
                        <Link href={`/chi-tiet-qt`} className="link text-line-2 text-white hover-text-main-600 transition-1">
                          {gift.tieude}
                        </Link>
                      </div>

                      <div className="flex-align gap-6 bg-white bg-opacity-90 p-8 px-16 rounded-pill d-inline-flex shadow-sm">
                        <span className="text-main-600 text-lg d-flex">
                          <i className="ph-bold ph-timer"></i>
                        </span>
                        <span className="text-gray-700 text-sm fw-semibold">
                          {gift.thoigian_conlai}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}