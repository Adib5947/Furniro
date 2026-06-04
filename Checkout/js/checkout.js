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

// Payment radio image switch

const paymentRadios = document.querySelectorAll(".payment-method__radio");

paymentRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    paymentRadios.forEach((item) => {
      const img = item.parentElement.querySelector(
        ".payment-method__radio-dot",
      );
      const paymentMethod = item.closest(".payment-method");
      const methodName = paymentMethod.querySelector(".payment-method__name");

      if (item.checked) {
        img.src = "./images/black_dot.svg";
        if (methodName) {
          methodName.style.color = "#000";
        }
      } else {
        img.src = "./images/white_dot.svg";
        if (methodName) {
          methodName.style.color = "#9f9f9f";
        }
      }
    });
  });
});

// Set default checked radio image

paymentRadios.forEach((item) => {
  const img = item.parentElement.querySelector(".payment-method__radio-dot");
  const paymentMethod = item.closest(".payment-method");
  const methodName = paymentMethod.querySelector(".payment-method__name");

  if (item.checked) {
    img.src = "./images/black_dot.svg";
    if (methodName) {
      methodName.style.color = "#000";
    }
  } else {
    img.src = "./images/white_dot.svg";
    if (methodName) {
      methodName.style.color = "#9f9f9f";
    }
  }
});

// Select dropdowns

const selectElements = document.querySelectorAll(".billing-form__select");

selectElements.forEach((select) => {
  select.addEventListener("change", () => {
    if (select.value && select.value !== "") {
      select.classList.add("has-value");
    } else {
      select.classList.remove("has-value");
    }
  });
});

// Textarea

const textareaElements = document.querySelectorAll(".billing-form__textarea");

textareaElements.forEach((textarea) => {
  textarea.addEventListener("input", () => {
    if (textarea.value && textarea.value.trim() !== "") {
      textarea.classList.add("has-content");
    } else {
      textarea.classList.remove("has-content");
    }
  });
});

const cartItems = [
  {
    name: "Asgaard sofa",
    quantity: 1,
    price: 250000.0,
  },
];

// Function to format price
function formatPrice(price) {
  return (
    "Rs. " +
    price.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Function to render order items
function renderOrderItems() {
  const orderItemsContainer = document.getElementById("orderItems");
  const orderSubtotalElement = document.getElementById("orderSubtotal");
  const orderTotalElement = document.getElementById("orderTotal");

  orderItemsContainer.innerHTML = "";

  let subtotal = 0;

  // Render each cart item
  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "order-table__item";
    itemElement.innerHTML = `
      <div>
        <span class="order-table__item-name">${item.name}</span>
        <span class="order-table__item-qty">× ${item.quantity}</span>
      </div>
      <span class="order-table__item-price">${formatPrice(itemTotal)}</span>
    `;

    orderItemsContainer.appendChild(itemElement);
  });

  // Update subtotal and total
  orderSubtotalElement.textContent = formatPrice(subtotal);
  orderTotalElement.textContent = formatPrice(subtotal);
}

// Render order items on page load
document.addEventListener("DOMContentLoaded", renderOrderItems);

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
