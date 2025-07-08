// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMNJ0tDS1BzMe_0w6JTm_Dm6hV9b096NY",
  authDomain: "mundofranchi-ccdee.firebaseapp.com",
  projectId: "mundofranchi-ccdee",
  storageBucket: "mundofranchi-ccdee.firebasestorage.app",
  messagingSenderId: "7229333965",
  appId: "1:7229333965:web:1a4bcac32780a76b75e484",
  measurementId: "G-T54T45ZBDL"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);