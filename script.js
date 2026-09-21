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
  const viewport = dialog.querySelector('.dialog-image-area');
  const stage = dialog.querySelector('.image-stage');
  const zoomIn = dialog.querySelector('.zoom-in');
  const zoomOut = dialog.querySelector('.zoom-out');
  const zoomValue = dialog.querySelector('.zoom-value');
  let scale = 1;
  let drag = null;
  function renderZoom(next = scale) {
    if (!dialog.open || !img.naturalWidth) return;
    scale = Math.max(1, Math.min(4, next));
    const w = viewport.clientWidth, h = viewport.clientHeight;
    const fit = Math.min((w - 32) / img.naturalWidth, (h - 32) / img.naturalHeight, 1);
    const width = Math.round(img.naturalWidth * fit * scale);
    const height = Math.round(img.naturalHeight * fit * scale);
    const x = (viewport.scrollLeft + w / 2) / Math.max(stage.offsetWidth, 1);
    const y = (viewport.scrollTop + h / 2) / Math.max(stage.offsetHeight, 1);
    img.style.width = width + 'px';
    img.style.height = height + 'px';
    stage.style.width = Math.max(w, width + 32) + 'px';
    stage.style.height = Math.max(h, height + 32) + 'px';
    viewport.scrollLeft = scale === 1 ? 0 : x * stage.offsetWidth - w / 2;
    viewport.scrollTop = scale === 1 ? 0 : y * stage.offsetHeight - h / 2;
    zoomValue.textContent = Math.round(scale * 100) + '%';
    zoomIn.disabled = scale >= 4;
    zoomOut.disabled = scale <= 1;
    viewport.classList.toggle('is-zoomed', scale > 1);
  }
  function resetZoom() { renderZoom(1); }
  zoomIn.addEventListener('click', () => renderZoom(scale + .5));
  zoomOut.addEventListener('click', () => renderZoom(scale - .5));
  dialog.querySelector('.zoom-fit').addEventListener('click', resetZoom);
  img.addEventListener('load', resetZoom);
  dialog.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (['+', '=', '-', '0'].includes(event.key)) {
      event.preventDefault();
      renderZoom(event.key === '0' ? 1 : scale + (event.key === '-' ? -.5 : .5));
    }
  });
  // Native overflow handles touch panning and keyboard arrows; pointer capture adds mouse dragging.
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0 || scale <= 1) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
    viewport.focus({ preventScroll: true });
    event.preventDefault();
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewport.scrollTop = drag.top - (event.clientY - drag.y);
  });
  function endDrag() { drag = null; viewport.classList.remove('is-dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  new ResizeObserver(() => renderZoom()).observe(viewport);
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
      resetZoom();
    });
  }
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { endDrag(); if (returnFocus) returnFocus.focus({ preventScroll: true }); });
}
