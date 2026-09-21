'use strict';
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
let queued = false;
function markSection() {
  let current = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= 140) current = section;
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12) current = sections.at(-1);
  for (const link of navLinks) {
    const active = current && link.hash === '#' + current.id;
    link.classList.toggle('is-active', Boolean(active));
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  }
  queued = false;
}
window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(markSection); } }, { passive: true });
window.addEventListener('resize', markSection);
markSection();

const dialog = document.querySelector('.figure-dialog');
let returnFocus;
if (dialog && typeof dialog.showModal === 'function') {
  const img = dialog.querySelector('img');
  const title = dialog.querySelector('h2');
  const original = dialog.querySelector('.original-link');
  for (const link of document.querySelectorAll('[data-figure]')) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = link;
      img.src = link.href;
      img.alt = link.querySelector('img').alt;
      title.textContent = link.dataset.caption;
      original.href = link.href;
      dialog.showModal();
    });
  }
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (returnFocus) returnFocus.focus({ preventScroll: true }); });
}
