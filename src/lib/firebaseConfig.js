import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-68cbd.firebaseapp.com",
  projectId: "chatapp-68cbd",
  storageBucket: "chatapp-68cbd.appspot.com",
  messagingSenderId: "444033004015",
  appId: "1:444033004015:web:89a861e0c981ba44f2c61a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage()