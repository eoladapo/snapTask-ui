/**
 * Image optimization utilities for the landing page
 */

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Get optimized image URL based on device pixel ratio
 * @param baseUrl - Base URL of the image
 * @param sizes - Available sizes (e.g., ['1x', '2x', '3x'])
 */
export const getOptimizedImageUrl = (
  baseUrl: string,
  sizes: string[] = ['1x', '2x']
): string => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  
  // Select appropriate size based on device pixel ratio
  if (dpr >= 3 && sizes.includes('3x')) {
    return baseUrl.replace(/\.(jpg|png|webp)$/, '@3x.$1');
  } else if (dpr >= 2 && sizes.includes('2x')) {
    return baseUrl.replace(/\.(jpg|png|webp)$/, '@2x.$1');
  }
  
  return baseUrl;
};

/**
 * Generate srcset for responsive images
 * @param baseUrl - Base URL of the image
 * @param widths - Array of widths to generate
 */
export const generateSrcSet = (
  baseUrl: string,
  widths: number[] = [320, 640, 960, 1280]
): string => {
  return widths
    .map((width) => {
      const url = baseUrl.replace(/\.(jpg|png|webp)$/, `-${width}w.$1`);
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Preload critical images
 * @param urls - Array of image URLs to preload
 */
export const preloadImages = (urls: string[]): void => {
  if (typeof window === 'undefined') return;
  
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images using Intersection Observer
 * @param selector - CSS selector for images to lazy load
 */
export const lazyLoadImages = (selector: string = 'img[data-lazy]'): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const images = document.querySelectorAll(selector);
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-lazy');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-lazy');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before entering viewport
    threshold: 0.01,
  });

  images.forEach((img) => imageObserver.observe(img));
};

/**
 * Optimize SVG by removing unnecessary attributes
 * @param svgString - SVG string to optimize
 */
export const optimizeSVG = (svgString: string): string => {
  return svgString
    .replace(/\s+/g, ' ') // Remove extra whitespace
    .replace(/<!--.*?-->/g, '') // Remove comments
    .replace(/\s*=\s*"/g, '="') // Normalize attribute spacing
    .trim();
};
