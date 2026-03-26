const products = [
  { id: 1, name: 'Wireless Headphones', cat: 'tech',    emoji: '🎧', price: 89,  badge: 'new',  rating: 4.8, reviews: 124 },
  { id: 2, name: 'Silk Scarf',          cat: 'fashion', emoji: '🧣', price: 45,  badge: 'hot',  rating: 4.9, reviews: 89  },
  { id: 3, name: 'Aroma Diffuser',      cat: 'home',    emoji: '🕯️', price: 38,  badge: 'sale', rating: 4.7, reviews: 203, oldPrice: 55 },
  { id: 4, name: 'Smart Watch',         cat: 'tech',    emoji: '⌚', price: 199, badge: 'new',  rating: 4.6, reviews: 57  },
  { id: 5, name: 'Linen Tote Bag',      cat: 'fashion', emoji: '👜', price: 32,  badge: null,   rating: 4.8, reviews: 341 },
  { id: 6, name: 'Face Serum',          cat: 'beauty',  emoji: '✨', price: 62,  badge: 'hot',  rating: 4.9, reviews: 178 },
  { id: 7, name: 'Desk Lamp',           cat: 'home',    emoji: '💡', price: 54,  badge: null,   rating: 4.5, reviews: 92  },
  { id: 8, name: 'Lip Palette',         cat: 'beauty',  emoji: '💄', price: 28,  badge: 'sale', rating: 4.7, reviews: 215, oldPrice: 40 },
];

let cart = [];

function stars(r) {
  return '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));
}

function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  const bgMap = { tech: '#E6F1FB', fashion: '#FBEAF0', home: '#EAF3DE', beauty: '#FBEAF0' };
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img" style="background:${bgMap[p.cat]}">
        ${p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : ''}
        <span>${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div>
            <span class="price">$${p.price}</span>
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
          </div>
          <button class="add-btn" id="btn-${p.id}" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filter(cat, el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderProducts(cat === 'all' ? products : products.filter(p => p.cat === cat));
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  const btn = document.getElementById('btn-' + id);
  btn.textContent = 'Added!';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Add'; btn.classList.remove('added'); }, 1200);
  showToast(p.emoji + ' ' + p.name + ' added to cart');
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
  const el = document.getElementById('cartItems');
  if (!cart.length) { el.innerHTML = '<div class="empty-cart">Your cart is empty</div>'; return; }
  el.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-emoji">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">$${i.price} each</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${i.id}, -1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${i.id})">✕</button>
    </div>
  `).join('');
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function removeItem(id) { cart = cart.filter(x => x.id !== id); updateCartUI(); }

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('backdrop').classList.toggle('show');
}

function checkout() {
  showToast('🎉 Order placed successfully!');
  cart = [];
  updateCartUI();
  toggleCart();
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

renderProducts(products);
updateCartUI();
