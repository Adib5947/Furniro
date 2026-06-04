"use strict";

// Hamburger Mobile Nav

const hamburger = document.querySelector(".nav-hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    navMenu.classList.toggle("nav-menu--open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  navMenu.querySelectorAll(".nav-menu__link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-open");
      navMenu.classList.remove("nav-menu--open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// Cart Data

const CART_KEY = "furniro_cart";

// Default items that always load on page refresh
const DEFAULT_ITEMS = [
  {
    id: "SS001",
    name: "Asgaard sofa",
    price: 250000,
    qty: 1,
    imgSrc: "../Cart/images/sofa-set-preview-0.png",
    imgAlt: "Asgaard sofa",
  },
  {
    id: "LV001",
    name: "Leviosa",
    price: 2500,
    qty: 1,
    imgSrc: "../Cart/images/product-2.png",
    imgAlt: "Leviosa",
  },
];

function formatPrice(raw) {
  const num = parseFloat(raw);
  if (isNaN(num)) return "Rs. 0.00";
  return (
    "Rs. " +
    num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

let sessionCart = DEFAULT_ITEMS.map((item) => ({ ...item }));

function calcSubtotal(cart) {
  return cart.reduce((acc, item) => {
    return acc + (parseFloat(item.price) || 0) * (parseInt(item.qty, 10) || 0);
  }, 0);
}

// Rendering

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmptyEl = document.getElementById("cartEmpty");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  if (sessionCart.length === 0) {
    if (cartEmptyEl) cartEmptyEl.hidden = false;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(0);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(0);
    return;
  }

  if (cartEmptyEl) cartEmptyEl.hidden = true;

  sessionCart.forEach((item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.qty, 10) || 1;
    const subtotal = price * qty;
    const imgSrc = item.imgSrc || item.image || "";

    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.dataset.id = item.id;

    row.innerHTML = `
      <div class="cart-item__product">
        <div class="cart-item__img-wrap">
          <img src="${imgSrc}" alt="${item.imgAlt || item.name}" class="cart-item__img" />
        </div>
        <span class="cart-item__name">${item.name}</span>
      </div>
      <span class="cart-item__price">${formatPrice(price)}</span>
      <div class="cart-item__qty-wrap">
        <input
          type="number"
          class="cart-item__qty-input"
          value="${qty}"
          min="1"
          max="99"
          aria-label="Quantity for ${item.name}"
          data-id="${item.id}"
        />
      </div>
      <div class="cart-item__subtotal">
        <span class="cart-item__subtotal-price">${formatPrice(subtotal)}</span>
        <button class="cart-item__remove" aria-label="Remove ${item.name}" data-id="${item.id}">
          <img src="../Single_Product/images/design_delete.svg" alt="Remove" width="28" height="28" />
        </button>
      </div>
    `;

    cartItemsEl.appendChild(row);
  });

  const total = calcSubtotal(sessionCart);
  if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(total);
  if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
}

// Event Delegation

const cartItemsEl = document.getElementById("cartItems");

if (cartItemsEl) {
  // Quantity change
  cartItemsEl.addEventListener("change", (e) => {
    if (!e.target.matches(".cart-item__qty-input")) return;
    const id = e.target.dataset.id;
    const newQty = Math.max(1, parseInt(e.target.value, 10) || 1);
    e.target.value = newQty;

    const item = sessionCart.find((i) => i.id === id);
    if (item) {
      item.qty = newQty;
      renderCart();
    }
  });

  // Remove item
  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".cart-item__remove");
    if (!btn) return;
    const id = btn.dataset.id;
    sessionCart = sessionCart.filter((i) => i.id !== id);
    renderCart();
  });
}

// Footer Brand Scroll To Top
const footerBrand = document.querySelector(".site-footer__brand");

if (footerBrand) {
  footerBrand.style.cursor = "pointer";

  footerBrand.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Init
renderCart();
