'use client';

import Link from 'next/link';
import Image from 'next/image';

type VendorCardProps = {
  href: string;
  title: string;
  cover: string;
  productsText?: string; // "12 sản phẩm" (không bắt buộc)
};

export default function VendorCard({ href, title, cover, productsText }: VendorCardProps) {
  const external = /^https?:\/\//i.test(cover);

  return (
    <article className="p-16 border border-gray-100 vendor-card rounded-12 hover-border-main-600 transition-2 h-100">
      <Link href={href} className="block overflow-hidden rounded-10 bg-gray-50">
        <Image
          src={cover}
          alt={title}
          width={400}
          height={180}
          className="w-full h-[180px] object-cover"
          unoptimized={external}
        />
      </Link>

      <div className="mt-12">
        <h6 className="text-md fw-semibold line-clamp-1">
          <Link href={href} className="link">{title}</Link>
        </h6>
        {productsText && <div className="mt-4 text-xs text-gray-500">{productsText}</div>}
      </div>

      <div className="mt-12">
        <Link
          href={href}
          className="inline-flex items-center gap-6 text-sm fw-semibold text-main-600 hover-text-decoration-underline"
        >
          Xem cửa hàng <i className="ph ph-arrow-up-right" />
        </Link>
      </div>
    </article>
  );
}
//import VendorCard from '@/components/VendorCard'; cách dùng vendor card
{/* <SwiperSlide key={v.id}>
  <VendorCard
    href={v.href}
    title={v.title}
    productsText={`${v.count} sản phẩm`}
    cover={v.cover}
  />
</SwiperSlide> */}