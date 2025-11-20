/**
 * LocalStorage utility functions for token and user data management
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Store authentication token in localStorage
 * @param token - JWT authentication token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve authentication token from localStorage
 * @returns Token string or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Store user data in localStorage
 * @param user - User object to store
 */
export const setUser = (user: object): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Retrieve user data from localStorage
 * @returns Parsed user object or null if not found
 */
export const getUser = (): object | null => {
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      return null;
    }
  }
  return null;
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

/**
 * Check if user is authenticated by verifying token existence
 * @returns Boolean indicating if token exists
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
