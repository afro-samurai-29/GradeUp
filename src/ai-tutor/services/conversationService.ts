import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ConversationMessage, MessageMetadata, ConversationContext, ChatMessage } from '../types';

export class ConversationService {
  private readonly MAX_MESSAGES = 10; // Sliding window size

  /**
   * Create a new conversation with metadata
   */
  async createConversation(
    userId: string, 
    title: string, 
    topic: string = 'probability'
  ): Promise<string> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const conversationData = {
        userId,
        title,
        topic,
        lastMessage: '',
        lastActivity: serverTimestamp(),
        messageCount: 0,
        createdAt: serverTimestamp()
      };

      const conversationDoc = await addDoc(conversationsRef, conversationData);
      console.log('Created conversation:', conversationDoc.id);
      return conversationDoc.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Add message with sliding window pattern - keeps only last 10 messages
   */
  async addMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant',
    metadata?: MessageMetadata
  ): Promise<string> {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const conversationRef = doc(db, 'conversations', conversationId);
      
      // 1. Count current messages
      const countQuery = query(messagesRef, orderBy('timestamp', 'desc'));
      const countSnapshot = await getDocs(countQuery);
      const currentMessageCount = countSnapshot.docs.length;
      console.log(`📊 Current message count: ${currentMessageCount} (max: ${this.MAX_MESSAGES})`);
      
      // 2. Delete old messages if we have 10 or more (sliding window)
      if (currentMessageCount >= this.MAX_MESSAGES) {
        // Keep 9 messages, delete the rest (making room for 1 new message = 10 total)
        const messagesToDelete = countSnapshot.docs.slice(this.MAX_MESSAGES - 1); 
        console.log(`🗑️ Deleting ${messagesToDelete.length} old messages (keeping ${this.MAX_MESSAGES - 1})`);
        
        // Batch delete for performance
        const deletePromises = messagesToDelete.map(messageDoc => 
          deleteDoc(messageDoc.ref)
        );
        await Promise.all(deletePromises);
        
        console.log(`✅ Deleted ${messagesToDelete.length} old messages to maintain sliding window`);
      }
      
      // 3. Add the new message
      const messageData = {
        conversationId,
        content,
        role,
        timestamp: serverTimestamp(),
        metadata: metadata || {}
      };

      const messageDoc = await addDoc(messagesRef, messageData);

      // 4. Update conversation metadata
      await updateDoc(conversationRef, {
        lastMessage: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        lastActivity: serverTimestamp(),
        messageCount: Math.min(currentMessageCount + 1, this.MAX_MESSAGES) // Never exceed 10
      });

      return messageDoc.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Get messages for AI context (always 10 or fewer due to sliding window)
   */
  async getMessagesForContext(conversationId: string): Promise<ConversationMessage[]> {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc')); // Chronological order
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as ConversationMessage));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Get conversation details
   */
  async getConversation(conversationId: string): Promise<ConversationContext | null> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        return null;
      }
      
      return {
        conversationId,
        ...conversationDoc.data()
      } as ConversationContext;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, newTitle: string): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        title: newTitle,
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  }

  /**
   * Update conversation context
   */
  async updateConversationContext(
    conversationId: string,
    context: Partial<ConversationContext>
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        ...context,
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating conversation context:', error);
      throw error;
    }
  }

  /**
   * Real-time message subscription
   */
  subscribeToMessages(
    conversationId: string,
    callback: (messages: ConversationMessage[]) => void
  ): () => void {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages: ConversationMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ConversationMessage));
      callback(messages); // Always ≤10 messages due to sliding window
    });
  }

  /**
   * Convert conversation messages to AI provider format
   */
  convertToChatMessages(messages: ConversationMessage[]): ChatMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Inject RAG context into conversation (for cold start optimization)
   */
  async injectRAGContext(
    conversationId: string,
    ragResponse: {
      response: string;
      metadata: {
        chunks_used: number;
        best_similarity: number;
        query_time: number;
      };
      context?: {
        similarities: Array<{
          chunkId: string;
          chunkIndex: number;
          similarity: number;
          contentPreview: string;
        }>;
      };
    },
    userQuery: string,
    topics: string[]
  ): Promise<void> {
    try {
      // Add the RAG response as an assistant message with context metadata
      const ragMessageMetadata: MessageMetadata = {
        intent: 'rag_response',
        topics: topics,
        chunks_used: ragResponse.metadata.chunks_used,
        similarity: ragResponse.metadata.best_similarity,
        query_time: ragResponse.metadata.query_time,
        isRAGContext: true,
        ragChunks: ragResponse.context?.similarities || []
      };

      await this.addMessage(conversationId, ragResponse.response, 'assistant', ragMessageMetadata);
      console.log('RAG context injected into conversation');
    } catch (error) {
      console.error('Error injecting RAG context:', error);
      throw error;
    }
  }

  /**
   * Check if conversation has RAG context (for optimization)
   */
  hasRAGContext(messages: ConversationMessage[]): boolean {
    return messages.some(msg => msg.metadata?.isRAGContext === true);
  }

  /**
   * Analyze user message for intent and topics (local analysis)
   */
  analyzeUserMessageSync(message: string): {
    intent: 'question' | 'help_request' | 'explanation' | 'example' | 'general';
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
  } {
    const messageLower = message.toLowerCase();
    
    // Intent detection
    let intent: 'question' | 'help_request' | 'explanation' | 'example' | 'general' = 'general';
    
    if (messageLower.includes('?') || messageLower.includes('what') || messageLower.includes('how') || messageLower.includes('why')) {
      intent = 'question';
    } else if (messageLower.includes('help') || messageLower.includes('stuck') || messageLower.includes('confused')) {
      intent = 'help_request';
    } else if (messageLower.includes('explain') || messageLower.includes('understand') || messageLower.includes('mean')) {
      intent = 'explanation';
    } else if (messageLower.includes('example') || messageLower.includes('show me') || messageLower.includes('demonstrate')) {
      intent = 'example';
    }
    
    // Topic extraction
    const topics: string[] = [];
    const topicKeywords = {
      'probability': ['probability', 'chance', 'likelihood', 'odds', 'random'],
      'functions': ['function', 'graph', 'equation', 'derivative', 'integral'],
      'calculus': ['calculus', 'derivative', 'integral', 'limit', 'continuous'],
      'algebra': ['algebra', 'equation', 'solve', 'variable', 'polynomial'],
      'statistics': ['statistics', 'mean', 'median', 'standard deviation', 'distribution']
    };
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    // Urgency detection
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (messageLower.includes('urgent') || messageLower.includes('asap') || messageLower.includes('quickly')) {
      urgency = 'high';
    } else if (messageLower.includes('soon') || messageLower.includes('important')) {
      urgency = 'medium';
    }
    
    return { intent, topics, urgency };
  }
}

// Export singleton instance
export const conversationService = new ConversationService();
