// =============================================================================
// AI TUTOR PLUGIN - MAIN EXPORT FILE
// =============================================================================

// Core Components
export { AITutorPlugin } from './components/AITutorPlugin';
export { MarkdownFormatter } from './components/MarkdownFormatter';

// Services
export { ConversationService, conversationService } from './services/conversationService';
export { FirebaseRAGApiService, firebaseRagApi } from './services/firebaseRagApi';

// Providers
export { FirebaseProvider } from './providers/FirebaseProvider';

// Types
export type {
  Message,
  Topic,
  ConversationMessage,
  MessageMetadata,
  ConversationContext,
  ChatMessage,
  RAGQueryRequest,
  RAGQueryResponse,
  TestEmbeddingsResponse
} from './types';

// Hooks
export { useAITutor } from './hooks/useAITutor';
export { useConversation } from './hooks/useConversation';

// Utils
export { setDebugMode, getDebugMode } from './utils/debug';
export { createTopic, validateTopic } from './utils/topicUtils';

// Constants
export { DEFAULT_TOPICS, QUICK_PROMPTS } from './constants';
