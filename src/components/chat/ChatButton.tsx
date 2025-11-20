import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-24 sm:right-28 md:bottom-8 md:right-8 z-40 bg-[var(--color-purple-primary)] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-purple-300 min-w-[56px] min-h-[56px] flex items-center justify-center touch-manipulation"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      aria-label="Open AI Task Assistant"
    >
      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--color-purple-primary)]"
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Icon */}
      <MessageCircle className="h-6 w-6 relative z-10" />
    </motion.button>
  );
};

export default ChatButton;
