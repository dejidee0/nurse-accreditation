// FAQ Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeFAQ();
});

function initializeFAQ() {
  setupFAQItems();
  setupCategoryFilters();
  setupSearch();
  setupChatButton();
}

// FAQ Accordion Functionality
function setupFAQItems() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
}

// Category Filtering
function setupCategoryFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn");
  const faqSections = document.querySelectorAll(".faq-section");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      // Update active button
      categoryBtns.forEach((otherBtn) => {
        otherBtn.classList.remove("active");
      });
      btn.classList.add("active");

      // Filter sections
      filterFAQSections(category);
    });
  });
}

function filterFAQSections(category) {
  const faqSections = document.querySelectorAll(".faq-section");

  faqSections.forEach((section) => {
    if (category === "all" || section.dataset.category === category) {
      section.classList.remove("hidden");
      section.style.display = "block";
    } else {
      section.classList.add("hidden");
      section.style.display = "none";
    }
  });

  // Close all open FAQ items when filtering
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.classList.remove("active");
  });
}

// Search Functionality
function setupSearch() {
  const searchInput = document.getElementById("faqSearch");
  let searchTimeout;

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
  }
}

function performSearch(query) {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqSections = document.querySelectorAll(".faq-section");

  if (!query.trim()) {
    // Show all items if search is empty
    faqItems.forEach((item) => {
      item.style.display = "block";
      clearHighlights(item);
    });

    faqSections.forEach((section) => {
      section.style.display = "block";
    });

    // Reset category filter
    const activeCategory = document.querySelector(".category-btn.active");
    if (activeCategory) {
      filterFAQSections(activeCategory.dataset.category);
    }

    return;
  }

  const searchTerm = query.toLowerCase();
  let hasResults = false;

  // Show all sections during search
  faqSections.forEach((section) => {
    section.style.display = "block";
    section.classList.remove("hidden");
  });

  faqItems.forEach((item) => {
    const question = item
      .querySelector(".faq-question h3")
      .textContent.toLowerCase();
    const answer = item.querySelector(".faq-answer").textContent.toLowerCase();

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.style.display = "block";
      highlightSearchTerm(item, query);
      hasResults = true;
    } else {
      item.style.display = "none";
      clearHighlights(item);
    }
  });

  // Show "no results" message if needed
  showSearchResults(hasResults, query);
}

function highlightSearchTerm(item, term) {
  const question = item.querySelector(".faq-question h3");
  const answer = item.querySelector(".faq-answer");

  // Clear previous highlights
  clearHighlights(item);

  // Highlight in question
  highlightText(question, term);

  // Highlight in answer
  highlightText(answer, term);
}

function highlightText(element, term) {
  const regex = new RegExp(`(${escapeRegex(term)})`, "gi");
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    if (regex.test(textNode.textContent)) {
      const highlightedHTML = textNode.textContent.replace(
        regex,
        '<span class="search-highlight">$1</span>'
      );
      const wrapper = document.createElement("div");
      wrapper.innerHTML = highlightedHTML;

      while (wrapper.firstChild) {
        textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
      }
      textNode.remove();
    }
  });
}

function clearHighlights(item) {
  const highlights = item.querySelectorAll(".search-highlight");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    parent.replaceChild(
      document.createTextNode(highlight.textContent),
      highlight
    );
    parent.normalize();
  });
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function showSearchResults(hasResults, query) {
  // Remove existing no results message
  const existingMessage = document.querySelector(".no-results-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  if (!hasResults && query.trim()) {
    const message = document.createElement("div");
    message.className = "no-results-message";
    message.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or browse our categories above.</p>
                <div class="no-results-actions">
                    <button class="btn btn-primary" onclick="clearSearch()">Clear Search</button>
                    <a href="support.html" class="btn btn-outline">Contact Support</a>
                </div>
            </div>
        `;

    document.querySelector(".faq-wrapper").appendChild(message);

    // Add styles for no results message
    addNoResultsStyles();
  }
}

function clearSearch() {
  const searchInput = document.getElementById("faqSearch");
  if (searchInput) {
    searchInput.value = "";
    performSearch("");
  }
}

// Chat Button
function setupChatButton() {
  const chatBtn = document.getElementById("startChat");

  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      const chatWidget = document.getElementById("chatWidget");
      if (chatWidget) {
        chatWidget.classList.add("active");

        setTimeout(() => {
          if (window.NMCN && window.NMCN.addChatMessage) {
            window.NMCN.addChatMessage(
              "Hello! I noticed you're browsing our FAQ. Is there something specific I can help you find?",
              false
            );
          }
        }, 500);
      }
    });
  }
}

// Add No Results Styles
function addNoResultsStyles() {
  if (document.querySelector("#no-results-styles")) return;

  const styles = `
        .no-results-message {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            margin: 2rem 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .no-results-content i {
            font-size: 3rem;
            color: #9ca3af;
            margin-bottom: 1rem;
        }
        
        .no-results-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .no-results-content p {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .no-results-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .no-results-actions .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .no-results-actions .btn-primary {
            background: linear-gradient(135deg, #059669, #10B981);
            color: white;
        }
        
        .no-results-actions .btn-outline {
            background: transparent;
            color: #059669;
            border: 2px solid #059669;
        }
        
        @media (max-width: 480px) {
            .no-results-message {
                padding: 2rem 1rem;
            }
            
            .no-results-actions {
                flex-direction: column;
            }
        }
    `;

  const style = document.createElement("style");
  style.id = "no-results-styles";
  style.textContent = styles;
  document.head.appendChild(style);
}

// Smooth scrolling for anchor links within FAQ
document.addEventListener("click", (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Auto-expand FAQ item if URL has hash
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement && targetElement.classList.contains("faq-item")) {
      targetElement.classList.add("active");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
});

// Export for global access
window.clearSearch = clearSearch;
