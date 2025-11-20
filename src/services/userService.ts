import api from './api';

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  profilePicture?: string;
}

export interface CategoryStatistic {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
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
  categoryBreakdown: CategoryStatistic[];
}

export interface PhoneNumberResponse {
  message: string;
  phoneNumber: string;
  phoneVerified: boolean;
  verificationCode?: string; // Only in development
}

export interface VerifyPhoneResponse {
  message: string;
  phoneNumber: string;
  phoneVerified: boolean;
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

  // Update phone number
  updatePhoneNumber: async (phoneNumber: string): Promise<PhoneNumberResponse> => {
    const response = await api.put('/user/profile/phone', { phoneNumber });
    return response.data;
  },

  // Verify phone number
  verifyPhoneNumber: async (code: string): Promise<VerifyPhoneResponse> => {
    const response = await api.post('/user/profile/phone/verify', { code });
    return response.data;
  },

  // Remove phone number
  removePhoneNumber: async (): Promise<void> => {
    await api.put('/user/profile/phone', { phoneNumber: null });
  },

  // Get notification preferences
  getNotificationPreferences: async (): Promise<{ notificationPreferences: any }> => {
    const response = await api.get('/user/profile/notifications');
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: {
    whatsappEnabled?: boolean;
    taskReminders?: boolean;
    statusUpdates?: boolean;
    dailySummary?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  }): Promise<void> => {
    await api.put('/user/profile/notifications', preferences);
  },
};
