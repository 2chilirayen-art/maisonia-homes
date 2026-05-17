// ===== Property details page =====
import { initNavbar } from './ui.js';
import { getProperty, subscribeProperties, renderGrid } from './properties.js';
import { isFavorite, toggleFavorite } from './favorites.js';
import { renderMap } from './map.js';
import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';
import { toast, escapeHtml, formatPrice } from './ui.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  if (!id) { document.getElementById('details-root').innerHTML = '<div class="empty"><h3>Missing property id</h3></div>'; return; }

  const p = await getProperty(id);
  if (!p) { document.getElementById('details-root').innerHTML = '<div class="empty"><h3>Property not found</h3></div>'; return; }

  renderDetails(p);

  // Similar
  subscribeProperties((items) => {
    const similar = items.filter(x => x.id !== id && x.city === p.city).slice(0, 3);
    const root = document.getElementById('similar-grid');
    if (root) renderGrid(root, similar.length ? similar : items.filter(x => x.id !== id).slice(0, 3));
  }, { limit: 12 });
});

function renderDetails(p) {
  document.title = `${p.title} — RaniaDjerba`;
  const images = (p.images && p.images.length) ? p.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'];
  const amenities = (p.amenities || '').split(',').map(s => s.trim()).filter(Boolean);
  const fav = isFavorite(p.id);

  document.getElementById('details-root').innerHTML = `
    <div class="container" style="padding-top:120px">
      <a href="properties.html" class="btn btn-ghost" style="margin-bottom:20px"><i class="fas fa-arrow-left"></i> Back to listings</a>

      <div class="gallery">
        <div class="swiper main-swiper">
          <div class="swiper-wrapper">
            ${images.map(src => `<div class="swiper-slide"><img src="${escapeHtml(src)}" alt="${escapeHtml(p.title)}"></div>`).join('')}
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
        ${images.length > 1 ? `<div class="swiper thumbs-swiper gallery-thumbs"><div class="swiper-wrapper">
          ${images.map(src => `<div class="swiper-slide"><img src="${escapeHtml(src)}" alt=""></div>`).join('')}
        </div></div>` : ''}
      </div>

      <div class="details-grid">
        <div class="details-info">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap">
            <div>
              <h1>${escapeHtml(p.title)}</h1>
              <div class="meta">
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(p.address || '')}, ${escapeHtml(p.city || '')}</span>
                <span><i class="fas fa-tag"></i> ${escapeHtml(p.type || 'For Rent')}</span>
              </div>
            </div>
            <button id="fav-toggle" class="btn ${fav ? 'btn-primary' : 'btn-outline'}">
              <i class="fas fa-heart"></i> ${fav ? 'Saved' : 'Save'}
            </button>
          </div>

          <div class="specs-box">
            <div class="spec-item"><div class="ic"><i class="fas fa-bed"></i></div><strong>${p.bedrooms ?? 0}</strong><span>Bedrooms</span></div>
            <div class="spec-item"><div class="ic"><i class="fas fa-bath"></i></div><strong>${p.bathrooms ?? 0}</strong><span>Bathrooms</span></div>
            <div class="spec-item"><div class="ic"><i class="fas fa-ruler-combined"></i></div><strong>${p.area ?? 0}</strong><span>Square meters</span></div>
            <div class="spec-item"><div class="ic"><i class="fas fa-star"></i></div><strong>${(p.rating || 4.8).toFixed(1)}</strong><span>Rating</span></div>
          </div>

          <h2 style="font-family:var(--font-display);font-size:1.6rem;margin-bottom:14px">About this property</h2>
          <p style="color:var(--gray-3);font-size:1.02rem;line-height:1.8;white-space:pre-wrap">${escapeHtml(p.description || 'No description provided.')}</p>

          ${amenities.length ? `
            <h2 style="font-family:var(--font-display);font-size:1.6rem;margin:30px 0 14px">Amenities</h2>
            <div class="amenities">${amenities.map(a => `<span class="amenity-chip"><i class="fas fa-check" style="color:var(--turquoise);margin-right:6px"></i>${escapeHtml(a)}</span>`).join('')}</div>
          ` : ''}

          <h2 style="font-family:var(--font-display);font-size:1.6rem;margin:40px 0 14px">Location</h2>
          <div id="details-map"></div>
        </div>

        <aside>
          <div class="side-card">
            <div class="price-big">${formatPrice(p.price)}<span> / month</span></div>
            <form id="contact-form" style="display:flex;flex-direction:column;gap:14px">
              <div class="form-group"><label>Name</label><input name="name" required></div>
              <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
              <div class="form-group"><label>Phone</label><input name="phone"></div>
              <div class="form-group"><label>Message</label><textarea name="message" rows="4" required>I'm interested in ${escapeHtml(p.title)}</textarea></div>
              <button class="btn btn-primary" type="submit"><i class="fas fa-paper-plane"></i> Send inquiry</button>
            </form>
          </div>
        </aside>
      </div>

      <section class="section">
        <h2 class="section-title" style="margin-bottom:30px">Similar properties</h2>
        <div class="grid-3" id="similar-grid"></div>
      </section>
    </div>
  `;

  // Swipers
  if (window.Swiper) {
    let thumbs = null;
    if (images.length > 1) {
      thumbs = new window.Swiper('.thumbs-swiper', {
        slidesPerView: 5, spaceBetween: 10, watchSlidesProgress: true
      });
    }
    new window.Swiper('.main-swiper', {
      loop: images.length > 1,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      thumbs: thumbs ? { swiper: thumbs } : undefined
    });
  }

  // Map
  if (p.lat && p.lng) renderMap('details-map', [p]);
  else document.getElementById('details-map').innerHTML = '<div style="padding:40px;text-align:center;color:var(--gray-3)">Location not set</div>';

  // Favorite toggle
  document.getElementById('fav-toggle').addEventListener('click', (e) => {
    const added = toggleFavorite(p.id);
    e.currentTarget.className = 'btn ' + (added ? 'btn-primary' : 'btn-outline');
    e.currentTarget.innerHTML = `<i class="fas fa-heart"></i> ${added ? 'Saved' : 'Save'}`;
    toast(added ? 'Added to favorites' : 'Removed from favorites', added ? 'success' : '');
  });

  // Contact form
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await addDoc(collection(db, 'messages'), {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        message: fd.get('message'),
        propertyId: p.id,
        propertyTitle: p.title,
        read: false,
        createdAt: serverTimestamp()
      });
      toast('Inquiry sent successfully!', 'success');
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast('Failed to send. Try again.', 'error');
    }
  });
}
