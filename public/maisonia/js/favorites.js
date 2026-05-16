// ===== Favorites — localStorage based =====
const KEY = 'maisonia_favorites';

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
export function isFavorite(id) { return getFavorites().includes(id); }
export function toggleFavorite(id) {
  const favs = getFavorites();
  const i = favs.indexOf(id);
  if (i >= 0) favs.splice(i, 1); else favs.push(id);
  localStorage.setItem(KEY, JSON.stringify(favs));
  return i < 0; // true if added
}
export function removeFavorite(id) {
  const favs = getFavorites().filter(x => x !== id);
  localStorage.setItem(KEY, JSON.stringify(favs));
}
