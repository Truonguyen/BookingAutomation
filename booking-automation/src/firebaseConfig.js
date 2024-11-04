// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFWf6Vb9kUZj83M33wT2IlMEXrRf7JOJ0",
  authDomain: "booking-automation-e2735.firebaseapp.com",
  projectId: "booking-automation-e2735",
  storageBucket: "booking-automation-e2735.firebasestorage.app",
  messagingSenderId: "468894597609",
  appId: "1:468894597609:web:590edf8d6c38c6b6dbcb78",
  measurementId: "G-KQVE15YGVF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
