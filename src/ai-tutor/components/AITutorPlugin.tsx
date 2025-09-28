import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { firebaseRagApi } from "../services/firebaseRagApi";
import { conversationService } from "../services/conversationService";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RAGQueryRequest, ConversationMessage, MessageMetadata } from "../types";
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
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>(defaultTopic);

  // Update selectedTopic when defaultTopic prop changes
  useEffect(() => {
    setSelectedTopic(defaultTopic);
  }, [defaultTopic]);

  // Update cooking message in real-time
  const [cookingMessage, setCookingMessage] = useState("Let me cook... 🍳");
  
  useEffect(() => {
    if (!isTyping || !typingStartTime) {
      setCookingMessage("Let me cook... 🍳");
      return;
    }
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - typingStartTime;
      const seconds = Math.floor(elapsed / 1000);
      
      if (seconds < 3) {
        setCookingMessage("Let me cook... 🍳");
      } else if (seconds < 6) {
        setCookingMessage("Still cooking... 👨‍🍳");
      } else if (seconds < 10) {
        setCookingMessage("Almost done... 🔥");
      } else {
        setCookingMessage("This is taking longer than expected... 😅");
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTyping, typingStartTime]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const [uploadStatus, setUploadStatus] = useState<{
    isUploading: boolean;
    progress: number;
    message: string;
  }>({ isUploading: false, progress: 0, message: "" });
  
  // Conversation management state
  const [conversationId, setConversationId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRAGContext, setHasRAGContext] = useState(false);
  const [hasNotesForCurrentTopic, setHasNotesForCurrentTopic] = useState(false);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set RAG connection status (no need to actually test)
  useEffect(() => {
    // Skip health check entirely - just assume it's working
    setIsConnected(true);
    setConnectionError(null);
    console.log('🍳 AI Tutor ready to cook! (Health check skipped)');
  }, []); // Empty dependency array = run only once

  // Initialize conversation when topic changes
  useEffect(() => {
    // Reset state when topic changes
    setIsInitialized(false);
    setHasRAGContext(false);
    setHasNotesForCurrentTopic(false); // Reset notes state for new topic
    setConversationId('');
    setMessages(initialMessages);
    
    initializeConversation();
  }, [selectedTopic]);

  // Initialize conversation when component mounts or topic changes
  const initializeConversation = async (): Promise<string> => {
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
        return newConversationId;
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        throw error;
      }
    }
    return conversationId;
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const startTime = Date.now();
    if (debugMode) console.log('⏱️ Message processing started');

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      if (debugMode) console.log('📝 Adding user message to state:', userMessage.content);
      if (debugMode) console.log('📊 Total messages in state:', newMessages.length);
      return newMessages;
    });
    const currentQuery = inputValue;
    setInputValue("");
    setIsTyping(true);
    setTypingStartTime(Date.now());

    // Call onMessageSent callback
    onMessageSent?.(userMessage);

    // Ensure conversation is initialized
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = await initializeConversation();
    }

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
      if (currentConversationId) {
        conversationService.addMessage(currentConversationId, currentQuery, 'user', userMessageMetadata);
      }
      
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
      
      // Try RAG first, but fallback gracefully if it fails
      if (debugMode) console.log(`🔍 hasRAGContext state: ${hasRAGContext}`);
      
      // Smart hybrid approach: Full notes on first question, conversation-only on follow-ups
      const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
      
      if (!hasNotesForCurrentTopic) {
        // First question in this topic - use full notes
        if (debugMode) console.log('📚 First question in topic - loading full notes from Firebase');
        
        aiResponse = await generateResponseWithNotes(
          currentQuery,
          chatHistory,
          selectedTopic,
          selectedTopicData?.name || 'mathematics'
        );
        
        setHasNotesForCurrentTopic(true); // Mark that we've loaded notes for this topic
        
        responseMetadata = {
          chunks_used: 1, // Using full notes
          best_similarity: 1.0, // Perfect match since we use all relevant notes
          query_time: Date.now() - startTime
        };
        
        if (debugMode) console.log('✅ Response with full notes received, length:', aiResponse?.length);
        
      } else {
        // Follow-up question - use conversation history only (save tokens!)
        if (debugMode) console.log('💬 Follow-up question - using conversation history only');
        
        aiResponse = await generateConversationOnlyResponse(
          currentQuery,
          chatHistory,
          selectedTopicData?.name || 'mathematics'
        );
        
        responseMetadata = {
          chunks_used: 0, // No notes, just conversation
          best_similarity: 0.9, // High confidence from conversation context
          query_time: Date.now() - startTime
        };
        
        if (debugMode) console.log('✅ Conversation-only response received, length:', aiResponse?.length);
      }
      
      if (debugMode) console.log('📝 Response preview:', aiResponse?.substring(0, 100));
      
      if (debugMode) console.log('🔍 Creating AI message with content length:', aiResponse?.length);
      if (debugMode) console.log('🔍 AI response content preview:', aiResponse?.substring(0, 100));
      
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
      
        setMessages(prev => {
          const newMessages = [...prev, aiMessage];
          if (debugMode) console.log('📝 Adding AI message to state:', aiMessage.id, 'Content length:', aiMessage.content?.length);
          if (debugMode) console.log('📝 AI message content preview:', aiMessage.content?.substring(0, 100) + '...');
          if (debugMode) console.log('📊 Total messages in state:', newMessages.length);
          return newMessages;
        });
      
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
      
      if (currentConversationId) {
        conversationService.addMessage(currentConversationId, aiResponse, 'assistant', aiMessageMetadata);
      }
      
      const endTime = Date.now();
      if (debugMode) console.log(`⏱️ Total processing time: ${endTime - startTime}ms`);
      
    } catch (error: any) {
      console.error('Message processing error:', error);
      
      let errorContent: string;
      if (error.message?.includes('timeout')) {
        errorContent = `⏰ Oops! My cooking timer went off - I got distracted while preparing your answer! 😅 The system is taking longer than expected. Please try asking your question again, and I'll make sure to serve it up fresh! 🍳`;
      } else {
        errorContent = `🍳 I'm sorry, I encountered an error while cooking up your answer: ${error.message || 'Unknown error'}. Please try again or check if the RAG system is properly configured. 👨‍🍳`;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Call onResponseReceived callback for error
      onResponseReceived?.(errorMessage);
      
      // Add error message to conversation
      if (currentConversationId) {
        await conversationService.addMessage(currentConversationId, errorMessage.content, 'assistant', {
          intent: 'error_response'
        });
      }
    } finally {
      setIsTyping(false);
      setTypingStartTime(null);
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

  // Fetch real notes from Firebase
  const fetchRealNotesFromFirebase = async (topic: string): Promise<string> => {
    try {
      // Map topics to Firebase document paths (same as RAG system)
      const topicPaths: Record<string, string> = {
        'probability': 'notes/content/mathematics/probability',
        'functions': 'notes/content/mathematics/functions',
        'physics': 'notes/content/physics/mechanics',
        'chemistry': 'notes/content/chemistry/organic',
        'programming': 'notes/content/computer-science/programming',
        'history': 'notes/content/history/world',
        'general': 'notes/content/general/knowledge'
      };

      const documentPath = topicPaths[topic] || topicPaths.general;
      
      if (debugMode) console.log(`📖 Fetching real-notes from: ${documentPath}`);
      
      const docRef = doc(db, documentPath);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const realNotes = data['real-notes'];
        
        if (realNotes && typeof realNotes === 'string') {
          if (debugMode) console.log(`✅ Real notes fetched, length: ${realNotes.length} characters`);
          return realNotes;
        } else {
          console.warn(`⚠️ real-notes field not found or invalid in ${documentPath}`);
          // Fallback to hardcoded notes
          return getNotesForTopic(topic);
        }
      } else {
        console.warn(`⚠️ Document ${documentPath} does not exist`);
        // Fallback to hardcoded notes
        return getNotesForTopic(topic);
      }
    } catch (error) {
      console.error('❌ Error fetching real notes from Firebase:', error);
      // Fallback to hardcoded notes
      return getNotesForTopic(topic);
    }
  };

  // Generate response using topic notes directly (much simpler than RAG)
  const generateResponseWithNotes = async (
    userQuery: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    topic: string,
    subject: string
  ): Promise<string> => {
    try {
      if (debugMode) console.log('📚 Fetching real notes from Firebase for topic:', topic);
      
      // Fetch the real notes from Firebase instead of hardcoded ones
      const topicNotes = await fetchRealNotesFromFirebase(topic);
      
      // Build messages array with notes + conversation history
      let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
      
      // Add system prompt with notes
      const systemPrompt = SYSTEM_PROMPTS[selectedTopic as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general;
      messages.push({
        role: 'system',
        content: `${systemPrompt}

COURSE NOTES FOR ${subject.toUpperCase()}:
${topicNotes}

FORMATTING INSTRUCTIONS:
- Write in clear, clean prose without excessive markdown symbols
- Use simple headings when needed (## for main topics)
- Only use **bold** sparingly for the most important terms
- Use numbered lists for step-by-step instructions
- Use bullet points for simple lists
- Write mathematical expressions in plain text like P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- Keep formatting minimal and focus on clarity and readability

Please provide comprehensive, detailed explanations with examples and step-by-step breakdowns. Focus on clear, readable content over fancy formatting.`
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
        messages = messages.slice(-maxMessages);
      }
      
      if (debugMode) console.log(`📝 Sending ${messages.length} messages to DeepSeek with notes`);
      
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
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from DeepSeek API');
      }
      
      const text = data.choices[0].message.content;
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from DeepSeek API');
      }
      
      const deepSeekEnd = Date.now();
      if (debugMode) console.log(`✅ DeepSeek response with notes - ${deepSeekEnd - deepSeekStart}ms, length: ${text.length}`);
      return text;
    } catch (error) {
      console.error('Error generating response with notes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I'm sorry, I encountered an error while processing your question: ${errorMessage}. Please try again.`;
    }
  };

  // Helper function to get notes for a topic
  const getNotesForTopic = (topic: string): string => {
    const notes = {
      probability: `
# Probability Notes

## Basic Concepts
- Probability is the measure of likelihood that an event will occur
- Probability ranges from 0 (impossible) to 1 (certain)
- P(A) = Number of favorable outcomes / Total number of possible outcomes

## Types of Events
- **Mutually Exclusive**: Events that cannot occur at the same time
- **Independent**: Events where one doesn't affect the other
- **Dependent**: Events where one affects the probability of the other

## Key Formulas
- **Addition Rule**: P(A or B) = P(A) + P(B) - P(A and B)
- **Multiplication Rule**: P(A and B) = P(A) × P(B|A)
- **Conditional Probability**: P(A|B) = P(A and B) / P(B)

## Examples
1. Rolling a die: P(getting a 3) = 1/6
2. Drawing cards: P(heart) = 13/52 = 1/4
3. Coin flips: P(heads) = 1/2

## Problem-Solving Steps
1. Identify the type of probability problem
2. List all possible outcomes
3. Count favorable outcomes
4. Apply the appropriate formula
5. Simplify the fraction if needed
      `,
      
      functions: `
# Functions Notes

## What is a Function?
- A function is a relation where each input has exactly one output
- Written as f(x) = expression
- Domain: all possible input values
- Range: all possible output values

## Types of Functions
- **Linear**: f(x) = mx + b (straight line)
- **Quadratic**: f(x) = ax² + bx + c (parabola)
- **Exponential**: f(x) = aˣ
- **Logarithmic**: f(x) = log(x)

## Key Concepts
- **Vertical Line Test**: If any vertical line intersects the graph more than once, it's not a function
- **One-to-One**: Each output corresponds to exactly one input
- **Inverse Functions**: f⁻¹(x) "undoes" what f(x) does

## Transformations
- f(x) + k: shifts up k units
- f(x) - k: shifts down k units
- f(x + h): shifts left h units
- f(x - h): shifts right h units
- af(x): vertical stretch by factor a
- f(bx): horizontal compression by factor 1/b

## Examples
1. f(x) = 2x + 3 is a linear function
2. g(x) = x² - 4x + 3 is a quadratic function
3. h(x) = 3ˣ is an exponential function
      `,
      
      // Add more topics as needed
      general: `
# Mathematics Study Notes

## General Problem-Solving Strategy
1. Read the problem carefully
2. Identify what you're looking for
3. List what you know
4. Choose the appropriate method/formula
5. Solve step by step
6. Check your answer

## Key Mathematical Principles
- Always show your work
- Check answers by substituting back
- Use proper mathematical notation
- Explain your reasoning clearly
      `
    };
    
    return notes[topic as keyof typeof notes] || notes.general;
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
        content: `${systemPrompt}

FORMATTING INSTRUCTIONS:
- Write in clear, clean prose without excessive markdown symbols
- Use simple headings when needed (## for main topics)
- Only use **bold** sparingly for the most important terms
- Use numbered lists for step-by-step instructions
- Use bullet points for simple lists
- Write mathematical expressions in plain text like P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- Keep formatting minimal and focus on clarity and readability

Please provide comprehensive, detailed explanations with examples and step-by-step breakdowns. Focus on clear, readable content over fancy formatting.`
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
          max_tokens: 4000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from DeepSeek API');
      }
      
      const text = data.choices[0].message.content;
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from DeepSeek API');
      }
      
      const deepSeekEnd = Date.now();
      if (debugMode) console.log(`✅ DeepSeek response generated (conversation history only) - ${deepSeekEnd - deepSeekStart}ms, length: ${text.length}`);
      return text;
    } catch (error) {
      console.error('Error generating conversation-only response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I'm sorry, I encountered an error while processing your question: ${errorMessage}. Please try again.`;
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`} style={style}>
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 relative ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ minHeight: '40px' }}
              >
                {message.sender === "ai" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg relative z-10 ${
                    message.sender === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                  style={{ 
                    backgroundColor: message.sender === "user" ? "#10b981" : "#f3f4f6",
                    minHeight: '20px'
                  }}
                >
                  {message.sender === "ai" ? (
                    <div className="text-sm">
                      {debugMode && (() => { console.log('🎨 Rendering AI message:', message.id, 'Content length:', message.content?.length, 'Content preview:', message.content?.substring(0, 100)); return null; })()}
                      {message.content ? (
                        <MarkdownFormatter content={message.content} />
                      ) : (
                        <div className="text-gray-500 italic">Loading response...</div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>

                {message.sender === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {cookingMessage}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t p-4 flex-shrink-0 bg-white">
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
                className="min-h-[50px] resize-none pr-12"
              />
            </div>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-[50px] w-12 bg-green-500 hover:bg-green-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};