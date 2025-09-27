import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Image, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: '1',
    title: 'New Chat',
    messages: [],
    timestamp: new Date()
  });
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!currentMessage.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };

    setCurrentSession(updatedSession);
    setCurrentMessage('');
    setSelectedImage(null);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text, !!userMessage.image),
        sender: 'ai',
        timestamp: new Date()
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse]
      }));
    }, 1000);
  };

  const generateAIResponse = (userText: string, hasImage: boolean): string => {
    // Placeholder AI responses - replace with actual AI API
    if (hasImage) {
      return "I can see you've uploaded an image. For math problems, I can help explain the concepts and guide you through similar problems. What specific part would you like help with?";
    }
    
    if (userText.toLowerCase().includes('math')) {
      return "I'd be happy to help with mathematics! What specific topic are you working on? Algebra, calculus, geometry, or something else?";
    }
    
    if (userText.toLowerCase().includes('physics')) {
      return "Physics can be challenging but rewarding! Are you working on mechanics, electricity, waves, or another topic?";
    }
    
    return "Thanks for your question! I'm here to help with your matric studies. Can you provide more details about what you're working on?";
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCurrentSession = () => {
    if (currentSession.messages.length > 0) {
      setChatHistory(prev => [currentSession, ...prev.slice(0, 9)]); // Keep last 10 sessions
    }
  };

  const startNewChat = () => {
    saveCurrentSession();
    setCurrentSession({
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date()
    });
  };

  const loadChatSession = (session: ChatSession) => {
    saveCurrentSession();
    setCurrentSession(session);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-forest-primary hover:bg-forest-secondary text-white rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[32rem]'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-forest-primary text-white rounded-t-lg">
          <CardTitle className="text-lg">AI Study Assistant</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-forest-secondary p-1 h-auto"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-forest-secondary p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(32rem-4rem)]">
            {/* Chat History Sidebar */}
            {chatHistory.length > 0 && (
              <div className="border-b p-2 bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="w-full text-xs"
                >
                  New Chat
                </Button>
                <ScrollArea className="h-20 mt-2">
                  {chatHistory.map((session) => (
                    <Button
                      key={session.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => loadChatSession(session)}
                      className="w-full text-left text-xs p-1 h-auto justify-start"
                    >
                      {session.title.substring(0, 20)}...
                    </Button>
                  ))}
                </ScrollArea>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {currentSession.messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Ask me anything about your matric studies!</p>
                  <p className="text-xs mt-1">You can upload images of math problems too.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-forest-primary text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.image && (
                          <img
                            src={message.image}
                            alt="Uploaded"
                            className="max-w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Image Preview */}
            {selectedImage && (
              <div className="p-2 border-t bg-gray-50">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about math, physics, or any subject..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;