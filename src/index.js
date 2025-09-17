// src/index.js
import { PRODUCTS } from './products.js';
import { fmtVN, percentOff, ratingText, getProductById, addToCart, loadCart, saveCart } from './utils.js';

const $  = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));

/**
 * (Khuyến nghị) Nếu bạn đã sửa HTML để data-product là id thật (101,102,105,...),
 * hãy đặt USE_DIRECT_CARD_ID = true và có thể bỏ SLOT_TO_PRODUCT_ID.
 * Còn nếu HTML vẫn dùng 1..5 như hiện tại, để USE_DIRECT_CARD_ID = false
 * và dùng bảng map dưới đây để trỏ tới id thật trong PRODUCTS.
 */
const USE_DIRECT_CARD_ID = true; // true nếu data-product đã là id thật
// const SLOT_TO_PRODUCT_ID = {
//   1: 101,
//   2: 102,
//   3: 105,
//   4: 102,
//   5: 103,
// };

document.addEventListener('DOMContentLoaded', () => {
  const homePage          = $('#home-page');
  const productDetailPage = $('#product-detail-page');
  const logo              = $('#logo');
  const backToHome        = $('#back-to-home');
  const productCards      = $$('.product-card');

  // Ẩn trang chi tiết ban đầu
  if (productDetailPage) productDetailPage.style.display = 'none';

  // về trang chủ
  logo?.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
  backToHome?.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });

  // click card -> show detail
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const raw = card.getAttribute('data-product'); // "1".."5" hoặc "101"..
      const pid = USE_DIRECT_CARD_ID ? Number(raw) : Number(SLOT_TO_PRODUCT_ID[raw] ?? raw);
      showProductDetail(pid);
    });
  });

  function showHomePage() {
    if (homePage) homePage.style.display = 'block';
    if (productDetailPage) productDetailPage.style.display = 'none';
    window.scrollTo(0, 0);
  }

  function showProductDetail(productId) {
    if (!homePage || !productDetailPage) return;
    homePage.style.display = 'none';
    productDetailPage.style.display = 'block';

    const p = getProductById(PRODUCTS, productId);
    if (!p) {
      console.warn('Product not found for id:', productId);
      return;
    }

    // title + breadcrumb
    $('#product-detail-title').textContent    = p.name;
    $('#product-breadcrumb-name').textContent = p.name;

    // giá hiện tại
    $('#product-current-price').textContent = fmtVN(p.price);

    // giá gốc & % giảm (nếu có)
    const originalEl = $('#product-original-price');
    const discountEl = $('#product-discount');
    if (p.originalPrice && p.originalPrice > p.price) {
      originalEl.textContent   = fmtVN(p.originalPrice);
      originalEl.style.display = 'inline';

      const off = percentOff(p.price, p.originalPrice); // vd "-18%"
      if (off) {
        discountEl.textContent   = off;
        discountEl.style.display = 'inline';
      } else {
        discountEl.style.display = 'none';
      }
    } else {
      originalEl.style.display = 'none';
      discountEl.style.display = 'none';
    }

    // rating text (nếu có reviewCount)
    if ($('#product-rating-text')) {
      $('#product-rating-text').textContent = ratingText(p.rating, p.reviewCount);
    }

    // (tuỳ chọn) nếu bạn có p.images, có thể set ảnh chính
    // const mainImage = document.querySelector('.main-image img');
    // if (p.images?.[0] && mainImage) mainImage.src = p.images[0];

    // --- số lượng
    const quantityInput = $('.quantity-input');
    const decreaseBtn   = $('#decrease');
    const increaseBtn   = $('#increase');

    decreaseBtn && (decreaseBtn.onclick = () => {
      let v = parseInt(quantityInput?.value || '1', 10);
      if (v > 1) quantityInput.value = String(v - 1);
    });

    increaseBtn && (increaseBtn.onclick = () => {
      let v = parseInt(quantityInput?.value || '1', 10);
      quantityInput.value = String(v + 1);
    });

    // --- thumbnails (giữ hiệu ứng mờ/hiện)
    const thumbnails = $$('.thumbnail');
    const mainImage  = $('.main-image img');
    thumbnails.forEach(thumb => {
      thumb.onclick = function(){
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        if (mainImage) {
          mainImage.style.opacity = '0';
          setTimeout(() => { mainImage.style.opacity = '1'; }, 300);
        }
      };
    });

    // --- nút giỏ / mua (gắn lại mỗi lần show để tránh nhân đôi listener)
    const addToCartBtn = $('.btn-cart');
    const buyNowBtn    = $('.btn-buy');

    addToCartBtn && (addToCartBtn.onclick = (ev) => {
      ev.stopPropagation();
      const qty = Math.max(1, parseInt(quantityInput?.value || '1', 10) || 1);
      addToCart(p.id, qty);
      alert(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
    });

    buyNowBtn && (buyNowBtn.onclick = (ev) => {
      ev.stopPropagation();
      const qty = Math.max(1, parseInt(quantityInput?.value || '1', 10) || 1);
      addToCart(p.id, qty);
      location.href = 'cart.html';
    });

    window.scrollTo(0, 0);
  }

  // --- Tìm kiếm (demo)
  const searchInput  = $('.search-bar input');
  const searchButton = $('.search-bar button');

  function performSearch() {
    const q = searchInput?.value.trim();
    if (q) alert(`Tìm kiếm: ${q}`);
  }
  searchButton?.addEventListener('click', performSearch);
  searchInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });

  // Tabs (ngoài detail)
  const tabHeaders = $$('.tab-header');
  const tabPanels  = $$('.tab-panel');
  tabHeaders.forEach(h => {
    h.addEventListener('click', function(){
      const tabId = this.getAttribute('data-tab');
      tabHeaders.forEach(x => x.classList.remove('active'));
      tabPanels.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(tabId)?.classList.add('active');
    });
  });
});
