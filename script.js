const products = [
  { name: 'Petal Glow Blush', category: 'Makeup', price: 1890, old: 2290, rating: '4.9' },
  { name: 'Cloud Cream Cleanser', category: 'Skincare', price: 2450, rating: '4.8' },
  { name: 'Dew Drop Lip Tint', category: 'Lip Care', price: 1650, old: 1950, rating: '4.9' },
  { name: 'Silk Touch Brush Set', category: 'Beauty Tools', price: 3200, rating: '5.0' },
  { name: 'Soft Focus Skin Tint', category: 'Makeup', price: 2850, rating: '4.8' },
  { name: 'Bloom Barrier Cream', category: 'Skincare', price: 2750, rating: '4.9' },
  { name: 'Rosewater Lip Oil', category: 'Lip Care', price: 1750, rating: '4.7' },
  { name: 'Everyday Beauty Sponge', category: 'Beauty Tools', price: 990, rating: '4.8' }
];

const categories = [
  ['Makeup', 'Complexion, colour & glow', '✹'],
  ['Skincare', 'Rituals for radiant skin', '◌'],
  ['Lip Care', 'A little colour, a lot of care', '♡'],
  ['Eye Makeup', 'Define your moment', '◒'],
  ['Beauty Essentials', 'The finishing touches', '✦']
];

let activeFilter = 'All';
let cart = JSON.parse(localStorage.getItem('fb-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('fb-wishlist') || '[]');

const money = n => `Rs. ${n.toLocaleString('en-PK')}`;

function renderCategories() {
  categoryGrid.innerHTML = categories.map(c =>
    `<a class="category-card" href="#shop" data-category="${c[0]}">
      <span class="cat-icon">${c[2]}</span>
      <div>
        <h3>${c[0]}</h3>
        <small>${c[1]}</small>
      </div>
    </a>`
  ).join('');

  document.querySelectorAll('.category-card').forEach(x => {
    x.onclick = () => {
      activeFilter = x.dataset.category;
      document.querySelectorAll('.filter').forEach(f =>
        f.classList.toggle('active', f.dataset.filter === activeFilter)
      );
      renderProducts();
    };
  });
}

function renderProducts() {
  let q = searchInput.value.toLowerCase();
  let list = products.filter(p =>
    (activeFilter === 'All' || p.category === activeFilter) &&
    p.name.toLowerCase().includes(q)
  );

  if (sortSelect.value === 'low') list.sort((a, b) => a.price - b.price);
  if (sortSelect.value === 'high') list.sort((a, b) => b.price - a.price);

  productGrid.innerHTML = list.length
    ? list.map(p => `
        <article class="product-card">
          <div class="product-image">
            <button class="wish ${wishlist.includes(p.name) ? 'saved' : ''}" data-name="${p.name}">
              ${wishlist.includes(p.name) ? '♥' : '♡'}
            </button>
            <div class="product-product"></div>
          </div>
          <div class="product-info">
            <small>${p.category}</small>
            <h3>${p.name}</h3>
            <span class="price">${money(p.price)} ${p.old ? `<span class="old">${money(p.old)}</span>` : ''}</span>
            <span class="rating">★ ${p.rating}</span>
            <button class="add" data-name="${p.name}">Add to bag</button>
          </div>
        </article>
      `).join('')
    : '<p>No products found. Try another search or category.</p>';

  document.querySelectorAll('.add').forEach(b => b.onclick = () => addCart(b.dataset.name));
  document.querySelectorAll('.wish').forEach(b => b.onclick = () => toggleWish(b.dataset.name));
}

function addCart(name) {
  cart.push(name);
  localStorage.setItem('fb-cart', JSON.stringify(cart));
  updateCounts();
  toast(`${name} added to your bag`);
}

function toggleWish(name) {
  wishlist = wishlist.includes(name)
    ? wishlist.filter(x => x !== name)
    : [...wishlist, name];

  localStorage.setItem('fb-wishlist', JSON.stringify(wishlist));
  updateCounts();
  renderProducts();
  toast(wishlist.includes(name) ? 'Saved to your wishlist' : 'Removed from wishlist');
}

function updateCounts() {
  cartCount.textContent = cart.length;
  wishCount.textContent = wishlist.length;
}

function toast(message) {
  let t = document.querySelector('#toast');
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

document.querySelectorAll('.filter').forEach(b => {
  b.onclick = () => {
    activeFilter = b.dataset.filter;
    document.querySelectorAll('.filter').forEach(f =>
      f.classList.toggle('active', f === b)
    );
    renderProducts();
  };
});

searchInput.oninput = renderProducts;
sortSelect.onchange = renderProducts;
searchBtn.onclick = () => {
  searchInput.focus();
  shop.scrollIntoView();
};

document.querySelector('.menu-toggle').onclick = () =>
  document.querySelector('.main-nav').classList.toggle('open');

newsletterForm.onsubmit = e => {
  e.preventDefault();
  newsletterMsg.textContent = 'Thank you — welcome to the bloom.';
  e.target.reset();
};

renderCategories();
renderProducts();
updateCounts();