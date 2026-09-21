'use strict';

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const progress = document.querySelector('.reading-progress');
let framePending = false;
function updateReadingPosition() {
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 160) current = section;
  }
  const remaining = document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= remaining - 12) current = sections.at(-1);
  for (const link of links) {
    const active = current && link.getAttribute('href') === '#' + current.id;
    link.classList.toggle('is-active', Boolean(active));
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (progress) progress.style.transform = `scaleX(${remaining > 0 ? Math.min(1, Math.max(0, window.scrollY / remaining)) : 0})`;
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateReadingPosition);
  }
}, { passive: true });
window.addEventListener('resize', updateReadingPosition);
updateReadingPosition();

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-button');
const videos = [...document.querySelectorAll('video[data-motion]')];
let userPaused = false;
let revealObserver;
function syncVideo(video) {
  const bounds = video.getBoundingClientRect();
  const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
  if (userPaused || motionPreference.matches || document.hidden || !visible) video.pause();
  else video.play().catch(() => { /* The poster remains visible when autoplay is unavailable. */ });
}
function setMotionState() {
  const paused = userPaused || motionPreference.matches;
  document.body.classList.toggle('motion-paused', paused);
  document.documentElement.classList.toggle('motion-paused', paused);
  document.body.classList.toggle('motion-enabled', !paused);
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.disabled = motionPreference.matches;
    motionButton.setAttribute('aria-label', motionPreference.matches ? 'Animations disabled by your system preference' : paused ? 'Enable animations' : 'Pause animations');
    motionButton.querySelector('.motion-label').textContent = paused ? 'Motion off' : 'Motion on';
    motionButton.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  }
  if (paused) document.querySelectorAll('.reveal.is-pending').forEach(el => el.classList.remove('is-pending'));
  videos.forEach(syncVideo);
}
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const revealElements = [...document.querySelectorAll('.reveal')];
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('is-pending');
  });
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -30px 0px', threshold: 0.06 });
  revealElements.forEach(el => revealObserver.observe(el));
  // Keep document content readable if observation is unavailable or interrupted.
  window.addEventListener('beforeprint', () => revealElements.forEach(el => el.classList.remove('is-pending')));
}
if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => syncVideo(entry.target)), { threshold: 0.1 });
  videos.forEach(video => videoObserver.observe(video));
}
if (motionButton) motionButton.addEventListener('click', () => {
  // A system-level reduced-motion preference remains authoritative.
  if (motionPreference.matches) {
    userPaused = true;
    motionButton.setAttribute('aria-label', 'Animations disabled by your system preference');
    return;
  }
  userPaused = !userPaused;
  setMotionState();
});
motionPreference.addEventListener('change', setMotionState);
document.addEventListener('visibilitychange', () => videos.forEach(syncVideo));
setMotionState();

for (const panel of document.querySelectorAll('[data-spotlight]')) {
  panel.addEventListener('pointermove', event => {
    if (userPaused || motionPreference.matches || event.pointerType !== 'mouse') return;
    const rect = panel.getBoundingClientRect();
    panel.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    panel.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  }, { passive: true });
}
