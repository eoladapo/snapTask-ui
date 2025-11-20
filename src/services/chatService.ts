import api, { getErrorMessage } from './api';

// Chat-specific timeout (longer than default API timeout)
const CHAT_TIMEOUT = 20000; // 20 seconds for AI responses

/**
 * Conversation message interface
 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Chat response from backend
 */
export interface ChatResponse {
  message: string;
  response: string;
  actionPerformed?: boolean; // Indicates if AI performed a task action
  conversationContext?: any; // Context for multi-turn conversations (disambiguation, confirmation)
  timestamp: string;
  retryable?: boolean; // Indicates if the error is retryable
}

/**
 * Welcome message response from backend
 */
export interface WelcomeResponse {
  response: string;
  timestamp: string;
}

/**
 * Chat service for AI Task Assistant API communication
 */
export const chatService = {
  /**
   * Send a message to the AI assistant and get a response
   * @param message - User message (max 500 characters)
   * @param conversationHistory - Array of previous messages for context (last 10 pairs)
   * @param conversationContext - Optional context for multi-turn conversations (disambiguation, confirmation)
   * @returns Promise with chat response containing AI message and optional action status
   * @throws Error if request fails after retries or action execution fails
   */
  async sendMessage(
    message: string,
    conversationHistory: ConversationMessage[] = [],
    conversationContext?: any
  ): Promise<ChatResponse> {
    try {
      // Validate message on client side
      if (!message || message.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      // Validate message length on client side
      if (message.length > 500) {
        throw new Error('Message must be 500 characters or less');
      }

      const response = await api.post<ChatResponse>('/chat/message', {
        message,
        conversationHistory,
        conversationContext,
      }, {
        timeout: CHAT_TIMEOUT,
      });

      return response.data;
    } catch (error: any) {
      // Handle action-specific errors with detailed messages
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Invalid request. Please check your input.';
        const retryable = error.response?.data?.retryable !== false;
        const err = new Error(message) as any;
        err.retryable = retryable;
        throw err;
      }

      if (error.response?.status === 403) {
        const message = error.response?.data?.message || 'You don\'t have permission to perform this action.';
        const err = new Error(message) as any;
        err.retryable = false;
        throw err;
      }

      if (error.response?.status === 404) {
        const message = error.response?.data?.message || 'The requested resource was not found.';
        const err = new Error(message) as any;
        err.retryable = false;
        throw err;
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        const err = new Error('You\'re sending messages too quickly. Please wait a moment and try again.') as any;
        err.retryable = true;
        throw err;
      }

      // Handle AI service unavailability
      if (error.response?.status === 503) {
        const message = error.response?.data?.message || 'AI service is temporarily unavailable. Please try again in a few moments.';
        const retryable = error.response?.data?.retryable !== false;
        const err = new Error(message) as any;
        err.retryable = retryable;
        throw err;
      }

      // Handle gateway timeout
      if (error.response?.status === 504) {
        const message = error.response?.data?.message || 'Request timed out. The AI service is taking too long to respond. Please try again.';
        const err = new Error(message) as any;
        err.retryable = true;
        throw err;
      }

      // Handle server errors
      if (error.response?.status === 500) {
        const message = error.response?.data?.message || 'Server error occurred. Please try again.';
        const retryable = error.response?.data?.retryable !== false;
        const err = new Error(message) as any;
        err.retryable = retryable;
        throw err;
      }

      // Handle client-side timeout
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        const err = new Error('Request timed out. Please check your connection and try again.') as any;
        err.retryable = true;
        throw err;
      }

      // Handle network errors
      if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
        const err = new Error('No internet connection. Please check your network and try again.') as any;
        err.retryable = true;
        throw err;
      }

      // Use centralized error handling from api.ts
      const errorMessage = getErrorMessage(error);
      const err = new Error(errorMessage) as any;
      err.retryable = true; // Default to retryable for unknown errors
      throw err;
    }
  },

  /**
   * Get welcome message with task summary when chat is first opened
   * @returns Promise with welcome message from AI assistant
   * @throws Error if request fails after retries
   */
  async getWelcomeMessage(): Promise<WelcomeResponse> {
    try {
      const response = await api.get<WelcomeResponse>('/chat/welcome', {
        timeout: CHAT_TIMEOUT,
      });
      return response.data;
    } catch (error: any) {
      // Handle specific error types
      if (error.response?.status === 503) {
        throw new Error('AI service is temporarily unavailable. Please try again in a few moments.');
      }

      if (error.response?.status === 504) {
        throw new Error('Request timed out. The AI service is taking too long to respond. Please try again.');
      }

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('Request timed out. Please check your connection and try again.');
      }

      if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // Use centralized error handling from api.ts
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};
