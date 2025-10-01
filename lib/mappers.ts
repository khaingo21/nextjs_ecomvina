// // lib/mappers.ts
// import type { ApiProduct, UIProduct } from "./types";

// export const num = (v: unknown, d: number = 0): number => {
//   if (v === null || v === undefined) return d;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : d;
// };

// export const pickImage = (p: ApiProduct): string => {
//   // ưu tiên mediaurl, sau đó tới ảnh đầu tiên trong anhsanphams
//   return (
//     p.mediaurl ||
//     p.image_url ||
//     p.anhsanphams?.[0]?.media ||
//     "/assets/images/thumbs/product-two-img7.png"
//   );
// };

// export const slugify = (name: string, fallback: string = "sp"): string => {
//   const s = (name || "").toLowerCase()
//     .normalize("NFD").replace(/\p{Diacritic}/gu, "")
//     .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
//   return s || fallback;
// };

// export const computePrices = (p: ApiProduct): {
//   original: number | null; selling: number; isDiscounted: boolean; percent: number | null;
// } => {
//   // Nguồn 1: đã chuẩn hóa (top_categories)
//   const sellingReady = p.selling_price ?? null;
//   const originalReady = p.original_price !== undefined ? num(p.original_price, null as unknown as number) : null;
//   const discountAmountReady = p.discount_amount !== undefined ? num(p.discount_amount) : null;

//   // Nguồn 2: best_products có p.gia
//   const giaCur = p.gia?.current ?? null;
//   const giaBefore = p.gia?.before_discount ?? null;

//   // Nguồn 3: hot_sales lấy từ biến thể đầu tiên
//   const v0 = p.bienthes?.[0];
//   const gia = v0?.gia ?? giaBefore;
//   const giagiam = v0?.giagiam ?? 0;

//   let selling = sellingReady ?? (giaCur ?? (num(giagiam) > 0 ? num(giagiam) : num(gia)));
//   let original = originalReady ?? (giaCur !== null && giaBefore !== null ? num(giaBefore) : num(gia, null as unknown as number));
//   if (original !== null && selling === 0 && original > 0) {
//     // không sao, coi như free
//   }
//   const isDiscounted = original !== null && selling > 0 && original > selling;
//   const percent = isDiscounted && original ? Math.round(((original - selling) / original) * 100) : null;

//   return { original, selling, isDiscounted, percent };
// };

// export const computeRating = (p: ApiProduct): { avg: number; count: number } => {
//   if (p.rating?.average !== undefined && p.rating?.count !== undefined) {
//     return { avg: num(p.rating.average), count: num(p.rating.count) };
//   }
//   const list = p.danhgias || [];
//   const count = list.length;
//   const sum = list.reduce((s, r) => s + num(r.diem), 0);
//   const avg = count ? Math.round((sum / count) * 10) / 10 : 0;
//   return { avg, count };
// };

// export const toUIProduct = (p: ApiProduct): UIProduct => {
//   const { original, selling, isDiscounted, percent } = computePrices(p);
//   const { avg, count } = computeRating(p);
//   const slug = p.slug ? String(p.slug) : slugify(p.ten, `sp-${p.id}`);
//   const isFree = selling === 0 || p.is_free === true;
//   const isSold = Boolean(p.is_sold) || (p.bienthes?.[0]?.soluong ?? 1) <= 0;

//   return {
//     id: p.id,
//     name: p.ten,
//     href: `/product/${slug}-${p.id}`,
//     image: pickImage(p),
//     originalPrice: original,
//     sellingPrice: selling,
//     isDiscounted,
//     discountPercent: percent,
//     isFree,
//     isSold,
//     ratingAverage: avg,
//     ratingCount: count,
//     sellerName: p.seller_name ?? p.store?.name ?? p.thuonghieu?.ten ?? null,
//     badgeText: isSold ? "Sold"
//       : isFree ? "Miễn phí"
//       : (p.discount_type ?? (percent ? `${percent}% OFF` : null)),
//   };
// };
