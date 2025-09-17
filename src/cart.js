// /src/cart.js
import { PRODUCTS } from './products.js';
import { fmtVN, loadCart, saveCart } from './utils.js';

const $  = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));

/* ---------------- Helpers ---------------- */
function getProductById(id){
  return Array.isArray(PRODUCTS)
    ? PRODUCTS.find(p => p.id === id)
    : PRODUCTS[id];
}
function getPriceOf(id){
  const p = getProductById(id);
  return p ? Number(p.price || 0) : 0;
}
function fallbackImgFor(p){
  return p?.img || 'https://via.placeholder.com/110x110/f5f8ff/3d5af1?text=H%C3%ACnh';
}

/* -------------- State (from localStorage) -------------- */
let cart = loadCart(); 
// Đảm bảo có cờ selected (mặc định true)
cart = cart.map(i => ({ selected: true, ...i }));
saveCart(cart);

/* ---------------- Render ---------------- */
function renderCart(){
  const wrap = $('#cart-items-container');
  if(!wrap) return;

  if(cart.length === 0){
    wrap.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p>Hãy khám phá cửa hàng và thêm sản phẩm vào giỏ!</p>
        <a href="index.html" class="shopping-btn">Mua sắm ngay</a>
      </div>`;
    updateSummary();
    syncSelectAll();
    return;
  }

  wrap.innerHTML = cart.map(it => {
    const p = getProductById(it.productId);
    if(!p) return ''; // sản phẩm không tồn tại

    return `
      <div class="cart-item" data-id="${it.productId}">
        <div class="item-select">
          <input type="checkbox" class="item-checkbox" data-id="${it.productId}" ${it.selected!==false ? 'checked' : ''}>
        </div>

        <img src="${fallbackImgFor(p)}" alt="${p.name}" class="item-image">

        <div class="item-details">
          <div class="item-name">${p.name}</div>
          <div class="item-price">${fmtVN(getPriceOf(it.productId))}</div>

          <div class="quantity-controls">
            <button class="quantity-btn btn-decrease" data-id="${it.productId}">-</button>
            <input type="number" class="quantity-input" value="${it.quantity || 1}" min="1" data-id="${it.productId}">
            <button class="quantity-btn btn-increase" data-id="${it.productId}">+</button>
          </div>

          <div class="item-actions">
            <button class="action-btn save-btn"><i class="far fa-heart"></i> Lưu lại</button>
            <button class="action-btn remove-btn" data-id="${it.productId}">
              <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  updateSummary();
  syncSelectAll();
}

/* -------------- Summary (only selected) -------------- */
function updateSummary(){
  const selected = cart.filter(i => i.selected !== false);
  const subtotal = selected.reduce((sum, it) => sum + getPriceOf(it.productId) * (it.quantity || 1), 0);

  const shipping = subtotal > 500000 ? 0 : (subtotal === 0 ? 0 : 30000);
  const discount = subtotal > 1000000 ? 100000 : 0;
  const total    = Math.max(0, subtotal + shipping - discount);

  $('#subtotal').textContent = fmtVN(subtotal);
  $('#shipping').textContent = fmtVN(shipping);
  $('#discount').textContent = `-${fmtVN(discount)}`;
  $('#total').textContent    = fmtVN(total);

  // (tuỳ) hiển thị số lượng sản phẩm đã chọn trên icon
  const count = selected.reduce((s, i) => s + (i.quantity || 1), 0);
  const badge = $('.cart-count');
  if(badge) badge.textContent = count;
}

/* -------------- Select all sync -------------- */
function syncSelectAll(){
  const all = $('#select-all');
  if(!all) return;
  all.checked = cart.length > 0 && cart.every(i => i.selected !== false);
  all.indeterminate = cart.some(i => i.selected !== false) && !all.checked;
}

/* -------------- Event delegation -------------- */
const container = $('#cart-items-container');

if(container){
  container.addEventListener('click', (e) => {
    // tăng/giảm
    if(e.target.matches('.btn-decrease, .btn-increase')){
      const id = Number(e.target.dataset.id);
      const item = cart.find(i => i.productId === id);
      if(!item) return;
      if(e.target.classList.contains('btn-decrease')){
        item.quantity = Math.max(1, (item.quantity || 1) - 1);
      } else {
        item.quantity = (item.quantity || 1) + 1;
      }
      saveCart(cart);
      renderCart();
    }

    // xóa
    if(e.target.closest('.remove-btn')){
      const id = Number(e.target.closest('.remove-btn').dataset.id);
      cart = cart.filter(i => i.productId !== id);
      saveCart(cart);
      renderCart();
    }
  });

  // thay đổi số lượng qua input
  container.addEventListener('change', (e) => {
    // checkbox chọn/bỏ chọn
    if(e.target.matches('.item-checkbox')){
      const id = Number(e.target.dataset.id);
      const item = cart.find(i => i.productId === id);
      if(item){
        item.selected = e.target.checked;
        saveCart(cart);
        updateSummary();
        syncSelectAll();
      }
    }

    // nhập số lượng
    if(e.target.matches('.quantity-input')){
      const id = Number(e.target.dataset.id);
      const v  = Math.max(1, parseInt(e.target.value || '1', 10) || 1);
      const item = cart.find(i => i.productId === id);
      if(item){
        item.quantity = v;
        saveCart(cart);
        updateSummary();
      }
    }
  });
}

/* -------------- Select all -------------- */
const selectAll = $('#select-all');
if(selectAll){
  selectAll.addEventListener('change', () => {
    const checked = selectAll.checked;
    cart = cart.map(i => ({ ...i, selected: checked }));
    saveCart(cart);
    renderCart();
  });
}

/* -------------- Start -------------- */
document.addEventListener('DOMContentLoaded', renderCart);
