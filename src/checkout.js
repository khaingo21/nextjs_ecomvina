// dùng lại bộ utils + products
import { PRODUCTS } from './products.js';
import { fmtVN, loadCart, saveCart } from './utils.js';

const $  = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));

/* ----- lấy sản phẩm theo id ----- */
function getProductById(id){
  return Array.isArray(PRODUCTS)
    ? PRODUCTS.find(p => p.id === id)
    : PRODUCTS[id];
}
const priceOf = (id) => Number(getProductById(id)?.price || 0);
const imgOf   = (id) => getProductById(id)?.img || 'https://via.placeholder.com/80x80/f5f8ff/3d5af1?text=H%C3%ACnh';

/* ----- state ----- */
let cart = loadCart().map(i => ({ selected:true, quantity:1, ...i })); // đảm bảo field
let voucherDiscount = 0;
let shipMethod = 'standard';

document.addEventListener('DOMContentLoaded', init);

function init(){
  renderItems();
  bindEvents();
  recalc();
}

function selectedItems(){
  return cart.filter(i => i.selected !== false);
}

/* ----- render danh sách item đã chọn ----- */
function renderItems(){
  const wrap = $('#ck-items');
  const selected = selectedItems();

  if(selected.length === 0){
    wrap.innerHTML = `<div class="empty">Không có sản phẩm nào được chọn. <a href="cart.html" class="btn-link">Quay lại giỏ hàng</a></div>`;
    return;
  }

  wrap.innerHTML = selected.map(it => {
    const p = getProductById(it.productId);
    if(!p) return '';
    return `
      <div class="ck-item" data-id="${it.productId}">
        <img src="${imgOf(it.productId)}" alt="${p.name}"/>
        <div>
          <div class="name">${p.name}</div>
          <div class="qty">x ${it.quantity || 1}</div>
        </div>
        <div class="price">${fmtVN(priceOf(it.productId) * (it.quantity || 1))}</div>
      </div>`;
  }).join('');
}

/* ----- tính tổng ----- */
function shippingFee(subtotal){
  // tiêu chuẩn: miễn phí nếu >= 500k
  if (shipMethod === 'standard') return subtotal >= 500000 ? 0 : (subtotal > 0 ? 30000 : 0);
  if (shipMethod === 'fast')     return subtotal > 0 ? 50000 : 0;
  if (shipMethod === 'express')  return subtotal > 0 ? 80000 : 0;
  return 0;
}
function recalc(){
  const list = selectedItems();
  const subtotal = list.reduce((s,i) => s + priceOf(i.productId) * (i.quantity || 1), 0);
  const ship     = shippingFee(subtotal);
  const discount = Math.min(voucherDiscount, subtotal); // không âm
  const total    = Math.max(0, subtotal + ship - discount);

  $('#sum-subtotal').textContent = fmtVN(subtotal);
  $('#sum-shipping').textContent = fmtVN(ship);
  $('#sum-discount').textContent = `-${fmtVN(discount)}`;
  $('#sum-total').textContent    = fmtVN(total);
}

/* ----- events ----- */
function bindEvents(){
  // đổi ship method
  $$('input[name="ship"]').forEach(r => {
    r.addEventListener('change', ()=>{
      shipMethod = r.value;
      recalc();
    });
  });

  // áp dụng voucher
  $('#applyVoucher').addEventListener('click', ()=>{
    const code = $('#voucher').value.trim().toUpperCase();
    voucherDiscount = (code === 'GIAM50K') ? 50000 : 0;
    recalc();
    alert(voucherDiscount ? 'Áp dụng mã thành công!' : 'Mã không hợp lệ.');
  });

  // đặt hàng
  $('#placeOrder').addEventListener('click', placeOrder);
}

/* ----- place order (demo) ----- */
function placeOrder(){
  const chosen = selectedItems();
  if (chosen.length === 0){
    alert('Bạn chưa chọn sản phẩm nào trong giỏ!');
    return;
  }

  // Xóa các item đã chọn khỏi giỏ (giữ lại phần chưa chọn)
  cart = loadCart(); // refresh
  const left = cart.filter(i =>
    !chosen.some(c => c.productId === i.productId &&
                      JSON.stringify(c.options||{}) === JSON.stringify(i.options||{}))
  );
  saveCart(left);

  alert('Đặt hàng thành công! (demo)\nBạn sẽ được chuyển về trang chủ.');
  location.href = 'index.html';
}
