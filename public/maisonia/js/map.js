// ===== Leaflet map helpers =====
export function ensureLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L);
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload = () => resolve(window.L);
    document.head.appendChild(s);
  });
}

const TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTR = '&copy; OpenStreetMap &copy; CARTO';

export async function renderMap(elId, properties = []) {
  const L = await ensureLeaflet();
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '';
  const valid = properties.filter(p => p.lat && p.lng);
  const center = valid.length ? [valid[0].lat, valid[0].lng] : [40.7128, -74.0060];
  const map = L.map(el).setView(center, valid.length ? 11 : 4);
  L.tileLayer(TILE, { attribution: ATTR, maxZoom: 19 }).addTo(map);

  const goldIcon = L.divIcon({
    className: 'mai-marker',
    html: `<div style="background:linear-gradient(135deg,#D4A373,#b8895a);width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;border:3px solid white"><i class="fas fa-home" style="color:white;transform:rotate(45deg);font-size:14px"></i></div>`,
    iconSize: [36, 36], iconAnchor: [18, 36]
  });

  valid.forEach(p => {
    const m = L.marker([p.lat, p.lng], { icon: goldIcon }).addTo(map);
    const img = (p.images && p.images[0]) || '';
    m.bindPopup(`
      <div style="min-width:200px">
        ${img ? `<img src="${img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px">` : ''}
        <strong style="font-size:1rem">${p.title || 'Property'}</strong><br>
        <span style="color:#64748B;font-size:.85rem">${p.city || ''}</span><br>
        <strong style="color:#D4A373">$${Number(p.price || 0).toLocaleString()}/mo</strong><br>
        <a href="property-details.html?id=${p.id}" style="display:inline-block;margin-top:8px;color:#06B6D4;font-weight:600">View →</a>
      </div>
    `);
  });

  if (valid.length > 1) {
    map.fitBounds(L.featureGroup(valid.map(p => L.marker([p.lat, p.lng]))).getBounds().pad(0.2));
  }
  return map;
}

export async function renderPicker(elId, initial, onChange) {
  const L = await ensureLeaflet();
  const el = document.getElementById(elId);
  if (!el) return;
  const start = initial && initial.lat ? [initial.lat, initial.lng] : [40.7128, -74.0060];
  const map = L.map(el).setView(start, initial && initial.lat ? 13 : 4);
  L.tileLayer(TILE, { attribution: ATTR, maxZoom: 19 }).addTo(map);

  let marker = null;
  const place = (lat, lng) => {
    if (marker) marker.setLatLng([lat, lng]);
    else marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', e => {
      const { lat, lng } = e.target.getLatLng();
      onChange({ lat, lng });
    });
  };
  if (initial && initial.lat) place(initial.lat, initial.lng);
  map.on('click', e => { place(e.latlng.lat, e.latlng.lng); onChange({ lat: e.latlng.lat, lng: e.latlng.lng }); });
  return map;
}
