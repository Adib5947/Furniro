// Hamburger Mobile Nav

const hamburger = document.querySelector(".nav-hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    navMenu.classList.toggle("nav-menu--open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close nav
  navMenu.querySelectorAll(".nav-menu__link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-open");
      navMenu.classList.remove("nav-menu--open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// Navbar active link animation
const navLinks = document.querySelectorAll(".nav-menu__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("nav-menu__link--active"));
    link.classList.add("nav-menu__link--active");
  });
});

// Before/After Image Slider
const ctaSlider = document.querySelector(".about-cta__slider");
const ctaNextBtn = document.querySelector(".about-cta__nav--next");
const ctaPrevBtn = document.querySelector(".about-cta__nav--prev");

if (ctaSlider && ctaNextBtn && ctaPrevBtn) {
  ctaNextBtn.addEventListener("click", () => {
    ctaSlider.classList.add("is-after");
  });

  ctaPrevBtn.addEventListener("click", () => {
    ctaSlider.classList.remove("is-after");
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

// View Blogs Button Click Handler
document
  .querySelectorAll(".about-story__btn, .about-cta__btn")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Button clicked:", btn.textContent);
    });
  });

// Mobile breakpoint
const MOBILE_BP = 700;
const isMobileView = () => window.innerWidth <= MOBILE_BP;

// Craftsmanship arrow slider
const craftGrid = document.getElementById("craftGrid");
const craftPrev = document.querySelector(".craft-nav--prev");
const craftNext = document.querySelector(".craft-nav--next");

function updateCraftNav() {
  if (!craftGrid || !craftPrev || !craftNext) return;
  const scrollLeft = Math.round(craftGrid.scrollLeft);
  const maxScroll = Math.round(craftGrid.scrollWidth - craftGrid.clientWidth);
  craftPrev.classList.toggle("craft-nav--hidden", scrollLeft <= 0);
  craftNext.classList.toggle("craft-nav--hidden", scrollLeft >= maxScroll - 2);
}

if (craftGrid && craftNext && craftPrev) {
  craftNext.addEventListener("click", () => {
    const card = craftGrid.querySelector(".craft-card");
    const amount = card ? card.offsetWidth : craftGrid.clientWidth;
    craftGrid.scrollBy({ left: amount, behavior: "smooth" });
  });
  craftPrev.addEventListener("click", () => {
    const card = craftGrid.querySelector(".craft-card");
    const amount = card ? card.offsetWidth : craftGrid.clientWidth;
    craftGrid.scrollBy({ left: -amount, behavior: "smooth" });
  });
  craftGrid.addEventListener("scroll", updateCraftNav);
  updateCraftNav();
}

// Team dot carousel
const teamGrid = document.getElementById("teamGrid");
let teamDotsBuilt = false;

function buildTeamDots() {
  if (!teamGrid || teamDotsBuilt) return;
  const cards = Array.from(teamGrid.querySelectorAll(".team-card"));
  if (!cards.length) return;

  const dotsWrap = document.createElement("div");
  dotsWrap.className = "team-carousel-dots";
  const dots = cards.map((_, i) => {
    const d = document.createElement("span");
    d.className = "carousel-dot" + (i === 0 ? " active" : "");
    dotsWrap.appendChild(d);
    return d;
  });
  teamGrid.parentElement.appendChild(dotsWrap);

  teamGrid.addEventListener("scroll", () => {
    const first = teamGrid.firstElementChild;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(teamGrid).gap) || 14;
    const unit = first.offsetWidth + gap;
    const active = Math.round(teamGrid.scrollLeft / unit);
    dots.forEach((d, i) => d.classList.toggle("active", i === active));
  });

  teamDotsBuilt = true;
}

function destroyTeamDots() {
  if (!teamGrid || !teamDotsBuilt) return;
  const dots = teamGrid.parentElement.querySelector(".team-carousel-dots");
  if (dots) dots.remove();
  teamDotsBuilt = false;
}

function applyAboutLayout() {
  if (isMobileView()) {
    buildTeamDots();
    updateCraftNav();
  } else {
    destroyTeamDots();
  }
}

let aboutResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(aboutResizeTimer);
  aboutResizeTimer = setTimeout(applyAboutLayout, 120);
});

applyAboutLayout();
