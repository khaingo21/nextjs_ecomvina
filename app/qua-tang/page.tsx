'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FullHeader from '@/components/FullHeader';
import { fetchHomePage, GiftEvent } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://148.230.100.215';

export default function GiftPromotionPage() {
    const [gifts, setGifts] = useState<GiftEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState<string>('popular');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch dữ liệu quà tặng từ API
    useEffect(() => {
        const loadGifts = async () => {
            try {
                setLoading(true);
                // Lấy 100 item để hiển thị tất cả quà tặng từ API
                const response = await fetchHomePage({}, 100);
                setGifts(response?.data?.hot_gift || []);
            } catch (error) {
                console.error('Error loading gifts:', error);
                setGifts([]);
            } finally {
                setLoading(false);
            }
        };
        loadGifts();
    }, []);

    // Sắp xếp quà tặng theo loại
    const sortedGifts = [...gifts].sort((a, b) => {
        if (sortType === 'popular') {
            return b.luotxem - a.luotxem;
        } else if (sortType === 'newest') {
            return new Date(b.ngaybatdau).getTime() - new Date(a.ngaybatdau).getTime();
        } else if (sortType === 'expiring') {
            return new Date(a.ngayketthuc).getTime() - new Date(b.ngayketthuc).getTime();
        }
        return 0;
    });

    // Lấy danh sách chương trình unique
    const providers = Array.from(
        new Map(
            gifts
                .filter(g => g.chuongtrinh)
                .map(g => [g.chuongtrinh.id, g.chuongtrinh])
        ).values()
    );

    return (
        <div className="color-two font-exo header-sticky-style">
            {/* Header */}
            <FullHeader showTopNav={true} showCategoriesBar={false} />

            {/* Custom CSS */}
            <style>{`
                .text-line-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.5;
                    max-height: 3em;
                }
            `}</style>

            <div className="page">
                {/* Breadcrumb */}
                <div className="breadcrumb mb-0 pt-40 bg-main-two-60">
                    <div className="container container-lg">
                        <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                            <h6 className="mb-0">Ưu đãi quà tặng</h6>
                        </div>
                    </div>
                </div>

                <section className="shop py-40">
                    <div className="container container-lg">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-lg-3">
                                <div className={`shop-sidebar ${sidebarOpen ? 'active' : ''}`}>
                                    <button
                                        type="button"
                                        className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <i className="ph ph-x"></i>
                                    </button>

                                    {/* Sắp xếp */}
                                    <div className="shop-sidebar__box border border-gray-100 rounded-8 p-26 pb-0 mb-32">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-16 mb-16">Sắp xếp ưu đãi</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            {[
                                                { value: 'popular', label: 'Phổ biến' },
                                                { value: 'newest', label: 'Mới nhất' },
                                                { value: 'expiring', label: 'Sắp hết hạn' }
                                            ].map(item => (
                                                <li className="mb-20" key={item.value}>
                                                    <div className="form-check common-check common-radio">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="sort"
                                                            id={item.value}
                                                            value={item.value}
                                                            checked={sortType === item.value}
                                                            onChange={() => setSortType(item.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor={item.value}>
                                                            {item.label}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Chương trình */}
                                    <div className="shop-sidebar__box border border-gray-100 rounded-8 p-26 pb-0 mb-32">
                                        <h6 className="text-xl border-bottom border-gray-100 pb-16 mb-24">Chương trình</h6>
                                        <ul className="max-h-540 overflow-y-auto scroll-sm">
                                            {providers.map(provider => (
                                                <li className="mb-16" key={provider.id}>
                                                    <div className="form-check common-check common-radio">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="provider"
                                                            id={`provider-${provider.id}`}
                                                            value={provider.id}
                                                        />
                                                        <label className="form-check-label" htmlFor={`provider-${provider.id}`}>
                                                            {provider.tieude}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Xóa bộ lọc */}
                                    <div className="shop-sidebar__box rounded-8 flex-align justify-content-between mb-32">
                                        <button
                                            onClick={() => setSortType('popular')}
                                            className="btn border-main-600 text-main-600 hover-bg-main-600 hover-border-main-600 hover-text-white rounded-8 px-32 py-12 w-100"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="col-lg-9">
                                {/* Top bar */}
                                <div className="flex-between gap-16 flex-wrap mb-40">
                                    <span className="text-gray-900">
                                        Hiển thị {sortedGifts.length} trên {sortedGifts.length} kết quả
                                    </span>
                                    <div className="position-relative flex-align gap-16 flex-wrap">
                                        <button
                                            type="button"
                                            className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                                            onClick={() => setSidebarOpen(true)}
                                        >
                                            <i className="ph-bold ph-funnel"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Loading state */}
                                {loading && (
                                    <div className="text-center py-40">
                                        <div className="spinner-border text-main-600" role="status">
                                            <span className="visually-hidden">Đang tải...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Gift cards grid */}
                                {!loading && (
                                    <div className="row g-12">
                                        {sortedGifts.map((gift) => (
                                            <div key={gift.id} className="col-xxl-6 col-xl-6 col-lg-6 col-sm-12 col-md-6 col-xs-12">
                                                <div className="h-100 flex-align gap-4 border border-gray-100 hover-border-main-600 rounded-6 transition-2">
                                                    <Link
                                                        href={`/chi-tiet-qt?id=${gift.id}`}
                                                        className="rounded-8 bg-gray-50"
                                                        style={{ width: '70%' }}
                                                    >
                                                        <img
                                                            src={gift.hinhanh?.startsWith('http') ? gift.hinhanh : `${API_URL}${gift.hinhanh}`}
                                                            alt={gift.tieude}
                                                            className="rounded-start-2"
                                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                const img = e.currentTarget;
                                                                img.onerror = null;
                                                                img.src = '/assets/images/thumbs/placeholder.png';
                                                            }}
                                                        />
                                                    </Link>
                                                    <div className="w-100 h-100 align-items-stretch flex-column justify-content-between d-flex px-10 py-10">
                                                        {/* Chương trình */}
                                                        {gift.chuongtrinh && (
                                                            <div className="flex-align gap-4">
                                                                <span
                                                                    className="bg-white text-main-600 border border-1 border-gray-100 rounded-circle flex-center text-xl flex-shrink-0"
                                                                    style={{ width: '30px', height: '30px', overflow: 'hidden' }}
                                                                >
                                                                    <img
                                                                        src={gift.chuongtrinh.hinhanh?.startsWith('http') ? gift.chuongtrinh.hinhanh : `${API_URL}${gift.chuongtrinh.hinhanh}`}
                                                                        alt={gift.chuongtrinh.tieude}
                                                                        className="w-100"
                                                                        onError={(e) => {
                                                                            const img = e.currentTarget;
                                                                            img.onerror = null;
                                                                            img.src = '/assets/images/thumbs/placeholder.png';
                                                                        }}
                                                                    />
                                                                </span>
                                                                <span className="text-sm fw-medium text-gray-600">
                                                                    {gift.chuongtrinh.tieude}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Tiêu đề */}
                                                        <h6 className="title text-lg fw-semibold mt-2 mb-2">
                                                            <Link
                                                                href={`/chi-tiet-qt?id=${gift.id}`}
                                                                className="link text-line-2"
                                                            >
                                                                {gift.tieude}
                                                            </Link>
                                                        </h6>

                                                        {/* Mô tả */}
                                                        <span className="fw-normal fst-italic text-gray-600 text-sm mt-4 text-line-2">
                                                            {gift.thongtin || 'Không có thông tin'}
                                                        </span>

                                                        {/* Thời gian còn lại */}
                                                        <div className="flex-align gap-8 p-4 bg-gray-50 rounded-6 mt-8">
                                                            <span className="text-main-600 text-md d-flex">
                                                                <i className="ph-bold ph-timer"></i>
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                Còn <strong>{gift.thoigian_conlai || 'Đang cập nhật'}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Empty state */}
                                        {sortedGifts.length === 0 && !loading && (
                                            <div className="col-12 text-center py-40">
                                                <i className="ph ph-gift text-gray-300" style={{ fontSize: '64px' }}></i>
                                                <p className="text-gray-500 mt-16">Chưa có chương trình quà tặng nào</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}