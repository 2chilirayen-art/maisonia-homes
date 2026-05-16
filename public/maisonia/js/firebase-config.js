// ===== Firebase Configuration & Initialization =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc,
  deleteDoc, onSnapshot, query, orderBy, where, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import {
  getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXkmifIldYRnjTbk6QOTOsFwBDN3nfN6g",
  authDomain: "maisonia-53f56.firebaseapp.com",
  projectId: "maisonia-53f56",
  storageBucket: "maisonia-53f56.firebasestorage.app",
  messagingSenderId: "626131204194",
  appId: "1:626131204194:web:95e92331385acb73be793b",
  measurementId: "G-QCLDTZ79JF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Re-export commonly used helpers
export {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, where, serverTimestamp, limit,
  storageRef, uploadBytesResumable, getDownloadURL, deleteObject
};
