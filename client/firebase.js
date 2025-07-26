import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDpAsScdtUoXXo-k_7g6hJ7XII20tN52J8",
  authDomain: "zeroly-65b9f.firebaseapp.com",
  projectId: "zeroly-65b9f",
  storageBucket: "zeroly-65b9f.firebasestorage.app",
  messagingSenderId: "476221544816",
  appId: "1:476221544816:web:386e8ee809fe62e0ea17b5",
  measurementId: "G-XY3JRZM92R",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
