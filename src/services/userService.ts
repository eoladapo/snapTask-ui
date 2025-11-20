import api from './api';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  profilePicture?: string;
}

export interface Statistics {
  overview: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completionRate: number;
  };
  periods: {
    week: {
      total: number;
      completed: number;
      completionRate: number;
    };
    month: {
      total: number;
      completed: number;
      completionRate: number;
    };
    year: {
      total: number;
      completed: number;
      completionRate: number;
    };
  };
  trends: {
    daily: Array<{ date: string; completed: number; total: number }>;
    weekly: Array<{ week: string; completed: number; total: number }>;
    monthly: Array<{ month: string; completed: number; total: number }>;
  };
}

export const userService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/user/profile');
    return response.data.user;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put('/user/profile', data);
    return response.data.user;
  },

  // Get user statistics
  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get('/user/statistics');
    return response.data.statistics;
  },
};
