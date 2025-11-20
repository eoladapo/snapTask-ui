import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Check, AlertCircle, Send } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import { sendTestNotification } from '../../services/notificationService';
import Button from '../common/Button';

interface NotificationPreferencesProps {
  phoneVerified?: boolean;
  onPreferencesUpdate?: () => void;
}

interface NotificationPrefs {
  whatsappEnabled: boolean;
  taskReminders: boolean;
  statusUpdates: boolean;
  dailySummary: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  phoneVerified = false,
  onPreferencesUpdate,
}) => {
  const { showSuccess, showError } = useToastContext();
  
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    whatsappEnabled: false,
    taskReminders: true,
    statusUpdates: true,
    dailySummary: false,
    quietHoursStart: '',
    quietHoursEnd: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getNotificationPreferences();
      setPreferences(data.notificationPreferences || {
        whatsappEnabled: false,
        taskReminders: true,
        statusUpdates: true,
        dailySummary: false,
        quietHoursStart: '',
        quietHoursEnd: '',
      });
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const handleTimeChange = (key: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await userService.updateNotificationPreferences(preferences);
      
      setHasChanges(false);
      showSuccess('Notification preferences updated successfully');
      
      if (onPreferencesUpdate) {
        onPreferencesUpdate();
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setIsSendingTest(true);
      
      const response = await sendTestNotification();
      showSuccess(response.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send test notification';
      showError(errorMessage);
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155] shadow-sm"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155] shadow-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Control which WhatsApp notifications you receive
          </p>
        </div>
      </div>

      {/* Phone verification warning */}
      {!phoneVerified && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg border border-yellow-200 dark:border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Phone Verification Required
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please add and verify your phone number to receive WhatsApp notifications
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Global Enable/Disable */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                Enable WhatsApp Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Master switch for all WhatsApp notifications
              </p>
            </div>
            <button
              onClick={() => handleToggle('whatsappEnabled')}
              disabled={!phoneVerified}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                preferences.whatsappEnabled
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.whatsappEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Notification Types
          </h3>

          {/* Task Reminders */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Task Reminders
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Get reminded about tasks due within 24 hours
              </p>
            </div>
            <button
              onClick={() => handleToggle('taskReminders')}
              disabled={!preferences.whatsappEnabled || !phoneVerified}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                preferences.taskReminders
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.taskReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Status Updates */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Status Updates
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Notifications when tasks change status or are completed
              </p>
            </div>
            <button
              onClick={() => handleToggle('statusUpdates')}
              disabled={!preferences.whatsappEnabled || !phoneVerified}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                preferences.statusUpdates
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.statusUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Daily Summary */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Daily Summary
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Receive a daily summary of your tasks
              </p>
            </div>
            <button
              onClick={() => handleToggle('dailySummary')}
              disabled={!preferences.whatsappEnabled || !phoneVerified}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                preferences.dailySummary
                  ? 'bg-purple-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.dailySummary ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Quiet Hours
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set hours during which you won't receive notifications
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={preferences.quietHoursStart || ''}
                onChange={(e) => handleTimeChange('quietHoursStart', e.target.value)}
                disabled={!preferences.whatsappEnabled || !phoneVerified}
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={preferences.quietHoursEnd || ''}
                onChange={(e) => handleTimeChange('quietHoursEnd', e.target.value)}
                disabled={!preferences.whatsappEnabled || !phoneVerified}
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {preferences.quietHoursStart && preferences.quietHoursEnd && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Notifications will be paused from {preferences.quietHoursStart} to {preferences.quietHoursEnd}
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <Button
              onClick={handleSave}
              loading={isSaving}
              variant="primary"
              icon={<Check className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Save Preferences
            </Button>
          </motion.div>
        )}

        {/* Test Notification */}
        {phoneVerified && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Test Notification
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Send a test message to verify your WhatsApp integration
                </p>
              </div>
              <Button
                onClick={handleTestNotification}
                loading={isSendingTest}
                variant="secondary"
                icon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Send Test Message
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {!hasChanges && preferences.whatsappEnabled && phoneVerified && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Your notification preferences are saved and active
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPreferences;
