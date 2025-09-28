import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  MessageCircle,
  Send,
  Paperclip,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  Calculator,
  Beaker,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  TrendingUp,
} from "lucide-react";
import { firebaseRagApi, RAGQueryRequest } from "../services/firebaseRagApi";
import { conversationService, ConversationMessage, MessageMetadata } from "../services/conversationService";
import { MarkdownFormatter } from "./MarkdownFormatter";
import { AITutorPluginProps, Message, Topic } from "../types";
import { DEFAULT_CONFIG, QUICK_PROMPTS, SAMPLE_MESSAGES, SYSTEM_PROMPTS } from "../constants";
import { useAITutor } from "../hooks/useAITutor";

export const AITutorPlugin: React.FC<AITutorPluginProps> = ({
  topics,
  onMessageSent,
  onResponseReceived,
  initialMessages = SAMPLE_MESSAGES,
  className = "",
  style,
  userId = "user",
  defaultTopic = "probability",
  enableQuickPrompts = true,
  enableFileUpload = false,
  maxMessages = DEFAULT_CONFIG.maxMessages,
  debugMode = DEFAULT_CONFIG.enableDebugMode,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>(defaultTopic);
  const [uploadStatus, setUploadStatus] = useState<{
    isUploading: boolean;
    progress: number;
    message: string;
  }>({ isUploading: false, progress: 0, message: "" });
  
  // Conversation management state
  const [conversationId, setConversationId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRAGContext, setHasRAGContext] = useState(false);

  // Initialize conversation and check RAG system connection
  useEffect(() => {
    initializeConversation();
    checkRAGConnection();
  }, [selectedTopic]);

  // Initialize conversation when component mounts or topic changes
  const initializeConversation = async () => {
    if (!isInitialized) {
      try {
        const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
        const title = `AI Tutor - ${selectedTopicData?.name || 'Mathematics'}`;
        const newConversationId = await conversationService.createConversation(
          userId,
          title,
          selectedTopic
        );
        setConversationId(newConversationId);
        setIsInitialized(true);
        if (debugMode) console.log('Conversation initialized:', newConversationId);
        
        // Load any existing conversation history
        await loadConversationHistory(newConversationId);
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
      }
    }
  };

  // Load conversation history from Firestore
  const loadConversationHistory = async (convId: string) => {
    try {
      const conversationHistory = await conversationService.getMessagesForContext(convId);
      if (conversationHistory.length > 0) {
        // Convert conversation messages to UI messages
        const uiMessages: Message[] = conversationHistory.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: msg.timestamp.toDate(),
          metadata: msg.metadata
        }));
        
        // Replace sample messages with loaded conversation
        setMessages(uiMessages);
        
        // Check if conversation already has RAG context
        const hasContext = conversationService.hasRAGContext(conversationHistory);
        setHasRAGContext(hasContext);
        
        if (debugMode) {
          console.log(`Loaded ${uiMessages.length} messages from conversation history`);
          console.log(`RAG context available: ${hasContext}`);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const checkRAGConnection = async () => {
    try {
      const health = await firebaseRagApi.healthCheck(selectedTopic);
      setIsConnected(health.rag_system === 'initialized');
      setConnectionError(null);
    } catch (error: any) {
      setIsConnected(false);
      const errorMessage = error.message || 'Failed to connect to Firebase RAG system';
      setConnectionError(errorMessage);
      console.error('RAG connection error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected || !conversationId) return;

    const startTime = Date.now();
    if (debugMode) console.log('⏱️ Message processing started');

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Call onMessageSent callback
    onMessageSent?.(userMessage);

    try {
      // Analyze user message for metadata
      const analysis = conversationService.analyzeUserMessageSync(currentQuery);
      
      // Add user message to conversation with sliding window
      const userMessageMetadata: MessageMetadata = {
        intent: analysis.intent,
        topics: analysis.topics,
        urgency: analysis.urgency
      };
      
      // Add user message to Firestore (async, don't wait)
      conversationService.addMessage(conversationId, currentQuery, 'user', userMessageMetadata);
      
      // Use local messages state instead of Firestore read (much faster)
      const localMessages = messages.filter(msg => msg.sender === 'user' || msg.sender === 'ai');
      // Limit to last maxMessages for sliding window
      const limitedMessages = localMessages.slice(-maxMessages);
      const chatHistory = limitedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      if (debugMode) console.log(`📊 Using local conversation history: ${chatHistory.length} messages (limited to ${maxMessages})`);
      
      let aiResponse: string;
      let responseMetadata: any;
      
      // COLD START OPTIMIZATION: Only query RAG if we don't have context yet
      if (debugMode) console.log(`🔍 hasRAGContext state: ${hasRAGContext}`);
      if (!hasRAGContext) {
        if (debugMode) console.log('🚀 Cold start: Querying RAG system for initial context');
        
        // Query the RAG system with conversation history (first time only)
        const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
        const systemPrompt = SYSTEM_PROMPTS[selectedTopic as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general;
        
        const ragRequest: RAGQueryRequest = {
          query: currentQuery,
          topK: 5,
          topic: selectedTopic,
          conversationHistory: chatHistory,
          systemPrompt: systemPrompt
        };

        const response = await firebaseRagApi.queryRAGSimplified(ragRequest);
        aiResponse = response.response;
        responseMetadata = response.metadata;
        
        // Mark that we now have RAG context
        setHasRAGContext(true);
        if (debugMode) console.log('✅ hasRAGContext set to true');
        
        // Inject RAG context into conversation for future use
        await conversationService.injectRAGContext(
          conversationId,
          response,
          currentQuery,
          analysis.topics
        );
        
        if (debugMode) console.log('✅ RAG context injected - future messages will use conversation history only');
        
      } else {
        if (debugMode) console.log('⚡ Using conversation history only (RAG context already available)');
        
        // Use conversation history only - call DeepSeek directly without RAG
        const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
        aiResponse = await generateConversationOnlyResponse(
          currentQuery,
          chatHistory,
          selectedTopicData?.name || 'mathematics'
        );
        responseMetadata = {
          chunks_used: 0, // No new chunks used
          best_similarity: 1.0, // Using existing context
          query_time: 0.1 // Fast response
        };
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        metadata: {
          chunks_used: responseMetadata.chunks_used,
          similarity: responseMetadata.best_similarity,
          query_time: responseMetadata.query_time
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Call onResponseReceived callback
      onResponseReceived?.(aiMessage);
      
      // Add AI response to conversation with sliding window (async, don't wait)
      const aiMessageMetadata: MessageMetadata = {
        intent: 'response',
        topics: analysis.topics,
        chunks_used: responseMetadata.chunks_used,
        similarity: responseMetadata.best_similarity,
        query_time: responseMetadata.query_time
      };
      
      conversationService.addMessage(conversationId, aiResponse, 'assistant', aiMessageMetadata);
      
      const endTime = Date.now();
      if (debugMode) console.log(`⏱️ Total processing time: ${endTime - startTime}ms`);
      
    } catch (error: any) {
      console.error('Message processing error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I encountered an error while processing your question: ${error.message || 'Unknown error'}. Please try again or check if the RAG system is properly configured.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Call onResponseReceived callback for error
      onResponseReceived?.(errorMessage);
      
      // Add error message to conversation
      await conversationService.addMessage(conversationId, errorMessage.content, 'assistant', {
        intent: 'error_response'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, show a message that file upload is not available with Firebase Functions
    const infoMessage: Message = {
      id: Date.now().toString(),
      content: `📄 File upload is not currently available with Firebase Functions. The system is using pre-loaded content for testing. You can ask questions about the selected topic!`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, infoMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Generate response using conversation history only (no RAG)
  const generateConversationOnlyResponse = async (
    userQuery: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    subject: string
  ): Promise<string> => {
    try {
      if (debugMode) console.log('🎯 Calling DeepSeek directly with conversation history only');
      
      // Build messages array with conversation history
      let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
      
      // Add system prompt
      const systemPrompt = SYSTEM_PROMPTS[selectedTopic as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general;
      messages.push({
        role: 'system',
        content: systemPrompt
      });

      // Add conversation history
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });

      // Add current user query
      messages.push({
        role: 'user',
        content: userQuery
      });

      // Safety check: Never send more than maxMessages
      if (messages.length > maxMessages) {
        if (debugMode) console.warn(`⚠️ Too many messages (${messages.length}), limiting to ${maxMessages}`);
        messages = messages.slice(-maxMessages); // Keep only the last maxMessages
      }
      
      if (debugMode) console.log(`📝 Sending ${messages.length} messages to DeepSeek (conversation history only)`);
      
      // Call DeepSeek API directly
      const deepSeekStart = Date.now();
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-560bea5180c04cb286d413aac21e585c'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      
      const deepSeekEnd = Date.now();
      if (debugMode) console.log(`✅ DeepSeek response generated (conversation history only) - ${deepSeekEnd - deepSeekStart}ms`);
      return text;
    } catch (error) {
      console.error('Error generating conversation-only response:', error);
      return `I'm sorry, I encountered an error while processing your question. Please try again.`;
    }
  };

  return (
    <div className={`h-full flex flex-col animate-fade-in ${className}`} style={style}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Tutor (Optimized)</h1>
                <p className="text-sm text-muted-foreground font-normal">
                  Your personal learning assistant with RAG - Cold Start Optimized
                </p>
              </div>
            </CardTitle>
            
            {/* Connection Status */}
            <div className="flex items-center gap-3">
              {isConnected === null ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Connecting...</span>
                </div>
              ) : isConnected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">RAG Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">RAG Offline</span>
                </div>
              )}
              
              {/* RAG Context Status */}
              {hasRAGContext && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Context Loaded</span>
                </div>
              )}
              
              {/* Upload Button */}
              {enableFileUpload && (
                <div className="relative">
                  <input
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={!isConnected}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isConnected}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Test Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Connection Error Alert */}
          {connectionError && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {connectionError}. Please ensure the RAG backend is running and properly configured.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Upload Status */}
          {uploadStatus.isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{uploadStatus.message}</span>
              </div>
              <Progress value={uploadStatus.progress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Topic Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">Study Topic:</span>
            </div>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{topic.name}</div>
                          <div className="text-xs text-muted-foreground">{topic.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {topics.find(t => t.id === selectedTopic)?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        {enableQuickPrompts && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleQuickPrompt(prompt.text)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <prompt.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{prompt.text}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {prompt.subject}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <Card className={`flex flex-col ${enableQuickPrompts ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-primary text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">AI Tutor (Optimized)</h3>
                <p className="text-sm text-muted-foreground">
                  {hasRAGContext ? 'Context Loaded • Fast Mode' : 'Cold Start • Loading Context'}
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.sender === "ai" ? (
                      <div className="text-sm">
                        <MarkdownFormatter content={message.content} />
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.metadata && message.sender === "ai" && (
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          {message.metadata.chunks_used !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.chunks_used} chunks
                            </Badge>
                          )}
                          {message.metadata.similarity && (
                            <Badge variant="outline" className="text-xs">
                              {(message.metadata.similarity * 100).toFixed(0)}% match
                            </Badge>
                          )}
                          {message.metadata.query_time && (
                            <span className="text-xs">
                              {message.metadata.query_time.toFixed(2)}s
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Ask me anything about your studies..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[60px] resize-none pr-12"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 bottom-2"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping || !isConnected}
                className="h-[60px] w-12 bg-gradient-primary hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press Enter to send, Shift + Enter for new line
              </p>
              {!isConnected && (
                <p className="text-xs text-red-500">
                  RAG system offline - responses may be limited
                </p>
              )}
              {hasRAGContext && (
                <p className="text-xs text-blue-500">
                  ⚡ Fast mode: Using conversation context
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
