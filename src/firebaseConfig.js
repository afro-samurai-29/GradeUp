import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDazrddF7KTSQP0YySz7DPxL_QktZqaA-s",
  authDomain: "studybuddy-d1751.firebaseapp.com",
  projectId: "studybuddy-d1751",
  storageBucket: "studybuddy-d1751.firebasestorage.app",
  messagingSenderId: "472560971412",
  appId: "1:472560971412:web:ffcbb1c39f3df51116ce81",
  measurementId: "G-VV3RK7X500"
};

const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);