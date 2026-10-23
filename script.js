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

// Paper exploration enhances the static list; all papers remain readable without JavaScript.
const explorer = document.querySelector('.publication-explorer');
const paperSearch = document.querySelector('#paper-search');
const cards = [...document.querySelectorAll('.paper-card')];
const normalizeText = value => value.normalize('NFKC').toLowerCase().trim();
let researchTopic = 'all';
let researchStatus = 'all';
const topicDescriptions = {
  all: 'Explore connections across robot perception, control, and learning.',
  vla: 'Geometry-aware VLA policies and terrain representations for perception-guided action.',
  locomotion: 'Humanoid skills, legged locomotion, and reliable control on real robots.',
  rl: 'Learning algorithms, motion skills, and scalable infrastructure for robot reinforcement learning.'
};
function filterPublications() {
  if (!explorer) return;
  const query = normalizeText(paperSearch.value);
  let visible = 0;
  for (const card of cards) {
    const topicMatch = researchTopic === 'all' || card.dataset.topics.split(' ').includes(researchTopic);
    const status = card.querySelector('.venue').textContent.includes('Under review') ? 'review' : 'accepted';
    const statusMatch = researchStatus === 'all' || researchStatus === status;
    const queryMatch = !query || normalizeText(card.textContent + ' ' + (card.dataset.keywords || '')).includes(query);
    card.hidden = !(topicMatch && statusMatch && queryMatch);
    if (!card.hidden) visible++;
  }
  for (const heading of document.querySelectorAll('.group-heading')) {
    const grid = heading.nextElementSibling;
    const count = [...grid.querySelectorAll('.paper-card')].filter(card => !card.hidden).length;
    heading.hidden = grid.hidden = count === 0;
    heading.querySelector('span').textContent = String(count).padStart(2, '0') + (count === 1 ? ' paper' : ' papers');
  }
  for (const button of explorer.querySelectorAll('[data-topic-filter]')) {
    button.setAttribute('aria-pressed', String(button.dataset.topicFilter === researchTopic));
  }
  for (const button of explorer.querySelectorAll('[data-status-filter]')) {
    button.setAttribute('aria-pressed', String(button.dataset.statusFilter === researchStatus));
  }
  explorer.querySelector('.lens-description').textContent = topicDescriptions[researchTopic];
  explorer.querySelector('.filter-summary').textContent = `Showing ${visible} of ${cards.length} publications`;
  document.querySelector('.research-empty').hidden = visible !== 0;
}
function resetPublications() {
  researchTopic = researchStatus = 'all';
  if (paperSearch) paperSearch.value = '';
  filterPublications();
}
if (explorer && paperSearch) {
  explorer.hidden = false;
  paperSearch.addEventListener('input', filterPublications);
  for (const button of explorer.querySelectorAll('[data-topic-filter]')) {
    button.addEventListener('click', () => { researchTopic = button.dataset.topicFilter; filterPublications(); });
  }
  for (const button of explorer.querySelectorAll('[data-status-filter]')) {
    button.addEventListener('click', () => { researchStatus = button.dataset.statusFilter; filterPublications(); });
  }
  document.querySelector('.reset-research').addEventListener('click', resetPublications);
  document.querySelector('.clear-research').addEventListener('click', resetPublications);
  filterPublications();
}
// News, quick navigation and shared anchors always reveal their target even after filtering.
function revealHashTarget(hash) {
  const card = cards.find(card => '#' + card.id === hash);
  if (card?.hidden) resetPublications();
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) revealHashTarget(link.hash);
});
window.addEventListener('hashchange', () => revealHashTarget(location.hash));

const commandDialog = document.querySelector('.command-dialog');
const commandTrigger = document.querySelector('.command-trigger');
if (commandDialog && typeof commandDialog.showModal === 'function' && commandTrigger) {
  const input = commandDialog.querySelector('input');
  const results = commandDialog.querySelector('.command-results');
  const entries = [
    ...navLinks.map(link => ({ label: link.textContent, href: link.hash, kind: 'Section', keywords: link.textContent })),
    ...cards.map(card => ({ label: card.querySelector('h4 a').firstChild.textContent.trim(), href: '#' + card.id, kind: 'Publication', keywords: card.textContent + ' ' + (card.dataset.keywords || '') }))
  ];
  let previousFocus;
  let renderedLinks = [];
  function renderCommands() {
    const query = normalizeText(input.value);
    results.replaceChildren();
    renderedLinks = [];
    for (const entry of entries.filter(entry => normalizeText(entry.label + ' ' + entry.keywords).includes(query))) {
      const link = document.createElement('a');
      link.href = entry.href;
      link.append(document.createTextNode(entry.label));
      const kind = document.createElement('span');
      kind.textContent = entry.kind + ' ↗';
      link.append(kind);
      link.addEventListener('click', () => {
        revealHashTarget(entry.href);
        commandDialog.close();
      });
      results.append(link);
      renderedLinks.push(link);
    }
    commandDialog.querySelector('.command-empty').hidden = renderedLinks.length !== 0;
  }
  function openCommands() {
    if (commandDialog.open) { commandDialog.close(); return; }
    if (dialog?.open) dialog.close();
    previousFocus = document.activeElement;
    input.value = '';
    renderCommands();
    commandDialog.showModal();
    input.focus();
  }
  commandTrigger.hidden = false;
  commandTrigger.querySelector('kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  commandTrigger.addEventListener('click', openCommands);
  commandDialog.querySelector('.command-close').addEventListener('click', () => commandDialog.close());
  input.addEventListener('input', renderCommands);
  commandDialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      commandDialog.close();
      return;
    }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && renderedLinks.length) {
      event.preventDefault();
      const index = renderedLinks.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % renderedLinks.length : (index < 0 ? renderedLinks.length - 1 : (index - 1 + renderedLinks.length) % renderedLinks.length);
      renderedLinks[next].focus();
    } else if (event.key === 'Enter' && event.target === input && renderedLinks.length) {
      event.preventDefault();
      renderedLinks[0].click();
    }
  });
  commandDialog.addEventListener('click', event => {
    if (event.target !== commandDialog) return;
    const rect = commandDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) commandDialog.close();
  });
  commandDialog.addEventListener('close', () => { if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommands();
    } else if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !commandDialog.open && !dialog?.open && !event.target.closest('input,textarea,[contenteditable=true]')) {
      event.preventDefault();
      paperSearch.scrollIntoView({ block: 'center' });
      paperSearch.focus({ preventScroll: true });
    }
  });
}
