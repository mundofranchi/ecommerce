// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW-4Tm4FgNPhAHEbvcrjFXlCzU3lXGD_g",
  authDomain: "casafranchi-ff656.firebaseapp.com",
  projectId: "casafranchi-ff656",
  storageBucket: "casafranchi-ff656.firebasestorage.app",
  messagingSenderId: "336476209274",
  appId: "1:336476209274:web:fba9994666d06566817bc3",
  measurementId: "G-NZWERBW9EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);