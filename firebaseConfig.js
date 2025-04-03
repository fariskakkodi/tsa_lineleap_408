// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS36h150yL-loBh6K4ea3S0n666-IAQ48",
  authDomain: "tsa-app-6090b.firebaseapp.com",
  projectId: "tsa-app-6090b",
  storageBucket: "tsa-app-6090b.firebasestorage.app",
  messagingSenderId: "171658007970",
  appId: "1:171658007970:web:be301ce03490c8d5d00efb",
  measurementId: "G-644QSTE2LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
