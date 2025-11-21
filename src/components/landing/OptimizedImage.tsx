import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  eager?: boolean; // For above-the-fold images
}

/**
 * Optimized image component with lazy loading and error handling
 * - Automatically applies lazy loading for below-fold images
 * - Provides fallback for failed image loads
 * - Optimizes loading performance
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback,
  eager = false,
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  // Use fallback if image fails to load
  const imageSrc = error && fallback ? fallback : src;

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
    </div>
  );
};
