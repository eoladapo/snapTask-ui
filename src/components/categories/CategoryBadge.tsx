import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  name,
  color,
  size = 'md',
  className = '',
  showDot = true,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotSizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${sizeStyles[size]}
        rounded-full
        font-medium
        border
        transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: `${color}20`,
        borderColor: `${color}60`,
        color: color,
      }}
    >
      {showDot && (
        <span
          className={`${dotSizeStyles[size]} rounded-full flex-shrink-0`}
          style={{ backgroundColor: color }}
        />
      )}
      <span className="truncate">{name}</span>
    </span>
  );
};

export default CategoryBadge;
