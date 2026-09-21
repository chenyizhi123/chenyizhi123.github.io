'use strict';
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let framePending = false;
function updateNavigation() {
  let current = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= 150) current = section;
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) current = sections.at(-1);
  for (const link of navLinks) {
    const active = link.getAttribute('href') === '#' + current.id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  }
  framePending = false;
}
window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateNavigation); } }, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
