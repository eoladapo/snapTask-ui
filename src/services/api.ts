import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getToken, clearAuth } from '../utils/storage';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://snaptask-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to determine if request should be retried
const shouldRetry = (error: AxiosError, retryCount: number): boolean => {
  if (retryCount >= MAX_RETRIES) {
    return false;
  }

  // Don't retry on authentication errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    return false;
  }

  // Retry on network errors
  if (!error.response) {
    return true;
  }

  // Retry on specific status codes
  return RETRY_STATUS_CODES.includes(error.response.status);
};

// Helper function to get user-friendly error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Network error
    if (!error.response) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Server error with message
    if (error.response.data?.message) {
      return error.response.data.message;
    }

    // HTTP status errors
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 408:
        return 'Request timeout. Please try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again.';
      default:
        return `An error occurred (${error.response.status}). Please try again.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Initialize retry count
    if (!config.headers['X-Retry-Count']) {
      config.headers['X-Retry-Count'] = '0';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      headers: InternalAxiosRequestConfig['headers'] & { 'X-Retry-Count'?: string };
    };

    // Handle 401 errors - clear auth and redirect
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic
    if (config && shouldRetry(error, parseInt(config.headers['X-Retry-Count'] || '0'))) {
      const retryCount = parseInt(config.headers['X-Retry-Count'] || '0') + 1;
      config.headers['X-Retry-Count'] = retryCount.toString();

      // Calculate exponential backoff delay
      const backoffDelay = RETRY_DELAY * Math.pow(2, retryCount - 1);

      console.log(`Retrying request (attempt ${retryCount}/${MAX_RETRIES})...`);

      // Wait before retrying
      await delay(backoffDelay);

      // Retry the request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
