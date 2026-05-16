// ===== App bootstrap (home page) =====
import { initNavbar, initReveal, initCounters } from './ui.js';
import { subscribeProperties, renderGrid, renderSkeleton } from './properties.js';
import { renderMap } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initCounters();

  // Featured properties (limit 6)
  const grid = document.getElementById('featured-grid');
  if (grid) {
    renderSkeleton(grid, 6);
    subscribeProperties((items) => {
      renderGrid(grid, items.slice(0, 6));
      const mapEl = document.getElementById('map');
      if (mapEl) renderMap('map', items);
    }, { limit: 12 });
  }

  // Hero search redirects to properties.html
  const sb = document.getElementById('hero-search');
  if (sb) {
    sb.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(sb);
      const params = new URLSearchParams();
      ['city','type','price'].forEach(k => { const v = fd.get(k); if (v) params.set(k, v); });
      location.href = 'properties.html?' + params.toString();
    });
  }

  // year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
