// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpAsScdtUoXXo-k_7g6hJ7XII20tN52J8",
  authDomain: "zeroly-65b9f.firebaseapp.com",
  projectId: "zeroly-65b9f",
  storageBucket: "zeroly-65b9f.firebasestorage.app",
  messagingSenderId: "476221544816",
  appId: "1:476221544816:web:386e8ee809fe62e0ea17b5",
  measurementId: "G-XY3JRZM92R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
