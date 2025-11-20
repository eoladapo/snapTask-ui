import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-[var(--radius-button)] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base touch-manipulation hover:shadow-md active:shadow-sm';

  const variantStyles = {
    primary:
      'bg-[var(--color-purple-primary)] text-white hover:bg-[var(--color-purple-dark)] hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-white text-[var(--color-text-primary)] border-2 border-[var(--color-border)] hover:border-[var(--color-purple-primary)] hover:text-[var(--color-purple-primary)] hover:scale-[1.02] active:scale-[0.98]',
    danger:
      'bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
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
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
