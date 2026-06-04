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

// Footer brand scroll
const footerBrand = document.querySelector(".site-footer__brand");
if (footerBrand) {
  footerBrand.style.cursor = "pointer";
  footerBrand.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Add A Product Dropdown
const addProductTrigger = document.getElementById("addProductTrigger");
const addProductDropdown = document.getElementById("addProductDropdown");

if (addProductTrigger && addProductDropdown) {
  addProductTrigger.addEventListener("click", () => {
    const isOpen = addProductDropdown.classList.toggle("is-open");
    addProductTrigger.setAttribute("aria-expanded", isOpen);
  });

  // Close dropdown
  document.addEventListener("click", (e) => {
    if (
      !addProductTrigger.contains(e.target) &&
      !addProductDropdown.contains(e.target)
    ) {
      addProductDropdown.classList.remove("is-open");
      addProductTrigger.setAttribute("aria-expanded", "false");
    }
  });

  // Keyboard support
  addProductDropdown
    .querySelectorAll(".comparison-add__item")
    .forEach((item) => {
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.click();
        }
      });
    });

  // Item selection
  addProductDropdown
    .querySelectorAll(".comparison-add__item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        const name = item.querySelector(
          ".comparison-add__item-name",
        ).textContent;
        addProductTrigger.querySelector("span").textContent = name;
        addProductDropdown.classList.remove("is-open");
        addProductTrigger.setAttribute("aria-expanded", "false");
      });
    });
}

// Add To Cart buttons
const addToCartBtns = document.querySelectorAll(".comparison-atc-btn");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {});
});

// Scroll Reveal
if ("IntersectionObserver" in window) {
  const style = document.createElement("style");
  style.textContent = `
    .comparison-product, .comparison-add, .comparison-goto {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .reveal--visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .comparison-table tbody tr {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity .35s ease, transform .35s ease;
    }
    .comparison-table tbody tr.row--visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".comparison-product, .comparison-add, .comparison-goto")
    .forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      revealObs.observe(el);
    });

  const rowObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("row--visible");
          rowObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 },
  );

  document.querySelectorAll(".comparison-table tbody tr").forEach((tr, i) => {
    tr.style.transitionDelay = `${i * 30}ms`;
    rowObs.observe(tr);
  });
}
