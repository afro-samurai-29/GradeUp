// =============================================================================
// AI TUTOR PLUGIN - TYPE DEFINITIONS
// =============================================================================

import { Timestamp } from 'firebase/firestore';
import { LucideIcon } from 'lucide-react';

// Core Message Interface
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "image";
  metadata?: {
    chunks_used?: number;
    similarity?: number;
    query_time?: number;
    intent?: string;
    topics?: string[];
    urgency?: 'low' | 'medium' | 'high';
    isRAGContext?: boolean;
    ragChunks?: Array<{
      chunkId: string;
      chunkIndex: number;
      similarity: number;
      contentPreview: string;
    }>;
  };
}

// Topic Configuration
export interface Topic {
  id: string;
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

// Conversation Message (Firestore format)
export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Timestamp;
  metadata?: {
    intent?: string;
    topics?: string[];
    aiModel?: string;
    turnId?: string;
    chunks_used?: number;
    similarity?: number;
    query_time?: number;
    isRAGContext?: boolean;
    ragChunks?: Array<{
      chunkId: string;
      chunkIndex: number;
      similarity: number;
      contentPreview: string;
    }>;
  };
}

// Message Metadata
export interface MessageMetadata {
  intent?: string;
  topics?: string[];
  aiModel?: string;
  turnId?: string;
  chunks_used?: number;
  similarity?: number;
  query_time?: number;
  urgency?: 'low' | 'medium' | 'high';
  isRAGContext?: boolean;
  ragChunks?: Array<{
    chunkId: string;
    chunkIndex: number;
    similarity: number;
    contentPreview: string;
  }>;
}

// Conversation Context
export interface ConversationContext {
  conversationId: string;
  title: string;
  topic: string;
  lastMessage: string;
  lastActivity: Timestamp;
  messageCount: number;
  userId?: string;
}

// Chat Message (AI Provider format)
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// RAG Query Request
export interface RAGQueryRequest {
  query: string;
  systemPrompt?: string;
  topK?: number;
  topic?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

// RAG Query Response
export interface RAGQueryResponse {
  success: boolean;
  query: string;
  response: string;
  context: {
    totalChunks: number;
    topChunksUsed: number;
    similarities: Array<{
      chunkId: string;
      chunkIndex: number;
      similarity: number;
      contentPreview: string;
    }>;
    metadata: {
      title: string;
      source_file: string;
      processed_at: string;
      total_characters: number;
      total_chunks: number;
    };
  };
}

// Test Embeddings Response
export interface TestEmbeddingsResponse {
  success: boolean;
  metadata: {
    title: string;
    source_file: string;
    processed_at: string;
    total_characters: number;
    total_chunks: number;
  };
  totalChunks: number;
  sampleChunk: {
    chunkId: string;
    chunkIndex: number;
    contentLength: number;
    embeddingLength: number;
    contentPreview: string;
  } | null;
}

// Plugin Props
export interface AITutorPluginProps {
  topics: Topic[];
  onMessageSent?: (message: Message) => void;
  onResponseReceived?: (response: Message) => void;
  initialMessages?: Message[];
  className?: string;
  style?: React.CSSProperties;
  userId?: string;
  defaultTopic?: string;
  enableQuickPrompts?: boolean;
  enableFileUpload?: boolean;
  maxMessages?: number;
  debugMode?: boolean;
}

// Firebase Provider Props
export interface FirebaseProviderProps {
  config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  children: React.ReactNode;
}

// Hook Return Types
export interface UseAITutorReturn {
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean | null;
  connectionError: string | null;
  selectedTopic: string;
  hasRAGContext: boolean;
  sendMessage: (content: string) => Promise<void>;
  setSelectedTopic: (topic: string) => void;
  clearConversation: () => void;
  retryConnection: () => Promise<void>;
}

export interface UseConversationReturn {
  conversationId: string | null;
  isInitialized: boolean;
  createConversation: (userId: string, title: string, topic: string) => Promise<string>;
  addMessage: (content: string, role: 'user' | 'assistant', metadata?: MessageMetadata) => Promise<string>;
  getMessages: () => Promise<ConversationMessage[]>;
  updateConversation: (updates: Partial<ConversationContext>) => Promise<void>;
}

// Error Types
export interface AITutorError {
  code: string;
  message: string;
  details?: any;
}

// Event Types
export interface MessageEvent {
  type: 'message_sent' | 'response_received' | 'error_occurred';
  data: Message | AITutorError;
  timestamp: Date;
}

// Configuration Types
export interface AITutorConfig {
  maxMessages: number;
  enableRAG: boolean;
  enableConversationHistory: boolean;
  enableMetadataTracking: boolean;
  enableDebugMode: boolean;
  defaultSystemPrompt: string;
  apiTimeouts: {
    ragQuery: number;
    healthCheck: number;
    messageSend: number;
  };
}
