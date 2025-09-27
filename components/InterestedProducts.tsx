'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const InterestedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Hàm xử lý lỗi khi tải ảnh
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/placeholder-product.jpg';
  };

  const handleTabClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'iPhone 13 Pro Max 128GB',
      brand: 'Apple',
      price: '22.990.000 đ',
      originalPrice: '26.990.000 đ',
      discount: '15%',
      rating: 4.9,
      reviewCount: '1.2K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'mobile'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S22 Ultra 5G',
      brand: 'Samsung',
      price: '24.990.000 đ',
      originalPrice: '28.990.000 đ',
      discount: '14%',
      rating: 4.8,
      reviewCount: '856',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'mobile'
    },
    {
      id: 3,
      name: 'MacBook Air M2 2022 13-inch',
      brand: 'Apple',
      price: '28.990.000 đ',
      originalPrice: '31.990.000 đ',
      discount: '9%',
      rating: 4.9,
      reviewCount: '2.3K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'laptop'
    },
    {
      id: 4,
      name: 'Dell XPS 13 9315',
      brand: 'Dell',
      price: '26.990.000 đ',
      originalPrice: '29.990.000 đ',
      discount: '10%',
      rating: 4.7,
      reviewCount: '1.5K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'laptop'
    },
    {
      id: 5,
      name: 'AirPods Pro 2',
      brand: 'Apple',
      price: '5.990.000 đ',
      originalPrice: '6.990.000 đ',
      discount: '14%',
      rating: 4.8,
      reviewCount: '5.6K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'accessories'
    },
    {
      id: 6,
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      price: '7.990.000 đ',
      originalPrice: '8.990.000 đ',
      discount: '11%',
      rating: 4.9,
      reviewCount: '3.2K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'accessories'
    },
    {
      id: 7,
      name: 'Samsung Galaxy Watch5 Pro',
      brand: 'Samsung',
      price: '11.990.000 đ',
      originalPrice: '13.990.000 đ',
      discount: '14%',
      rating: 4.7,
      reviewCount: '1.8K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'accessories'
    },
    {
      id: 8,
      name: 'iPad Air 5 M1 64GB',
      brand: 'Apple',
      price: '15.990.000 đ',
      originalPrice: '17.990.000 đ',
      discount: '11%',
      rating: 4.8,
      reviewCount: '2.1K',
      image: '/assets/images/products/14-pro-black.webp',
      category: 'tablet'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'mobile', name: 'Điện thoại' },
    { id: 'laptop', name: 'Laptop' },
    { id: 'tablet', name: 'Máy tính bảng' },
    { id: 'accessories', name: 'Phụ kiện' },
  ];

  return (
    <section className="trending-productss pt-60 overflow-hidden">
      <div className="container">
        <div className="border border-gray-100 p-24 rounded-16">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <h6 className="mb-0">
                <i className="ph-bold ph-hand-withdraw text-main-600"></i> Có thể bạn quan tâm
              </h6>
              <ul className="nav common-tab style-two nav-pills" id="pills-tab" role="tablist">
                {categories.map((category) => (
                  <li key={category.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link fw-medium text-sm hover-border-main-600 ${activeCategory === category.id ? 'active' : ''
                        }`}
                      onClick={() => handleTabClick(category.id)}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === category.id}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-all"
              role="tabpanel"
              aria-labelledby="pills-all-tab"
              tabIndex={0}
            >
              <div className="row g-12">
                {products
                  .filter(product => activeCategory === 'all' || product.category === activeCategory)
                  .slice(0, 8) // Chỉ hiển thị tối đa 8 sản phẩm
                  .map((product) => (
                    <div key={product.id} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6">
                      <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                        <a
                          href="#"
                          className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                        >
                          <Image
                            src={product.image || '/assets/images/placeholder-product.jpg'}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-auto max-w-unset"
                            onError={handleImageError}
                          />
                        </a>
                        <div className="product-card__content w-100 mt-16">
                          <span className="text-success-600 bg-success-50 text-sm fw-medium py-4 px-8">
                            Giảm giá đến {product.discount}
                          </span>
                          <h6 className="title text-lg fw-semibold my-16">
                            <a href="#" className="link text-line-2">
                              {product.name}
                            </a>
                          </h6>
                          <div className="flex-align gap-6">
                            <div className="flex-align gap-2">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xs fw-medium text-warning-600 d-flex">
                                  <i className="ph-fill ph-star"></i>
                                </span>
                              ))}
                            </div>
                            <span className="text-xs fw-medium text-gray-500">{product.rating}</span>
                            <span className="text-xs fw-medium text-gray-500">({product.reviewCount})</span>
                            <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 fw-normal">
                              {product.brand}
                            </span>
                          </div>

                          <div className="product-card__price mt-16 mb-10">
                            <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                              {product.originalPrice}
                            </span>
                            <span className="text-heading text-md fw-semibold">{product.price}</span>
                          </div>

                          <a
                            href="#"
                            className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-center gap-8 fw-medium"
                          >
                            Thêm vào giỏ hàng <i className="ph ph-shopping-cart"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestedProducts;
