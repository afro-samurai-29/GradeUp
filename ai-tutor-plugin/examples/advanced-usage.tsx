import React, { useState, useCallback } from 'react';
import { 
  AITutorPlugin, 
  FirebaseProvider, 
  useAITutor, 
  useConversation,
  setDebugMode 
} from 'ai-tutor-plugin';
import { TrendingUp, Zap, Calculator, Beaker, BookOpen, Lightbulb, Settings, BarChart3 } from 'lucide-react';

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

// Custom AI Tutor Component with Hooks
function CustomAITutor() {
  const [userId] = useState('advanced-user');
  const [debugMode, setDebugModeState] = useState(false);
  
  const {
    messages,
    isTyping,
    isConnected,
    connectionError,
    selectedTopic,
    hasRAGContext,
    sendMessage,
    setSelectedTopic,
    clearConversation,
    retryConnection
  } = useAITutor(topics, userId, 15);

  const {
    conversationId,
    isInitialized,
    createConversation,
    addMessage,
    getMessages,
    updateConversation
  } = useConversation();

  // Enable/disable debug mode
  const toggleDebugMode = useCallback(() => {
    const newDebugMode = !debugMode;
    setDebugModeState(newDebugMode);
    setDebugMode(newDebugMode);
  }, [debugMode]);

  // Analytics tracking
  const trackEvent = useCallback((eventName: string, data: any) => {
    console.log(`Analytics: ${eventName}`, data);
    // Integrate with your analytics service here
  }, []);

  const handleMessageSent = useCallback((message) => {
    trackEvent('message_sent', {
      topic: selectedTopic,
      messageLength: message.content.length,
      timestamp: new Date().toISOString()
    });
  }, [selectedTopic, trackEvent]);

  const handleResponseReceived = useCallback((response) => {
    trackEvent('response_received', {
      topic: selectedTopic,
      chunksUsed: response.metadata?.chunks_used || 0,
      similarity: response.metadata?.similarity || 0,
      queryTime: response.metadata?.query_time || 0,
      timestamp: new Date().toISOString()
    });
  }, [selectedTopic, trackEvent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header with Controls */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Advanced AI Tutor</h1>
              <p className="text-gray-600 mt-2">
                Custom implementation with hooks and analytics
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {isConnected === null ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Connecting...</span>
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Disconnected</span>
                  </div>
                )}
              </div>

              {/* RAG Context Status */}
              {hasRAGContext && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Context Loaded</span>
                </div>
              )}

              {/* Debug Mode Toggle */}
              <button
                onClick={toggleDebugMode}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  debugMode 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Debug
              </button>

              {/* Analytics Button */}
              <button
                onClick={() => trackEvent('analytics_viewed', { messagesCount: messages.length })}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Analytics
              </button>
            </div>
          </div>

          {/* Error Display */}
          {connectionError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <p className="font-medium">Connection Error:</p>
              <p className="text-sm">{connectionError}</p>
              <button
                onClick={retryConnection}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>

        {/* AI Tutor Plugin */}
        <AITutorPlugin
          topics={topics}
          onMessageSent={handleMessageSent}
          onResponseReceived={handleResponseReceived}
          userId={userId}
          defaultTopic={selectedTopic}
          enableQuickPrompts={true}
          enableFileUpload={false}
          maxMessages={15}
          debugMode={debugMode}
          className="shadow-lg"
        />

        {/* Debug Information */}
        {debugMode && (
          <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <h3 className="text-white font-bold mb-2">Debug Information:</h3>
            <div>Conversation ID: {conversationId || 'Not initialized'}</div>
            <div>Messages Count: {messages.length}</div>
            <div>Selected Topic: {selectedTopic}</div>
            <div>RAG Context: {hasRAGContext ? 'Loaded' : 'Not loaded'}</div>
            <div>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
            <div>Is Typing: {isTyping ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
function AdvancedUsageExample() {
  return (
    <FirebaseProvider config={firebaseConfig}>
      <CustomAITutor />
    </FirebaseProvider>
  );
}

export default AdvancedUsageExample;
