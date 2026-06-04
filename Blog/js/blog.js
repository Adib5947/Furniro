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

// Search functionality
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-form__input");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      console.log("Searching for:", searchTerm);
      alert(`Searching for: ${searchTerm}`);
    }
  });
}

// Pagination functionality
const paginationBtns = document.querySelectorAll(".pagination__btn");

paginationBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    paginationBtns.forEach((b) =>
      b.classList.remove("pagination__btn--active"),
    );
    this.classList.add("pagination__btn--active");
  });
});

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
