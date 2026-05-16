// ===== Properties — list, render, real-time, filters =====
import {
  db, collection, onSnapshot, query, orderBy, getDoc, doc, addDoc,
  updateDoc, deleteDoc, serverTimestamp, limit
} from './firebase-config.js';
import { isFavorite, toggleFavorite } from './favorites.js';
import { escapeHtml, formatPrice, toast } from './ui.js';

export function subscribeProperties(cb, opts = {}) {
  const col = collection(db, 'properties');
  const q = opts.limit ? query(col, orderBy('createdAt', 'desc'), limit(opts.limit))
                       : query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    cb(items);
  }, (err) => {
    console.error('properties subscribe error', err);
    cb([]);
  });
}

export async function getProperty(id) {
  const ref = doc(db, 'properties', id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createProperty(data) {
  return addDoc(collection(db, 'properties'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateProperty(id, data) {
  return updateDoc(doc(db, 'properties', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProperty(id) {
  return deleteDoc(doc(db, 'properties', id));
}

/* ===== Render helpers ===== */

export function propertyCard(p) {
  const fav = isFavorite(p.id) ? 'active' : '';
  const images = (p.images && p.images.length) ? p.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'];
  const slides = images.map(src => `<div class="swiper-slide"><img src="${escapeHtml(src)}" alt="${escapeHtml(p.title || 'Property')}" loading="lazy"></div>`).join('');
  const rating = Math.min(5, Math.max(0, p.rating || 4.7));
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return `
    <article class="property-card reveal" data-id="${p.id}">
      <div class="media">
        <span class="badge">${escapeHtml(p.type || 'For Rent')}</span>
        <button class="fav-btn ${fav}" data-fav="${p.id}" aria-label="Save"><i class="fas fa-heart"></i></button>
        <div class="swiper card-swiper">
          <div class="swiper-wrapper">${slides}</div>
        </div>
      </div>
      <div class="info">
        <div class="price">${formatPrice(p.price)}<span> / month</span></div>
        <h3>${escapeHtml(p.title || 'Untitled property')}</h3>
        <div class="addr"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(p.address || '')}, ${escapeHtml(p.city || '')}</div>
        <div class="rating">${stars} <span style="color:var(--gray-3);margin-left:4px">${rating.toFixed(1)}</span></div>
        <div class="specs">
          <span><i class="fas fa-bed"></i> ${p.bedrooms ?? 0} Beds</span>
          <span><i class="fas fa-bath"></i> ${p.bathrooms ?? 0} Baths</span>
          <span><i class="fas fa-ruler-combined"></i> ${p.area ?? 0} m²</span>
        </div>
        <a class="btn btn-dark" style="margin-top:12px" href="property-details.html?id=${p.id}">View details</a>
      </div>
    </article>
  `;
}

export function bindCardEvents(container) {
  container.querySelectorAll('[data-fav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.fav;
      const added = toggleFavorite(id);
      btn.classList.toggle('active', added);
      toast(added ? 'Added to favorites' : 'Removed from favorites', added ? 'success' : '');
    });
  });

  // Init swipers for cards
  if (window.Swiper) {
    container.querySelectorAll('.card-swiper').forEach(el => {
      if (el.dataset.init) return;
      el.dataset.init = '1';
      new window.Swiper(el, {
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: false
      });
    });
  }
}

export function renderGrid(container, items) {
  if (!items.length) {
    container.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <div class="icn"><i class="fas fa-home"></i></div>
        <h3>No properties yet</h3>
        <p>New listings will appear here in real time.</p>
      </div>`;
    return;
  }
  container.innerHTML = items.map(propertyCard).join('');
  bindCardEvents(container);
  // trigger reveal
  requestAnimationFrame(() => container.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
}

export function renderSkeleton(container, n = 6) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += `<div class="property-card"><div class="skeleton" style="aspect-ratio:4/3;border-radius:0"></div>
      <div class="info">
        <div class="skeleton" style="height:24px;width:50%"></div>
        <div class="skeleton" style="height:18px;width:80%"></div>
        <div class="skeleton" style="height:14px;width:60%"></div>
      </div></div>`;
  }
  container.innerHTML = html;
}
