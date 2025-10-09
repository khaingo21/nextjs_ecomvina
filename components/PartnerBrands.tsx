'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper/types';

const brandList = [
  { id: 1, name: 'coast',         logo: '/assets/images/thumbs/top-brand-img1.png' },
  { id: 2, name: 'globalpayments',logo: '/assets/images/thumbs/top-brand-img2.png' },
  { id: 3, name: 'Skupos',        logo: '/assets/images/thumbs/top-brand-img3.png' },
  { id: 4, name: 'LinkPool',      logo: '/assets/images/thumbs/top-brand-img4.png' }, // fixed
  { id: 5, name: 'coast',         logo: '/assets/images/thumbs/top-brand-img8.png' },
  { id: 6, name: 'conductor',     logo: '/assets/images/thumbs/top-brand-img5.png' },
  { id: 7, name: 'mosaic',        logo: '/assets/images/thumbs/top-brand-img6.png' },
];

export default function PartnerBrands() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  useEffect(() => {
    const s = swiperRef.current;
    if (!s) return;
    if (typeof s.params.navigation === 'object') {
      s.params.navigation.prevEl = prevRef.current;
      s.params.navigation.nextEl = nextRef.current;
      s.navigation.init();
      s.navigation.update();
    }
  }, []);

  return (
    <section aria-label="Thương hiệu đối tác" className="relative">
      <div className="absolute z-10 flex gap-2 right-2 top-2">
        <button ref={prevRef} type="button" aria-label="Trước" className="px-3 py-2 border rounded-full">‹</button>
        <button ref={nextRef} type="button" aria-label="Sau"   className="px-3 py-2 border rounded-full">›</button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={(s) => { swiperRef.current = s; }}
        navigation
        autoplay={{ delay: 0, disableOnInteraction: false }}   // marquee-style
        speed={3000}
        loop
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{ 640:{ slidesPerView:4 }, 1024:{ slidesPerView:6 } }}
        className="w-full"
      >
        {brandList.map(b => (
          <SwiperSlide key={b.id}>
            <div className="h-[76px] flex items-center justify-center rounded-[14px] border border-slate-100">
              <Image src={b.logo} alt={b.name} width={140} height={24} style={{ objectFit:'contain' }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
