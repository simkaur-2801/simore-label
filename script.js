const products = [
  {
    id: 1,
    name: 'Jumpsuit',
    category: 'jumpsuit',
    price: 2499,
    front: 'images/jumpsuit-front.jpeg',
    back: 'images/jumpsuit-back.jpeg',
    desc: 'A statement black jumpsuit with a dramatic embellished front and elegant open back.'
  },
  {
    id: 2,
    name: 'Jumpsuit',
    category: 'jumpsuit',
    price: 2499,
    front: 'images/jumpsuit-2-front.jpeg',
    back: 'images/jumpsuit-2-back.jpeg',
    desc: 'A statement silver jumpsuit with a dramatic embellished front and metal work.'
  },
  {
    id: 3,
    name: 'Gold Skirt-Top',
    category: 'skirt-top',
    price: 2999,
    front: 'images/gold-front.jpeg',
    back: 'images/gold-back.jpeg',
    desc: 'A sparkling embellished skirt-top set designed for standout evenings.'
  },
  {
    id: 4,
    name: 'Yellow Skirt-Top',
    category: 'skirt-top',
    price: 1999,
    front: 'images/yellow-front.jpeg',
    back: 'images/yellow-back.jpeg',
    desc: 'A bright asymmetric skirt paired with a crystal fringe top.'
  },
  {
    id: 5,
    name: 'Black Skirt-Top',
    category: 'skirt-top',
    price: 2299,
    front: 'images/black-front.jpeg',
    back: 'images/black-back.jpeg',
    desc: 'A sleek black skirt-top set finished with statement detailing.'
  },
  {
    id: 6,
    name: 'Green Skirt-Top',
    category: 'skirt-top',
    price: 2199,
    front: 'images/green-front.jpeg',
    back: 'images/green-back.jpeg',
    desc: 'A vibrant green co-ord with a textured finish and embellished side detail.'
  },
  {
    id: 7,
    name: 'Black Blazer-Pant',
    category: 'Blazer-Pant',
    price: 2099,
    front: 'images/blazer-pant-front.jpeg',
    back: 'images/blazer-pant-back.jpeg',
    desc: 'An elegant blazer paired with flared trousers.'
  }
];

let cart = JSON.parse(localStorage.getItem('simoreCart') || '[]');
let currentProduct = null;
let selectedSize = null;

const $ = id => document.getElementById(id);

function money(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function renderProducts() {
  const filter = $('filter').value;

  const list = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  $('products').innerHTML = list.map(p => `
    <article class="product-card" onclick="openProduct(${p.id})">
      <div class="product-image">
        <img src="${p.front}" alt="${p.name}">
        <span class="view-label">VIEW PIECE</span>
      </div>

      <div class="product-info">
        <h3>${p.name}</h3>

        <div class="meta">
          <span>${p.back ? 'Front + Back' : 'Front view'}</span>
          <span class="price">${money(p.price)}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);

  // Reset size whenever a new product is opened
  selectedSize = null;

  $('modalName').textContent = currentProduct.name;

  $('modalCategory').textContent =
    currentProduct.category === 'jumpsuit'
      ? 'JUMPSUIT'
      : currentProduct.category === 'skirt-top'
        ? 'SKIRT-TOP'
        : 'BLAZER-PANT';

  $('modalPrice').textContent = money(currentProduct.price);
  $('modalDescription').textContent = currentProduct.desc;

  const imgs = [
    currentProduct.front,
    ...(currentProduct.back ? [currentProduct.back] : [])
  ];

  $('thumbs').innerHTML = imgs.map((src, i) => `
    <img
      src="${src}"
      class="${i === 0 ? 'active' : ''}"
      onclick="selectImage('${src}', this)"
      alt="${currentProduct.name} view ${i + 1}"
    >
  `).join('');

  selectImage(imgs[0]);

  // SIZE BUTTONS
  document.querySelectorAll('.sizes button').forEach(button => {

    // Remove previous selected size
    button.classList.remove('active');

    // Add click event
    button.onclick = function () {

      // Remove active from all sizes
      document.querySelectorAll('.sizes button').forEach(btn => {
        btn.classList.remove('active');
      });

      // Select clicked size
      this.classList.add('active');

      // Save selected size
      selectedSize = this.textContent.trim();

      console.log('Selected Size:', selectedSize);
    };
  });

  $('productModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function selectImage(src, el) {
  $('mainProductImage').src = src;

  if (el) {
    document
      .querySelectorAll('.thumbs img')
      .forEach(x => x.classList.remove('active'));

    el.classList.add('active');
  }
}

function closeModal() {
  $('productModal').classList.remove('show');
  document.body.style.overflow = '';
}

document
  .querySelectorAll('[data-close]')
  .forEach(el => el.addEventListener('click', closeModal));


// ADD TO BAG
$('modalAdd').onclick = () => {

  if (!currentProduct) return;

  // Size select nahi kiya
  if (!selectedSize) {
    alert('Please select a size first.');
    return;
  }

  // Product + selected size
  const item = {
    ...currentProduct,
    size: selectedSize
  };

  cart.push(item);

  saveCart();

  closeModal();
  openBag();
};


function saveCart() {
  localStorage.setItem('simoreCart', JSON.stringify(cart));
  renderBag();
}


function renderBag() {

  $('bagCount').textContent = cart.length;

  $('bagTotal').textContent = money(
    cart.reduce((s, p) => s + p.price, 0)
  );

  $('bagItems').innerHTML = cart.length
    ? cart.map((p, i) => `
      <div class="bag-item">

        <img src="${p.front}" alt="${p.name}">

        <div>
          <h4>${p.name}</h4>

          <p>
            ${money(p.price)}
            • Size: <strong>${p.size || 'Not selected'}</strong>
          </p>
        </div>

        <button
          class="remove"
          onclick="removeItem(${i})">
          Remove
        </button>

      </div>
    `).join('')
    : '<p class="empty">Your bag is waiting for something special.</p>';
}


function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
}


function openBag() {
  $('bag').classList.add('open');
  $('overlay').classList.add('show');
}


function closeBag() {
  $('bag').classList.remove('open');
  $('overlay').classList.remove('show');
}


$('bagBtn').onclick = openBag;
$('bagClose').onclick = closeBag;
$('overlay').onclick = closeBag;


// WHATSAPP ORDER
$('whatsappBtn').onclick = () => {

  if (!cart.length) {
    alert('Please add a piece to your bag first.');
    return;
  }

  const phone = '919990676879';

  const lines = cart.map(p =>
    `${p.name} - Size: ${p.size || 'Not selected'} - ${money(p.price)}`
  ).join('\n');

  const total = money(
    cart.reduce((s, p) => s + p.price, 0)
  );

  const msg =
    `Hello SIMORÉ,

I want to order:

${lines}

Total: ${total}`;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
};


$('filter').addEventListener('change', renderProducts);

renderProducts();
renderBag();