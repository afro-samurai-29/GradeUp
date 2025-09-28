// =============================================================================
// FIREBASE CONFIGURATION FOR FRONTEND
// =============================================================================

import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

// Initialize Functions
export const functions = getFunctions(app);

// Initialize Firestore
export const db = getFirestore(app);

// Use production Firebase Functions (no emulator)
console.log('📡 Using production Firebase Functions');

export default app;
