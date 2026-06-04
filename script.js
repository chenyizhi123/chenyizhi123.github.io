const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navItems = [...document.querySelectorAll(".nav-links a")];
const sections = navItems
  .map((item) => document.querySelector(item.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = () => {
  let current = null;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= 96) {
      current = section;
    }
  });
  const activeId = current ? `#${current.id}` : "#top";
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.getAttribute("href") === activeId);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();
