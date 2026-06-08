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

const navLinks = document.querySelectorAll(".nav-menu__link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Inspiration Slider

const inspirationGallery = document.querySelector(".inspiration__gallery");
const nextBtn = document.querySelector(".inspiration__next");
const prevBtn = document.querySelector(".inspiration__prev");
const SCROLL_AMOUNT = 420;

function updateNavButtons() {
  if (!inspirationGallery) return;
  const scrollLeft = Math.round(inspirationGallery.scrollLeft);
  const maxScroll = Math.round(
    inspirationGallery.scrollWidth - inspirationGallery.clientWidth,
  );
  if (prevBtn)
    prevBtn.classList.toggle("inspiration__nav--hidden", scrollLeft <= 0);
  if (nextBtn)
    nextBtn.classList.toggle(
      "inspiration__nav--hidden",
      scrollLeft >= maxScroll - 2,
    );
}

if (nextBtn && inspirationGallery) {
  nextBtn.addEventListener("click", () =>
    inspirationGallery.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" }),
  );
}
if (prevBtn && inspirationGallery) {
  prevBtn.addEventListener("click", () =>
    inspirationGallery.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" }),
  );
}
if (inspirationGallery) {
  inspirationGallery.addEventListener("scroll", updateNavButtons);
  updateNavButtons();
}

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

const footerBrand = document.querySelector(".site-footer__brand");
if (footerBrand) {
  footerBrand.style.cursor = "pointer";
  footerBrand.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

// Helpers

const MOBILE_BP = 700;
const isMobile = () => window.innerWidth <= MOBILE_BP;

function makeDots(count, containerClass, trackEl) {
  const wrap = document.createElement("div");
  wrap.className = containerClass;
  const dots = [];
  for (let i = 0; i < count; i++) {
    const d = document.createElement("span");
    d.className = "carousel-dot" + (i === 0 ? " active" : "");
    wrap.appendChild(d);
    dots.push(d);
  }

  trackEl.addEventListener("scroll", () => {
    const firstChild = trackEl.firstElementChild;
    if (!firstChild) return;
    const style = getComputedStyle(trackEl);
    const gap = parseFloat(style.gap) || 10;
    const unit = firstChild.offsetWidth + gap;
    const active = Math.round(trackEl.scrollLeft / unit);
    dots.forEach((d, i) => d.classList.toggle("active", i === active));
  });

  return wrap;
}

// Range Carousel

const rangeGrid = document.querySelector(".range__grid");
let rangeCarouselBuilt = false;

function buildRangeCarousel() {
  if (!rangeGrid || rangeCarouselBuilt) return;

  const cards = Array.from(rangeGrid.querySelectorAll(".range-card"));
  if (!cards.length) return;

  const track = document.createElement("div");
  track.className = "range-swipe-track";
  cards.forEach((c) => track.appendChild(c));
  rangeGrid.appendChild(track);

  // Dot indicators
  const dots = makeDots(cards.length, "range-carousel-dots", track);
  rangeGrid.appendChild(dots);

  rangeCarouselBuilt = true;
}

function destroyRangeCarousel() {
  if (!rangeGrid || !rangeCarouselBuilt) return;

  const track = rangeGrid.querySelector(".range-swipe-track");
  if (track) {
    track
      .querySelectorAll(".range-card")
      .forEach((c) => rangeGrid.appendChild(c));
    track.remove();
  }
  const dots = rangeGrid.querySelector(".range-carousel-dots");
  if (dots) dots.remove();

  rangeCarouselBuilt = false;
}

// Products Carousel

const productsGrid = document.querySelector(".products__grid");
let productsCarouselBuilt = false;

function buildProductsCarousel() {
  if (!productsGrid || productsCarouselBuilt) return;

  const cards = Array.from(productsGrid.querySelectorAll(".product-card"));
  if (!cards.length) return;

  const ROW_SIZE = 4;

  for (let r = 0; r < cards.length; r += ROW_SIZE) {
    const rowCards = cards.slice(r, r + ROW_SIZE);

    const swipeRow = document.createElement("div");
    swipeRow.className = "carousel-row";
    rowCards.forEach((c) => swipeRow.appendChild(c));
    productsGrid.appendChild(swipeRow);

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";

    rowCards.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
      dotsWrap.appendChild(dot);
    });
    productsGrid.appendChild(dotsWrap);

    // Sync dots on scroll
    const dots = dotsWrap.querySelectorAll(".carousel-dot");
    swipeRow.addEventListener("scroll", () => {
      const firstCard = swipeRow.firstElementChild;
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(swipeRow).gap) || 14;
      const unit = firstCard.offsetWidth + gap;
      const active = Math.round(swipeRow.scrollLeft / unit);
      dots.forEach((d, i) => d.classList.toggle("active", i === active));
    });
  }

  productsCarouselBuilt = true;
}

function destroyProductsCarousel() {
  if (!productsGrid || !productsCarouselBuilt) return;

  productsGrid
    .querySelectorAll(".product-card")
    .forEach((c) => productsGrid.appendChild(c));
  productsGrid
    .querySelectorAll(".carousel-row, .carousel-dots")
    .forEach((el) => el.remove());

  productsCarouselBuilt = false;
}

// #FurniroFurnitur

const spGrid = document.querySelector(".social-proof__grid");
let spCarouselBuilt = false;

function buildSPCarousel() {
  if (!spGrid || spCarouselBuilt) return;

  const imgs = Array.from(spGrid.querySelectorAll(".social-proof__item"));
  if (!imgs.length) return;

  const col1Imgs = imgs.slice(0, 4);
  const col2Imgs = imgs.slice(4);

  function makeColumnWrap(colImgs) {
    const wrap = document.createElement("div");
    wrap.className = "sp-column-wrap";

    const col = document.createElement("div");
    col.className = "sp-column";

    colImgs.forEach((img) => {
      img.style.cssText =
        "position:static;top:auto;left:auto;width:100%;height:auto;transform:none;transition:none;";
      col.appendChild(img);
    });

    wrap.appendChild(col);
    return wrap;
  }

  spGrid.appendChild(makeColumnWrap(col1Imgs));
  spGrid.appendChild(makeColumnWrap(col2Imgs));

  spCarouselBuilt = true;
}

function destroySPCarousel() {
  if (!spGrid || !spCarouselBuilt) return;

  spGrid.querySelectorAll(".social-proof__item").forEach((img) => {
    img.style.cssText = "";
    spGrid.appendChild(img);
  });
  spGrid.querySelectorAll(".sp-column-wrap").forEach((el) => el.remove());

  spCarouselBuilt = false;
}

// Layout Manager

function applyLayout() {
  destroyProductsCarousel();

  if (isMobile()) {
    buildRangeCarousel();
    buildSPCarousel();
  } else {
    destroyRangeCarousel();
    destroySPCarousel();
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyLayout, 120);
});

applyLayout();
