'use strict';

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toast helper
  const toastEl = $('#toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // Copy email buttons
  $$('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const addr = btn.dataset.copyEmail;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(() => showToast(`Copied ${addr}`)).catch(() => showToast(addr));
      } else {
        showToast(addr);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 1. Scroll-spy Top Navigation
  // ------------------------------------------------------------------------
  const navLinks = $$('.nav-links a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  let scrollQueued = false;

  function updateActiveNav() {
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= 120) current = sec;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 16) {
      current = sections[sections.length - 1];
    }
    for (const link of navLinks) {
      const active = Boolean(current && link.hash === '#' + current.id);
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateActiveNav);
    }
  }, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  // ------------------------------------------------------------------------
  // 2. Hero Interactive Live Robot Reel (5 real-hardware & sim clips)
  // ------------------------------------------------------------------------
  const REEL_CLIPS = [
    {
      src: 'assets/videos/zeta0_tidy_720p.mp4',
      poster: 'assets/videos/zeta0_tidy_poster.jpg',
      badge: 'ζ₀ · Unitree G1 Autonomous Rollout',
      caption: 'Continuous 5-stage scene tidying on a physical Unitree G1 with joint scene-and-body foresight.',
      link: 'https://chenyizhi123.github.io/zeta0-project/',
      linkText: 'ζ₀ Project ↗'
    },
    {
      src: 'assets/videos/zeta0_hair_720p.mp4',
      poster: 'assets/videos/zeta0_hair_poster.jpg',
      badge: 'ζ₀ · Human-Robot Interaction (G1)',
      caption: 'Closed-loop hair drying near a person with sustained dual-arm coordination (10/10 trials).',
      link: 'https://chenyizhi123.github.io/zeta0-project/',
      linkText: 'ζ₀ Project ↗'
    },
    {
      src: 'assets/videos/zeta0_sim_720p.mp4',
      poster: 'assets/videos/zeta0_sim_poster.jpg',
      badge: 'ζ₀ · HumanoidArena 7-Task Policy',
      caption: 'One shared World Action Model achieves 79.5% mean success across all seven HumanoidArena tasks.',
      link: 'https://chenyizhi123.github.io/zeta0-project/',
      linkText: 'ζ₀ Project ↗'
    },
    {
      src: 'assets/geoalign-real-robot.mp4',
      poster: 'assets/geoalign-real-robot.jpg',
      badge: 'GeoAlign · ALOHA (CoRL 2026)',
      caption: 'State-guided spatial alignment brings fine-grained 3D geometry into real-world VLA manipulation.',
      link: 'https://chenyizhi123.github.io/geoalign-project/',
      linkText: 'GeoAlign ↗'
    },
    {
      src: 'assets/unilab-sharpa.mp4',
      poster: 'assets/unilab-sharpa.jpg',
      badge: 'UniLab · Heterogeneous RL (CoRL 2026)',
      caption: 'Decoupling CPU physics simulation and GPU policy learning for scalable cross-platform robot RL.',
      link: 'https://unilabsim.github.io/',
      linkText: 'UniLab ↗'
    }
  ];

  const reelVideo = $('#reelVideo');
  const reelStage = $('#reelStage');
  const reelBadgeText = $('#reelBadgeText');
  const reelCaption = $('#reelCaption');
  const reelProjectLink = $('#reelProjectLink');
  const reelProgressFill = $('#reelProgressFill');
  const reelPlayPause = $('#reelPlayPause');
  const reelTabs = $$('.reel-tab');
  let reelIdx = 0;
  let reelUserPaused = false;

  function syncReelIcon() {
    if (!reelPlayPause || !reelVideo) return;
    const paused = reelVideo.paused;
    $('.ic-pause', reelPlayPause).hidden = paused;
    $('.ic-play', reelPlayPause).hidden = !paused;
  }

  function loadReelClip(idx, autoplay = true) {
    reelIdx = (idx + REEL_CLIPS.length) % REEL_CLIPS.length;
    const clip = REEL_CLIPS[reelIdx];
    reelTabs.forEach((t, i) => {
      const active = i === reelIdx;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    if (reelBadgeText) reelBadgeText.textContent = clip.badge;
    if (reelCaption) reelCaption.textContent = clip.caption;
    if (reelProjectLink) {
      reelProjectLink.href = clip.link;
      reelProjectLink.textContent = clip.linkText;
    }
    if (reelProgressFill) reelProgressFill.style.width = '0%';
    if (reelVideo) {
      reelVideo.pause();
      reelVideo.src = clip.src;
      reelVideo.poster = clip.poster;
      reelVideo.load();
      if (autoplay && !reelUserPaused) {
        reelVideo.play().catch(() => {});
      }
      syncReelIcon();
    }
  }

  if (reelVideo) {
    reelTabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        reelUserPaused = false;
        loadReelClip(Number(btn.dataset.reelIdx), true);
      });
    });

    reelVideo.addEventListener('timeupdate', () => {
      if (reelVideo.duration && reelProgressFill) {
        reelProgressFill.style.width = `${(reelVideo.currentTime / reelVideo.duration) * 100}%`;
      }
    });

    reelVideo.addEventListener('ended', () => {
      loadReelClip(reelIdx + 1, true);
    });

    reelVideo.addEventListener('play', syncReelIcon);
    reelVideo.addEventListener('pause', syncReelIcon);

    const toggleReel = () => {
      if (reelVideo.paused) {
        reelUserPaused = false;
        reelVideo.play().catch(() => {});
      } else {
        reelUserPaused = true;
        reelVideo.pause();
      }
      syncReelIcon();
    };

    if (reelPlayPause) {
      reelPlayPause.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleReel();
      });
    }
    if (reelStage) {
      reelStage.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        toggleReel();
      });
    }
  }

  // ------------------------------------------------------------------------
  // 3. Publication Card Media Switchers (Live Demo Video <-> Architecture)
  // ------------------------------------------------------------------------
  $$('[data-media-switcher]').forEach((box) => {
    const panes = $$('[data-pane]', box);
    const btns = $$('[data-switch]', box);
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = btn.dataset.switch;
        btns.forEach((b) => b.classList.toggle('active', b === btn));
        panes.forEach((pane) => {
          const isActive = pane.dataset.pane === target;
          pane.classList.toggle('active', isActive);
          const v = $('video', pane);
          if (v) {
            if (isActive) v.play().catch(() => {});
            else v.pause();
          }
        });
      });
    });
  });

  // ------------------------------------------------------------------------
  // 4. Viewport-aware Autoplay (pauses offscreen videos smoothly)
  // ------------------------------------------------------------------------
  const autoVideos = $$('.auto-vis-video');
  if ('IntersectionObserver' in window) {
    const vidObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const v = entry.target;
        const pane = v.closest('[data-pane]');
        const paneActive = !pane || pane.classList.contains('active');
        if (entry.isIntersecting && paneActive) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      }
    }, { threshold: 0.2 });

    autoVideos.forEach((v) => vidObserver.observe(v));

    if (reelVideo) {
      const reelObs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reelUserPaused) reelVideo.play().catch(() => {});
          else reelVideo.pause();
        }
      }, { threshold: 0.15 });
      reelObs.observe(reelVideo);
    }
  }

  // ------------------------------------------------------------------------
  // 5. Research Explorer (Topic + Status + Instant Search)
  // ------------------------------------------------------------------------
  const explorer = $('#publicationExplorer');
  const paperSearch = $('#paper-search');
  const cards = $$('.pub-card');
  const filterSummary = $('#filterSummary');
  const explorerDesc = $('#explorerDesc');
  const resetBtn = $('#resetResearch');
  const clearBtn = $('#clearResearch');
  const emptyState = $('#researchEmpty');
  const normalizeText = (s) => (s || '').normalize('NFKC').toLowerCase().trim();

  let activeTopic = 'all';
  let activeStatus = 'all';

  const TOPIC_DESCS = {
    all: 'Explore connections across world action models, geometry-aware VLA policies, and whole-body robot control.',
    vla: 'Humanoid World Action Models, state-guided spatial alignment, and perception-driven policies.',
    locomotion: 'Whole-body humanoid control, perceptive terrain walking, and resilient legged locomotion.',
    rl: 'Hierarchical RL, stochastic latent policies, assistive curricula, and heterogeneous training systems.'
  };

  function applyFilters() {
    if (!explorer) return;
    const q = normalizeText(paperSearch ? paperSearch.value : '');
    let visible = 0;

    for (const card of cards) {
      const topics = (card.dataset.topics || '').split(/\s+/);
      const status = card.dataset.status || 'accepted';
      const topicOk = activeTopic === 'all' || topics.includes(activeTopic);
      const statusOk = activeStatus === 'all' || activeStatus === status;
      const hay = normalizeText(card.textContent + ' ' + (card.dataset.keywords || ''));
      const queryOk = !q || hay.includes(q);
      const show = topicOk && statusOk && queryOk;
      card.hidden = !show;
      if (show) visible++;
    }

    $$('.group-bar').forEach((bar) => {
      const container = bar.nextElementSibling;
      const count = $$('.pub-card', container).filter((c) => !c.hidden).length;
      bar.hidden = container.hidden = count === 0;
      const badge = $('.group-count', bar);
      if (badge) badge.textContent = String(count).padStart(2, '0') + (count === 1 ? ' paper' : ' papers');
    });

    $$('[data-topic-filter]').forEach((b) => {
      const on = b.dataset.topicFilter === activeTopic;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('[data-status-filter]').forEach((b) => {
      const on = b.dataset.statusFilter === activeStatus;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    if (explorerDesc) explorerDesc.textContent = TOPIC_DESCS[activeTopic] || TOPIC_DESCS.all;
    if (filterSummary) filterSummary.textContent = `Showing ${visible} of ${cards.length} publications`;
    if (resetBtn) resetBtn.hidden = (activeTopic === 'all' && activeStatus === 'all' && !q);
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function resetFilters() {
    activeTopic = 'all';
    activeStatus = 'all';
    if (paperSearch) paperSearch.value = '';
    applyFilters();
  }

  if (explorer) {
    $$('[data-topic-filter]').forEach((b) => b.addEventListener('click', () => { activeTopic = b.dataset.topicFilter; applyFilters(); }));
    $$('[data-status-filter]').forEach((b) => b.addEventListener('click', () => { activeStatus = b.dataset.statusFilter; applyFilters(); }));
    if (paperSearch) paperSearch.addEventListener('input', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (clearBtn) clearBtn.addEventListener('click', resetFilters);
    applyFilters();
  }

  // Reveal & highlight target publication when jumping from News or Cmd+K
  function revealAnchor(hash) {
    if (!hash || hash.length < 2) return;
    const card = cards.find((c) => '#' + c.id === hash);
    if (!card) return;
    if (card.hidden) resetFilters();
    card.classList.remove('is-flash');
    void card.offsetWidth;
    card.classList.add('is-flash');
    setTimeout(() => card.classList.remove('is-flash'), 1600);
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) revealAnchor(link.hash);
  });
  window.addEventListener('hashchange', () => revealAnchor(location.hash));

  // ------------------------------------------------------------------------
  // 6. Zoomable Pan/Drag Figure Lightbox
  // ------------------------------------------------------------------------
  const dialog = $('.figure-dialog');
  let returnFocus = null;
  if (dialog && typeof dialog.showModal === 'function') {
    const img = $('img', dialog);
    const title = $('h2', dialog);
    const original = $('.original-link', dialog);
    const viewport = $('.dialog-image-area', dialog);
    const stage = $('.image-stage', dialog);
    const zoomIn = $('.zoom-in', dialog);
    const zoomOut = $('.zoom-out', dialog);
    const zoomValue = $('.zoom-value', dialog);
    let scale = 1;
    let drag = null;

    function renderZoom(next = scale) {
      if (!dialog.open || !img.naturalWidth) return;
      scale = Math.max(1, Math.min(4, next));
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      const fit = Math.min((w - 32) / img.naturalWidth, (h - 32) / img.naturalHeight, 1);
      const width = Math.round(img.naturalWidth * fit * scale);
      const height = Math.round(img.naturalHeight * fit * scale);
      const x = (viewport.scrollLeft + w / 2) / Math.max(stage.offsetWidth, 1);
      const y = (viewport.scrollTop + h / 2) / Math.max(stage.offsetHeight, 1);
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
      stage.style.width = `${Math.max(w, width + 32)}px`;
      stage.style.height = `${Math.max(h, height + 32)}px`;
      viewport.scrollLeft = scale === 1 ? 0 : x * stage.offsetWidth - w / 2;
      viewport.scrollTop = scale === 1 ? 0 : y * stage.offsetHeight - h / 2;
      zoomValue.textContent = `${Math.round(scale * 100)}%`;
      zoomIn.disabled = scale >= 4;
      zoomOut.disabled = scale <= 1;
      viewport.classList.toggle('is-zoomed', scale > 1);
    }

    const resetZoom = () => renderZoom(1);
    zoomIn.addEventListener('click', () => renderZoom(scale + 0.5));
    zoomOut.addEventListener('click', () => renderZoom(scale - 0.5));
    $('.zoom-fit', dialog).addEventListener('click', resetZoom);
    img.addEventListener('load', resetZoom);

    dialog.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['+', '=', '-', '0'].includes(e.key)) {
        e.preventDefault();
        renderZoom(e.key === '0' ? 1 : scale + (e.key === '-' ? -0.5 : 0.5));
      }
    });

    viewport.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0 || scale <= 1) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
      e.preventDefault();
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      viewport.scrollLeft = drag.left - (e.clientX - drag.x);
      viewport.scrollTop = drag.top - (e.clientY - drag.y);
    });
    const endDrag = () => { drag = null; viewport.classList.remove('is-dragging'); };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);
    new ResizeObserver(() => renderZoom()).observe(viewport);

    $$('[data-figure]').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        returnFocus = link;
        img.src = link.href;
        img.alt = $('img', link)?.alt || '';
        title.textContent = link.dataset.caption || 'Figure preview';
        original.href = link.href;
        dialog.showModal();
        resetZoom();
      });
    });

    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      endDrag();
      if (returnFocus) returnFocus.focus({ preventScroll: true });
    });
  }

  // ------------------------------------------------------------------------
  // 7. Quick Navigation Command Palette (Cmd+K / Ctrl+K)
  // ------------------------------------------------------------------------
  const cmdDialog = $('.command-dialog');
  const cmdTrigger = $('.command-trigger');
  if (cmdDialog && typeof cmdDialog.showModal === 'function' && cmdTrigger) {
    const input = $('input', cmdDialog);
    const results = $('.command-results', cmdDialog);
    const entries = [
      ...navLinks.map((l) => ({ label: l.textContent.trim(), href: l.hash, kind: 'Section', keywords: l.textContent })),
      ...cards.map((c) => {
        const a = $('.pub-title a', c);
        const firstText = a && a.firstChild ? a.firstChild.textContent.trim() : c.id;
        return { label: firstText, href: '#' + c.id, kind: 'Publication', keywords: c.textContent + ' ' + (c.dataset.keywords || '') };
      })
    ];
    let prevFocus = null;
    let linksRendered = [];

    function renderCmds() {
      const q = normalizeText(input.value);
      results.replaceChildren();
      linksRendered = [];
      for (const item of entries.filter((e) => normalizeText(e.label + ' ' + e.keywords).includes(q))) {
        const a = document.createElement('a');
        a.href = item.href;
        a.append(document.createTextNode(item.label));
        const tag = document.createElement('span');
        tag.textContent = `${item.kind} ↗`;
        a.append(tag);
        a.addEventListener('click', () => {
          revealAnchor(item.href);
          cmdDialog.close();
        });
        results.append(a);
        linksRendered.push(a);
      }
      $('.command-empty', cmdDialog).hidden = linksRendered.length !== 0;
    }

    function openCmd() {
      if (cmdDialog.open) { cmdDialog.close(); return; }
      if (dialog?.open) dialog.close();
      prevFocus = document.activeElement;
      input.value = '';
      renderCmds();
      cmdDialog.showModal();
      input.focus();
    }

    const kbd = $('kbd', cmdTrigger);
    if (kbd) kbd.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
    cmdTrigger.addEventListener('click', openCmd);
    $('.command-close', cmdDialog).addEventListener('click', () => cmdDialog.close());
    input.addEventListener('input', renderCmds);

    cmdDialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); cmdDialog.close(); return; }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && linksRendered.length) {
        e.preventDefault();
        const idx = linksRendered.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown'
          ? (idx + 1) % linksRendered.length
          : (idx < 0 ? linksRendered.length - 1 : (idx - 1 + linksRendered.length) % linksRendered.length);
        linksRendered[next].focus();
      } else if (e.key === 'Enter' && e.target === input && linksRendered.length) {
        e.preventDefault();
        linksRendered[0].click();
      }
    });

    cmdDialog.addEventListener('click', (e) => {
      if (e.target !== cmdDialog) return;
      const r = cmdDialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) cmdDialog.close();
    });
    cmdDialog.addEventListener('close', () => {
      if (prevFocus?.isConnected) prevFocus.focus({ preventScroll: true });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmd();
      } else if (
        e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey &&
        !cmdDialog.open && !dialog?.open &&
        !e.target.closest('input,textarea,[contenteditable=true]')
      ) {
        e.preventDefault();
        if (paperSearch) {
          paperSearch.scrollIntoView({ block: 'center' });
          paperSearch.focus({ preventScroll: true });
        }
      }
    });
  }
})();
