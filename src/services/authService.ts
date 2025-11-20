import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';

export const authService = {
  /**
   * Register a new user account
   * @param data - User registration data (username, email, password)
   * @returns Promise with authentication response containing token and user data
   */
  async signup(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Login with existing credentials
   * @param credentials - User login credentials (email, password)
   * @returns Promise with authentication response containing token and user data
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};
