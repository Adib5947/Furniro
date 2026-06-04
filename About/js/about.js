// Hamburger Mobile Nav

const hamburger = document.querySelector(".nav-hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    navMenu.classList.toggle("nav-menu--open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close nav when a link is clicked
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
