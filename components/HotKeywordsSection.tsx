"use client";

import React, { useEffect, useState } from "react";
import { type HotKeyword } from "@/lib/api";
import { useHomeData } from "@/hooks/useHomeData";

export default function HotKeywordsSection() {
    const { data: homeData, loading: homeLoading } = useHomeData();
    const [keywords, setKeywords] = useState<HotKeyword[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!homeData) return;

        let alive = true;
        try {
            if (!alive) return;
            const hotKeywords = homeData.data?.hot_keywords || [];
            setKeywords(hotKeywords);
        } catch (error) {
            console.error("Error processing hot keywords:", error);
        } finally {
            if (alive) setLoading(false);
        }
        return () => {
            alive = false;
        };
    }, [homeData]);

    if (loading) return null;
    if (keywords.length === 0) return null;

    return (
        <section className="hot-keywords-section py-16 overflow-hidden">
            <div className="container container-lg">
                <div className="p-20 border border-gray-100 rounded-16 bg-white">
                    <div className="section-heading mb-16">
                        <div className="flex-align gap-8">
                            <i className="ph-bold ph-trend-up text-main-600 text-xl"></i>
                            <h6 className="mb-0 text-lg fw-semibold">
                                Từ khóa tìm kiếm phổ biến
                            </h6>
                        </div>
                    </div>

                    <div className="flex-wrap gap-8 flex-align">
                        {keywords.map((keyword) => (
                            <a
                                key={keyword.id}
                                href={keyword.lienket}
                                className="keyword-tag px-16 py-8 rounded-pill border border-gray-200 hover-border-main-600 hover-bg-main-50 transition-2 text-decoration-none"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <i className="ph ph-magnifying-glass text-gray-600"></i>
                                <span className="text-sm text-gray-900 fw-medium">
                                    {keyword.tukhoa}
                                </span>
                                <span className="px-6 py-2 rounded-pill bg-main-50 text-main-600 text-xs fw-semibold">
                                    {keyword.luottruycap}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .keyword-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .keyword-tag {
          transition: all 0.2s ease;
        }
      `}</style>
        </section>
    );
}
