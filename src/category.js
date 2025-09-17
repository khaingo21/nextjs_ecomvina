// category.js
import { PRODUCTS } from './products.js';
import { fmtVN, fallbackImg } from './utils.js';

const $  = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => Array.from(scope.querySelectorAll(s));

const state = { cat:'all', q:'', page:1, pageSize:15, sort:'pop', min:null, max:null, brands:[], rate:0 };

// đọc URL
const params = new URLSearchParams(location.search);
if (params.get('cat')) state.cat = params.get('cat');
if (params.get('q')) { state.q = params.get('q'); const qi = $('#q'); if (qi) qi.value = state.q; }

// UI
function setActiveChips(){
  $$('.chip').forEach(c=> c.classList.toggle('active', c.dataset.cat===state.cat));
  const mapName = {all:'Tất cả', electronics:'Điện tử', phones:'Điện thoại', laptop:'Laptop', audio:'Tai nghe/Âm thanh', home:'Gia dụng', fashion:'Thời trang', beauty:'Làm đẹp', new:'Sản phẩm mới', deals:'Khuyến mãi', health:'Sức khỏe'};
  $('#title').textContent   = mapName[state.cat] || 'Danh mục';
  $('#crumbCat').textContent= $('#title').textContent;
}

function applyFilters(){
  let list = PRODUCTS.slice();

  if (state.cat!=='all') list = list.filter(p=>p.cat===state.cat);
  if (state.q) {
    const q = state.q.toLowerCase();
    list = list.filter(p=> p.name.toLowerCase().includes(q));
  }
  if (state.min!=null) list = list.filter(p=> p.price >= state.min);
  if (state.max!=null) list = list.filter(p=> p.price <= state.max);
  if (state.brands.length) list = list.filter(p=> state.brands.includes(p.brand));
  if (state.rate>0) list = list.filter(p=> (p.rating||0) >= state.rate);

  if (state.sort==='price_asc')      list.sort((a,b)=>a.price-b.price);
  else if (state.sort==='price_desc')list.sort((a,b)=>b.price-a.price);
  else if (state.sort==='rating')    list.sort((a,b)=> (b.rating||0)-(a.rating||0));
  // 'pop' giữ nguyên thứ tự

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total/state.pageSize));
  state.page = Math.min(state.page, pages);
  const start = (state.page-1)*state.pageSize;
  renderGrid(list.slice(start, start+state.pageSize));
  renderPagination(pages);
}

function renderGrid(items){
  const grid = $('#grid'); if (!grid) return;
  grid.innerHTML = items.map(p=>`
    <div class="card" data-id="${p.id}">
      <div class="img">
        <img src="${p.img || fallbackImg}" alt="${p.name}" loading="lazy" onerror="this.src='${fallbackImg}'">
      </div>
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">${fmtVN(p.price)}${
          p.originalPrice ? ` <span class="strike">${fmtVN(p.originalPrice)}</span>` : ''
        }</div>
        <div class="rating"><i class="fas fa-star"></i> ${(p.rating||0).toFixed(1)}</div>
      </div>
    </div>
  `).join('');

  $$('.card', grid).forEach(c=>{
    c.addEventListener('click', ()=>{
      location.href = `index.html#p${c.dataset.id}`;
    });
  });
}

function renderPagination(pages){
  const pag = $('#pagination'); if (!pag) return;
  pag.innerHTML = '';
  for (let i=1;i<=pages;i++){
    const btn = document.createElement('button');
    btn.className = 'page' + (i===state.page ? ' active':'');
    btn.textContent = i;
    btn.addEventListener('click', ()=>{
      state.page = i; applyFilters(); window.scrollTo({top:0, behavior:'smooth'});
    });
    pag.appendChild(btn);
  }
}

// events
$$('.chip').forEach(ch=>{
  ch.addEventListener('click', ()=>{
    state.cat = ch.dataset.cat || 'all'; state.page=1;
    setActiveChips(); applyFilters();
    const u = new URL(location); u.searchParams.set('cat', state.cat); history.replaceState({},'',u);
  });
});
const q = $('#q'), btnSearch = $('#btnSearch');
if (btnSearch) btnSearch.addEventListener('click', ()=>{
  state.q = (q?.value||'').trim(); state.page=1; applyFilters();
  const u = new URL(location);
  state.q ? u.searchParams.set('q', state.q) : u.searchParams.delete('q');
  history.replaceState({},'',u);
});
if (q) q.addEventListener('keypress', e=>{
  if (e.key==='Enter'){
    state.q = q.value.trim(); state.page=1; applyFilters();
    const u = new URL(location);
    state.q ? u.searchParams.set('q', state.q) : u.searchParams.delete('q');
    history.replaceState({},'',u);
  }
});

$('#apply')?.addEventListener('click', ()=>{
  const min = parseInt($('#min')?.value || '', 10);
  const max = parseInt($('#max')?.value || '', 10);
  state.min = Number.isFinite(min) ? min : null;
  state.max = Number.isFinite(max) ? max : null;
  state.brands = Array.from(document.querySelectorAll('.brand:checked')).map(b=>b.value);
  state.rate = parseFloat(document.querySelector('input[name="rate"]:checked')?.value || '0');
  state.page = 1; applyFilters();
});
$('#sort')?.addEventListener('change', e=>{ state.sort = e.target.value; applyFilters(); });

// start
setActiveChips(); applyFilters();
