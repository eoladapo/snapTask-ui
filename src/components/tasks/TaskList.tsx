import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types/task.types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error?: string | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: Task['status']) => Promise<void>;
  onRetry?: () => void;
  activeFilter?: 'all' | 'pending' | 'in-progress' | 'completed';
  selectedDate?: Date; // Add selected date to show date-specific messages
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = [], // Default to empty array
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
  onRetry,
  activeFilter = 'all',
  selectedDate,
}) => {
  
  // Check if selected date is today, past, or future
  const getDateContext = () => {
    if (!selectedDate) return 'today';
    
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedLocal = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    if (selectedLocal.getTime() === todayLocal.getTime()) return 'today';
    if (selectedLocal.getTime() < todayLocal.getTime()) return 'past';
    return 'future';
  };
  
  // Get context-specific empty state messages
  const getEmptyStateContent = () => {
    const dateContext = getDateContext();
    
    // Date-specific messages for 'all' filter
    if (activeFilter === 'all') {
      if (dateContext === 'past') {
        return {
          emoji: '📅',
          title: 'No tasks for this day',
          description: 'You didn\'t create any tasks on this date. Navigate to today to create new tasks.',
        };
      }
      if (dateContext === 'future') {
        return {
          emoji: '🔮',
          title: 'No tasks scheduled',
          description: 'You haven\'t created any tasks for this date yet. Create tasks for future planning!',
        };
      }
      return {
        emoji: '📝',
        title: 'No tasks for today',
        description: 'Get started by creating your first task. Click the "Create Task" button in the sidebar.',
      };
    }
    
    // Status-specific messages
    switch (activeFilter) {
      case 'pending':
        return {
          emoji: '⏳',
          title: 'No pending tasks',
          description: dateContext === 'today' 
            ? 'You don\'t have any pending tasks for today.' 
            : 'No pending tasks for this date.',
        };
      case 'in-progress':
        return {
          emoji: '🚀',
          title: 'No tasks in progress',
          description: dateContext === 'today'
            ? 'You don\'t have any tasks in progress. Start working on a pending task!'
            : 'No tasks were in progress on this date.',
        };
      case 'completed':
        return {
          emoji: '✅',
          title: 'No completed tasks',
          description: dateContext === 'today'
            ? 'You haven\'t completed any tasks today yet. Keep working!'
            : 'No tasks were completed on this date.',
        };
      default:
        return {
          emoji: '📝',
          title: 'No tasks',
          description: 'No tasks found for this date and filter.',
        };
    }
  };

  const emptyContent = getEmptyStateContent();

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2].map((j) => (
              <div key={j} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="flex justify-between mb-3 gap-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20 flex-shrink-0"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <div className="h-11 bg-gray-200 rounded flex-1"></div>
                  <div className="h-11 w-11 bg-gray-200 rounded"></div>
                  <div className="h-11 w-11 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-12 sm:py-16 px-6 min-h-[400px] mx-auto"
        style={{ maxWidth: '600px' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 sm:w-32 sm:h-32 mb-6 text-6xl sm:text-8xl flex items-center justify-center"
        >
          {emptyContent.emoji}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mb-3 text-center"
        >
          {emptyContent.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-[var(--color-text-secondary)] text-center mb-6 leading-relaxed"
        >
          {emptyContent.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-secondary)]"
        >
          <span className="inline-block w-2 h-2 bg-[var(--color-purple-primary)] rounded-full animate-pulse"></span>
          <span>Ready to boost your productivity?</span>
        </motion.div>
      </motion.div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 w-full min-h-[400px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 text-6xl sm:text-8xl flex items-center justify-center"
      >
        ⚠️
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mb-2 text-center whitespace-nowrap"
      >
        Failed to load tasks
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm sm:text-base text-[var(--color-text-secondary)] text-center max-w-md mb-4 sm:mb-6 px-4 leading-relaxed"
      >
        {error || 'An error occurred while loading your tasks. Please try again.'}
      </motion.p>
      {onRetry && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onRetry}
          className="px-6 py-3 bg-[var(--color-purple-primary)] hover:bg-[var(--color-purple-dark)] text-white rounded-lg font-medium transition-colors min-h-[44px] touch-manipulation whitespace-nowrap"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );

  // Show loading skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show error state if there's an error and no tasks
  if (error && tasks.length === 0) {
    return <ErrorState />;
  }

  // Show empty state if no tasks
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
    >
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </motion.div>
  );
};

export default TaskList;
