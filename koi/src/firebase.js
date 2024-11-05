// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b3bb7.firebaseapp.com",
  projectId: "mern-blog-b3bb7",
  storageBucket: "mern-blog-b3bb7.appspot.com",
  messagingSenderId: "487857685902",
  appId: "1:487857685902:web:33a3a38b0bea9a201010df"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);