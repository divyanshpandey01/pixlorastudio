import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Activated Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwyaDT7wopOIZuIy1GEumZ_AVoGCFNVLE",
  authDomain: "pixlorastudio-66200.firebaseapp.com",
  projectId: "pixlorastudio-66200",
  storageBucket: "pixlorastudio-66200.firebasestorage.app",
  messagingSenderId: "842423492677",
  appId: "1:842423492677:web:fb059401b34421a0c4832c",
  measurementId: "G-0XGXDPQGG6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const isConfigured = true;

export { auth, db, isConfigured };
