import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFunctions, Functions } from 'firebase/functions';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FirebaseProviderProps } from '../types';

interface FirebaseContextType {
  app: FirebaseApp;
  functions: Functions;
  db: Firestore;
  isInitialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ 
  config, 
  children 
}) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [functions, setFunctions] = useState<Functions | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Initialize Firebase
      const firebaseApp = initializeApp(config);
      const firebaseFunctions = getFunctions(firebaseApp);
      const firestore = getFirestore(firebaseApp);

      setApp(firebaseApp);
      setFunctions(firebaseFunctions);
      setDb(firestore);
      setIsInitialized(true);

      console.log('🔥 Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      setIsInitialized(false);
    }
  }, [config]);

  if (!isInitialized || !app || !functions || !db) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ app, functions, db, isInitialized }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
