// Main JavaScript for NMCN Website

// DOM Elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const heroSlider = document.getElementById("heroSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sliderDots = document.getElementById("sliderDots");
const floatingChat = document.getElementById("floatingChat");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

// Slider State
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;

// Mobile Menu Toggle
if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    navMenu.classList.remove("active");
    const icon = mobileMenuBtn.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Hero Slider Functions
function showSlide(n) {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  currentSlide = (n + totalSlides) % totalSlides;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Slider Event Listeners
if (nextBtn) {
  nextBtn.addEventListener("click", nextSlide);
}

if (prevBtn) {
  prevBtn.addEventListener("click", prevSlide);
}

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// Auto-slide functionality
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
if (heroSlider) {
  heroSlider.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  heroSlider.addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
}

// Chat Widget Functions
if (floatingChat) {
  floatingChat.addEventListener("click", () => {
    chatWidget.classList.toggle("active");
    if (chatWidget.classList.contains("active")) {
      chatInput.focus();
    }
  });
}

if (chatClose) {
  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("active");
  });
}

// Chat Input Handling
function addChatMessage(message, isUser = false) {
  const chatBody = document.querySelector(".chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${isUser ? "user" : "bot"}`;
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleChatMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addChatMessage(message, true);
    chatInput.value = "";

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. How can I assist you with your registration or examination needs?",
        "I'd be happy to help! Are you looking to register as a new applicant or do you have an existing license?",
        "For immediate assistance, you can also call our support line at +234 800 NMCN (6632).",
        "Would you like information about our upcoming certification programs or examination schedules?",
        "I can help you with registration, payment processes, or any questions about NMCN services.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addChatMessage(randomResponse, false);
    }, 1000);
  }
}

if (chatSend) {
  chatSend.addEventListener("click", handleChatMessage);
}

if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleChatMessage();
    }
  });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  updateCounter();
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.3,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");

      // Animate stat numbers
      if (entry.target.classList.contains("stat-card")) {
        const numberElement = entry.target.querySelector(".stat-number");
        const text = numberElement.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ""));

        if (number && !numberElement.dataset.animated) {
          numberElement.dataset.animated = "true";
          numberElement.textContent = "0";

          setTimeout(() => {
            if (text.includes("%")) {
              animateCounter(numberElement, number, 1500);
              setTimeout(() => {
                numberElement.textContent = text;
              }, 1500);
            } else if (number >= 1000) {
              animateCounter(numberElement, number, 2000);
              setTimeout(() => {
                numberElement.textContent = text;
              }, 2000);
            }
          }, 200);
        }
      }
    }
  });
});

// Observe elements for animation
document
  .querySelectorAll(".stat-card, .event-card, .section-header")
  .forEach((el) => {
    observer.observe(el);
  });

// Header Scroll Effect
let lastScrollTop = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.style.transform = "translateY(-100%)";
  } else {
    // Scrolling up
    header.style.transform = "translateY(0)";
  }

  // Add background on scroll
  if (scrollTop > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScrollTop = scrollTop;
});

// Add CSS for header scroll effect
const headerScrollCSS = `
.header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.header {
    transition: transform 0.3s ease, background 0.3s ease;
}
`;

const style = document.createElement("style");
style.textContent = headerScrollCSS;
document.head.appendChild(style);

// Form Validation Utilities
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return re.test(phone);
}

// Local Storage Utilities
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Add loading animation
  document.body.classList.add("loaded");

  // Initialize any saved chat state
  const savedChatState = getFromLocalStorage("NMCN_chat_state");
  if (savedChatState && savedChatState.messages) {
    // Restore chat messages if needed
  }

  // Add fade-in animation to initial elements
  document.querySelectorAll(".hero-content, .logo").forEach((el) => {
    el.classList.add("fade-in");
  });
});

// Page Load Performance
window.addEventListener("load", () => {
  // Remove any loading indicators
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
  }

  // Preload images for better performance
  const imageUrls = [
    "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  ];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
});

// Export functions for use in other pages
window.NMCN = {
  validateEmail,
  validatePhone,
  saveToLocalStorage,
  getFromLocalStorage,
  addChatMessage,
};
