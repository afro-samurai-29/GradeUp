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

function CustomStylingExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Custom Styled AI Tutor
          </h1>
          <p className="text-gray-600 text-lg">
            Example with custom colors and styling
          </p>
        </div>
        
        <FirebaseProvider config={firebaseConfig}>
          <AITutorPlugin
            topics={topics}
            userId="styled-user"
            defaultTopic="probability"
            enableQuickPrompts={true}
            enableFileUpload={false}
            maxMessages={10}
            debugMode={false}
            className="custom-ai-tutor"
            style={{
              '--ai-tutor-primary': '#8b5cf6',
              '--ai-tutor-secondary': '#3b82f6',
              '--ai-tutor-accent': '#f59e0b',
              '--ai-tutor-background': '#f8fafc',
              '--ai-tutor-surface': '#ffffff',
              '--ai-tutor-text': '#1f2937',
              '--ai-tutor-text-muted': '#6b7280',
              '--ai-tutor-border': '#e5e7eb',
              '--ai-tutor-success': '#10b981',
              '--ai-tutor-warning': '#f59e0b',
              '--ai-tutor-error': '#ef4444',
              '--ai-tutor-info': '#3b82f6'
            }}
          />
        </FirebaseProvider>
      </div>

      {/* Custom CSS for additional styling */}
      <style jsx>{`
        .custom-ai-tutor {
          --border-radius: 12px;
          --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --gradient-primary: linear-gradient(135deg, var(--ai-tutor-primary), var(--ai-tutor-secondary));
        }

        .custom-ai-tutor .bg-gradient-primary {
          background: var(--gradient-primary);
        }

        .custom-ai-tutor .border-primary {
          border-color: var(--ai-tutor-primary);
        }

        .custom-ai-tutor .text-primary {
          color: var(--ai-tutor-primary);
        }

        .custom-ai-tutor .bg-primary {
          background-color: var(--ai-tutor-primary);
        }

        .custom-ai-tutor .hover\\:bg-primary\\/90:hover {
          background-color: color-mix(in srgb, var(--ai-tutor-primary) 90%, transparent);
        }

        .custom-ai-tutor .bg-muted {
          background-color: var(--ai-tutor-surface);
        }

        .custom-ai-tutor .text-muted-foreground {
          color: var(--ai-tutor-text-muted);
        }

        .custom-ai-tutor .border {
          border-color: var(--ai-tutor-border);
        }

        .custom-ai-tutor .text-green-600 {
          color: var(--ai-tutor-success);
        }

        .custom-ai-tutor .text-red-600 {
          color: var(--ai-tutor-error);
        }

        .custom-ai-tutor .text-blue-600 {
          color: var(--ai-tutor-info);
        }

        .custom-ai-tutor .text-yellow-600 {
          color: var(--ai-tutor-warning);
        }

        /* Custom animations */
        .custom-ai-tutor .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar */
        .custom-ai-tutor ::-webkit-scrollbar {
          width: 6px;
        }

        .custom-ai-tutor ::-webkit-scrollbar-track {
          background: var(--ai-tutor-background);
        }

        .custom-ai-tutor ::-webkit-scrollbar-thumb {
          background: var(--ai-tutor-primary);
          border-radius: 3px;
        }

        .custom-ai-tutor ::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--ai-tutor-primary) 80%, black);
        }

        /* Custom focus states */
        .custom-ai-tutor input:focus,
        .custom-ai-tutor textarea:focus {
          outline: none;
          border-color: var(--ai-tutor-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--ai-tutor-primary) 20%, transparent);
        }

        /* Custom button hover effects */
        .custom-ai-tutor button:hover {
          transform: translateY(-1px);
          transition: transform 0.2s ease;
        }

        /* Custom message bubbles */
        .custom-ai-tutor .bg-primary {
          background: var(--gradient-primary);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--ai-tutor-primary) 30%, transparent);
        }

        .custom-ai-tutor .bg-muted {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default CustomStylingExample;
