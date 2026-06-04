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

// Active nav link

const navLinks = document.querySelectorAll(".nav-menu__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("nav-menu__link--active"));
    link.classList.add("nav-menu__link--active");
  });
});

// Filter Drawer toggle

const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterDrawer = document.getElementById("filterDrawer");

if (filterToggleBtn && filterDrawer) {
  filterToggleBtn.addEventListener("click", () => {
    const isOpen = filterDrawer.classList.toggle("is-open");
    filterToggleBtn.setAttribute("aria-expanded", isOpen);
    filterDrawer.setAttribute("aria-hidden", !isOpen);
  });
}

// Price Range

const priceRange = document.getElementById("priceRange");
const priceRangeVal = document.getElementById("priceRangeVal");

function formatRp(value) {
  return "Rp " + Number(value).toLocaleString("id-ID").replace(/\./g, ".");
}

if (priceRange && priceRangeVal) {
  priceRange.addEventListener("input", () => {
    priceRangeVal.textContent = formatRp(priceRange.value);
  });
}

// View Toggle (Grid / List)

const viewBtns = document.querySelectorAll(".toolbar-view");
const productsGrid = document.getElementById("productsGrid");

viewBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    viewBtns.forEach((b) => b.classList.remove("toolbar-view--active"));
    btn.classList.add("toolbar-view--active");

    if (!productsGrid) return;

    const view = btn.dataset.view;

    if (view === "list") {
      productsGrid.classList.add("products__grid--list");
    } else {
      productsGrid.classList.remove("products__grid--list");
    }

    initCardTilt();
  });
});

// Show Count selector

const showCountEl = document.getElementById("showCount");
const rangeEndEl = document.getElementById("rangeEnd");
const rangeStartEl = document.getElementById("rangeStart");
const totalEl = document.getElementById("totalResults");

const TOTAL_PRODUCTS = 32;

function updateResultsLabel(perPage, page) {
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, TOTAL_PRODUCTS);
  if (rangeStartEl) rangeStartEl.textContent = start;
  if (rangeEndEl) rangeEndEl.textContent = end;
  if (totalEl) totalEl.textContent = TOTAL_PRODUCTS;
}

if (showCountEl) {
  showCountEl.addEventListener("change", () => {
    updateResultsLabel(Number(showCountEl.value), currentPage);
  });
}

updateResultsLabel(16, 1);

// Sort selector

const sortByEl = document.getElementById("sortBy");

if (sortByEl) {
  sortByEl.addEventListener("change", () => {
    if (productsGrid) {
      productsGrid.style.opacity = "0.4";
      productsGrid.style.transition = "opacity .2s";
      setTimeout(() => {
        productsGrid.style.opacity = "1";
      }, 350);
    }
  });
}

// Pagination

let currentPage = 1;

const paginationBtns = document.querySelectorAll(".pagination__btn");

paginationBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const isNext = btn.classList.contains("pagination__btn--next");

    if (isNext) {
      currentPage = Math.min(currentPage + 1, 3);
    } else {
      const page = parseInt(btn.textContent, 10);
      if (!isNaN(page)) currentPage = page;
    }

    // Update active state
    paginationBtns.forEach((b) => {
      if (!b.classList.contains("pagination__btn--next")) {
        b.classList.remove("pagination__btn--active");
        b.removeAttribute("aria-current");
      }
    });

    paginationBtns.forEach((b) => {
      if (parseInt(b.textContent, 10) === currentPage) {
        b.classList.add("pagination__btn--active");
        b.setAttribute("aria-current", "page");
      }
    });

    // Update results label
    if (showCountEl) {
      updateResultsLabel(Number(showCountEl.value), currentPage);
    }

    // Smooth scroll to products top
    const shopProducts = document.getElementById("shopProducts");
    if (shopProducts) {
      shopProducts.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Filter Apply button

const filterApplyBtn = document.querySelector(".filter-apply-btn");

if (filterApplyBtn && filterDrawer) {
  filterApplyBtn.addEventListener("click", () => {
    // Close the drawer
    filterDrawer.classList.remove("is-open");
    if (filterToggleBtn) filterToggleBtn.setAttribute("aria-expanded", "false");
    filterDrawer.setAttribute("aria-hidden", "true");

    // Flash the grid
    if (productsGrid) {
      productsGrid.style.opacity = "0.4";
      productsGrid.style.transition = "opacity .25s";
      setTimeout(() => {
        productsGrid.style.opacity = "1";
      }, 400);
    }
  });
}

// Smooth scroll

document.querySelectorAll('a[href="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Footer brand

const footerBrand = document.querySelector(".site-footer__brand");

if (footerBrand) {
  footerBrand.style.cursor = "pointer";
  footerBrand.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Scroll-reveal animation

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
    { threshold: 0.12 },
  );

  // Add base hidden style via JS
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
