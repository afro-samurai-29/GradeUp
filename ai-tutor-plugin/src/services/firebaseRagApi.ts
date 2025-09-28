// =============================================================================
// FIREBASE RAG API SERVICE - Frontend Integration with Firebase Functions
// =============================================================================

import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { RAGQueryRequest, RAGQueryResponse, TestEmbeddingsResponse } from '../types';

class FirebaseRAGApiService {
  private ragQueryFunction: any;
  private testEmbeddingsFunction: any;

  constructor() {
    // Initialize Firebase Functions
    this.ragQueryFunction = httpsCallable(functions, 'ragQuery');
    this.testEmbeddingsFunction = httpsCallable(functions, 'testEmbeddings');
  }

  /**
   * Query the RAG system using Firebase Functions
   */
  async queryRAG(request: RAGQueryRequest): Promise<RAGQueryResponse> {
    try {
      console.log('🔍 Querying RAG system:', request.query);
      
      const result = await this.ragQueryFunction({
        query: request.query,
        systemPrompt: request.systemPrompt,
        topK: request.topK || 4,
        topic: request.topic || 'probability',
        conversationHistory: request.conversationHistory || []
      });

      if (result.data.success) {
        console.log('✅ RAG query successful');
        return result.data;
      } else {
        throw new Error('RAG query failed');
      }
    } catch (error: any) {
      console.error('❌ RAG query error:', error);
      // Extract more detailed error information
      const errorMessage = error.message || error.details || 'Failed to query RAG system';
      console.error('Detailed error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Test the embeddings document structure
   */
  async testEmbeddings(topic: string = 'probability'): Promise<TestEmbeddingsResponse> {
    try {
      console.log('🧪 Testing embeddings document for topic:', topic);
      
      const result = await this.testEmbeddingsFunction({ topic });
      
      if (result.data.success) {
        console.log('✅ Embeddings test successful');
        return result.data;
      } else {
        throw new Error('Embeddings test failed');
      }
    } catch (error: any) {
      console.error('❌ Embeddings test error:', error);
      // Extract more detailed error information
      const errorMessage = error.message || error.details || 'Failed to test embeddings';
      console.error('Detailed error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Health check - test if the RAG system is working
   */
  async healthCheck(topic: string = 'probability'): Promise<{ status: string; rag_system: string }> {
    try {
      const result = await this.testEmbeddings(topic);
      return {
        status: 'healthy',
        rag_system: result.success ? 'initialized' : 'error'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        rag_system: 'error'
      };
    }
  }

  /**
   * Get a simplified response format compatible with the existing UI
   */
  async queryRAGSimplified(request: RAGQueryRequest): Promise<{
    success: boolean;
    response: string;
    metadata: {
      chunks_used: number;
      best_similarity: number;
      query_time: number;
    };
    error?: string;
  }> {
    try {
      const result = await this.queryRAG(request);
      
      // Calculate best similarity from the similarities array
      const bestSimilarity = result.context.similarities.length > 0 
        ? Math.max(...result.context.similarities.map(s => s.similarity))
        : 0;

      return {
        success: result.success,
        response: result.response,
        metadata: {
          chunks_used: result.context.topChunksUsed,
          best_similarity: bestSimilarity,
          query_time: 0 // Firebase Functions don't provide timing info easily
        }
      };
    } catch (error: any) {
      return {
        success: false,
        response: '',
        metadata: {
          chunks_used: 0,
          best_similarity: 0,
          query_time: 0
        },
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const firebaseRagApi = new FirebaseRAGApiService();
export default firebaseRagApi;
