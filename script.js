document.getElementById('year').textContent = new Date().getFullYear();

// Safe default so any code can flag a "working" moment; the real
// implementation (bottom of this file) overrides it on fine-pointer devices.
window.cursorPulseWorking = function () {};

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

// Mobile section strip: slides in under the header once you've scrolled past the hero
const secnav = document.getElementById('secnav');
const heroEl = document.querySelector('.hero');

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = pct + '%';
  topbar.classList.toggle('scrolled', doc.scrollTop > 8);
  toTop.classList.toggle('show', doc.scrollTop > 500);
  if (secnav && heroEl) secnav.classList.toggle('show', heroEl.getBoundingClientRect().bottom < 0);
  updateRail();
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Full-screen menu overlay: toggled from the header's box-notation button
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
if (menuToggle && menuOverlay) {
  function openMenu() {
    menuOverlay.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.querySelector('span').textContent = 'CLOSE';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuOverlay.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.querySelector('span').textContent = 'MENU';
    document.body.style.overflow = '';
  }
  menuToggle.addEventListener('click', () => {
    menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuOverlay.querySelectorAll('.menu-list a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
  });
}

// Nav active-section tracking: brackets the header link for whichever
// section is currently crossing the reading line, moving as you scroll.
// The mobile section strip shares the same active state, so its pills
// light up in sync with the desktop topnav brackets.
const navLinks = [...document.querySelectorAll('.topnav a[href^="#"], .secnav a[href^="#"]')];
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

  // The reading-line band above never reaches into a short last section once
  // the page runs out of room to scroll further, so it can never fire an
  // intersection for it. Force that link active once you're at the bottom.
  const lastNavLink = navLinks[navLinks.length - 1];
  document.addEventListener('scroll', () => {
    const doc = document.documentElement;
    if (doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 2) {
      navLinks.forEach((a) => a.classList.toggle('active', a === lastNavLink));
    }
  }, { passive: true });
}

// Decrypt-style scramble on the nav bar: letters settle left to right out of
// random glyphs on hover/focus, instead of the label just appearing
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#%$&01';
  const scrambleIn = (el) => {
    const target = el.dataset.text || (el.dataset.text = el.textContent);
    clearInterval(el._scrambleTimer);
    const totalFrames = 14;
    let frame = 0;
    el._scrambleTimer = setInterval(() => {
      frame++;
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === ' ') { out += ' '; continue; }
        const settleAt = Math.floor((i / target.length) * totalFrames * 0.75);
        out += frame > settleAt ? ch : SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame >= totalFrames) { clearInterval(el._scrambleTimer); el.textContent = target; }
    }, 32);
  };
  const scrambleOut = (el) => {
    clearInterval(el._scrambleTimer);
    if (el.dataset.text) el.textContent = el.dataset.text;
  };
  document.querySelectorAll('.topnav a').forEach((a) => {
    a.addEventListener('mouseenter', () => scrambleIn(a));
    a.addEventListener('mouseleave', () => scrambleOut(a));
    a.addEventListener('focus', () => scrambleIn(a));
    a.addEventListener('blur', () => scrambleOut(a));
  });
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
    if (willOpen) window.cursorPulseWorking(420);
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
      window.cursorPulseWorking(220);
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

// Case studies: clicking a card (not its own link) expands a bigger showcase
// clone of it, so the carousel itself is never touched/reflowed underneath.
// Runs after the carousel setup above so the cloned loop-page is covered too.
const cardLightbox = document.getElementById('cardLightbox');
const cardLightboxStage = document.getElementById('cardLightboxStage');
const cardLightboxClose = document.getElementById('cardLightboxClose');

function openCardShowcase(card) {
  cardLightboxStage.innerHTML = '';
  cardLightboxStage.appendChild(card.cloneNode(true));
  cardLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  window.cursorPulseWorking(240);
}
function closeCardShowcase() {
  cardLightbox.classList.remove('open');
  document.body.style.overflow = '';
}
if (cardLightbox) {
  document.querySelectorAll('#credCarousel .cred-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cred-link')) return; // let the button navigate normally
      openCardShowcase(card);
    });
  });
  cardLightboxClose.addEventListener('click', closeCardShowcase);
  cardLightbox.addEventListener('click', (e) => { if (e.target === cardLightbox) closeCardShowcase(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cardLightbox.classList.contains('open')) closeCardShowcase();
  });
}

// Skills marquee: click a title for the detail behind it, in a small bubble
const skillGroups = {
  'Technical Skills': {
    'Advanced Analytics': [
      { name: 'Query & Data Analytics Languages', children: ['SQL', 'Power Query (M)', 'KQL', 'DAX', 'Python', 'R'] },
      { name: 'BI & Data Visualisation Software', children: ['Power BI', 'Tableau', 'Microsoft Excel'] },
    ],
    'Embedded & Autonomous (GNC) Systems Engineering': [
      { name: 'Hardware & Prototyping', children: ['MCUs (Arduino Uno, ESP32)', 'MPUs / SBCs (Raspberry Pi 4B / 5)', 'Peripherals (Sensors, Actuators & Indicators, Power Actuators / Motor Drivers)'] },
      { name: 'System Modelling & Analysis', children: ['State Space Representation', 'Transfer Functions', 'Bode Plots', 'Root Locus'] },
      { name: 'Guidance Logic', children: ['Trajectory / Path Planning Algorithms', 'Model Predictive Control (MPC) / Receding Horizon Guidance', 'Waypoint & Constrained Guidance'] },
      { name: 'Navigation Logic', children: ['Sensor Fusion (Kalman Filtering)', 'Dead Reckoning', 'Fault Detection and Isolation (FDI)'] },
      { name: 'Control Logic', children: ['PID Control', 'Cascaded Loops', 'Feedforward Compensation'] },
      { name: 'System Architecture', children: ['Time Triggered Architecture (TTA)', 'RTOS Based Architecture'] },
      { name: 'System Implementation & Testing', children: ['Software in the Loop (SIL) Prototyping', 'Hardware in the Loop (HIL) Rigs'] },
      { name: 'Mechanical Design Software', children: ['SolidWorks', 'SimScale'] },
      { name: 'Simulation Software', children: ['Proteus', 'MATLAB and Simulink'] },
    ],
    'Experimental R&D': [
      { name: 'Device Fabrication & Nanotechnology', children: ['Substrate Preparation & Chemical Etching', 'Transport Layer Deposition', 'Perovskite Crystal Engineering', 'Vacuum & Vapor Deposition'] },
      { name: 'Controlled Environment Processing', children: ['Spin Coating Optimisation', 'UV Ozone Substrate Cleaning', 'Nitrogen Glovebox Operations'] },
      { name: 'Metrology & Characterisation', children: ['Structural & Morphological Analysis', 'Photovoltaic & Electrical Evaluation', 'Optoelectronic Testing'] },
    ],
    'Quality Engineering & Continuous Improvement': [
      { name: 'Process Improvement Methodologies', children: ['Lean', 'Six Sigma (DMAIC)', 'Lean Six Sigma'] },
      { name: 'Continuous Improvement Tools', children: ['Risk & Root Cause Analysis (FMEA, Fishbone, 5 Whys, RCA)', 'Statistical Process Control (SPC)', 'Measurement Quality Assurance (MQA)'] },
    ],
  },
  'Professional Skills': {
    'Project Management Approaches & Competencies': [
      { name: 'Development Approaches', children: ['Predictive Methodologies', 'Hybrid Methodologies', 'Adaptive / Agile Methodologies'] },
      { name: 'Core Competencies', children: ['Scope Management', 'Schedule Management', 'Cost Management', 'Quality Management', 'Resource Management', 'Communication Management', 'Risk Management', 'Procurement Management', 'Contract & Vendor Management', 'Project Integration Management', 'Stakeholder Engagement Management'] },
    ],
    'Systems Engineering Processes': [
      'Lifecycles (V Model)',
      'Quality to Cost Balance Methodologies: VE, CBA',
    ],
    'Product Strategy & Continuity': ['Product Thinking', 'Strategic Scope Definition', 'Technical Continuity Enforcement'],
    'Work Management Tools': ['Jira', 'Asana'],
  },
  'Behavioural Skills': {
    'Communication Architecture': ['Data Storytelling', 'Stakeholder Technical Presentations', 'Cross Functional Reporting'],
    'Critical Thinking & Problem Solving': ['Risk & Root Cause Analysis', 'Complex Logic Processing', 'Structural Crisis Management & Recovery'],
    'Leadership & Adaptability': ['Influence Without Authority', 'Adaptive Leadership', 'Conflict Resolution', 'Strategic Consensus Building', 'Rapid Multi Disciplinary Adaptability', 'Time & Prioritisation Management'],
    'Teamwork & Professionalism': ['Dynamic Teamwork Collaboration', 'Professionalism & Workplace Ethics'],
  },
};
const SKILL_GROUP_CLASS = { 'Technical Skills': 'technical', 'Behavioural Skills': 'behavioural' };

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
    bubbleKicker.classList.remove('technical', 'behavioural');
    const groupClass = SKILL_GROUP_CLASS[data.group];
    if (groupClass) bubbleKicker.classList.add(groupClass);
    bubbleTitle.textContent = btn.dataset.skill;
    bubbleList.innerHTML = renderItems(data.items);
    bubbleBackdrop.classList.add('open');
    bubble.classList.add('open');
    window.cursorPulseWorking(240);

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

// Custom cursor: normal / working / link / expand, built from an extracted
// Cinnamoroll cursor pack (assets/cursors/*-sprite.png — see README there for
// how the frames were pulled out of the original .ani files). Desktop/mouse
// only; touch devices keep the system default untouched.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.getElementById('customCursor');
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MODES = {
    normal: { frameCount: 2, seq: [0, 0, 0, 0, 0, 0, 1], stepMs: 1000 / 6, hx: 0, hy: 8 },
    link: { frameCount: 3, seq: [0, 0, 1, 1, 0, 0, 2, 1], stepMs: 1000 / 6, hx: 0, hy: 8 },
    working: { frameCount: 11, seq: null, stepMs: 1000 / 12, hx: 0, hy: 8 },
    // clear diagonal-resize glyph, used as the "expand" cursor; its own hotspot differs from the others
    expand: { frameCount: 1, seq: null, stepMs: 0, hx: 9, hy: 14 },
  };

  document.documentElement.classList.add('has-custom-cursor');

  let currentMode = null;
  let timer = null;
  let step = 0;
  let workingUntil = 0;
  let hotspot = MODES.normal;
  let lastX = 0;
  let lastY = 0;

  function positionCursor() {
    el.style.transform = `translate3d(${lastX - hotspot.hx}px, ${lastY - hotspot.hy}px, 0)`;
  }

  function setMode(mode) {
    if (mode === currentMode) return;
    currentMode = mode;
    el.className = 'custom-cursor mode-' + mode;
    clearInterval(timer);
    step = 0;
    el.style.backgroundPositionX = '0px';
    const m = MODES[mode];
    hotspot = m;
    positionCursor();
    if (reduced || m.frameCount <= 1) return;
    timer = setInterval(() => {
      step = (step + 1) % (m.seq ? m.seq.length : m.frameCount);
      const frame = m.seq ? m.seq[step] : step;
      el.style.backgroundPositionX = (-frame * 48) + 'px';
    }, m.stepMs);
  }
  setMode('normal');

  document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    positionCursor();
  }, { passive: true });

  const EXPAND_SELECTOR = '.idcard, .cred-card, .dsr-photo, .carousel-page';
  const LINK_SELECTOR = 'a, button, [role="button"], [role="tab"], .mq-skill, .carousel-arrow, .dot, .row, .ct-tab';

  document.addEventListener('mouseover', (e) => {
    if (performance.now() < workingUntil) return; // let a working pulse finish
    if (e.target.closest(EXPAND_SELECTOR)) { setMode('expand'); return; }
    if (e.target.closest(LINK_SELECTOR)) { setMode('link'); return; }
    setMode('normal');
  });
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) setMode('normal');
  });

  // Brief "working" pulse for async-feeling moments (accordion open, tab
  // swap, skill bubble) — called via window.cursorPulseWorking elsewhere.
  window.cursorPulseWorking = function (ms) {
    workingUntil = performance.now() + ms;
    setMode('working');
    setTimeout(() => {
      if (performance.now() >= workingUntil) setMode('normal');
    }, ms);
  };
})();

