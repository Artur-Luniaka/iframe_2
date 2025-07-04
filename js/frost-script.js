// Winter-themed JavaScript with unique function names
const sleighQueue = [];
let frostAnimationId = null;
const snowflakeCollection = [];
let shoutsSwipeInited = false;
let shoutsSwipeHandlers = null;

// --- Frost Map Adventure Section Popup ---
const frostMapTracks = {
  lake: {
    title: "Frozen Lake Run",
    desc: "Glide across the crystal lake with icy speed and smooth curves.",
  },
  mountain: {
    title: "Mountain Peak Descent",
    desc: "Race down steep slopes and dodge frosty obstacles.",
  },
  forest: {
    title: "Forest Trail Adventure",
    desc: "Weave through enchanted woods and magical snowdrifts.",
  },
};

function setupFrostMapPopup() {
  const popup = document.getElementById("frostMapPopup");
  const popupTitle = document.getElementById("frostMapPopupTitle");
  const popupDesc = document.getElementById("frostMapPopupDesc");
  const popupClose = document.getElementById("frostMapPopupClose");
  const tracks = document.querySelectorAll(".frost-map-track");
  let current = null;

  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      const key = track.getAttribute("data-track");
      if (!key || !frostMapTracks[key]) return;
      if (current === key && popup.classList.contains("active")) {
        popup.classList.remove("active");
        current = null;
        return;
      }
      popupTitle.textContent = frostMapTracks[key].title;
      popupDesc.textContent = frostMapTracks[key].desc;
      popup.classList.add("active");
      current = key;
    });
  });
  if (popupClose) {
    popupClose.addEventListener("click", () => {
      popup.classList.remove("active");
      current = null;
    });
  }
  // Закрытие по клику вне попапа
  document.addEventListener("click", (e) => {
    if (
      !popup.contains(e.target) &&
      ![...tracks].some((t) => t.contains(e.target))
    ) {
      popup.classList.remove("active");
      current = null;
    }
  });
}

// Initialize the winter wonderland
function initializeWinterWonderland() {
  loadHeaderAndFooter();
  loadDynamicContent();
  setupMobileMenu();
  updateCopyrightYear();
  setupContactForm();
  setupFrostMapPopup();
}

// Load header and footer dynamically
async function loadHeaderAndFooter() {
  try {
    const headerResponse = await fetch("header.html");
    const footerResponse = await fetch("footer.html");

    const headerContent = await headerResponse.text();
    const footerContent = await footerResponse.text();

    document.body.insertAdjacentHTML("afterbegin", headerContent);
    document.body.insertAdjacentHTML("beforeend", footerContent);

    setupMobileMenu();
  } catch (error) {
    console.error("Failed to load header or footer:", error);
  }
}

// Setup mobile menu functionality
function setupMobileMenu() {
  const burgerBtn = document.getElementById("burger-snow-btn");
  const mobileMenu = document.getElementById("mobile-snow-menu");

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      burgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      if (mobileMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });

    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll(".mobile-nav-snow-link");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        burgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    });
  }
}

// Load dynamic content from JSON files
async function loadDynamicContent() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  try {
    if (currentPage === "index.html" || currentPage === "") {
      await loadRidingTips();
      await loadTestimonials();
    } else if (currentPage === "sled-log.html") {
      await loadUpdates();
      await loadNotes();
    } else if (currentPage === "northpole-contacts.html") {
      await loadContactInfo();
    }
  } catch (error) {
    console.error("Failed to load dynamic content:", error);
  }
}

// Load riding tips from JSON
async function loadRidingTips() {
  try {
    const response = await fetch("json/riding-tips.json");
    const tipsData = await response.json();

    const container = document.getElementById("riding-tips-container");
    if (!container) return;

    container.innerHTML = tipsData.tips
      .map((tip, idx) => {
        const isEmoji = !String(tip.icon).includes(".svg");
        return `
            <div class="timeline-step-card" style="animation-delay: ${
              idx * 0.12
            }s">
              <div class="timeline-step-icon">
                ${
                  isEmoji
                    ? `<span style='font-size:2rem;line-height:1'>${tip.icon}</span>`
                    : `<img src='${tip.icon}' alt='${tip.title}' width='40' height='40' />`
                }
              </div>
              <div class="timeline-step-content">
                <h3 class="timeline-step-title">${tip.title}</h3>
                <p class="timeline-step-desc">${tip.description}</p>
              </div>
            </div>
          `;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load riding tips:", error);
  }
}

// Load testimonials from JSON
let shoutsCurrent = 0;
let shoutsTotal = 0;
let shoutsData = [];
let shoutsLast = 0;

async function loadTestimonials() {
  try {
    const response = await fetch("json/testimonials.json");
    const testimonialsData = await response.json();
    shoutsData = testimonialsData.testimonials;
    shoutsTotal = shoutsData.length;
    shoutsCurrent = 0;
    renderShoutsCarousel();
    setupShoutsCarouselNav();
  } catch (error) {
    console.error("Failed to load testimonials:", error);
  }
}

function renderShoutsCarousel(direction = 0) {
  const container = document.getElementById("testimonials-container");
  if (!container) return;
  let html = "";
  const prev = (shoutsCurrent - 1 + shoutsTotal) % shoutsTotal;
  const next = (shoutsCurrent + 1) % shoutsTotal;
  // Показываем только три карточки
  html += `
    <div class=\"shouts-card shouts-card-side\">\n      <div class=\"shouts-card-name\">�� <span>${shoutsData[prev].name}</span></div>\n      <div class=\"shouts-card-text\">${shoutsData[prev].text}</div>\n    </div>\n  `;
  html += `
    <div class=\"shouts-card main-shouts-card\">\n      <div class=\"shouts-card-name\">🎅 <span>${shoutsData[shoutsCurrent].name}</span></div>\n      <div class=\"shouts-card-text\">${shoutsData[shoutsCurrent].text}</div>\n    </div>\n  `;
  html += `
    <div class=\"shouts-card shouts-card-side\">\n      <div class=\"shouts-card-name\">🎅 <span>${shoutsData[next].name}</span></div>\n      <div class=\"shouts-card-text\">${shoutsData[next].text}</div>\n    </div>\n  `;
  container.innerHTML = html;
  // Анимация появления центральной карточки
  const mainCard = container.querySelector(".main-shouts-card");
  if (mainCard && direction) {
    mainCard.classList.add(direction > 0 ? "slide-in-right" : "slide-in-left");
    setTimeout(
      () => mainCard.classList.remove("slide-in-right", "slide-in-left"),
      700
    );
  }
  // Рендерим индикаторы в отдельный div
  const dotsContainer = document.querySelector(".shouts-slider-dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = shoutsData
      .map(
        (_, i) =>
          `<span class='shouts-slider-dot${
            i === shoutsCurrent ? " active" : ""
          }'></span>`
      )
      .join("");
  }
}

function setupShoutsCarouselNav() {
  const prevBtn = document.getElementById("shoutsPrev");
  const nextBtn = document.getElementById("shoutsNext");
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      const dir = -1;
      shoutsCurrent = (shoutsCurrent - 1 + shoutsTotal) % shoutsTotal;
      renderShoutsCarousel(dir);
    };
    nextBtn.onclick = () => {
      const dir = 1;
      shoutsCurrent = (shoutsCurrent + 1) % shoutsTotal;
      renderShoutsCarousel(dir);
    };
  }
  initShoutsSwipe();
  window.addEventListener("resize", () => {
    if (window.innerWidth < 900) {
      resetShoutsSwipe();
      initShoutsSwipe();
    } else {
      resetShoutsSwipe();
    }
  });
}

function resetShoutsSwipe() {
  const viewport = document.querySelector(".shouts-carousel-viewport");
  if (viewport && shoutsSwipeHandlers) {
    viewport.removeEventListener("touchstart", shoutsSwipeHandlers.touchstart);
    viewport.removeEventListener("touchmove", shoutsSwipeHandlers.touchmove);
    viewport.removeEventListener("touchend", shoutsSwipeHandlers.touchend);
  }
  shoutsSwipeInited = false;
  shoutsSwipeHandlers = null;
}

function initShoutsSwipe() {
  if (shoutsSwipeInited) return;
  const viewport = document.querySelector(".shouts-carousel-viewport");
  if (viewport) {
    let startX = null;
    let isSwiping = false;
    // Touch events
    const touchstart = (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        isSwiping = true;
      }
    };
    const touchmove = (e) => {
      if (!isSwiping || startX === null) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        const dir = dx > 0 ? -1 : 1;
        shoutsCurrent = (shoutsCurrent + dir + shoutsTotal) % shoutsTotal;
        renderShoutsCarousel(dir);
        isSwiping = false;
        startX = null;
      }
    };
    const touchend = () => {
      isSwiping = false;
      startX = null;
    };
    viewport.addEventListener("touchstart", touchstart);
    viewport.addEventListener("touchmove", touchmove);
    viewport.addEventListener("touchend", touchend);
    // Mouse events for desktop swipe
    let mouseDown = false;
    let mouseStartX = null;
    viewport.addEventListener("mousedown", (e) => {
      mouseDown = true;
      mouseStartX = e.clientX;
    });
    viewport.addEventListener("mousemove", (e) => {
      if (!mouseDown || mouseStartX === null) return;
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 40) {
        const dir = dx > 0 ? -1 : 1;
        shoutsCurrent = (shoutsCurrent + dir + shoutsTotal) % shoutsTotal;
        renderShoutsCarousel(dir);
        mouseDown = false;
        mouseStartX = null;
      }
    });
    viewport.addEventListener("mouseup", () => {
      mouseDown = false;
      mouseStartX = null;
    });
    viewport.addEventListener("mouseleave", () => {
      mouseDown = false;
      mouseStartX = null;
    });
    shoutsSwipeHandlers = { touchstart, touchmove, touchend };
    shoutsSwipeInited = true;
  }
}

// Load updates from JSON
async function loadUpdates() {
  try {
    const response = await fetch("json/updates.json");
    const updatesData = await response.json();

    const container = document.getElementById("updates-container");
    if (!container) return;

    container.innerHTML = updatesData.updates
      .map(
        (update) => `
            <div class="frozen-update-card">
                <div class="frozen-update-image">
                    <img src="public/${update.image}" alt="${update.title}" class="frozen-img" />
                    <div class="frozen-overlay"></div>
                </div>
                <div class="frozen-update-content">
                    <div class="frozen-update-header">
                        <h3 class="frozen-update-title">${update.title}</h3>
                        <span class="frozen-update-date">${update.date}</span>
                    </div>
                    <p class="frozen-update-text">${update.content}</p>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Failed to load updates:", error);
  }
}

// Load notes from JSON
async function loadNotes() {
  try {
    const response = await fetch("json/notes.json");
    const notesData = await response.json();

    const container = document.getElementById("notes-container");
    if (!container) return;

    container.innerHTML = notesData.notes
      .map(
        (note) => `
            <div class="claus-note-card">
                <div class="claus-note-icon">🎄</div>
                <div class="claus-note-content">
                    <h3 class="claus-note-title">${note.title}</h3>
                    <p class="claus-note-text">${note.content}</p>
                    <div class="claus-note-meta">
                        <span class="claus-note-date">${note.date}</span>
                        <div class="claus-note-badge">Claus Tip</div>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Failed to load notes:", error);
  }
}

// Load contact information from JSON
async function loadContactInfo() {
  try {
    const response = await fetch("json/contact-info.json");
    const contactData = await response.json();

    const container = document.getElementById("contact-info-container");
    if (!container) return;

    container.innerHTML = `
      <div class="contact-info-item">
        <div class="contact-item-icon">📧</div>
        <div class="contact-item-content">
          <h3 class="contact-item-title">Email</h3>
          <a href="mailto:${contactData.email}" class="contact-item-link">${contactData.email}</a>
        </div>
      </div>
      <div class="contact-info-item">
        <div class="contact-item-icon">📞</div>
        <div class="contact-item-content">
          <h3 class="contact-item-title">Phone</h3>
          <a href="tel:${contactData.phone}" class="contact-item-link">${contactData.phone}</a>
        </div>
      </div>
      <div class="contact-info-item">
        <div class="contact-item-icon">📍</div>
        <div class="contact-item-content">
          <h3 class="contact-item-title">Address</h3>
          <span class="contact-item-text">${contactData.address}</span>
        </div>
      </div>
      <div class="contact-info-item">
        <div class="contact-item-icon">⏰</div>
        <div class="contact-item-content">
          <h3 class="contact-item-title">Business Hours</h3>
          <span class="contact-item-text">Monday - Friday: 9:00 AM - 6:00 PM (GMT+2)</span>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Failed to load contact info:", error);
  }
}

// Update copyright year
function updateCopyrightYear() {
  const yearElement = document.getElementById("current-snow-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Setup contact form
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    // Simulate form submission
    console.log("Form submitted:", formObject);

    // Show success message
    showSuccessMessage();

    // Reset form
    this.reset();
  });
}

// Show success message
function showSuccessMessage() {
  // Прокрутка вверх
  window.scrollTo({ top: 0, behavior: "smooth" });

  const successMessage = document.createElement("div");
  successMessage.className = "success-snow-message";
  successMessage.innerHTML = `
    <span class="success-snow-icon">🎉</span>
    <span class="success-snow-text">Message sent successfully!</span>
  `;
  successMessage.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 32px;
    transform: translateX(-50%) translateY(100%);
    min-width: 260px;
    max-width: 90vw;
    background: linear-gradient(90deg, var(--frost-panel), var(--ice-crystal));
    color: #fff;
    padding: 1.1rem 2.2rem;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(30,58,138,0.18);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.15rem;
    font-weight: 600;
    animation: slideUpSnow 0.6s cubic-bezier(.4,1.6,.6,1) forwards;
  `;

  document.body.appendChild(successMessage);

  setTimeout(() => {
    successMessage.style.animation =
      "slideDownSnow 0.5s cubic-bezier(.4,1.6,.6,1) forwards";
    setTimeout(() => {
      successMessage.remove();
    }, 500);
  }, 3000);
}

// Добавляю новые анимации для уведомления
const style = document.createElement("style");
style.textContent = `
@keyframes slideUpSnow {
  from { transform: translateX(-50%) translateY(100%); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
@keyframes slideDownSnow {
  from { transform: translateX(-50%) translateY(0); opacity: 1; }
  to { transform: translateX(-50%) translateY(100%); opacity: 0; }
}
.success-snow-message .success-snow-icon {
  font-size: 1.5em;
  filter: drop-shadow(0 2px 6px #fff8);
}
`;
document.head.appendChild(style);

// Включаю плавный скролл для всех якорных ссылок
if (typeof document !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}
// JS-фоллбек для Safari/старых браузеров
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", setupSmoothScrolling);

// Add hover effects to cards
function addCardHoverEffects() {
  const cards = document.querySelectorAll(
    ".feature-snow-card, .track-snow-card, .upgrade-snow-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeWinterWonderland();
  setupSmoothScrolling();
  addCardHoverEffects();
});

// Handle window resize
window.addEventListener("resize", function () {
  // Clear existing snowflakes on resize
  snowflakeCollection.forEach((snowflake) => snowflake.remove());
  snowflakeCollection.length = 0;

  // Recreate snowfall effect
  setTimeout(createSnowfallEffect, 100);
});

// Add loading animation
window.addEventListener("load", function () {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease-in";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// В initializeWinterWonderland добавь вызов setupFrostMapPopup после загрузки DOM
const origInit = initializeWinterWonderland;
window.initializeWinterWonderland = function () {
  origInit();
  setupFrostMapPopup();
};

// Cookie bar logic
function setupCookieBar() {
  const bar = document.getElementById("cookie-bar");
  const btn = document.getElementById("cookie-accept-btn");
  if (!bar || !btn) return;
  if (localStorage.getItem("cookieAccepted") === "yes") return;
  bar.style.display = "block";
  btn.addEventListener("click", function () {
    localStorage.setItem("cookieAccepted", "yes");
    bar.style.display = "none";
  });
}
document.addEventListener("DOMContentLoaded", setupCookieBar);
