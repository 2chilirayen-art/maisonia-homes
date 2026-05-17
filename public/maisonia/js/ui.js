// ===== UI utilities — toasts, navbar, reveal animations, WA FAB =====

// Inject floating WhatsApp button on all client pages
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.wa-fab')) return;
    const a = document.createElement('a');
    a.className = 'wa-fab';
    a.href = 'https://wa.me/21623922701';
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat on WhatsApp');
    a.innerHTML = '<i class="fab fa-whatsapp"></i>';
    a.style.cssText = 'position:fixed;bottom:18px;right:18px;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.7rem;box-shadow:0 10px 30px rgba(37,211,102,.45);z-index:150;text-decoration:none;transition:transform .2s';
    a.onmouseenter = () => a.style.transform = 'scale(1.08)';
    a.onmouseleave = () => a.style.transform = 'scale(1)';
    document.body.appendChild(a);
  });
}

export function toast(message, type = '') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2700);
  setTimeout(() => t.remove(), 3100);
}

export function initNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = nav.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = nav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    });
  }
  // Close on outside click / on link click
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (e.target.closest('.nav-links a')) {
      nav.classList.remove('open');
      const i = toggle?.querySelector('i'); if (i) i.className = 'fas fa-bars';
    } else if (!nav.contains(e.target)) {
      nav.classList.remove('open');
      const i = toggle?.querySelector('i'); if (i) i.className = 'fas fa-bars';
    }
  });

  // active link
  const path = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

export function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

export function formatPrice(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US') + ' TND';
}

export function formatDate(d) {
  if (!d) return '—';
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Animated counters
export function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.counter;
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}
