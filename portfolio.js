const filterTabs = document.querySelectorAll(".filter-tab");
const projects = document.querySelectorAll(".portfolio-project");
const projectCount = document.getElementById("projectCount");
const emptyState = document.getElementById("emptyState");

const lightbox = document.getElementById("portfolioLightbox");
const lightboxClose = document.getElementById(
  "portfolioLightboxClose"
);
const lightboxVisual = document.getElementById(
  "portfolioLightboxVisual"
);
const lightboxCategory = document.getElementById(
  "portfolioLightboxCategory"
);
const lightboxTitle = document.getElementById(
  "portfolioLightboxTitle"
);
const lightboxDescription = document.getElementById(
  "portfolioLightboxDescription"
);

let lastFocusedElement = null;

// Turn category names such as "web-design"
// into "Web Design"
function formatCategory(category) {
  return category
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Update the visible project count
function updateProjectCount(count) {
  if (projectCount) {
    projectCount.textContent =
      `${count} project${count === 1 ? "" : "s"}`;
  }

  if (emptyState) {
    emptyState.hidden = count !== 0;
  }
}

// Show only projects matching the selected filter
function filterProjects(filter) {
  let visibleCount = 0;

  projects.forEach((project, index) => {
    const projectCategory = project.dataset.category;

    const shouldShow =
      filter === "all" || projectCategory === filter;

    project.classList.toggle("is-hidden", !shouldShow);

    if (shouldShow) {
      visibleCount += 1;

      // Restart the card entrance animation
      project.style.animation = "none";

      // Forces the browser to register the animation reset
      void project.offsetHeight;

      project.style.animation = "";
      project.style.animationDelay =
        `${Math.min(index * 45, 270)}ms`;
    }
  });

  updateProjectCount(visibleCount);
}

// Filter-tab click events
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((item) => {
      const isActive = item === tab;

      item.classList.toggle("active", isActive);
      item.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });

    const selectedFilter = tab.dataset.filter || "all";

    filterProjects(selectedFilter);
  });
});

// Open a project in the lightbox
function openProject(project) {
  if (!lightbox || !lightboxVisual) {
    return;
  }

  lastFocusedElement = document.activeElement;

  const originalPreview =
    project.querySelector(".project-preview");

  const sourceImage =
    originalPreview?.querySelector("img");

  const projectTitle =
    project.dataset.title || "Portfolio Project";

  lightboxVisual.replaceChildren();

  let albumImages = [];

  // Read the album images from data-images
  if (project.dataset.images) {
    try {
      albumImages = JSON.parse(project.dataset.images);
    } catch (error) {
      console.error(
        `Could not read images for ${projectTitle}:`,
        error
      );
    }
  }

  // Project has an album
  if (albumImages.length > 0) {
    const gallery = document.createElement("div");
    gallery.className = "portfolio-lightbox-gallery";

    albumImages.forEach((imagePath, index) => {
      const image = document.createElement("img");

      image.src = imagePath;
      image.alt =
        `${projectTitle} project image ${index + 1}`;

      // Load the first image immediately
      image.loading = index === 0 ? "eager" : "lazy";

      gallery.appendChild(image);
    });

    lightboxVisual.appendChild(gallery);
  } else {
    // Fall back to the original single-image system
    const imagePath = project.dataset.image;

    if (imagePath) {
      const image = document.createElement("img");

      image.src = imagePath;

      image.alt =
        sourceImage?.alt ||
        projectTitle ||
        "Project preview";

      lightboxVisual.appendChild(image);
    } else if (originalPreview) {
      // Use a copy of generated card artwork
      const visualClone =
        originalPreview.cloneNode(true);

      visualClone.removeAttribute("aria-label");
      visualClone.tabIndex = -1;

      lightboxVisual.appendChild(visualClone);
    }
  }

  if (lightboxCategory) {
    lightboxCategory.textContent = formatCategory(
      project.dataset.category || "Project"
    );
  }

  if (lightboxTitle) {
    lightboxTitle.textContent = projectTitle;
  }

  if (lightboxDescription) {
    lightboxDescription.textContent =
      project.dataset.description || "";
  }

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  lightboxClose?.focus();
}

// Close the project lightbox
function closeProject() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  // Wait for the closing animation before clearing it
  window.setTimeout(() => {
    lightboxVisual?.replaceChildren();
  }, 300);

  lastFocusedElement?.focus();
}

// Open projects when their preview is clicked
projects.forEach((project) => {
  const preview =
    project.querySelector(".project-preview");

  preview?.addEventListener("click", () => {
    openProject(project);
  });
});

// Close button
lightboxClose?.addEventListener(
  "click",
  closeProject
);

// Close when clicking the dark background
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeProject();
  }
});

// Close with the Escape key
document.addEventListener("keydown", (event) => {
  const lightboxIsOpen =
    lightbox?.classList.contains("open");

  if (event.key === "Escape" && lightboxIsOpen) {
    closeProject();
  }
});

// Start by showing every project
filterProjects("all");
