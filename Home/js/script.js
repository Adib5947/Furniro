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
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Product card hover tilt effect
const productCards = document.querySelectorAll(".product-card");

productCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Inspiration Slider

const inspirationGallery = document.querySelector(".inspiration__gallery");
const nextBtn = document.querySelector(".inspiration__next");
const prevBtn = document.querySelector(".inspiration__prev");
const SCROLL_AMOUNT = 420; // px per click

function updateNavButtons() {
  if (!inspirationGallery) return;

  const scrollLeft = Math.round(inspirationGallery.scrollLeft);
  const maxScroll = Math.round(
    inspirationGallery.scrollWidth - inspirationGallery.clientWidth,
  );

  // Hide prev when we are all the way to the left (at start)
  if (prevBtn) {
    if (scrollLeft <= 0) {
      prevBtn.classList.add("inspiration__nav--hidden");
    } else {
      prevBtn.classList.remove("inspiration__nav--hidden");
    }
  }

  // Hide next when we are all the way to the right (at end)
  if (nextBtn) {
    if (scrollLeft >= maxScroll - 2) {
      nextBtn.classList.add("inspiration__nav--hidden");
    } else {
      nextBtn.classList.remove("inspiration__nav--hidden");
    }
  }
}

if (nextBtn && inspirationGallery) {
  nextBtn.addEventListener("click", () => {
    inspirationGallery.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  });
}

if (prevBtn && inspirationGallery) {
  prevBtn.addEventListener("click", () => {
    inspirationGallery.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  });
}

if (inspirationGallery) {
  inspirationGallery.addEventListener("scroll", updateNavButtons);
  updateNavButtons();
}

// Smooth Scroll

document.querySelectorAll('a[href="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
