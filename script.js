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
      const delay = el.closest('.rows, .xrows') ? Array.from(el.parentElement.children).indexOf(el) * 60 : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

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

// Live local clock in the menu sidebar
const clockEl = document.getElementById('liveClock');
function tickClock() {
  clockEl.textContent = new Date().toLocaleTimeString([], { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);
