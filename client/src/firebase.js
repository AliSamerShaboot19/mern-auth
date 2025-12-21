import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-e07b0.firebaseapp.com",
  projectId: "mern-auth-e07b0",
  storageBucket: "mern-auth-e07b0.firebasestorage.app",
  messagingSenderId: "236954129620",
  appId: "1:236954129620:web:07cfd6085332c5b536d741",
};

export const app = initializeApp(firebaseConfig);
