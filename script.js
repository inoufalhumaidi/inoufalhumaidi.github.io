document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress bar + topbar scrolled state + to-top button
const progress = document.getElementById('scrollProgress');
const topbar = document.getElementById('topbar');
const toTop = document.getElementById('toTop');

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = pct + '%';
  topbar.classList.toggle('scrolled', doc.scrollTop > 8);
  toTop.classList.toggle('show', doc.scrollTop > 500);
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.closest('.cases, .xrows') ? Array.from(el.parentElement.children).indexOf(el) * 60 : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Selected-work accordion: one case open at a time, animated height
const caseToggles = document.querySelectorAll('.row[aria-controls]');
function setCase(btn, panel, open) {
  btn.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  const label = btn.querySelector('.go b');
  if (label) label.textContent = open ? 'Close' : 'Open';
  panel.style.height = panel.scrollHeight + 'px';
  if (open) {
    const done = (e) => {
      if (e && (e.target !== panel || e.propertyName !== 'height')) return;
      panel.style.height = 'auto';
      panel.removeEventListener('transitionend', done);
    };
    panel.addEventListener('transitionend', done);
  } else {
    requestAnimationFrame(() => { panel.style.height = '0px'; });
  }
}
caseToggles.forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (!panel) return;
  panel.style.height = '0px';
  btn.addEventListener('click', () => {
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    caseToggles.forEach((other) => {
      if (other === btn || other.getAttribute('aria-expanded') !== 'true') return;
      setCase(other, document.getElementById(other.getAttribute('aria-controls')), false);
    });
    setCase(btn, panel, willOpen);
  });
});

// Case detail tabs: Situation / Built / Showed
document.querySelectorAll('.case-tabs').forEach((list) => {
  const tabs = [...list.querySelectorAll('.ct-tab')];
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.classList.toggle('on', on);
    });
  }
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => select(tab));
  });
});

// Menu overlay
const menuOverlay = document.getElementById('menuOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');

function openMenu() {
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.querySelectorAll('.menu-list a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Live clock in the menu sidebar, pinned to a placeholder GMT+3 timezone
const clockEls = document.querySelectorAll('[data-clock]');
function tickClock() {
  let t;
  try { t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Riyadh', hour12: false }); }
  catch { t = new Date().toLocaleTimeString([], { hour12: false }); }
  clockEls.forEach((el) => { el.textContent = t; });
}
tickClock();
setInterval(tickClock, 1000);
