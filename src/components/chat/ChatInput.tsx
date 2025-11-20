import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARACTERS = 500;

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length <= MAX_CHARACTERS) {
      setMessage(value);
      setError('');
    } else {
      setError(`Message cannot exceed ${MAX_CHARACTERS} characters`);
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      setError('Please enter a message');
      return;
    }

    if (trimmedMessage.length > MAX_CHARACTERS) {
      setError(`Message cannot exceed ${MAX_CHARACTERS} characters`);
      return;
    }

    onSend(trimmedMessage);
    setMessage('');
    setError('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const remainingChars = MAX_CHARACTERS - message.length;
  const showCharCount = message.length > MAX_CHARACTERS * 0.8; // Show when 80% full

  return (
    <div className="border-t border-[var(--color-border)] bg-white p-4">
      <div className="flex gap-2 items-end">
        {/* Textarea */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'AI is typing...' : 'Type your message...'}
            rows={1}
            className={`
              w-full px-3 sm:px-4 py-2.5 sm:py-3
              rounded-[var(--radius-button)]
              border-2 border-[var(--color-border)]
              bg-white
              text-sm sm:text-base
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-secondary)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-2 focus:ring-[var(--color-purple-light)] focus:ring-opacity-20
              disabled:bg-gray-100 disabled:cursor-not-allowed
              resize-none
              min-h-[44px]
              max-h-[150px]
              touch-manipulation
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            `}
            aria-label="Message input"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'input-error' : undefined}
          />
          
          {/* Character count and error */}
          <div className="flex justify-between items-center mt-1.5 min-h-[20px]">
            {error ? (
              <span id="input-error" className="text-xs sm:text-sm text-red-500" role="alert">
                {error}
              </span>
            ) : (
              <span className="text-xs text-[var(--color-text-secondary)]">
                Press Enter to send, Shift+Enter for new line
              </span>
            )}
            
            {showCharCount && (
              <span
                className={`text-xs ${
                  remainingChars < 0 ? 'text-red-500' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {remainingChars}
              </span>
            )}
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim() || message.length > MAX_CHARACTERS}
          className={`
            flex items-center justify-center
            w-11 h-11 sm:w-12 sm:h-12
            rounded-full
            bg-[var(--color-purple-primary)]
            text-white
            transition-all duration-200
            hover:bg-[var(--color-purple-dark)]
            hover:scale-105
            active:scale-95
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
            shadow-md
            hover:shadow-lg
            touch-manipulation
          `}
          aria-label="Send message"
        >
          {disabled ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
