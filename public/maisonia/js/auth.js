// ===== Auth helpers =====
import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from './firebase-config.js';

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logout() { return signOut(auth); }

export function requireAdmin(redirect = '../login.html') {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) { window.location.replace(redirect); return; }
      resolve(user);
    });
  });
}

export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb);
}
