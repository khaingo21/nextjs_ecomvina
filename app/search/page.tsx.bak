"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCardSearch from "@/components/ProductCardSearch";
import { searchProducts, Product, SearchParams } from "@/lib/searchAlgorithm";

type Category = {
    id: number;
    ten: string;
    slug: string;
};

export default function SearchPage() {
    const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("category_id");
    const sortBy = searchParams.get("sort") as SearchParams["sort_by"];

    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [results, setResults] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
        categoryId ? parseInt(categoryId) : undefined
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [currentSort, setCurrentSort] = useState<SearchParams["sort_by"]>(sortBy || "relevance");

    // Load products và categories
    useEffect(() => {
        Promise.all([
            fetch(`${API}/sanphams`).then(r => r.json()),
            fetch(`${API}/danhmucs-selection?per_page=20`).then(r => r.json())
        ])
            .then(([productsRes, categoriesRes]) => {
                // API trả về { status, data }
                let products = [];
                if (Array.isArray(productsRes)) {
                    products = productsRes;
                } else if (productsRes?.data) {
                    products = Array.isArray(productsRes.data) ? productsRes.data : [];
                }

                // Map dữ liệu từ API sang format cần thiết cho search
                const mappedProducts = products.map((p: Record<string, any>) => ({
                    id: p.id,
                    ten: p.ten,
                    slug: p.slug || '',
                    mota: p.mota || '',
                    hashtags: p.hashtags || [],
                    mediaurl: p.mediaurl || p.anhsanphams?.[0]?.media || '/assets/images/thumbs/product-two-img1.png',
                    selling_price: p.selling_price || p.bienthes?.[0]?.gia || 0,
                    original_price: p.original_price || p.bienthes?.[0]?.giagiam || p.selling_price || p.bienthes?.[0]?.gia || 0,
                    discount_amount: p.discount_amount || 0,
                    discount_percent: p.discount_percent || 0,
                    rating_average: p.rating_average || p.danhgias?.[0]?.diem || 0,
                    rating_count: p.rating_count || p.danhgias?.length || 0,
                    danhmuc_id: p.danhmuc_id || p.thuonghieu?.danhmuc_id || 0,
                    total_sold: p.total_sold || 0,
                    monthly_sold: p.monthly_sold || 0,
                    view_count: p.view_count || p.luotxem || 0,
                    conversion_rate: p.conversion_rate || 0,
                    shop_response_rate: p.shop_response_rate || 0,
                    return_rate: p.return_rate || 0,
                    cancel_rate: p.cancel_rate || 0,
                    shop_rating: p.shop_rating || 0,
                    is_mall: p.is_mall || false,
                    is_favorite: p.is_favorite || false,
                    has_video: p.has_video || false,
                    image_count: p.image_count || p.anhsanphams?.length || 0,
                    is_ad: p.is_ad || false,
                    is_flash_sale: p.is_flash_sale || false,
                    flash_sale_priority: p.flash_sale_priority || 0,
                }));

                const cats = Array.isArray(categoriesRes?.data) ? categoriesRes.data : [];

                console.log('Products loaded:', mappedProducts.length);
                console.log('First mapped product:', mappedProducts[0]);
                console.log('Categories loaded:', cats.length);

                setAllProducts(mappedProducts);
                setCategories(cats);
            })
            .catch(err => {
                console.error('Error loading data:', err);
            })
            .finally(() => setLoading(false));
    }, [API]);

    // Tìm kiếm và filter
    useEffect(() => {
        console.log('Search useEffect triggered');
        console.log('Query:', query);
        console.log('All products count:', allProducts.length);

        if (allProducts.length === 0) {
            console.log('No products loaded yet');
            return;
        }

        const searchParams: SearchParams = {
            query,
            category_id: selectedCategory,
            min_price: priceRange[0],
            max_price: priceRange[1],
            min_rating: minRating,
            sort_by: currentSort,
        };

        console.log('Search params:', searchParams);
        const filtered = searchProducts(allProducts, searchParams);
        console.log('Filtered results:', filtered.length);
        console.log('First 3 results:', filtered.slice(0, 3));
        setResults(filtered);
    }, [query, allProducts, selectedCategory, priceRange, minRating, currentSort]);

    if (loading) {
        return (
            <div className="container py-80">
                <div className="text-center">
                    <div className="mb-16 spinner-border text-main-600" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p>Đang tìm kiếm...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-40 search-page">
            <div className="container">
                {/* Header */}
                <div className="mb-24">
                    <h1 className="mb-8 text-2xl fw-bold">
                        Kết quả tìm kiếm: <span className="text-main-600">{query}</span>
                    </h1>
                    <p className="text-gray-600">
                        Tìm thấy <span className="fw-semibold">{results.length}</span> sản phẩm
                    </p>
                </div>

                <div className="row g-24">
                    {/* Sidebar Filters */}
                    <div className="col-lg-3">
                        <div className="p-24 bg-white border border-gray-100 rounded-8">
                            <h5 className="mb-20 fw-bold">Bộ lọc</h5>

                            {/* Danh mục */}
                            <div className="mb-24">
                                <h6 className="mb-12 fw-semibold">Danh mục</h6>
                                <div className="gap-8 d-flex flex-column">
                                    <button
                                        onClick={() => setSelectedCategory(undefined)}
                                        className={`px-12 py-8 text-start rounded-6 ${!selectedCategory ? "bg-main-50 text-main-600" : "hover-bg-gray-50"
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-12 py-8 text-start rounded-6 ${selectedCategory === cat.id ? "bg-main-50 text-main-600" : "hover-bg-gray-50"
                                                }`}
                                        >
                                            {cat.ten}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Giá */}
                            <div className="mb-24">
                                <h6 className="mb-12 fw-semibold">Khoảng giá</h6>
                                <div className="gap-8 d-flex align-items-center">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className="px-8 py-6 form-control"
                                        placeholder="Từ"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                                        className="px-8 py-6 form-control"
                                        placeholder="Đến"
                                    />
                                </div>
                            </div>

                            {/* Đánh giá */}
                            <div className="mb-24">
                                <h6 className="mb-12 fw-semibold">Đánh giá</h6>
                                <div className="gap-8 d-flex flex-column">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating)}
                                            className={`px-12 py-8 text-start rounded-6 ${minRating === rating ? "bg-main-50 text-main-600" : "hover-bg-gray-50"
                                                }`}
                                        >
                                            {"⭐".repeat(rating)} trở lên
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setMinRating(0)}
                                        className={`px-12 py-8 text-start rounded-6 ${minRating === 0 ? "bg-main-50 text-main-600" : "hover-bg-gray-50"
                                            }`}
                                    >
                                        Tất cả
                                    </button>
                                </div>
                            </div>

                            {/* Reset */}
                            <button
                                onClick={() => {
                                    setSelectedCategory(undefined);
                                    setPriceRange([0, 10000000]);
                                    setMinRating(0);
                                }}
                                className="w-100 btn btn-outline-main"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="col-lg-9">
                        {/* Sort bar */}
                        <div className="p-16 mb-24 bg-white border border-gray-100 rounded-8">
                            <div className="gap-12 d-flex align-items-center">
                                <span className="text-sm fw-medium">Sắp xếp:</span>
                                <div className="flex-wrap gap-8 d-flex">
                                    {[
                                        { value: "relevance", label: "Liên quan" },
                                        { value: "sales", label: "Bán chạy" },
                                        { value: "price_asc", label: "Giá thấp" },
                                        { value: "price_desc", label: "Giá cao" },
                                        { value: "rating", label: "Đánh giá" },
                                    ].map((sort) => (
                                        <button
                                            key={sort.value}
                                            onClick={() => setCurrentSort(sort.value as SearchParams["sort_by"])}
                                            className={`px-16 py-8 text-sm rounded-6 ${currentSort === sort.value
                                                ? "bg-main-600 text-white"
                                                : "bg-gray-50 hover-bg-gray-100"
                                                }`}
                                        >
                                            {sort.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {results.length === 0 ? (
                            <div className="text-center py-80">
                                <i className="mb-16 text-6xl text-gray-300 ph ph-magnifying-glass"></i>
                                <h5 className="mb-8 fw-semibold">Không tìm thấy sản phẩm</h5>
                                <p className="text-gray-600">Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                            </div>
                        ) : (
                            <div className="row g-16">
                                {results.map((product) => (
                                    <div key={product.id} className="col-6 col-sm-4 col-xl-3">
                                        <ProductCardSearch product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
