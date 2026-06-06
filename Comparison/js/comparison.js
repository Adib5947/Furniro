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
    navLinks.forEach((i) => i.classList.remove("nav-menu__link--active"));
    link.classList.add("nav-menu__link--active");
  });
});

const footerBrand = document.querySelector(".site-footer__brand");
if (footerBrand) {
  footerBrand.style.cursor = "pointer";
  footerBrand.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

// Add A Product Dropdown

const trigger = document.getElementById("addProductTrigger");
const dropdown = document.getElementById("addProductDropdown");

if (trigger && dropdown) {
  document.body.appendChild(dropdown);

  Object.assign(dropdown.style, {
    position: "fixed",
    zIndex: "99999",
    backgroundColor: "#ffffff",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.20)",
    listStyle: "none",
    padding: "6px 0",
    maxHeight: "300px",
    overflowY: "auto",
    display: "none",
    minWidth: "220px",
  });

  // Items solid white background
  dropdown.querySelectorAll(".comparison-add__item").forEach((item) => {
    item.style.backgroundColor = "#ffffff";
    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "#fdf6ec";
    });
    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "#ffffff";
    });
  });

  // Dropdown Positoning
  function positionDropdown() {
    const rect = trigger.getBoundingClientRect();
    dropdown.style.top = rect.bottom + 4 + "px";
    dropdown.style.left = rect.left + "px";
    dropdown.style.width = rect.width + "px";
  }

  // Open / close
  function openDropdown() {
    positionDropdown();
    dropdown.style.display = "block";
    trigger.setAttribute("aria-expanded", "true");
    window.addEventListener("scroll", positionDropdown, { passive: true });
    window.addEventListener("resize", positionDropdown, { passive: true });
  }

  function closeDropdown() {
    dropdown.style.display = "none";
    trigger.setAttribute("aria-expanded", "false");
    window.removeEventListener("scroll", positionDropdown);
    window.removeEventListener("resize", positionDropdown);
  }

  function isOpen() {
    return dropdown.style.display === "block";
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeDropdown() : openDropdown();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Keyboard support
  dropdown.querySelectorAll(".comparison-add__item").forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Item selection
  dropdown.querySelectorAll(".comparison-add__item").forEach((item) => {
    item.addEventListener("click", () => {
      const name = item.querySelector(".comparison-add__item-name").textContent;
      trigger.querySelector("span").textContent = name;
      closeDropdown();
    });
  });
}

// Add To Cart buttons
document.querySelectorAll(".comparison-atc-btn").forEach((btn) => {
  btn.addEventListener("click", () => {});
});

// Scroll Reveal
if ("IntersectionObserver" in window) {
  const style = document.createElement("style");
  style.textContent = `
    .comparison-product, .comparison-add, .comparison-goto {
      opacity: 0; transform: translateY(20px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .reveal--visible { opacity: 1 !important; transform: translateY(0) !important; }
    .comparison-table tbody tr {
      opacity: 0; transform: translateY(10px);
      transition: opacity .35s ease, transform .35s ease;
    }
    .comparison-table tbody tr.row--visible { opacity: 1; transform: translateY(0); }
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
