import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatService } from '../../services/chatService';
import type { ConversationMessage } from '../../services/chatService';
import { useTasks } from '../../hooks/useTasks';
import { useToastContext } from '../../context/ToastContext';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedWelcome, setHasLoadedWelcome] = useState(false);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Get task context and toast context
  const { fetchTasks } = useTasks();
  const { showSuccess, showError } = useToastContext();

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fetch welcome message on first open
  useEffect(() => {
    if (isOpen && !hasLoadedWelcome && messages.length === 0) {
      fetchWelcomeMessage();
    }
  }, [isOpen, hasLoadedWelcome, messages.length]);

  // Clear conversation history when closing chat
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setError(null);
      setHasLoadedWelcome(false);
      setConversationContext(null);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchWelcomeMessage = async () => {
    setIsLoadingWelcome(true);
    setError(null);

    try {
      const response = await chatService.getWelcomeMessage();
      
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages([welcomeMessage]);
      setHasLoadedWelcome(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load welcome message';
      setError(errorMessage);
      
      // Add fallback welcome message if AI service fails
      const fallbackMessage: Message = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: `Welcome! 👋 I'm your AI Task Assistant. I'm here to help you manage your tasks, but I'm having trouble connecting right now. Error: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([fallbackMessage]);
    } finally {
      setIsLoadingWelcome(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    // Validate message
    if (!messageContent || messageContent.trim().length === 0) {
      setError('Message cannot be empty');
      return;
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history (last 10 message pairs = 20 messages)
      const conversationHistory: ConversationMessage[] = messages
        .slice(-20)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Send message to backend with conversation context
      const response = await chatService.sendMessage(
        messageContent,
        conversationHistory,
        conversationContext
      );

      // Add AI response to UI
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation context if present in response
      if (response.conversationContext) {
        setConversationContext(response.conversationContext);
      } else {
        // Clear conversation context if not present (action completed or no context needed)
        setConversationContext(null);
      }

      // If AI performed a task action, refresh tasks and show success notification
      if (response.actionPerformed) {
        setIsPerformingAction(true);
        try {
          await fetchTasks();
          showSuccess('Task updated successfully');
        } catch (refreshError) {
          // Log error but don't disrupt the chat flow
          console.error('Failed to refresh tasks after AI action:', refreshError);
          showError('Task action completed, but failed to refresh task list');
        } finally {
          setIsPerformingAction(false);
        }
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Show error toast for action failures
      if (errorMessage.includes('task') || errorMessage.includes('action')) {
        showError(errorMessage);
      }
      
      // Determine if error is retryable (check custom property or message content)
      const isRetryable = err.retryable !== false && 
                          !errorMessage.includes('blocked') && 
                          !errorMessage.includes('content filters') &&
                          !errorMessage.includes('500 characters') &&
                          !errorMessage.includes('permission') &&
                          !errorMessage.includes('Authentication');
      
      // Build user-friendly error message with specific guidance
      let errorContent = `Sorry, I encountered an error: ${errorMessage}`;
      
      // Add specific retry suggestions based on error type
      if (isRetryable) {
        if (errorMessage.includes('timeout') || errorMessage.includes('took too long')) {
          errorContent += '\n\nThe request timed out. Please try sending your message again.';
        } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
          errorContent += '\n\nPlease check your internet connection and try again.';
        } else if (errorMessage.includes('database') || errorMessage.includes('Database')) {
          errorContent += '\n\nThere was a temporary database issue. Please try again in a moment.';
        } else if (errorMessage.includes('unavailable') || errorMessage.includes('quota')) {
          errorContent += '\n\nThe AI service is temporarily unavailable. Please try again in a few minutes.';
        } else if (errorMessage.includes('task not found') || errorMessage.includes('couldn\'t find')) {
          errorContent += '\n\nTry asking me to list your tasks first, then use the exact task name.';
        } else {
          errorContent += '\n\nPlease try again.';
        }
      } else {
        // Non-retryable errors - provide alternative actions
        if (errorMessage.includes('permission') || errorMessage.includes('Authentication')) {
          errorContent += '\n\nPlease log out and log back in to continue.';
        } else if (errorMessage.includes('blocked') || errorMessage.includes('content filters')) {
          errorContent += '\n\nPlease rephrase your message and try again.';
        } else if (errorMessage.includes('500 characters')) {
          errorContent += '\n\nPlease shorten your message.';
        } else if (errorMessage.includes('validation') || errorMessage.includes('Invalid')) {
          errorContent += '\n\nPlease check your input and try again with valid information.';
        }
      }
      
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="AI Task Assistant Chat"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-50"
          />

          {/* Chat Panel - Slide in from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative w-full sm:w-[400px] md:w-[450px] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-purple-primary)] text-white">
              <div>
                <h2 className="text-lg font-semibold">AI Task Assistant</h2>
                <p className="text-xs text-purple-100">Ask me about your tasks</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 transition-colors p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Close chat"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages Container */}
            <div
              ref={messageContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
              {/* Loading welcome message */}
              {isLoadingWelcome && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--color-purple-primary)]" />
                </div>
              )}

              {/* Error message banner (only shown when no messages) */}
              {error && !isLoadingWelcome && messages.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-red-800 mb-1">Connection Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={fetchWelcomeMessage}
                    className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-white border border-[var(--color-border)] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Loading Indicator */}
            {isPerformingAction && (
              <div className="px-4 py-2 bg-purple-50 border-t border-purple-200 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--color-purple-primary)]" />
                <span className="text-sm text-purple-700">Updating tasks...</span>
              </div>
            )}

            {/* Input Area */}
            <ChatInput onSend={handleSendMessage} disabled={isLoading || isLoadingWelcome || isPerformingAction} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
