// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKWIBeu2xaP-0ghk_lRwRo-1EpS9qEQQU",
  authDomain: "gruppe22-ae1ee.firebaseapp.com",
  projectId: "gruppe22-ae1ee",
  storageBucket: "gruppe22-ae1ee.appspot.com",
  messagingSenderId: "877612435783",
  appId: "1:877612435783:web:fab96287699e90b9b2a462",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
