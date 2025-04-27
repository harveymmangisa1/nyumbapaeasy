import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTbzIqfYhPlNOd60tDz_v6jyyS47zlmwM",
  authDomain: "nyumbapaeasy.firebaseapp.com",
  projectId: "nyumbapaeasy",
  storageBucket: "nyumbapaeasy.appspot.com",
  messagingSenderId: "887603462087",
  appId: "1:887603462087:web:ca96db0ec9515c7ed023e2",
  measurementId: "G-RWMVBKJ6C2",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app); // Add this line

export { app, db, auth }; // Export auth
