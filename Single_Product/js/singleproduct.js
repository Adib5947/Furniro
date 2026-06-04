"use strict";

// Cart Sidebar
(function () {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  const closeBtn = document.getElementById("cartClose");
  const cartIconDesktop = document.getElementById("cartIcon");
  const cartIconMobile = document.getElementById("cartIconMobile");
  const itemsList = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const badgeEl = document.getElementById("cartBadge");

  if (!sidebar || !overlay) return;
  let cartState = [];
  function formatPrice(num) {
    return (
      "Rs. " +
      num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Render
  function renderCart() {
    if (!itemsList) return;

    if (cartState.length === 0) {
      itemsList.innerHTML = `
        <li class="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Your cart is empty.</p>
        </li>`;
    } else {
      itemsList.innerHTML = cartState
        .map(function (item) {
          return `
          <li class="cart-item" data-id="${escapeHtml(item.id)}">
            <div class="cart-item__img-wrap">
              <img src="${escapeHtml(item.imgSrc)}"
                   alt="${escapeHtml(item.imgAlt)}"
                   class="cart-item__img"
                   onerror="this.src='https://placehold.co/105x105/f9f1e7/b88e2f?text=Item'"/>
            </div>
            <div class="cart-item__info">
              <span class="cart-item__name">${escapeHtml(item.name)}</span>
              <div class="cart-item__qty-price">
                <span class="cart-item__qty">${item.qty}</span>
                <span class="cart-item__x">x</span>
                <span class="cart-item__price">${formatPrice(item.price)}</span>
              </div>
            </div>
            <button class="cart-item__remove js-remove-item"
                    data-id="${escapeHtml(item.id)}"
                    aria-label="Remove ${escapeHtml(item.name)}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#9F9F9F"/>
                <path d="M15 9l-6 6M9 9l6 6" stroke="#fff"
                      stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </li>`;
        })
        .join("");

      // Attach remove listeners
      itemsList.querySelectorAll(".js-remove-item").forEach(function (btn) {
        btn.addEventListener("click", function () {
          removeItem(btn.dataset.id);
        });
      });
    }

    updateSubtotal();
    updateBadge();
  }

  function updateSubtotal() {
    if (!subtotalEl) return;
    const total = cartState.reduce(function (acc, item) {
      return acc + item.price * item.qty;
    }, 0);
    subtotalEl.textContent = formatPrice(total);
  }

  function updateBadge() {
    if (!badgeEl) return;
    const count = cartState.reduce(function (acc, item) {
      return acc + item.qty;
    }, 0);
    badgeEl.textContent = count;
    badgeEl.style.display = count > 0 ? "flex" : "none";
  }

  // CRUD
  function addItem(item) {
    const existing = cartState.find(function (i) {
      return i.id === item.id;
    });
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cartState.push({
        id: item.id || Date.now().toString(),
        name: item.name || "Product",
        price: item.price || 0,
        qty: item.qty || 1,
        imgSrc: item.imgSrc || "",
        imgAlt: item.imgAlt || item.name || "Product",
      });
    }
    renderCart();
  }

  function removeItem(id) {
    cartState = cartState.filter(function (i) {
      return i.id !== id;
    });
    renderCart();
  }

  // Open / Close
  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
    [cartIconDesktop, cartIconMobile].forEach(function (el) {
      if (el) el.setAttribute("aria-expanded", "true");
    });
    document.addEventListener("keydown", handleEsc);
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-active");
    document.body.style.overflow = "";
    [cartIconDesktop, cartIconMobile].forEach(function (el) {
      if (el) el.setAttribute("aria-expanded", "false");
    });
    document.removeEventListener("keydown", handleEsc);
  }

  function toggleSidebar() {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeSidebar();
  }

  // Event listeners
  if (cartIconDesktop) {
    cartIconDesktop.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  if (cartIconMobile) {
    cartIconMobile.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  overlay.addEventListener("click", closeSidebar);
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Focus trap inside sidebar
  sidebar.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    const focusable = Array.from(
      sidebar.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  renderCart();

  // Public API
  window.furniroCart = {
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar,
    addItem: addItem,
    removeItem: removeItem,
    getItems: function () {
      return cartState.slice();
    },
  };
})();

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

// Active nav link
const navLinks = document.querySelectorAll(".nav-menu__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("nav-menu__link--active"));
    link.classList.add("nav-menu__link--active");
  });
});

// Thumbnail Gallery
const mainImage = document.getElementById("mainProductImage");
const thumbBtns = document.querySelectorAll(".thumb-btn");

const thumbImages = [
  "./images/sofa-set-preview-1.png",
  "./images/sofa-set-preview-2.png",
  "./images/sofa-set-preview-3.png",
  "./images/sofa-set-preview-4.png",
];

let currentColorImage = "./images/sofa-set-preview-0.png";

function setMainImage(src) {
  if (!mainImage) return;
  mainImage.classList.add("img--fade");
  setTimeout(() => {
    mainImage.src = src;
    mainImage.classList.remove("img--fade");
  }, 280);
}

thumbBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    thumbBtns.forEach((b) => b.classList.remove("thumb-btn--active"));
    btn.classList.add("thumb-btn--active");
    setMainImage(thumbImages[index] || currentColorImage);
  });
});

// Size Selector
const sizeOptions = document.querySelectorAll("#sizeOptions .option-btn");

sizeOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizeOptions.forEach((b) => b.classList.remove("option-btn--active"));
    btn.classList.add("option-btn--active");
  });
});

// Color Swatch Selector
const colorSwatches = document.querySelectorAll("#colorOptions .color-swatch");

colorSwatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    colorSwatches.forEach((s) => s.classList.remove("color-swatch--active"));
    swatch.classList.add("color-swatch--active");

    const newImage = swatch.dataset.image;
    if (newImage) {
      currentColorImage = newImage;
      thumbBtns.forEach((b) => b.classList.remove("thumb-btn--active"));
      if (thumbBtns[0]) thumbBtns[0].classList.add("thumb-btn--active");
      setMainImage(newImage);
    }
  });
});

// Quantity Control
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const qtyValue = document.getElementById("qtyValue");

let qty = 1;

function updateQty(value) {
  qty = Math.max(1, Math.min(99, value));
  if (qtyValue) qtyValue.textContent = qty;
}

if (qtyMinus) qtyMinus.addEventListener("click", () => updateQty(qty - 1));
if (qtyPlus) qtyPlus.addEventListener("click", () => updateQty(qty + 1));

// Toast helper
const cartToast = document.getElementById("cartToast");
const toastMessage = document.getElementById("toastMessage");
let toastTimeout = null;

function showToast(message) {
  if (!cartToast) return;
  if (toastMessage) toastMessage.textContent = message;
  cartToast.classList.add("toast--visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    cartToast.classList.remove("toast--visible");
  }, 2800);
}

// Add to Cart
const addToCartBtn = document.getElementById("addToCartBtn");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    addToCartBtn.classList.add("btn-add-cart--added");
    addToCartBtn.textContent = "Added!";
    setTimeout(() => {
      addToCartBtn.classList.remove("btn-add-cart--added");
      addToCartBtn.textContent = "Add To Cart";
    }, 1500);

    // Read selected options
    const activeSize = document.querySelector(
      "#sizeOptions .option-btn--active",
    );
    const activeColor = document.querySelector(
      "#colorOptions .color-swatch--active",
    );
    const sizeName = activeSize ? activeSize.dataset.value : "L";
    const colorName = activeColor ? activeColor.dataset.color : "default";

    // Add to cart sidebar
    if (window.furniroCart) {
      window.furniroCart.addItem({
        id: "SS001",
        name: `Asgaard sofa (${sizeName}, ${colorName})`,
        price: 250000,
        qty: qty,
        imgSrc: currentColorImage,
        imgAlt: "Asgaard sofa",
      });
      window.furniroCart.open();
    }

    showToast(
      `${qty}× Asgaard sofa (${sizeName}, ${colorName}) added to cart!`,
    );
  });
}

document.querySelectorAll(".js-card-add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const id = btn.dataset.id || Date.now().toString();
    const name = btn.dataset.name || "Product";
    const price = parseFloat(btn.dataset.price) || 0;
    const img = btn.dataset.img || "";

    if (window.furniroCart) {
      window.furniroCart.addItem({
        id,
        name,
        price,
        qty: 1,
        imgSrc: img,
        imgAlt: name,
      });
      window.furniroCart.open();
    }

    showToast(`${name} added to cart!`);
  });
});

// Product Tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("aria-controls");

    tabBtns.forEach((b) => {
      b.classList.remove("tab-btn--active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("tab-btn--active");
    btn.setAttribute("aria-selected", "true");

    tabPanels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.add("tab-panel--active");
        panel.removeAttribute("hidden");
      } else {
        panel.classList.remove("tab-panel--active");
        panel.setAttribute("hidden", "");
      }
    });
  });
});

// Review Star Picker
const starPickers = document.querySelectorAll(".review-star-pick");

starPickers.forEach((star) => {
  star.addEventListener("mouseenter", () => {
    const val = parseInt(star.dataset.val, 10);
    starPickers.forEach((s) => {
      s.classList.toggle("is-lit", parseInt(s.dataset.val, 10) <= val);
    });
  });

  star.addEventListener("mouseleave", () => {
    const selected = parseInt(
      document.querySelector(".review-star-pick.is-selected")?.dataset.val ||
        "0",
      10,
    );
    starPickers.forEach((s) => {
      s.classList.toggle("is-lit", parseInt(s.dataset.val, 10) <= selected);
    });
  });

  star.addEventListener("click", () => {
    const val = parseInt(star.dataset.val, 10);
    starPickers.forEach((s) => {
      const sv = parseInt(s.dataset.val, 10);
      s.classList.toggle("is-lit", sv <= val);
      s.classList.toggle("is-selected", sv === val);
    });
  });
});

// Review Form Submit
const reviewSubmit = document.querySelector(".review-form__submit");

if (reviewSubmit) {
  reviewSubmit.addEventListener("click", () => {
    const nameEl = document.querySelector(".review-form__input");
    const bodyEl = document.querySelector(".review-form__textarea");
    const name = nameEl?.value.trim();
    const body = bodyEl?.value.trim();
    const rating = document.querySelectorAll(".review-star-pick.is-lit").length;

    if (!name || !body || rating === 0) {
      showToast("Please fill all fields and select a rating.");
      return;
    }

    const list = document.querySelector(".reviews-list");
    if (list) {
      const starsHtml = Array.from(
        { length: 5 },
        (_, i) =>
          `<img src="./images/${i < rating ? "star-filled" : "star-half"}.svg" alt="" />`,
      ).join("");

      const item = document.createElement("div");
      item.className = "review-item";
      item.style.animation = "tabFade 0.3s ease";
      item.innerHTML = `
        <div class="review-item__header">
          <strong class="review-item__author">${escapeHtml(name)}</strong>
          <div class="stars stars--sm" aria-label="${rating} stars">${starsHtml}</div>
        </div>
        <p class="review-item__body">${escapeHtml(body)}</p>
      `;
      list.appendChild(item);
    }

    if (nameEl) nameEl.value = "";
    if (bodyEl) bodyEl.value = "";
    starPickers.forEach((s) => s.classList.remove("is-lit", "is-selected"));
    showToast("Thank you for your review!");
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Scroll-reveal for related product cards
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("card--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  const style = document.createElement("style");
  style.textContent = `
    .product-card {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .5s ease, transform .5s ease, box-shadow .35s ease;
    }
    .product-card.card--visible {
      opacity: 1;
      transform: translateY(0);
    }
    .product-card.card--visible:hover {
      transform: translateY(-8px);
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".product-card").forEach((card, i) => {
    card.style.transitionDelay = `${(i % 4) * 60}ms`;
    revealObserver.observe(card);
  });
}

// Footer brand scroll-to-top
const footerBrand = document.querySelector(".site-footer__brand");

if (footerBrand) {
  footerBrand.style.cursor = "pointer";
  footerBrand.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Smooth scroll for # anchors
document.querySelectorAll('a[href="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
