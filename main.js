// main.js — UI logic para index, producto, carrito, checkout y admin
// Requiere: productos (global from productos.js)

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Storage helpers */
const CART_KEY = 'mt_cart_v1';
const WISH_KEY = 'mt_wish_v1';

function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
function getWish(){ return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
function setWish(w){ localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateWishCount(); }

function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  $$('#cart-count').forEach(el => el.textContent = count);
  $$('#cart-count-2').forEach(el => el.textContent = count);
}
function updateWishCount(){ const c = getWish().length; $$('#wish-count').forEach(e=>e.textContent=c); }

/* Init categories in selects and side menu */
function initCategories(){
  const cats = Array.from(new Set(productos.map(p=>p.category))).sort();
  const select = $('#dept-select');
  const sideList = $('#side-cats');
  cats.forEach(cat=>{
    const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; select.appendChild(opt);
    const li = document.createElement('li'); li.innerHTML = `<a href="#" class="side-cat" data-cat="${cat}">${cat}</a>`; sideList.appendChild(li);
  });
}

/* Create card element from template */
function createCard(p){
  const tpl = document.getElementById('card-tpl').content.cloneNode(true);
  const article = tpl.querySelector('.product-card');
  article.querySelector('img').src = p.img;
  article.querySelector('img').alt = p.title;
  article.querySelector('.card-title').textContent = p.title;
  article.querySelector('.rating').textContent = `★ ${p.rating}`;
  article.querySelector('.reviews').textContent = `(${p.reviews})`;
  article.querySelector('.price').textContent = `$${p.price.toFixed(2)}`;
  article.querySelector('.old-price').textContent = p.price_old ? `$${p.price_old.toFixed(2)}` : '';
  // actions
  const addBtn = article.querySelector('.add-to-cart');
  addBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    addToCart(p.id,1);
  });
  article.querySelector('.add-wish').addEventListener('click', (e)=>{ e.stopPropagation(); toggleWish(p.id); });
  article.addEventListener('click', ()=> { location.href = `producto.html?id=${p.id}`; });
  return article;
}

/* Render carousels */
function renderCarousel(containerId, filterFn){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  productos.filter(filterFn).forEach(p => {
    const el = createCard(p);
    el.classList.add('carousel-item');
    container.appendChild(el);
  });
}

/* Render products grid */
function renderProducts(list){
  const grid = $('#products-grid');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p => grid.appendChild(createCard(p)));
  const count = $('#results-count'); if(count) count.textContent = `${list.length} productos`;
}

/* Add to cart logic */
function addToCart(id, qty=1){
  const prod = productos.find(p=>p.id===id);
  if(!prod) return alert('Producto no encontrado');
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty; else cart.push({ id, qty, title:prod.title, price:prod.price, img:prod.img });
  setCart(cart);
  toast(`${prod.title} añadido al carrito`);
}

/* Cart rendering for cart page */
function renderCartPage(){
  const container = $('#cart-container');
  if(!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length === 0){ container.innerHTML = '<p>Tu carrito está vacío.</p>'; $('#cart-summary').innerHTML=''; return; }
  cart.forEach(item=>{
    const div = document.createElement('div'); div.className = 'cart-item card';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="info">
        <strong>${item.title}</strong>
        <div>$${item.price.toFixed(2)}</div>
        <div>Cantidad: <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty" style="width:70px"></div>
      </div>
      <div class="subtotal"><strong>$${(item.price*item.qty).toFixed(2)}</strong></div>
      <div><button class="small-btn remove-item" data-id="${item.id}">Eliminar</button></div>
    `;
    container.appendChild(div);
  });
  // listeners
  $$('.cart-qty').forEach(inp => inp.addEventListener('change', e => {
    const id = Number(e.target.dataset.id), q = Math.max(1, Number(e.target.value) || 1);
    updateCartQty(id,q);
  }));
  $$('.remove-item').forEach(btn => btn.addEventListener('click', e => {
    const id = Number(e.target.dataset.id); removeFromCart(id);
  }));
  renderCartSummary();
}
function renderCartSummary(){
  const sumEl = $('#cart-summary');
  if(!sumEl) return;
  const total = getCart().reduce((s,i)=>s + i.qty * i.price, 0);
  sumEl.innerHTML = `<div>Total: <strong>$${total.toFixed(2)}</strong></div>`;
}
function updateCartQty(id, qty){
  const cart = getCart(); const it = cart.find(i=>i.id===id); if(!it) return;
  it.qty = qty; setCart(cart); renderCartPage();
}
function removeFromCart(id){
  let cart = getCart(); cart = cart.filter(i=>i.id!==id); setCart(cart); renderCartPage();
}

/* Wishlist */
function toggleWish(id){
  const wish = getWish();
  const i = wish.indexOf(id);
  if(i===-1) wish.push(id); else wish.splice(i,1);
  setWish(wish);
  toast(i===-1 ? 'Añadido a wishlist' : 'Eliminado de wishlist');
}

/* Toast helper */
function toast(msg){
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=> el.classList.add('show'), 10);
  setTimeout(()=> { el.classList.remove('show'); setTimeout(()=>el.remove(),300); }, 2500);
}

/* Product detail page */
function renderProductDetail(){
  const container = $('#product-detail'); if(!container) return;
  const params = new URLSearchParams(location.search); const id = Number(params.get('id'));
  const p = productos.find(x=>x.id===id); if(!p) { container.innerHTML = '<p>Producto no encontrado</p>'; return; }
  const tpl = document.getElementById('detail-tpl').content.cloneNode(true);
  tpl.querySelector('.detail-media img').src = p.img;
  tpl.querySelector('.detail-title').textContent = p.title;
  tpl.querySelector('.rating').textContent = `★ ${p.rating}`;
  tpl.querySelector('.reviews').textContent = `(${p.reviews} opiniones)`;
  tpl.querySelector('.detail-desc').textContent = p.description;
  tpl.querySelector('.big-price').textContent = `$${p.price.toFixed(2)}`;
  tpl.querySelector('.old-price').textContent = p.price_old ? `$${p.price_old.toFixed(2)}` : '';
  container.appendChild(tpl);
  $('#detail-add')?.addEventListener('click', ()=> {
    const q = Number($('#detail-qty').value || 1); addToCart(p.id, q);
  });
  $('#detail-wish')?.addEventListener('click', ()=> toggleWish(p.id));
  // sample reviews
  const reviewsList = $('#reviews-list'); if(reviewsList) {
    reviewsList.innerHTML = `<div class="card"><strong>Ana</strong><p>Muy contenta con el producto. Recomendado.</p></div>`;
  }
}

/* Admin (local only) */
function initAdmin(){
  const form = $('#admin-form'); if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const newP = {
      id: Math.max(0, ...productos.map(x=>x.id)) + 1,
      title: $('#p-title').value,
      price: Number($('#p-price').value),
      price_old: Number($('#p-old').value) || null,
      img: $('#p-img').value,
      category: $('#p-cat').value,
      rating: Number($('#p-rating').value)||4.5,
      reviews: 0,
      featured: false,
      bestseller: false,
      description: $('#p-desc').value || ''
    };
    productos.push(newP);
    renderAdminList();
    toast('Producto agregado (memoria local).');
    form.reset();
  });
  renderAdminList();
}
function renderAdminList(){
  const list = $('#admin-list'); if(!list) return;
  list.innerHTML = productos.map(p => `<div class="card" style="margin-bottom:8px"><strong>${p.title}</strong> · $${p.price.toFixed(2)} · <em>${p.category}</em></div>`).join('');
}

/* Hero slider - simple */
function initHeroSlider(){
  const slider = $('#hero-slider'); if(!slider) return;
  let idx = 0; const slides = Array.from(slider.children);
  function show(i){ slides.forEach((s,si)=> s.style.display = si===i ? 'block' : 'none'); }
  show(idx);
  setInterval(()=> { idx = (idx+1) % slides.length; show(idx); }, 4500);
}

/* Side panel toggles */
function initSidePanel(){
  const side = $('#side-panel'); if(!side) return;
  $('#hamburger')?.addEventListener('click', ()=> side.classList.add('open'));
  $('#side-close')?.addEventListener('click', ()=> side.classList.remove('open'));
  document.addEventListener('click', (e)=> {
    if(e.target.matches('.side-cat')){ e.preventDefault(); const cat = e.target.dataset.cat; $('#dept-select').value = cat; applyFilters(); side.classList.remove('open'); }
  });
}

/* Filters and search */
function applyFilters(){
  const q = ($('#search-input')?.value || '').trim().toLowerCase();
  const cat = $('#dept-select')?.value || '';
  const min = Number($('#min-price')?.value || 0);
  const max = Number($('#max-price')?.value || 0);
  let list = productos.filter(p => {
    if(cat && p.category !== cat) return false;
    if(q && !(p.title + ' ' + p.description + ' ' + p.category).toLowerCase().includes(q)) return false;
    if(min && p.price < min) return false;
    if(max && max > 0 && p.price > max) return false;
    return true;
  });
  const sort = $('#sort-select')?.value;
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  if(sort === 'rating-desc') list.sort((a,b)=>b.rating-b.rating);
  renderProducts(list);
}

/* Initialize everything on DOM ready */
function init(){
  initCategories();
  initSidePanel();
  initHeroSlider();
  renderCarousel('featured-carousel', p => p.featured || (p.price_old && p.price_old > p.price));
  renderCarousel('bestseller-carousel', p => p.bestseller);
  renderProducts(productos);
  updateCartCount();
  renderCartPage();
  renderCheckoutSummary();
  initAdmin();
  // bindings
  $('#search-btn')?.addEventListener('click', applyFilters);
  $('#apply-filters')?.addEventListener('click', applyFilters);
  $('#grid-view')?.addEventListener('click', ()=> { $('#grid-view').classList.add('active'); $('#list-view').classList.remove('active'); $('#products-grid').classList.remove('list'); });
  $('#list-view')?.addEventListener('click', ()=> { $('#grid-view').classList.remove('active'); $('#list-view').classList.add('active'); $('#products-grid').classList.add('list'); });
  $('#clear-cart')?.addEventListener('click', ()=> { localStorage.removeItem(CART_KEY); renderCartPage(); });
  // page-specific
  renderProductDetail();
  renderCartSummary();
}

/* Checkout summary */
function renderCheckoutSummary(){
  const el = $('#checkout-summary');
  if(!el) return;
  const total = getCart().reduce((s,i)=>s + i.price * i.qty, 0);
  el.innerHTML = `<div class="card">Artículos: ${getCart().length} · Total: <strong>$${total.toFixed(2)}</strong></div>`;
}

/* DOMContentLoaded hook */
document.addEventListener('DOMContentLoaded', init);
