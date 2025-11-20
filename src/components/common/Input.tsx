import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', type = 'text', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substring(2, 11)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)] mb-1.5 sm:mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`
              w-full px-3 sm:px-4 py-2.5 sm:py-3 ${icon ? 'pl-9 sm:pl-10' : ''}
              rounded-[var(--radius-button)]
              border-2 border-[var(--color-border)]
              bg-white
              text-sm sm:text-base
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-secondary)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-2 focus:ring-[var(--color-purple-light)] focus:ring-opacity-20
              disabled:bg-gray-100 disabled:cursor-not-allowed
              min-h-[44px]
              touch-manipulation
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id={`${inputId}-error`}
              className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
