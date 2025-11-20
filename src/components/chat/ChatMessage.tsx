import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-[var(--color-purple-primary)] text-white rounded-br-md'
              : 'bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-bl-md'
          } shadow-sm`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-[var(--color-text-secondary)] mt-1 px-1">
          {formatTime(timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
