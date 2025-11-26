'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchBoxWithSuggestions from '@/components/SearchBoxWithSuggestions';
import { BlogPost, fetchBlogPosts } from '@/lib/api';

const categories = [
    { name: 'Gaming', count: 12 },
    { name: 'Smart Gadget', count: 5 },
    { name: 'Software', count: 29 },
    { name: 'Electronics', count: 24 },
    { name: 'Laptop', count: 8 },
    { name: 'Mobile & Accessories', count: 16 },
    { name: 'Apliance', count: 24 }
];

export default function BlogDetailPage() {
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');
    const currentId = idParam ? parseInt(idParam, 10) : undefined;

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchBlogPosts();
                setPosts(data);

                if (data.length > 0) {
                    const found = currentId
                        ? data.find((p) => p.id === currentId)
                        : data[0];
                    setCurrentPost(found || data[0]);
                } else {
                    setCurrentPost(null);
                }
            } catch (error) {
                console.error('Error loading blog posts:', error);
                setCurrentPost(null);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentId]);

    const recentPosts = posts.slice(0, 4);

    const getImageUrl = (url?: string): string => {
        if (!url || !url.trim()) {
            // Ảnh placeholder nội bộ trong dự án (public/assets/...)
            return '/assets/images/thumbs/default-product.png';
        }
        if (url.startsWith('http')) return url;
        // Chuẩn hóa relative path từ API
        return `http://148.230.100.215${url.startsWith('/') ? url : `/${url}`}`;
    };

    return (
        <>
            {/* Top red header bar */}
            <div
                style={{
                    background: 'rgb(229, 57, 53)',
                    width: '100%',
                    padding: '10px 0px',
                    display: 'block',
                }}
            >
                <div className="container container-lg">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                        }}
                    >
                        {/* Left group: đăng ký / giới thiệu / liên hệ */}
                        <ul
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '16px',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <Link
                                    href="/dangky"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph-bold ph-user"></i> Đăng ký thành viên
                                </Link>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <a
                                    href="#"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph-bold ph-info"></i> Giới thiệu về Siêu Thị Vina
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <a
                                    href="#"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph-bold ph-chat-dots"></i> Liên hệ hỗ trợ
                                </a>
                            </li>
                        </ul>

                        {/* Right group: danh mục / tra cứu đơn hàng / giỏ hàng */}
                        <ul
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '16px',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <li style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <a
                                    href="#"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph ph-squares-four"></i> Danh mục
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <a
                                    href="/orders"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph-bold ph-notepad"></i> Tra cứu đơn hàng
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                <Link
                                    href="/gio-hang"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    <i className="ph-bold ph-shopping-cart"></i> Giỏ hàng
                                    <span
                                        style={{
                                            background: 'rgb(0, 230, 118)',
                                            color: 'rgb(255, 255, 255)',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            marginLeft: '4px',
                                            fontSize: '13px',
                                        }}
                                    >
                                        3
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main header with logo + search */}
            <header
                className="header border-bottom border-neutral-40 pt-16 pb-10"
                style={{ zIndex: 99 }}
            >
                <div className="container container-lg">
                    <nav className="header-inner flex-between gap-16">
                        <div className="logo">
                            <Link className="link" aria-label="Trang chủ Siêu Thị Vina" href="/">
                                <img
                                    alt="Logo"
                                    width={140}
                                    height={40}
                                    src="https://sieuthivina.com/assets/client/images/logo/logo_nguyenban.png"
                                />
                            </Link>
                        </div>
                        <div className="header-menu w-50 d-lg-block d-none">
                            <div className="mx-20">
                                {/* Ô tìm kiếm có gợi ý giống trang chủ */}
                                <SearchBoxWithSuggestions placeholder="Sâm Ngọc Linh...." />
                                <div className="flex-align mt-10 gap-12 title">
                                    <Link
                                        className="text-sm link text-gray-600 hover-text-main-600 fst-italic"
                                        href="/shop?query=sâm ngọc linh"
                                    >
                                        Sâm Ngọc Linh
                                    </Link>
                                    <Link
                                        className="text-sm link text-gray-600 hover-text-main-600 fst-italic"
                                        href="/shop?query=sách hán ngữ 3"
                                    >
                                        Sách hán ngữ 3
                                    </Link>
                                    <Link
                                        className="text-sm link text-gray-600 hover-text-main-600 fst-italic"
                                        href="/shop?query=móc khóa genshin"
                                    >
                                        Móc khóa genshin
                                    </Link>
                                    <Link
                                        className="text-sm link text-gray-600 hover-text-main-600 fst-italic"
                                        href="/shop?query=đồ chơi minecraft"
                                    >
                                        Đồ chơi minecraft
                                    </Link>
                                    <Link
                                        className="text-sm link text-gray-600 hover-text-main-600 fst-italic"
                                        href="/shop?query=điện nội thất"
                                    >
                                        Điện nội thất
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="header-right flex-align">
                            <ul className="header-top__right style-two style-three flex-align flex-wrap d-lg-block d-none">
                                <li className="d-sm-flex d-none">
                                    <Link
                                        className="d-flex align-content-around gap-10 fw-medium text-main-600 py-14 px-24 bg-main-50 rounded-pill line-height-1 hover-bg-main-600 hover-text-white"
                                        href="/dang-nhap"
                                    >
                                        <span className="d-sm-flex d-none line-height-1">
                                            <i className="ph-bold ph-user"></i>
                                        </span>
                                        Đăng nhập
                                    </Link>
                                </li>
                            </ul>
                            <div className="d-none"></div>
                            <button
                                type="button"
                                className="toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex"
                            >
                                <i className="ph ph-list"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="page">
                <section className="blog-details py-80">
                    <div className="container container-lg">
                        <div className="row gy-5">
                            {/* Main Content */}
                            <div className="col-lg-8 pe-xl-4">
                                {loading && (
                                    <div className="text-center py-40">
                                        <div className="spinner-border text-main-600" role="status">
                                            <span className="visually-hidden">Đang tải...</span>
                                        </div>
                                    </div>
                                )}

                                {!loading && !currentPost && (
                                    <div className="text-center py-40">
                                        <p className="text-lg text-gray-600 mb-8">Không tìm thấy bài viết.</p>
                                        <p className="text-sm text-gray-500">Vui lòng quay lại trang chủ hoặc chọn bài khác.</p>
                                    </div>
                                )}

                                {!loading && currentPost && (
                                    <div className="blog-item-wrapper">
                                        <div className="blog-item">
                                            <img
                                                src={getImageUrl(currentPost.hinhanh)}
                                                alt={currentPost.tieude}
                                                className="cover-img rounded-16"
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                            <div className="blog-item__content mt-24">
                                                <span className="bg-main-50 text-main-600 py-4 px-24 rounded-8 mb-16 d-inline-block">
                                                    Bài viết nổi bật
                                                </span>
                                                <h4 className="mb-24">{currentPost.tieude}</h4>

                                                <div
                                                    className="text-gray-700 mb-24 border-bottom border-gray-100 pb-24"
                                                    dangerouslySetInnerHTML={{ __html: currentPost.noidung }}
                                                />

                                                <div className="flex-align flex-wrap gap-24">
                                                    <div className="flex-align flex-wrap gap-8">
                                                        <span className="text-lg text-main-600">
                                                            <i className="ph ph-chats-circle"></i>
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            <span className="text-gray-500 hover-text-main-600">
                                                                {currentPost.luotxem} Lượt xem
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="my-48 flex-between flex-sm-nowrap flex-wrap gap-24">
                                    <div>
                                        <button
                                            type="button"
                                            className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600"
                                            disabled
                                        >
                                            Trước đó
                                        </button>
                                    </div>
                                    <div className="text-end">
                                        <button
                                            type="button"
                                            className="mb-20 h6 text-gray-500 text-lg fw-normal hover-text-main-600"
                                            disabled
                                        >
                                            Tiếp theo
                                        </button>
                                    </div>
                                </div>

                                <div className="my-48">
                                    <span className="border-bottom border-gray-100 d-block"></span>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="col-lg-4 ps-xl-4">
                                {/* Recent Posts */}
                                <div className="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
                                    <h6 className="text-xl mb-32 pb-32 border-bottom border-gray-100">
                                        Bài viết gần đây
                                    </h6>

                                    {recentPosts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            className={`d-flex align-items-center flex-sm-nowrap flex-wrap gap-24 ${index !== recentPosts.length - 1 ? 'mb-16' : 'mb-0'}`}
                                        >
                                            <Link
                                                href={`/bai-viet?id=${post.id}`}
                                                className="w-100 h-100 rounded-4 overflow-hidden flex-shrink-0"
                                                style={{ width: '120px', height: '120px', maxWidth: '120px' }}
                                            >
                                                <img
                                                    src={getImageUrl(post.hinhanh as any)}
                                                    alt={post.tieude}
                                                    className="cover-img"
                                                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                                />
                                            </Link>
                                            <div className="flex-grow-1">
                                                <h6 className="text-lg">
                                                    <Link href={`/bai-viet?id=${post.id}`} className="text-line-3">
                                                        {post.tieude}
                                                    </Link>
                                                </h6>
                                                <div className="flex-align flex-wrap gap-8">
                                                    <span className="text-lg text-main-600">
                                                        <i className="ph ph-calendar-dots"></i>
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        <span className="text-gray-500 hover-text-main-600">
                                                            {post.date}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Categories */}
                                <div className="blog-sidebar border border-gray-100 rounded-8 p-32 mb-40">
                                    <h6 className="text-xl mb-32 pb-32 border-bottom border-gray-100">
                                        Danh mục
                                    </h6>
                                    <ul>
                                        {categories.map((category, index) => (
                                            <li key={category.name} className={index !== categories.length - 1 ? 'mb-16' : 'mb-0'}>
                                                <Link
                                                    href={`/bai-viet?category=${encodeURIComponent(category.name)}`}
                                                    className="flex-between gap-8 text-gray-700 border border-gray-100 rounded-4 p-4 ps-16 hover-border-main-600 hover-text-main-600"
                                                >
                                                    <span>{category.name} ({category.count})</span>
                                                    <span className="w-40 h-40 flex-center rounded-4 bg-main-50 text-main-600">
                                                        <i className="ph ph-arrow-right"></i>
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
