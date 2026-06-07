"use strict";

// Navbar Search + Cart features

(function () {
  function findButtons(type) {
    const sel = ".header-actions__button";
    return Array.from(document.querySelectorAll(sel)).filter(function (btn) {
      const img = btn.querySelector("img");
      const label = (btn.getAttribute("aria-label") || "").toLowerCase();
      const src = img ? (img.getAttribute("src") || "").toLowerCase() : "";
      if (type === "search") {
        return label === "search" || src.indexOf("search-icon") !== -1;
      }
      // cart
      return label === "cart" || src.indexOf("cart-icon") !== -1;
    });
  }

  // Search Dropdown
  function initSearch() {
    const searchButtons = findButtons("search");
    if (!searchButtons.length) return;

    // Styling for Search Options
    if (!document.getElementById("nf-search-styles")) {
      const style = document.createElement("style");
      style.id = "nf-search-styles";
      style.textContent = `
        .nf-search-panel {
          position: fixed;
          width: 320px;
          max-width: calc(100vw - 24px);
          background: #ffffff;
          border: 1px solid #d9d9d9;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.14);
          z-index: 9998;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s ease;
          padding: 10px;
        }
        .nf-search-panel.nf-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .nf-search-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          padding: 0 12px;
          background: #fff;
          transition: border-color 0.25s;
        }
        .nf-search-inner:focus-within {
          border-color: #b88e2f;
        }
        .nf-search-inner img {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .nf-search-input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          height: 44px;
          font-size: 15px;
          color: #000;
          font-family: inherit;
        }
        .nf-search-input::placeholder { color: #9f9f9f; }
        .nf-search-close {
          border: 0;
          background: transparent;
          font-size: 22px;
          line-height: 1;
          color: #9f9f9f;
          cursor: pointer;
          padding: 4px 6px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .nf-search-close:hover { color: #b88e2f; }
      `;
      document.head.appendChild(style);
    }

    // Build the panel once
    let panel = document.getElementById("nfSearchPanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "nf-search-panel";
      panel.id = "nfSearchPanel";
      panel.innerHTML =
        '<div class="nf-search-inner">' +
        '<img src="' +
        getSearchIconSrc(searchButtons[0]) +
        '" alt="" />' +
        '<input type="text" class="nf-search-input" placeholder="Search products..." aria-label="Search" />' +
        '<button type="button" class="nf-search-close" aria-label="Close search">&times;</button>' +
        "</div>";
      document.body.appendChild(panel);
    }

    const input = panel.querySelector(".nf-search-input");
    const closeBtn = panel.querySelector(".nf-search-close");

    // Remember which search button is currently driving the panel position.
    let activeBtn = searchButtons[0];

    function positionPanel() {
      const btn = activeBtn || searchButtons[0];
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const gap = 10; // space between icon and panel
      const panelW = panel.offsetWidth || 320;

      // top: just below the icon
      panel.style.top = r.bottom + gap + "px";

      // right-align the panel's right edge to the icon's right edge,
      // but clamp so it never runs off the left side of the viewport.
      let left = r.right - panelW;
      const minLeft = 12;
      const maxLeft = window.innerWidth - panelW - 12;
      if (left > maxLeft) left = maxLeft;
      if (left < minLeft) left = minLeft;
      panel.style.left = left + "px";
    }

    function openSearch() {
      closeCart(); // don't show both at once
      positionPanel();
      panel.classList.add("nf-open");
      searchButtons.forEach(function (b) {
        b.setAttribute("aria-expanded", "true");
      });
      setTimeout(function () {
        input.focus();
      }, 120);
      window.addEventListener("scroll", positionPanel, { passive: true });
      window.addEventListener("resize", positionPanel, { passive: true });
    }

    function closeSearch() {
      panel.classList.remove("nf-open");
      searchButtons.forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
      window.removeEventListener("scroll", positionPanel);
      window.removeEventListener("resize", positionPanel);
    }

    function isOpen() {
      return panel.classList.contains("nf-open");
    }

    // expose for cart to call
    window.__nfCloseSearch = closeSearch;

    searchButtons.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isOpen()) {
          closeSearch();
        } else {
          activeBtn = btn; // anchor under whichever icon was clicked
          openSearch();
        }
      });
    });

    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeSearch();
    });

    // close on outside click
    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (panel.contains(e.target)) return;
      if (
        searchButtons.some(function (b) {
          return b.contains(e.target);
        })
      )
        return;
      closeSearch();
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeSearch();
    });
  }

  function getSearchIconSrc(btn) {
    const img = btn.querySelector("img");
    return img ? img.getAttribute("src") : "";
  }

  // Cart Sidebar
  function closeCart() {
    const sb = document.getElementById("cartSidebar");
    const ov = document.getElementById("cartOverlay");
    if (sb) sb.classList.remove("is-open");
    if (ov) ov.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  function initCart() {
    const cartButtons = findButtons("cart");
    if (!cartButtons.length) return;

    if (document.getElementById("cartSidebar")) return;

    // Inject styles once
    if (!document.getElementById("nf-cart-styles")) {
      const style = document.createElement("style");
      style.id = "nf-cart-styles";
      style.textContent = `
        .nf-cart-overlay {
          position: fixed; 
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1000; 
          opacity: 0; 
          visibility: hidden;
          transition: opacity 0.38s ease, visibility 0.38s ease;
        }

        .nf-cart-overlay.is-active { 
        opacity: 1; 
        visibility: visible;
        }

        .nf-cart-sidebar {
          position: fixed; 
          top: 0; 
          right: 0;
          width: 417px; 
          max-width: 100vw;
          height: 100vh;
          background: #fff;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          padding: 28px 30px;
          gap: 20px;
          overflow-y: auto;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
          transform: translateX(100%);
          visibility: hidden;
          transition: transform 0.38s ease, visibility 0.38s ease;
        }

        .nf-cart-sidebar.is-open { 
        transform: translateX(0);
        visibility: visible; 
        }

        .nf-cart-header {
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          padding-top: 6px;
        }

        .nf-cart-title { 
        color:#000; 
        font-size: 24px; 
        font-weight: 600; 
        }

        .nf-cart-close {
          width: 40px; 
          height: 40px; 
          border: 0; 
          background: none; 
          cursor: pointer;
          display: flex; 
          align-items: center; 
          justify-content: center;
          border-radius: 50%; 
          font-size: 22px; 
          color: #9f9f9f;
          transition: background 0.2s, color 0.2s;
        }

        .nf-cart-close:hover { 
        background: #f4f5f7; 
        color: #b88e2f; 
        }

        .nf-cart-divider { 
        width: 100%; 
        height: 1px; 
        background: #d9d9d9; 
        flex-shrink: 0; 
        }

        .nf-cart-items { 
        list-style: none; 
        display: flex; 
        flex-direction: column; 
        gap: 24px; 
        flex: 1; 
        margin: 0; 
        padding: 0; 
        }

        .nf-cart-empty {
          flex: 1; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          gap: 16px;
          color: #9f9f9f; 
          text-align: center; 
          padding: 40px 0;
        }

        .nf-cart-empty svg { 
        opacity: 0.3; 
        }

        .nf-cart-empty p {
        font-size: 0.9375rem; 
        }

        .nf-cart-subtotal { 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        padding: 4px 0; 
        }

        .nf-cart-subtotal-label { 
        font-size: 1rem; 
        font-weight: 600; 
        color: #3a3a3a; 
        }
        
        .nf-cart-subtotal-value {
        font-size: 1.125rem; 
        font-weight: 600; 
        color: #b88e2f; 
        }

        .nf-cart-actions { 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        gap: 12px; 
        flex-wrap: wrap; 
        padding-bottom: 8px; 
        }

        .nf-cart-btn {
          flex: 1; 
          min-width: 80px; 
          text-align: center; 
          padding: 10px 14px;
          font-size: 0.8125rem; 
          color: #3a3a3a; 
          text-decoration: none;
          border: 1.5px solid #3a3a3a; 
          border-radius: 50px; 
          background: transparent;
          transition: 
          background 0.22s, 
          color 0.22s, 
          border-color 0.22s, 
          transform 0.15s;
        }

        .nf-cart-btn:hover {
        background: #b88e2f; 
        color: #fff; 
        border-color: #b88e2f; 
        transform: translateY(-1px); 
        }

        @media (max-width: 480px) {
          .nf-cart-sidebar { 
          width: 100vw; 
          padding: 24px 20px; 
          }

          .nf-cart-actions { 
          flex-direction: column; 
          }

          .nf-cart-btn { 
          width: 100%; 
          }

        }
      `;
      document.head.appendChild(style);
    }

    const prefix = getPagePrefix();

    const overlay = document.createElement("div");
    overlay.className = "nf-cart-overlay";
    overlay.id = "cartOverlay";

    const sidebar = document.createElement("aside");
    sidebar.className = "nf-cart-sidebar";
    sidebar.id = "cartSidebar";
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    sidebar.setAttribute("aria-label", "Shopping Cart");
    sidebar.innerHTML =
      '<div class="nf-cart-header">' +
      '<h2 class="nf-cart-title">Shopping Cart</h2>' +
      '<button class="nf-cart-close" id="cartClose" aria-label="Close cart">&times;</button>' +
      "</div>" +
      '<div class="nf-cart-divider"></div>' +
      '<ul class="nf-cart-items" id="cartItems">' +
      '<li class="nf-cart-empty">' +
      '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<path d="M16 10a4 4 0 0 1-8 0"/>' +
      "</svg>" +
      "<p>Your cart is empty.</p>" +
      "</li>" +
      "</ul>" +
      '<div class="nf-cart-subtotal">' +
      '<span class="nf-cart-subtotal-label">Subtotal</span>' +
      '<span class="nf-cart-subtotal-value">Rs. 0.00</span>' +
      "</div>" +
      '<div class="nf-cart-divider"></div>' +
      '<div class="nf-cart-actions">' +
      '<a href="' +
      prefix +
      'Cart/cart.html" class="nf-cart-btn">Cart</a>' +
      '<a href="' +
      prefix +
      'Checkout/checkout.html" class="nf-cart-btn">Checkout</a>' +
      '<a href="' +
      prefix +
      'Comparison/comparison.html" class="nf-cart-btn">Comparison</a>' +
      "</div>";

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    function openCart() {
      if (window.__nfCloseSearch) window.__nfCloseSearch();
      sidebar.classList.add("is-open");
      overlay.classList.add("is-active");
      document.body.style.overflow = "hidden";
      cartButtons.forEach(function (b) {
        b.setAttribute("aria-expanded", "true");
      });
    }
    function doClose() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-active");
      document.body.style.overflow = "";
      cartButtons.forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
    }
    function toggleCart() {
      sidebar.classList.contains("is-open") ? doClose() : openCart();
    }

    cartButtons.forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleCart();
      });
    });

    overlay.addEventListener("click", doClose);
    const closeBtn = sidebar.querySelector("#cartClose");
    if (closeBtn) closeBtn.addEventListener("click", doClose);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") doClose();
    });
  }

  function getPagePrefix() {
    const link = document.querySelector(
      '.nav-menu__link[href*="shop.html"], .nav-menu__link[href*="index.html"]',
    );
    if (link) {
      const href = link.getAttribute("href") || "";
      if (href.indexOf("../") === 0) return "../";
    }
    return "../";
  }
  function init() {
    initSearch();
    initCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
