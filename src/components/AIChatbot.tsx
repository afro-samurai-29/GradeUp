import React, { useState } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AITutorPlugin } from '../ai-tutor/components/AITutorPlugin';
import { FirebaseProvider } from '../ai-tutor/providers/FirebaseProvider';
import { DEFAULT_TOPICS } from '../ai-tutor/constants';
import { firebaseConfig } from '../firebase';

interface AIChatbotProps {
  defaultTopic?: string;
}

export default function AIChatbot({ defaultTopic = "probability" }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">AI Tutor</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleMinimize}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-green-600"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-green-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <FirebaseProvider config={firebaseConfig}>
                <AITutorPlugin
                  key={selectedTopic}
                  topics={DEFAULT_TOPICS}
                  defaultTopic={selectedTopic}
                  userId="student-user"
                  debugMode={false}
                />
              </FirebaseProvider>
            </div>
          )}
        </div>
      )}
    </>
  );
}