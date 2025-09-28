// =============================================================================
// FIREBASE CONFIGURATION FOR FRONTEND
// =============================================================================

import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - should be provided by the user
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Functions
export const functions = getFunctions(app);

// Initialize Firestore
export const db = getFirestore(app);

// Use production Firebase Functions (no emulator)
console.log('📡 Using production Firebase Functions');

export default app;
