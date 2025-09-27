"use client";
import React, { useRef } from 'react';
import Image from 'next/image';

const brandList = [
  // 1. coast
  { id: 1, name: 'coast', logo: '/assets/images/thumbs/top-brand-img1.png' },
  // 2. globalpayments
  { id: 2, name: 'globalpayments', logo: '/assets/images/thumbs/top-brand-img2.png' },
  // 3. Skupos
  { id: 3, name: 'Skupos', logo: '/assets/images/thumbs/top-brand-img3.png' },
  // 4. LinkPool (tên file gốc là .png.png)
  { id: 4, name: 'LinkPool', logo: '/assets/images/thumbs/top-brand-img4.png.png' },
  // 5. coast (lần 2) - dùng ảnh số 8
  { id: 5, name: 'coast', logo: '/assets/images/thumbs/top-brand-img8.png' },
  // 6. conductor
  { id: 6, name: 'conductor', logo: '/assets/images/thumbs/top-brand-img5.png' },
  // 7. mosaic
  { id: 7, name: 'mosaic', logo: '/assets/images/thumbs/top-brand-img6.png' }
];

const PartnerBrands = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const gap = 20; // khoảng cách giữa các ảnh sát mẫu

  const scrollBy = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    const firstCard = node.querySelector('[data-card]') as HTMLElement | null;
    const amount = ((firstCard?.offsetWidth ?? 220) + gap);
    node.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: '36px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            position: 'relative',
            background: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: 16,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ padding: '12px 16px 6px 16px' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Các thương hiệu đối tác</h2>
          </div>

          <div style={{ position: 'absolute', top: 8, right: 10 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 9999,
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                aria-label="Cuộn trái"
                onClick={() => scrollBy('left')}
                style={{ width: 26, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 0, color: '#374151', cursor: 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div style={{ width: 1, height: 18, background: '#e5e7eb' }} />
              <button
                type="button"
                aria-label="Cuộn phải"
                onClick={() => scrollBy('right')}
                style={{ width: 26, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 0, color: '#374151', cursor: 'pointer' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{ padding: '0 0 10px 0' }}>
            <div
              ref={scrollRef}
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'stretch',
                gap,
                padding: '6px 16px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollBehavior: 'smooth',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
              className="brands-scroller"
            >
              {brandList.map((brand) => (
                <div
                  key={brand.id}
                  data-card
                  style={{
                    flex: '0 0 auto',
                    width: 140,
                    height: 76,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    border: '1px solid #f1f5f9',
                    borderRadius: 14,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={140}
                    height={48}
                    style={{ height: 24, width: 'auto', opacity: 0.9, padding: 4 }}
                    loading={brand.id > 4 ? 'lazy' : 'eager'}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Hide scrollbar for WebKit via styled-jsx (scoped to this component) */}
          <style jsx>{`
            .brands-scroller::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default PartnerBrands;