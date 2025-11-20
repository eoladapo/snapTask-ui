import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X, TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { userService, type UserProfile, type Statistics } from '../services/userService';
import { useToastContext } from '../context/ToastContext';
import { useTasks } from '../hooks/useTasks';
import StatisticsChart from '../components/profile/StatisticsChart';
import StatsCard from '../components/profile/StatsCard';
import PhoneNumberSettings from '../components/profile/PhoneNumberSettings';
import NotificationPreferences from '../components/profile/NotificationPreferences';
import NotificationHistory from '../components/notifications/NotificationHistory';
import type { ViewType } from '../components/layout/Sidebar';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToastContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskapp_sidebar_state');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.innerWidth >= 768;
    }
    return true;
  });

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        userService.getProfile(),
        userService.getStatistics(),
      ]);
      setProfile(profileData);
      setStatistics(statsData);
      setFormData({
        username: profileData.username,
        bio: profileData.bio || '',
      });
    } catch (error) {
      showError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneUpdate = () => {
    // Reload profile data to get updated phone information
    loadProfileData();
  };

  const handlePreferencesUpdate = () => {
    // Reload profile data if needed
    loadProfileData();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        username: profile.username,
        bio: profile.bio || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      showSuccess('Profile updated successfully');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewChange = (view: ViewType) => {
    if (view === 'profile') {
      // Already on profile page
      return;
    } else if (view === 'statistics') {
      // Stay on profile page but could scroll to statistics section
      return;
    } else {
      // Navigate back to dashboard with the selected view
      navigate('/dashboard');
    }
  };

  const handleCategorySelect = () => {
    // Navigate back to dashboard when category is selected
    navigate('/dashboard');
  };

  const handleCreateTask = () => {
    // Navigate back to dashboard to create task
    navigate('/dashboard');
  };

  // Calculate task counts
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('taskapp_sidebar_state', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <Layout
        showSidebar={true}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={handleSidebarToggle}
        activeView="profile"
        onViewChange={handleViewChange}
        taskCounts={taskCounts}
        onCreateTask={handleCreateTask}
        onCategorySelect={handleCategorySelect}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showSidebar={true}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={handleSidebarToggle}
      activeView="profile"
      onViewChange={handleViewChange}
      taskCounts={taskCounts}
      onCreateTask={handleCreateTask}
      onCategorySelect={handleCategorySelect}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile & Statistics
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your profile and track your productivity
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155] shadow-sm"
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {profile?.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile?.bio || 'No bio added yet'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phone Number Settings */}
        <PhoneNumberSettings
          initialPhoneNumber={profile?.phoneNumber}
          initialPhoneVerified={profile?.phoneVerified}
          onPhoneUpdate={handlePhoneUpdate}
        />

        {/* Notification Preferences */}
        <NotificationPreferences
          phoneVerified={profile?.phoneVerified}
          onPreferencesUpdate={handlePreferencesUpdate}
        />

        {/* Notification History */}
        <NotificationHistory />

        {/* Statistics Overview */}
        {statistics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                icon={<Target className="w-6 h-6" />}
                title="Total Tasks"
                value={statistics.overview.totalTasks}
                color="purple"
              />
              <StatsCard
                icon={<Award className="w-6 h-6" />}
                title="Completed"
                value={statistics.overview.completedTasks}
                color="green"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Completion Rate"
                value={`${statistics.overview.completionRate}%`}
                color="blue"
              />
              <StatsCard
                icon={<Calendar className="w-6 h-6" />}
                title="This Month"
                value={statistics.periods.month.completed}
                subtitle={`of ${statistics.periods.month.total} tasks`}
                color="orange"
              />
            </div>

            {/* Charts */}
            <StatisticsChart statistics={statistics} />
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default Profile;
