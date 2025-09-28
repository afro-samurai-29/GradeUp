import React from 'react';
import { AITutorPlugin, FirebaseProvider } from 'ai-tutor-plugin';
import { TrendingUp, Zap, Calculator, Beaker, BookOpen, Lightbulb } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Available topics
const topics = [
  {
    id: "probability",
    name: "Probability",
    path: "notes/content/mathematics/probability",
    icon: TrendingUp,
    description: "Probability theory, conditional probability, and statistics"
  },
  {
    id: "functions",
    name: "Functions",
    path: "notes/content/mathematics/functions",
    icon: Zap,
    description: "Mathematical functions, calculus, and analysis"
  },
  {
    id: "physics",
    name: "Physics",
    path: "notes/content/physics/mechanics",
    icon: BookOpen,
    description: "Classical mechanics and quantum physics"
  },
  {
    id: "chemistry",
    name: "Chemistry",
    path: "notes/content/chemistry/organic",
    icon: Beaker,
    description: "Organic chemistry and chemical reactions"
  }
];

function BasicUsageExample() {
  const handleMessageSent = (message) => {
    console.log('User sent message:', message);
    // You can track user engagement here
  };

  const handleResponseReceived = (response) => {
    console.log('AI responded:', response);
    // You can track AI performance here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Tutor Plugin - Basic Usage
        </h1>
        
        <FirebaseProvider config={firebaseConfig}>
          <AITutorPlugin
            topics={topics}
            onMessageSent={handleMessageSent}
            onResponseReceived={handleResponseReceived}
            userId="demo-user"
            defaultTopic="probability"
            enableQuickPrompts={true}
            enableFileUpload={false}
            maxMessages={10}
            debugMode={false}
          />
        </FirebaseProvider>
      </div>
    </div>
  );
}

export default BasicUsageExample;
