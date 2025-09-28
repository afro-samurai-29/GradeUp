import { useState, useCallback } from 'react';
import { conversationService } from '../services/conversationService';
import { UseConversationReturn, ConversationMessage, MessageMetadata, ConversationContext } from '../types';

export const useConversation = (): UseConversationReturn => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const createConversation = useCallback(async (
    userId: string,
    title: string,
    topic: string
  ): Promise<string> => {
    try {
      const newConversationId = await conversationService.createConversation(userId, title, topic);
      setConversationId(newConversationId);
      setIsInitialized(true);
      return newConversationId;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }, []);

  const addMessage = useCallback(async (
    content: string,
    role: 'user' | 'assistant',
    metadata?: MessageMetadata
  ): Promise<string> => {
    if (!conversationId) {
      throw new Error('No active conversation');
    }

    try {
      return await conversationService.addMessage(conversationId, content, role, metadata);
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  }, [conversationId]);

  const getMessages = useCallback(async (): Promise<ConversationMessage[]> => {
    if (!conversationId) {
      return [];
    }

    try {
      return await conversationService.getMessagesForContext(conversationId);
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }, [conversationId]);

  const updateConversation = useCallback(async (
    updates: Partial<ConversationContext>
  ): Promise<void> => {
    if (!conversationId) {
      throw new Error('No active conversation');
    }

    try {
      await conversationService.updateConversationContext(conversationId, updates);
    } catch (error) {
      console.error('Failed to update conversation:', error);
      throw error;
    }
  }, [conversationId]);

  return {
    conversationId,
    isInitialized,
    createConversation,
    addMessage,
    getMessages,
    updateConversation
  };
};
