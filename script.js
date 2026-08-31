document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress bar + topbar scrolled state + to-top button
const progress = document.getElementById('scrollProgress');
const topbar = document.getElementById('topbar');
const toTop = document.getElementById('toTop');

// Work-rail: the accent line down the case list fills and its lit node
// tracks whichever row is nearest the reading line as you scroll.
const workRail = document.querySelector('.work-rail');
const railFill = workRail ? workRail.querySelector('span') : null;
const railRows = document.querySelectorAll('.row .node');

function updateRail() {
  if (!workRail) return;
  const rect = workRail.getBoundingClientRect();
  const readLine = window.innerHeight * 0.4;
  const pct = Math.max(0, Math.min(1, (readLine - rect.top) / rect.height));
  railFill.style.setProperty('--rail', (pct * 100) + '%');
  workRail.style.setProperty('--rail', (pct * 100) + '%');

  let closest = null;
  let closestDist = Infinity;
  railRows.forEach((node) => {
    const d = Math.abs(node.getBoundingClientRect().top - readLine);
    if (d < closestDist) { closestDist = d; closest = node; }
  });
  railRows.forEach((node) => node.classList.toggle('rail-lit', node === closest && closestDist < window.innerHeight));
}

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = pct + '%';
  topbar.classList.toggle('scrolled', doc.scrollTop > 8);
  toTop.classList.toggle('show', doc.scrollTop > 500);
  updateRail();
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Nav active-section tracking: brackets the header link for whichever
// section is currently crossing the reading line, moving as you scroll
const navLinks = [...document.querySelectorAll('.topnav a[href^="#"]')];
const navSections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
if (navSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  navSections.forEach((s) => navObserver.observe(s));
}

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

// Safety net: if the observer never fires (unexpected error, odd viewport),
// nothing should stay invisible forever.
setTimeout(() => {
  if (!document.querySelector('.reveal.visible')) {
    revealEls.forEach(el => el.classList.add('visible'));
  }
}, 3000);

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
const menuToggleLabel = menuToggle.querySelector('span');

function openMenu() {
  menuOverlay.classList.add('open');
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggleLabel.textContent = 'CLOSE';
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  menuOverlay.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggleLabel.textContent = 'MENU';
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', () => {
  menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
});
menuOverlay.querySelectorAll('.menu-list a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Flagship dashboard mockup: tabs swap the kicker/title/sub/KPIs
const panelTabs = document.getElementById('panelTabs');
const panelData = {
  overview: { kicker: 'OPERATIONS ANALYTICS / EXECUTIVE VIEW', title: 'Demand &amp; Retention Control Tower', sub: 'Forecast accuracy, churn exposure, and campaign ROI in one decision view.', kpis: [['FORECAST ACC.', '92.4%'], ['CHURN FLAGGED', '31%'], ['CAMPAIGN ROI', '4.2x']] },
  demand: { kicker: 'DEMAND / FORECAST VIEW', title: 'SKU Forecast &amp; Stockout Risk', sub: 'Forecast error and reorder urgency, ranked by SKU.', kpis: [['SKUS TRACKED', '40'], ['STOCKOUTS AVOIDED', '18%'], ['AVG. FORECAST ERROR', '7.6%']] },
  churn: { kicker: 'RETENTION / CHURN VIEW', title: 'Churn Risk Watchlist', sub: 'Accounts ranked by 60-day churn probability and driver.', kpis: [['ACCOUNTS SCORED', '1.2K'], ['HIGH-RISK TIER', '9%'], ['RETENTION LIFT', '8%']] },
  campaigns: { kicker: 'MARKETING / ATTRIBUTION VIEW', title: 'Channel Spend &amp; Return', sub: 'Incremental return by channel, reconciled across platforms.', kpis: [['CHANNELS TRACKED', '6'], ['SPEND RECONCILED', '$482K'], ['ROI CLARITY', '4.2x']] },
  actions: { kicker: 'OPERATIONS / ACTION QUEUE', title: 'This Week’s Priority Queue', sub: 'Urgent, high and watch-tier items surfaced from every model.', kpis: [['URGENT', '6'], ['HIGH', '14'], ['WATCH', '22']] },
  quality: { kicker: 'GOVERNANCE / DATA QUALITY', title: 'Pipeline Health &amp; Exceptions', sub: 'Freshness, null-rate and schema checks across every source table.', kpis: [['TABLES MONITORED', '11'], ['PASSING CHECKS', '97%'], ['OPEN EXCEPTIONS', '2']] },
};
if (panelTabs) {
  const body = document.querySelector('.panel-body');
  const kickerEl = document.getElementById('panelKicker');
  const titleEl = document.getElementById('panelTitle');
  const subEl = document.getElementById('panelSub');
  const kpisEl = document.getElementById('panelKpis');
  panelTabs.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      panelTabs.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const data = panelData[btn.dataset.tab];
      body.classList.add('switching');
      setTimeout(() => {
        kickerEl.innerHTML = data.kicker;
        titleEl.innerHTML = data.title;
        subEl.textContent = data.sub;
        kpisEl.innerHTML = data.kpis.map(([label, val]) => `<div><span class="mono">${label}</span><b>${val}</b></div>`).join('');
        body.classList.remove('switching');
      }, 180);
    });
  });
}

// Flagship "Full screen": moves the live panel into a lightbox (distinct from
// the hero's "Open live dashboard", which just scrolls to this section)
const dashboardLightbox = document.getElementById('dashboardLightbox');
const lightboxStage = document.getElementById('lightboxStage');
const lightboxClose = document.getElementById('lightboxClose');
const panelFullscreen = document.getElementById('panelFullscreen');
const flagshipPanel = document.getElementById('flagship-panel');
const flagshipPanelHome = flagshipPanel ? flagshipPanel.parentNode : null;
const flagshipPanelNext = flagshipPanel ? flagshipPanel.nextSibling : null;

function openLightbox() {
  if (!flagshipPanel) return;
  lightboxStage.appendChild(flagshipPanel);
  dashboardLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!flagshipPanel) return;
  if (flagshipPanelNext) flagshipPanelHome.insertBefore(flagshipPanel, flagshipPanelNext);
  else flagshipPanelHome.appendChild(flagshipPanel);
  dashboardLightbox.classList.remove('open');
  document.body.style.overflow = '';
}
if (panelFullscreen) {
  panelFullscreen.addEventListener('click', openLightbox);
  lightboxClose.addEventListener('click', closeLightbox);
  dashboardLightbox.addEventListener('click', (e) => { if (e.target === dashboardLightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dashboardLightbox.classList.contains('open')) closeLightbox();
  });
}

// Case studies carousel: auto-advances horizontally, with dot/arrow toggles.
// A cloned first slide is appended so autoplay/next can always animate
// forward (like the marquee's continuous crawl) instead of snapping
// backward through the deck when it loops.
const credCarousel = document.getElementById('credCarousel');
if (credCarousel) {
  const track = document.getElementById('credTrack');
  const dots = credCarousel.querySelectorAll('.dot');
  const prevBtn = document.getElementById('credPrev');
  const nextBtn = document.getElementById('credNext');
  const realCount = track.querySelectorAll('.carousel-page').length;
  const clone = track.firstElementChild.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  let current = 0;
  let timer = null;

  function render(instant) {
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current % realCount));
  }
  function goForward() {
    current += 1;
    render(false);
    if (current === realCount) {
      track.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'transform') return;
        track.removeEventListener('transitionend', onEnd);
        current = 0;
        render(true);
        track.offsetHeight; // flush the instant jump before re-enabling transitions
      });
    }
  }
  function goTo(i) {
    current = (i + realCount) % realCount;
    render(false);
  }
  function startAutoplay() {
    timer = setInterval(goForward, 3400);
  }
  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goForward(); resetAutoplay(); });
  dots.forEach((dot, idx) => dot.addEventListener('click', () => { goTo(idx); resetAutoplay(); }));
  credCarousel.addEventListener('mouseenter', () => clearInterval(timer));
  credCarousel.addEventListener('mouseleave', startAutoplay);
  startAutoplay();
}

// Skills marquee: click a title for the detail behind it, in a small bubble
const skillGroups = {
  'Technical Skills': {
    'Engineering & Control Systems': [
      'Control Systems',
      { name: 'PID Autopilot Development', children: ['Tuning', 'Implementation', 'Testing'] },
      'Feedback Loops', 'Stability', 'Transfer Functions',
      'Embedded Control Algorithms', 'Sensor & Actuator Integration', 'Power Systems & Wiring',
    ],
    'Embedded Systems & Hardware': ['C++ [Arduino]', 'Embedded Hardware', 'Arduino', 'ESCs', 'SBCs'],
    'Programming & Data': ['Python', 'SQL', 'Power BI', 'DAX', 'Power Query', 'Excel', 'Tableau'],
    'CAD & Design': ['SolidWorks', 'Adobe Illustrator', 'Canva'],
  },
  'Professional Skills': {
    'Project Management': [
      'Scope Management', 'Schedule Management', 'Cost Management', 'Resource Management',
      'Risk Management', 'Quality Management', 'Procurement Management',
      'Stakeholder Engagement', 'Communication Management',
    ],
    'Project Methodologies': ['Predictive / Waterfall', 'Agile', 'Scrum', 'Hybrid'],
    'Business & Systems': ['Business Analysis', 'Systems Engineering Process', 'Integration Management', 'PMBOK-based Processes'],
    'Work Management Tools': ['Jira', 'Asana'],
    'Communication & Product': ['Presentation & Communication', 'Storytelling', 'Product Thinking', 'Time Management'],
  },
};

const skillButtons = document.querySelectorAll('.mq-skill');
if (skillButtons.length) {
  const bubble = document.getElementById('skillBubble');
  const bubbleBackdrop = document.getElementById('skillBubbleBackdrop');
  const bubbleKicker = document.getElementById('skillBubbleKicker');
  const bubbleTitle = document.getElementById('skillBubbleTitle');
  const bubbleList = document.getElementById('skillBubbleList');

  function findSkill(name) {
    for (const [group, items] of Object.entries(skillGroups)) {
      if (items[name]) return { group, items: items[name] };
    }
    return null;
  }
  function renderItems(list) {
    return list.map((item) => {
      if (typeof item === 'string') return `<li>${item}</li>`;
      return `<li><b>${item.name}</b><ul>${item.children.map((c) => `<li>${c}</li>`).join('')}</ul></li>`;
    }).join('');
  }
  function closeBubble() {
    bubble.classList.remove('open');
    bubbleBackdrop.classList.remove('open');
    skillButtons.forEach((b) => b.classList.remove('active'));
  }
  function openBubble(btn) {
    const data = findSkill(btn.dataset.skill);
    if (!data) return;
    skillButtons.forEach((b) => b.classList.toggle('active', b.dataset.skill === btn.dataset.skill));
    bubbleKicker.textContent = data.group.toUpperCase();
    bubbleTitle.textContent = btn.dataset.skill;
    bubbleList.innerHTML = renderItems(data.items);
    bubbleBackdrop.classList.add('open');
    bubble.classList.add('open');

    // position near the clicked title, clamped inside the viewport
    const rect = btn.getBoundingClientRect();
    const bw = bubble.offsetWidth || 340;
    let left = rect.left + rect.width / 2 - bw / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - bw - 12));
    const openBelow = rect.bottom + 320 < window.innerHeight;
    bubble.style.left = left + 'px';
    if (openBelow) {
      bubble.style.top = (rect.bottom + 12) + 'px';
      bubble.style.bottom = 'auto';
    } else {
      bubble.style.bottom = (window.innerHeight - rect.top + 12) + 'px';
      bubble.style.top = 'auto';
    }
  }
  skillButtons.forEach((btn) => btn.addEventListener('click', () => openBubble(btn)));
  document.getElementById('skillBubbleClose').addEventListener('click', closeBubble);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBubble(); });
  // close on outside click, but never swallow a click on another skill title —
  // that title's own handler already opened/updated the bubble for it
  document.addEventListener('click', (e) => {
    if (!bubble.classList.contains('open')) return;
    if (bubble.contains(e.target) || e.target.closest('.mq-skill')) return;
    closeBubble();
  });
}

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
