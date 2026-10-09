const products = [
  {
    id: 1,
    name: "Vintage Red 2×4 Brick",
    category: "part",
    label: "RARE PART",
    part: "Sample #3001",
    condition: "Used – Excellent",
    price: 24.95,
    color: "#d81717",
    description: "Sample listing. Replace this with the exact colour, year, element ID, and set origin."
  },
  {
    id: 2,
    name: "Printed Space Tile",
    category: "printed",
    label: "PRINTED",
    part: "Sample #3068b",
    condition: "Used – Very Good",
    price: 39.95,
    color: "#e2e2e2",
    description: "Ideal for hard-to-find printed tiles, shields, panels, control boards, and logos."
  },
  {
    id: 3,
    name: "Retired Minifigure Accessory",
    category: "minifig",
    label: "MINIFIG",
    part: "Sample accessory",
    condition: "Used – Excellent",
    price: 18.50,
    color: "#222222",
    description: "Use this for helmets, weapons, capes, hair pieces, tools, or rare character accessories."
  },
  {
    id: 4,
    name: "Trans-Clear Specialty Element",
    category: "part",
    label: "HARD TO FIND",
    part: "Sample element ID",
    condition: "New",
    price: 12.00,
    color: "#bfe9f4",
    description: "Good template for unusual colours, transparent elements, and retired specialty pieces."
  },
  {
    id: 5,
    name: "Vintage Castle Shield",
    category: "printed",
    label: "VINTAGE",
    part: "Sample shield",
    condition: "Used – Good",
    price: 31.00,
    color: "#b7b7b7",
    description: "Describe print wear, scratches, bite marks, cracks, fading, or other collector-relevant details."
  },
  {
    id: 6,
    name: "Rare Minifigure Head",
    category: "minifig",
    label: "COLLECTOR",
    part: "Sample head",
    condition: "Used – Very Good",
    price: 27.95,
    color: "#f3cc2f",
    description: "Add front/back face details, production era, and compatible minifigure or set information."
  }
];

let cart = [];

const grid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

function formatMoney(value) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
}

function renderProducts(filter = 'all') {
  const visible = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image" style="--piece-color:${product.color}">
        <span class="product-tag">${product.label}</span>
        <div class="mock-piece"></div>
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${product.part}</span><span>${product.condition}</span></div>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="price">${formatMoney(product.price)}</span>
          <button class="add-button" onclick="addToCart(${product.id})">Add to cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = formatMoney(total);

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>Qty ${item.qty} × ${formatMoney(item.price)}</small><br>
        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
      <strong>${formatMoney(item.price * item.qty)}</strong>
    </div>
  `).join('');
}

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
});

document.getElementById('cartButton').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

document.getElementById('checkoutButton').addEventListener('click', () => {
  if (!cart.length) return alert('Your cart is empty.');
  const orderLines = cart.map(item => `${item.qty}× ${item.name} (${formatMoney(item.price * item.qty)})`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const subject = encodeURIComponent('Purchase inquiry – Rare Brick Vault');
  const body = encodeURIComponent(`Hi, I would like to buy:\n\n${orderLines}\n\nTotal: ${formatMoney(total)}\n\nPlease let me know availability, shipping/pickup, and payment details.`);
  window.location.href = `mailto:YOUR_EMAIL_HERE?subject=${subject}&body=${body}`;
});

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent('LEGO part inquiry');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:YOUR_EMAIL_HERE?subject=${subject}&body=${body}`;
});

renderProducts();
renderCart();
