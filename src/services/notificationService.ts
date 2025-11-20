import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface NotificationHistoryItem {
  _id: string;
  user: string;
  type: 'task_reminder' | 'status_change' | 'daily_summary';
  taskId?: {
    _id: string;
    title: string;
    status: string;
  };
  message: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  sentAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationHistoryResponse {
  message: string;
  notifications: NotificationHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

/**
 * Get notification history for the authenticated user
 * @param page - Page number (default: 1)
 * @param limit - Number of items per page (default: 20)
 * @returns Promise with notification history
 */
export const getNotificationHistory = async (
  page: number = 1,
  limit: number = 20
): Promise<NotificationHistoryResponse> => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/notifications/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

/**
 * Send a test WhatsApp notification to verify integration
 * @returns Promise with success message
 */
export const sendTestNotification = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${API_URL}/notifications/test`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
