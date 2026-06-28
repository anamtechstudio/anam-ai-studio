/* ============================================================
   ANAM AI STUDIO — script.js  (v2 — Production Ready)
   Author : Anam AI Studio | anamaitech5@gmail.com
   ============================================================ */

/* ── 1. PAGE LOADER ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('done'), 500);
});

/* ── 2. NAVBAR SCROLL ───────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 40);

  /* back-to-top visibility */
  const topBtn = document.getElementById('top-btn');
  if (topBtn) topBtn.classList.toggle('show', window.scrollY > 420);

  /* active nav link */
  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === `#${cur}`);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── 3. MOBILE DRAWER ───────────────────────────────────── */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('mobile-drawer');
const overlay = document.getElementById('drawer-overlay');
const dClose  = document.getElementById('drawer-close');

const openDrawer  = () => { burger.classList.add('open'); drawer.classList.add('open'); overlay.classList.add('on'); document.body.style.overflow = 'hidden'; };
const closeDrawer = () => { burger.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('on'); document.body.style.overflow = ''; };

burger?.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
dClose?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);
drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ── 4. THEME TOGGLE ────────────────────────────────────── */
const themeBtn  = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
const applyTheme = (mode) => {
  document.body.classList.toggle('light', mode === 'light');
  if (themeIcon) themeIcon.textContent = mode === 'light' ? '☀️' : '🌙';
  localStorage.setItem('aas-theme', mode);
};
/* Load saved theme */
applyTheme(localStorage.getItem('aas-theme') || 'dark');
themeBtn?.addEventListener('click', () => {
  applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
});

/* ── 5. SEARCH BAR ──────────────────────────────────────── */
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('s-btn');
const searchInp = document.getElementById('s-input');

searchBtn?.addEventListener('click', () => {
  searchBox.classList.toggle('open');
  if (searchBox.classList.contains('open')) searchInp?.focus();
});
document.addEventListener('click', e => {
  if (searchBox && !searchBox.contains(e.target)) searchBox.classList.remove('open');
});

/* ── 6. SCROLL REVEAL ───────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); revObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── 7. COUNTER ANIMATION ───────────────────────────────── */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target;
    const end = parseInt(el.dataset.count);
    let cur = 0, dur = 1600, step = end / (dur / 16);
    const tick = () => {
      cur = Math.min(cur + step, end);
      el.textContent = Math.floor(cur);
      if (cur < end) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

/* ── 8. SKILL BARS (CV section) ─────────────────────────── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.w || '0%';
    });
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.4 });
const cvPreview = document.querySelector('.cv-preview-card');
if (cvPreview) skillObs.observe(cvPreview);

/* ── 9. TESTIMONIALS SLIDER ─────────────────────────────── */
let tIdx = 0;
const tTrack = document.getElementById('testi-track');

const perView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

const slideTo = (i) => {
  if (!tTrack) return;
  const cards = tTrack.querySelectorAll('.testi-card');
  const max   = Math.max(0, cards.length - perView());
  tIdx = Math.max(0, Math.min(i, max));
  const cardW = (tTrack.parentElement.offsetWidth + 22) / perView();
  tTrack.style.transform = `translateX(-${tIdx * cardW}px)`;
};
document.getElementById('t-prev')?.addEventListener('click', () => slideTo(tIdx - 1));
document.getElementById('t-next')?.addEventListener('click', () => slideTo(tIdx + 1));
window.addEventListener('resize', () => slideTo(tIdx));

/* auto-advance every 5s */
setInterval(() => {
  if (!tTrack) return;
  const max = tTrack.querySelectorAll('.testi-card').length - perView();
  slideTo(tIdx >= max ? 0 : tIdx + 1);
}, 5000);

/* ── 10. FAQ ACCORDION ──────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const body   = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('active');

    /* Close all */
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      const b = i.querySelector('.faq-body');
      b.style.maxHeight = null;
    });

    /* Open if was closed */
    if (!isOpen) {
      item.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

/* ── 11. CONTACT FORM ───────────────────────────────────── */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.textContent = 'Sending…'; btn.disabled = true;
  /* Simulate — replace with fetch('/contact.php', ...) for real sends */
  setTimeout(() => {
    e.target.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 1400);
});

/* ── 12. NEWSLETTER FORM ────────────────────────────────── */
document.getElementById('nl-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const inp = e.target.querySelector('input');
  btn.textContent = '✓ Subscribed!';
  btn.style.cssText = 'background:#22C55E;box-shadow:0 4px 18px rgba(34,197,94,.4)';
  inp.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.cssText = ''; }, 3200);
});

/* ── 13. BACK TO TOP ────────────────────────────────────── */
document.getElementById('top-btn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 14. SMOOTH ANCHOR SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
