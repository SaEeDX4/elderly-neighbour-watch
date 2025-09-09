// inject-layout.js - Header and Footer injection for consistent layout

function initializeLayout(currentPage) {
  injectHeader(currentPage);
  injectFooter();
  initializeNavigation();
}

function injectHeader(currentPage) {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  const headerHTML = `
    <div class="container">
      <div class="header-content">
        <a href="index.html" class="logo">
          <img src="./assets/img/logo.svg" alt="ENW Logo" class="logo-img" width="40" height="40">
          <span>ENW</span>
        </a>
        
        <nav id="main-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="index.html" class="${
              currentPage === "home" ? "active" : ""
            }">Home</a></li>
            <li><a href="about.html" class="${
              currentPage === "about" ? "active" : ""
            }">About</a></li>
            <li><a href="seniors.html" class="${
              currentPage === "seniors" ? "active" : ""
            }">Need Help</a></li>
            <li><a href="volunteers.html" class="${
              currentPage === "volunteers" ? "active" : ""
            }">Volunteer</a></li>
            <li><a href="donate.html" class="${
              currentPage === "donate" ? "active" : ""
            }">Donate</a></li>
            <li><a href="contact.html" class="${
              currentPage === "contact" ? "active" : ""
            }">Contact</a></li>
            ${
              currentPage === "admin"
                ? '<li><a href="admin.html" class="active">Admin</a></li>'
                : ""
            }
          </ul>
        </nav>

        <div class="header-utils">
          <button type="button" class="text-size-toggle" onclick="toggleTextSize()" aria-label="Toggle larger text size">
            A+
          </button>
          <button type="button" class="nav-toggle" onclick="toggleMobileNav()" aria-label="Toggle navigation menu">
            ☰
          </button>
        </div>
      </div>
    </div>
  `;

  headerPlaceholder.innerHTML = headerHTML;
}

function injectFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  const footerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Services</h3>
          <a href="seniors.html">Request Help</a>
          <a href="volunteers.html">Become a Volunteer</a>
          <a href="about.html">How It Works</a>
          <a href="contact.html">Get Support</a>
        </div>
        
        <div class="footer-section">
          <h3>Support</h3>
          <a href="donate.html">Make a Donation</a>
          <a href="contact.html">Contact Us</a>
          <a href="contact.html">Help Center</a>
          <a href="contact.html">Volunteer Resources</a>
        </div>
        
        <div class="footer-section">
          <h3>Organization</h3>
          <a href="about.html">Our Mission</a>
          <a href="about.html">Our Impact</a>
          <a href="contact.html">Partner With Us</a>
          <a href="contact.html">Careers</a>
        </div>
        
        <div class="footer-section">
          <h3>Legal</h3>
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Service</a>
          <a href="contact.html">Report a Concern</a>
          <a href="contact.html">Accessibility</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Elderly Neighbour Watch. All rights reserved.</p>
        <p>Building stronger communities through neighborly care.</p>
      </div>
    </div>
  `;

  footerPlaceholder.innerHTML = footerHTML;
}

function initializeNavigation() {
  // Set up mobile navigation toggle
  const nav = document.getElementById("main-nav");

  // Close mobile nav when clicking outside
  document.addEventListener("click", function (event) {
    const navToggle = document.querySelector(".nav-toggle");
    const isClickInsideNav = nav && nav.contains(event.target);
    const isNavToggle = navToggle && navToggle.contains(event.target);

    if (
      !isClickInsideNav &&
      !isNavToggle &&
      nav &&
      nav.classList.contains("open")
    ) {
      nav.classList.remove("open");
    }
  });

  // Handle keyboard navigation
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      document.querySelector(".nav-toggle").focus();
    }
  });
}

function toggleMobileNav() {
  const nav = document.getElementById("main-nav");
  if (nav) {
    nav.classList.toggle("open");
  }
}

function toggleTextSize() {
  document.body.classList.toggle("large-text");

  // Save preference to localStorage (if available)
  try {
    const isLargeText = document.body.classList.contains("large-text");
    localStorage.setItem("enw-large-text", isLargeText ? "true" : "false");
  } catch (error) {
    // localStorage not available, continue without saving
    console.log("Could not save text size preference");
  }

  // Update button text
  const button = document.querySelector(".text-size-toggle");
  if (button) {
    button.textContent = document.body.classList.contains("large-text")
      ? "A-"
      : "A+";
    button.setAttribute(
      "aria-label",
      document.body.classList.contains("large-text")
        ? "Switch to normal text size"
        : "Switch to larger text size"
    );
  }
}

// Initialize text size preference on page load
document.addEventListener("DOMContentLoaded", function () {
  try {
    const savedPreference = localStorage.getItem("enw-large-text");
    if (savedPreference === "true") {
      document.body.classList.add("large-text");
      const button = document.querySelector(".text-size-toggle");
      if (button) {
        button.textContent = "A-";
        button.setAttribute("aria-label", "Switch to normal text size");
      }
    }
  } catch (error) {
    // localStorage not available, use default
    console.log("Could not load text size preference");
  }
});

// Export functions for use in other scripts
if (typeof window !== "undefined") {
  window.initializeLayout = initializeLayout;
  window.toggleMobileNav = toggleMobileNav;
  window.toggleTextSize = toggleTextSize;
}
