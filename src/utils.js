// src/utils.js
export const CART_KEY = 'cart';

// -------- Format tiền VND từ số --------
export const fmtVN = (n) =>
  (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

// Ảnh fallback nếu thiếu ảnh
export const fallbackImg =
  'https://via.placeholder.com/400x400/F5F5F5/999?text=H%C3%ACnh';

// -------- Giỏ hàng: đọc/ghi localStorage --------
export function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Thêm vào giỏ: lưu productId + quantity + options tuỳ chọn
export function addToCart(productId, quantity = 1, options = {}) {
  const items = loadCart();
  const idx = items.findIndex(i =>
    i.productId === productId &&
    JSON.stringify(i.options || {}) === JSON.stringify(options || {})
  );
  if (idx >= 0) {
    items[idx].quantity = (items[idx].quantity || 1) + quantity;
  } else {
    items.push({ productId, quantity, options });
  }
  saveCart(items);
  return items;
}

// Tính phần trăm giảm: trả về dạng "-18%" hoặc "" nếu không hợp lệ
export function percentOff(price, originalPrice) {
  const p = Number(price), o = Number(originalPrice);
  if (!o || !p || o <= p) return '';
  const off = Math.round((1 - p / o) * 100);
  return `-${off}%`;
}

// Ghép text hiển thị rating: "4.5 (1,238 đánh giá)" ...
export function ratingText(rating, reviewCount) {
  if (rating == null && reviewCount == null) return '';
  const r = (rating != null) ? Number(rating).toFixed(1) : '';
  const c = (reviewCount != null)
    ? Number(reviewCount).toLocaleString('vi-VN')
    : null;
  if (r && c) return `${r} (${c} đánh giá)`;
  if (r) return r;
  if (c) return `(${c} đánh giá)`;
  return '';
}

// Tìm sản phẩm theo id, hỗ trợ cả mảng và object
export function getProductById(collection, id) {
  if (!collection) return null;
  const numId = Number(id);
  // PRODUCTS là mảng?
  if (Array.isArray(collection)) {
    return collection.find(p => Number(p.id) === numId) || null;
  }
  // PRODUCTS là object dạng {101: {...}}
  if (typeof collection === 'object') {
    return collection[numId] || collection[String(numId)] || null;
  }
  return null;
}
