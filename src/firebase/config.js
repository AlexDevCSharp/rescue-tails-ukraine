// Импорт Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔧 Замените эти значения на свои из Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCSYxapKOIw8OrXU0wTn007vhHD4Nh0mzk",
  authDomain: "rescue-tails-ukraine.firebaseapp.com",
  projectId: "rescue-tails-ukraine",
  storageBucket: "rescue-tails-ukraine.firebasestorage.app",
  messagingSenderId: "182347020438",
  appId: "1:182347020438:web:0bce7eb89d8c679a26aab7",
  measurementId: "G-BK1QM7RJQX"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт нужных модулей
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
