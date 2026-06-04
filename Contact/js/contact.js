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

// Contact Form Submission
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Simple validation
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Form submitted:", { name, email, subject, message });

    // Show success message
    alert("Thank you for your message! We will get back to you soon.");

    // Reset form
    contactForm.reset();
  });
}

// Add focus effects
const formInputs = document.querySelectorAll(
  ".contact-form__input, .contact-form__textarea",
);

formInputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.style.borderColor = "var(--color-primary)";
  });

  input.addEventListener("blur", () => {
    input.style.borderColor = "#9f9f9f";
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
