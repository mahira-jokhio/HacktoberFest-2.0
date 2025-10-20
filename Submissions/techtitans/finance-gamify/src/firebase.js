import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClh2fah88xWMaNQK6YilD86gcMdknKsyE",
  authDomain: "finance-gamify.firebaseapp.com",
  projectId: "finance-gamify",
  storageBucket: "finance-gamify.firebasestorage.app",
  messagingSenderId: "803801624971",
  appId: "1:803801624971:web:3ae5cf1963d79b3c09ff8e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  setDoc
};