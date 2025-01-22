// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// import dotenv from "react-dotenv";
import { API_KEY } from "@env";
import "firebase/database"; // for Realtime Database
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// dotenv.config();
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "monu-electronics.firebaseapp.com",
  projectId: "monu-electronics",
  storageBucket: "monu-electronics.firebasestorage.app",
  messagingSenderId: "1001352477022",
  appId: "1:1001352477022:web:27543bef1680f9c4d3b7cf",
  measurementId: "G-1BG6F243PW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
