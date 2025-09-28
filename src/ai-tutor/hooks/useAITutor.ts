import { useState, useEffect, useCallback } from 'react';
import { firebaseRagApi } from '../services/firebaseRagApi';
import { conversationService } from '../services/conversationService';
import { UseAITutorReturn, Message, MessageMetadata } from '../types';
import { debugLog, debugError } from '../utils/debug';

export const useAITutor = (
  topics: any[],
  userId: string = 'user',
  maxMessages: number = 10
): UseAITutorReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('probability');
  const [hasRAGContext, setHasRAGContext] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');

  // Initialize conversation and check RAG system connection
  useEffect(() => {
    initializeConversation();
    checkRAGConnection();
  }, [selectedTopic]);

  const initializeConversation = async () => {
    try {
      const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
      const title = `AI Tutor - ${selectedTopicData?.name || 'Mathematics'}`;
      const newConversationId = await conversationService.createConversation(
        userId,
        title,
        selectedTopic
      );
      setConversationId(newConversationId);
      debugLog('Conversation initialized:', newConversationId);
      
      // Load any existing conversation history
      await loadConversationHistory(newConversationId);
    } catch (error) {
      debugError('Failed to initialize conversation:', error);
    }
  };

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
        
        setMessages(uiMessages);
        
        // Check if conversation already has RAG context
        const hasContext = conversationService.hasRAGContext(conversationHistory);
        setHasRAGContext(hasContext);
        
        debugLog(`Loaded ${uiMessages.length} messages from conversation history`);
        debugLog(`RAG context available: ${hasContext}`);
      }
    } catch (error) {
      debugError('Failed to load conversation history:', error);
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
      debugError('RAG connection error:', error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !isConnected || !conversationId) return;

    const startTime = Date.now();
    debugLog('⏱️ Message processing started');

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Analyze user message for metadata
      const analysis = conversationService.analyzeUserMessageSync(content);
      
      // Add user message to conversation with sliding window
      const userMessageMetadata: MessageMetadata = {
        intent: analysis.intent,
        topics: analysis.topics,
        urgency: analysis.urgency
      };
      
      // Add user message to Firestore (async, don't wait)
      conversationService.addMessage(conversationId, content, 'user', userMessageMetadata);
      
      // Use local messages state instead of Firestore read (much faster)
      const localMessages = messages.filter(msg => msg.sender === 'user' || msg.sender === 'ai');
      // Limit to last maxMessages for sliding window
      const limitedMessages = localMessages.slice(-maxMessages);
      const chatHistory = limitedMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      debugLog(`📊 Using local conversation history: ${chatHistory.length} messages (limited to ${maxMessages})`);
      
      let aiResponse: string;
      let responseMetadata: any;
      
      // COLD START OPTIMIZATION: Only query RAG if we don't have context yet
      debugLog(`🔍 hasRAGContext state: ${hasRAGContext}`);
      if (!hasRAGContext) {
        debugLog('🚀 Cold start: Querying RAG system for initial context');
        
        // Query the RAG system with conversation history (first time only)
        const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
        const systemPrompt = `You are an expert AI tutor specializing in ${selectedTopicData?.name || 'mathematics'}. Use the provided context and conversation history to give detailed, accurate, and educational explanations. Maintain context from previous messages in the conversation. If the context doesn't contain enough information to answer the question, please say so.`;
        
        const ragRequest = {
          query: content,
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
        debugLog('✅ hasRAGContext set to true');
        
        // Inject RAG context into conversation for future use
        await conversationService.injectRAGContext(
          conversationId,
          response,
          content,
          analysis.topics
        );
        
        debugLog('✅ RAG context injected - future messages will use conversation history only');
        
      } else {
        debugLog('⚡ Using conversation history only (RAG context already available)');
        
        // Use conversation history only - call DeepSeek directly without RAG
        const selectedTopicData = topics.find(topic => topic.id === selectedTopic);
        aiResponse = await generateConversationOnlyResponse(
          content,
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
      debugLog(`⏱️ Total processing time: ${endTime - startTime}ms`);
      
    } catch (error: any) {
      debugError('Message processing error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I encountered an error while processing your question: ${error.message || 'Unknown error'}. Please try again or check if the RAG system is properly configured.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Add error message to conversation
      await conversationService.addMessage(conversationId, errorMessage.content, 'assistant', {
        intent: 'error_response'
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, isConnected, conversationId, hasRAGContext, selectedTopic, topics, maxMessages]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setHasRAGContext(false);
    setConversationId('');
  }, []);

  const retryConnection = useCallback(async () => {
    await checkRAGConnection();
  }, [selectedTopic]);

  // Generate response using conversation history only (no RAG)
  const generateConversationOnlyResponse = async (
    userQuery: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    subject: string
  ): Promise<string> => {
    try {
      debugLog('🎯 Calling DeepSeek directly with conversation history only');
      
      // Build messages array with conversation history
      let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
      
      // Add system prompt
      messages.push({
        role: 'system',
        content: `You are an expert AI tutor specializing in ${subject}. Use the conversation history to provide helpful, educational responses. The context from previous messages should be sufficient to answer follow-up questions. Maintain the conversation flow and build upon previous explanations.`
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
        debugLog(`⚠️ Too many messages (${messages.length}), limiting to ${maxMessages}`);
        messages = messages.slice(-maxMessages); // Keep only the last maxMessages
      }
      
      debugLog(`📝 Sending ${messages.length} messages to DeepSeek (conversation history only)`);
      
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
      debugLog(`✅ DeepSeek response generated (conversation history only) - ${deepSeekEnd - deepSeekStart}ms`);
      return text;
    } catch (error) {
      debugError('Error generating conversation-only response:', error);
      return `I'm sorry, I encountered an error while processing your question. Please try again.`;
    }
  };

  return {
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
  };
};
