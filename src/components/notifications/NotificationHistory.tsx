import React, { useState, useEffect } from 'react';
import { getNotificationHistory } from '../../services/notificationService';
import type { NotificationHistoryItem } from '../../services/notificationService';

const NotificationHistory: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotificationHistory(page, 20);
      setNotifications(response.notifications);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (err: any) {
      console.error('Error fetching notification history:', err);
      setError(err.response?.data?.message || 'Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      sent: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      task_reminder: 'Task Reminder',
      status_change: 'Status Change',
      daily_summary: 'Daily Summary',
    };

    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notification History</h2>
        <div className="text-sm text-gray-600">
          Total: {totalCount} notification{totalCount !== 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Your notification history will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {getTypeLabel(notification.type)}
                      </span>
                      {getStatusBadge(notification.status)}
                    </div>
                    {notification.taskId && (
                      <div className="text-xs text-gray-500 mb-2">
                        Task: {notification.taskId.title}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-2 bg-gray-50 p-3 rounded">
                  {notification.message}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div>
                    {notification.status === 'sent' && notification.sentAt && (
                      <span>Sent: {formatDate(notification.sentAt)}</span>
                    )}
                    {notification.status === 'pending' && (
                      <span>Scheduled: {formatDate(notification.scheduledFor)}</span>
                    )}
                    {notification.status === 'failed' && (
                      <span className="text-red-600">
                        Failed {notification.retryCount > 0 && `(${notification.retryCount} retries)`}
                      </span>
                    )}
                  </div>
                  {notification.error && (
                    <div className="text-red-600 text-xs">Error: {notification.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationHistory;
