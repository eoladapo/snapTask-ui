import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { setToken, getToken, setUser, getUser, clearAuth } from '../utils/storage';
import { getErrorMessage } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const clearError = () => {
    setError(null);
  };

  /**
   * Check for existing authentication on app load
   */
  const checkAuth = () => {
    setLoading(true);
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser as User);
    }
    setLoading(false);
  };

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      // Store token and user data in localStorage first
      setToken(response.accessToken);
      setUser(response.user);
      
      // Update state - this will trigger re-renders
      setTokenState(response.accessToken);
      setUserState(response.user);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Register new user account
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signup(data);
      
      // Store token and user data
      setToken(response.accessToken);
      setUser(response.user);
      
      // Update state
      setTokenState(response.accessToken);
      setUserState(response.user);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear authentication data
   */
  const logout = (): void => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
