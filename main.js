// main.js
// Dependencias: productos (desde productos.js)
// Maneja: render, búsqueda, filtros, carritos, wishlist, sliders, admin hooks

/* Utilities */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* State helpers */
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }
function getWishlist(){ return JSON.parse(localStorage.getItem('wishlist')||'[]'); }
function setWishlist(w){ localStorage.setItem('wishlist', JSON.stringify(w)); updateWishlistCount(); }

function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  $$('#cart-count').forEach(el => el.textContent = count);
  $$('#cart-count-2').forEach(el => el.textContent = count);
}
function updateWishlistCount(){
  const count = getWishlist().length;
  $$('#wishlist-count').forEach(el => el.textContent = count);
}

/* Init categories in select and side menu */
function initCategories(){
  const cats = Array.from(new Set(productos.map(p=>p.category))).sort();
  const select = $('#select-categoria');
  const menuList = $('#menu-list');
  const filterCats = $('#filter-categories');

  cats.forEach(cat=>{
    const opt=document.createElement('option'); opt.value=cat; opt.textContent=cat; select.appendChild(opt);
    const li=document.createElement('li'); li.innerHTML=`<a href="#" class="menu-cat" data-cat="${cat}">${cat}</a>`; menuList.appendChild(li);
    const li2=document.createElement('li'); li2.innerHTML=`<label><input type="checkbox" data-cat="${cat}" class="filter-cat"> ${cat}</label>`; filterCats.appendChild(li2);
  });
}

/* Render a horizontal carousel (containerId) with items filtered by predicate */
function renderCarousel(containerId, predicate){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  const list = productos.filter(predicate);
  list.forEach(p => {
    const card = createCard(p);
    container.appendChild(card);
  });
}

/* Create product card element */
function createCard(p){
  const tpl = document.getElementById('card-template');
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.querySelector('img').src = p.img;
  node.querySelector('img').alt = p.title;
  node.querySelector('.p-title').textContent = p.title;
  node.querySelector('.rating').textContent = `★ ${p.rating}`;
  node.querySelector('.reviews').textContent = `(${p.reviews})`;
  node.querySelector('.price').textContent = `$${p.price.toFixed(2)}`;
  node.querySelector('.price-old').textContent = p.price_old ? `$${p.price_old.toFixed(2)}` : '';
  node.querySelector('.add-cart').addEventListener('click', ()=> addToCart(p.id,1));
  node.querySelector('.add-wish').addEventListener('click', ()=> toggleWishlist(p.id));
  node.addEventListener('click', (e)=> {
    // if clicked inside buttons, ignore; else go to product
    if(e.target.closest('.add-cart') || e.target.closest('.add-wish')) return;
    window.location.href = `producto.html?id=${p.id}`;
  });
  return node;
}

/* Render the main products grid with filters */
function renderProductsGrid(list){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p=>{
    const card = createCard(p);
    grid.appendChild(card);
  });
  const rc = document.getElementById('results-count');
  if(rc) rc.textContent = `${list.length} productos`;
}

/* Add to cart */
function addToCart(productId, qty=1){
  const product = productos.find(x=>x.id===productId);
  if(!product) return;
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found) found.qty += qty;
  else cart.push({id:productId, qty, title:product.title, price:product.price, img:product.img});
  setCart(cart);
  alert(`${product.title} añadido al carrito`);
}

/* Remove from cart */
function removeFromCart(productId){
  let cart = getCart();
  cart = cart.filter(i=>i.id !== productId);
  setCart(cart);
  renderCart();
}

/* Update cart item quantity */
function updateCartQty(productId, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if(!item) return;
  item.qty = Math.max(1, qty);
  setCart(cart);
  renderCart();
}

/* Toggle wishlist */
function toggleWishlist(productId){
  const w = getWishlist();
  const idx = w.indexOf(productId);
  if(idx === -1) w.push(productId);
  else w.splice(idx,1);
  setWishlist(w);
  alert(idx === -1 ? 'Añadido a wishlist' : 'Eliminado de wishlist');
}

/* Render cart page */
function renderCart(){
  const container = document.getElementById('cart-container');
  if(!container) return;
  container.innerHTML = '';
  const cart = getCart();
  if(cart.length === 0){
    container.innerHTML = '<p>Tu carrito está vacío.</p>';
    document.getElementById('cart-summary').innerHTML = '';
    return;
  }
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="info">
        <strong>${item.title}</strong>
        <p>$${item.price.toFixed(2)}</p>
        <div>
          Cantidad: <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty" style="width:60px">
          <button data-id="${item.id}" class="remove-item small-btn">Eliminar</button>
        </div>
      </div>
      <div class="subtotal"><strong>$${(item.price*item.qty).toFixed(2)}</strong></div>
    `;
    container.appendChild(row);
  });
  // listeners
  $$('.cart-qty').forEach(el=>{
    el.addEventListener('change',(e)=>{
      const id = Number(e.target.dataset.id);
      const qty = Number(e.target.value);
      updateCartQty(id, qty);
    });
  });
  $$('.remove-item').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = Number(e.target.dataset.id);
      removeFromCart(id);
    });
  });
  // summary
  const summary = document.getElementById('cart-summary');
  const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
  summary.innerHTML = `<div class="cart-summary">Total: <strong>$${total.toFixed(2)}</strong></div>`;
}

/* Build checkout summary */
function renderCheckoutSummary(){
  const summary = document.getElementById('checkout-summary') || document.getElementById('cart-summary');
  if(!summary) return;
  const cart = getCart();
  const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
  summary.innerHTML = `<div class="cart-summary">Artículos: ${cart.length} · Total: <strong>$${total.toFixed(2)}</strong></div>`;
}

/* Render product detail page */
function renderProductDetail(){
  const el = document.getElementById('product-detail');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));
  const p = productos.find(x=>x.id===id);
  if(!p){
    el.innerHTML = '<p>Producto no encontrado</p>';
    return;
  }
  const tpl = document.getElementById('detail-template').content.cloneNode(true);
  tpl.getElementById('detail-img').src = p.img;
  tpl.getElementById('detail-title').textContent = p.title;
  tpl.getElementById('detail-rating').textContent = `★ ${p.rating}`;
  tpl.getElementById('detail-reviews').textContent = `(${p.reviews} opiniones)`;
  tpl.getElementById('detail-desc').textContent = p.description;
  tpl.getElementById('detail-price').textContent = `$${p.price.toFixed(2)}`;
  tpl.getElementById('detail-price-old').textContent = p.price_old ? `$${p.price_old.toFixed(2)}` : '';
  el.appendChild(tpl);

  $('#detail-addcart').addEventListener('click', ()=>{
    const qty = Number($('#detail-qty').value || 1);
    addToCart(p.id, qty);
  });
  $('#detail-wish').addEventListener('click', ()=> toggleWishlist(p.id));
}

/* Admin functions (local only) */
function adminInit(){
  const form = document.getElementById('admin-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const newP = {
      id: Math.max(0, ...productos.map(x=>x.id)) + 1,
      title: document.getElementById('p-title').value,
      price: Number(document.getElementById('p-price').value),
      price_old: null,
      img: document.getElementById('p-img').value,
      category: document.getElementById('p-category').value,
      rating: Number(document.getElementById('p-rating').value) || 4.5,
      reviews: 0,
      featured: false, bestseller: false, recommend: false,
      description: ''
    };
    productos.push(newP);
    alert('Producto agregado (solo en memoria). Refresca para ver.');
    renderAdminList();
    form.reset();
  });
  renderAdminList();
}
function renderAdminList(){
  const list = document.getElementById('admin-list');
  if(!list) return;
  list.innerHTML = productos.map(p => `<div class="admin-card"><strong>${p.title}</strong> · $${p.price.toFixed(2)} · <em>${p.category}</em></div>`).join('');
}

/* Hero slider simple */
function initHeroSlider(){
  const slider = document.getElementById('hero-slider');
  if(!slider) return;
  let idx = 0;
  const slides = slider.children;
  function show(i){
    Array.from(slides).forEach((s,si)=> s.style.display = si===i ? 'block' : 'none');
  }
  show(idx);
  setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 4500);
}

/* Side menu toggles */
function initMenu(){
  const side = document.getElementById('side-menu');
  $('#menu-btn')?.addEventListener('click', ()=> side.classList.remove('closed'));
  $('#close-menu')?.addEventListener('click', ()=> side.classList.add('closed'));
  // menu category clicks
  document.addEventListener('click', (e)=>{
    if(e.target.matches('.menu-cat')){
      e.preventDefault();
      const cat = e.target.dataset.cat;
      $('#select-categoria').value = cat;
      applyFilters();
      side.classList.add('closed');
    }
  });
}

/* Search & filter apply */
function applyFilters(){
  const q = $('#search-input')?.value.trim().toLowerCase() || '';
  const selCat = $('#select-categoria')?.value || '';
  const min = Number($('#min-price')?.value || 0);
  const max = Number($('#max-price')?.value || 0);
  const checkedCats = Array.from($$('.filter-cat')).filter(i=>i.checked).map(i=>i.dataset.cat);
  const sort = $('#sort-select')?.value || 'default';

  let list = productos.filter(p => {
    if(selCat && p.category !== selCat) return false;
    if(checkedCats.length && !checkedCats.includes(p.category)) return false;
    if(q && !(`${p.title} ${p.description} ${p.category}`.toLowerCase().includes(q))) return false;
    if(min && p.price < min) return false;
    if(max && max>0 && p.price > max) return false;
    return true;
  });

  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  if(sort === 'rating-desc') list.sort((a,b)=>b.rating-b.rating);

  renderProductsGrid(list);
  renderCheckoutSummary();
}

/* Wire up search and controls */
function initControls(){
  $('#search-btn')?.addEventListener('click', applyFilters);
  $('#apply-filters')?.addEventListener('click', applyFilters);
  $('#grid-view')?.addEventListener('click', ()=> {
    $('#grid-view').classList.add('active'); $('#list-view').classList.remove('active');
    document.getElementById('products-grid').classList.remove('list-mode');
  });
  $('#list-view')?.addEventListener('click', ()=> {
    $('#grid-view').classList.remove('active'); $('#list-view').classList.add('active');
    document.getElementById('products-grid').classList.add('list-mode');
  });
  $('#clear-cart')?.addEventListener('click', ()=> { localStorage.removeItem('cart'); renderCart(); });
}

/* Render recommended and featured carousels */
function renderAllCarousels(){
  renderCarousel('ofertas-carousel', p => p.featured || (p.price_old && p.price_old > p.price));
  renderCarousel('masvendidos-carousel', p => p.bestseller);
  renderCarousel('reco-carousel', p => p.recommend);
}

/* Initial page render */
function init(){
  initCategories();
  initMenu();
  initHeroSlider();
  initControls();
  renderAllCarousels();
  renderProductsGrid(productos);
  renderCheckoutSummary();
  renderCart();
  updateCartCount();
  updateWishlistCount();
  adminInit();
}

/* DOMContentLoaded */
document.addEventListener('DOMContentLoaded', init);
