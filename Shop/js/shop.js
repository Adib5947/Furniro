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

    if (showCountEl) {
      updateResultsLabel(Number(showCountEl.value), currentPage);
    }

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
    filterDrawer.classList.remove("is-open");
    if (filterToggleBtn) filterToggleBtn.setAttribute("aria-expanded", "false");
    filterDrawer.setAttribute("aria-hidden", "true");

    if (productsGrid) {
      productsGrid.style.opacity = "0.4";
      productsGrid.style.transition = "opacity .25s";
      setTimeout(() => {
        productsGrid.style.opacity = "1";
      }, 400);
    }
  });
}

// Compare buttons
document
  .querySelectorAll(".product-card__overlay-actions span")
  .forEach((span) => {
    if (span.textContent.trim().startsWith("Compare")) {
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = "../Comparison/comparison.html";
      });
    }
  });

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

// Scroll-reveal

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

// Mobile

const CARDS_PER_ROW = 4;
const MOBILE_BREAKPOINT = 700;

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function destroyCarousel() {
  if (!productsGrid) return;

  const allRows = productsGrid.querySelectorAll(".carousel-row");
  allRows.forEach((row) => {
    row.querySelectorAll(".product-card").forEach((card) => {
      productsGrid.appendChild(card);
    });
    row.remove();
  });

  const dotContainers = productsGrid.querySelectorAll(".carousel-dots");
  dotContainers.forEach((d) => d.remove());
}

function buildCarousel() {
  if (!productsGrid) return;

  destroyCarousel();

  const cards = Array.from(productsGrid.querySelectorAll(".product-card"));
  if (!cards.length) return;

  for (let i = 0; i < cards.length; i += CARDS_PER_ROW) {
    const chunk = cards.slice(i, i + CARDS_PER_ROW);

    const row = document.createElement("div");
    row.className = "carousel-row";
    chunk.forEach((card) => row.appendChild(card));
    chunk.forEach((card) => card.classList.add("card--visible"));
    productsGrid.appendChild(row);

    // Dot indicators
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";

    chunk.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
      dotsWrap.appendChild(dot);
    });

    productsGrid.appendChild(dotsWrap);

    // Update dots on scroll
    const dots = dotsWrap.querySelectorAll(".carousel-dot");
    row.addEventListener("scroll", () => {
      const cardWidth = row.firstElementChild
        ? row.firstElementChild.offsetWidth + 14
        : 1;
      const active = Math.round(row.scrollLeft / cardWidth);
      dots.forEach((d, idx) => {
        d.classList.toggle("active", idx === active);
      });
    });
  }
}

// Runs in any sizes
function applyLayout() {
  destroyCarousel();

  if (isMobile()) {
    if (productsGrid) productsGrid.classList.remove("products__grid--list");
    const gridBtn = document.getElementById("viewGrid");
    const listBtn = document.getElementById("viewList");
    if (
      gridBtn &&
      listBtn &&
      listBtn.classList.contains("toolbar-view--active")
    ) {
      listBtn.classList.remove("toolbar-view--active");
      gridBtn.classList.add("toolbar-view--active");
    }
  }
}

// Resize Handler
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyLayout, 120);
});

applyLayout();

// Custom Dropdowns
(function () {
  const selects = document.querySelectorAll(".toolbar-select");
  if (!selects.length) return;

  let openDd = null;

  function closeAll() {
    if (openDd) {
      openDd.classList.remove("nf-open");
      openDd = null;
    }
  }

  selects.forEach((select) => {
    const wrap = select.closest(".toolbar-select-wrap");
    if (!wrap) return;
    wrap.classList.add("nf-has-custom");

    const dd = document.createElement("div");
    dd.className = "nf-dd";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nf-dd__btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");

    const menu = document.createElement("ul");
    menu.className = "nf-dd__menu";
    menu.setAttribute("role", "listbox");

    const options = Array.from(select.options);

    function syncLabel() {
      btn.textContent = select.options[select.selectedIndex].textContent;
    }

    options.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "nf-dd__option";
      li.setAttribute("role", "option");
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;
      if (opt.selected) li.classList.add("nf-selected");

      li.addEventListener("click", () => {
        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));

        menu
          .querySelectorAll(".nf-dd__option")
          .forEach((o) => o.classList.remove("nf-selected"));
        li.classList.add("nf-selected");
        syncLabel();
        closeAll();
        btn.setAttribute("aria-expanded", "false");
      });

      menu.appendChild(li);
    });

    syncLabel();

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("nf-open");
      closeAll();
      if (!isOpen) {
        dd.classList.add("nf-open");
        openDd = dd;
        btn.setAttribute("aria-expanded", "true");
      } else {
        btn.setAttribute("aria-expanded", "false");
      }
    });

    dd.appendChild(btn);
    dd.appendChild(menu);
    wrap.appendChild(dd);
  });

  // Close on outside click
  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
