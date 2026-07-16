// =========================
// Tab Switching
// =========================

const tabs = document.querySelectorAll(".tab");
const tabSections = document.querySelectorAll(".tab-section");
const moreButton = document.querySelector(".more-button");

const portfolioLinks = {
  "graphic-panel": "portfolio-gd.html",
  "fine-art-panel": "portfolio-fa.html",
  "photography-panel": "portfolio-pt.html",
};

function switchTab(selectedTab) {
  const targetId = selectedTab.dataset.tab;
  const targetSection = document.getElementById(targetId);

  if (!targetSection) {
    console.error(`No section found with the id "${targetId}".`);
    return;
  }

  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;

    tab.classList.toggle("active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  tabSections.forEach((section) => {
    const isSelected = section.id === targetId;

    section.classList.toggle("active", isSelected);
    section.hidden = !isSelected;
  });

  // Change the More button based on the active tab
  if (moreButton && portfolioLinks[targetId]) {
    moreButton.href = portfolioLinks[targetId];
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    switchTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    let newIndex = index;

    if (event.key === "ArrowRight") {
      newIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      newIndex = 0;
    } else if (event.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    tabs[newIndex].focus();
    switchTab(tabs[newIndex]);
  });
});

// =========================
// Lightbox
// =========================

const projectCards = document.querySelectorAll(".project-card");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById(
  "lightboxDescription"
);

let lastFocusedElement = null;

function openLightbox(card) {
  const image = card.querySelector("img");

  if (!image || !lightbox) {
    return;
  }

  lastFocusedElement = document.activeElement;

  const previewImage = document.createElement("img");
  previewImage.src = image.src;
  previewImage.alt = image.alt;

  lightboxImage.replaceChildren(previewImage);

  lightboxTitle.textContent =
    card.dataset.title || image.alt || "Portfolio project";

  lightboxDescription.textContent =
    card.dataset.description || "";

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  lightboxImage.replaceChildren();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    openLightbox(card);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    lightbox?.classList.contains("open")
  ) {
    closeLightbox();
  }
});

// =========================
// Initial Tab
// =========================

const initialTab =
  document.querySelector(".tab.active") || tabs[0];

if (initialTab) {
  switchTab(initialTab);
}