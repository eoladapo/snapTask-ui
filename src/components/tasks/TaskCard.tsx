import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types/task.types';
import ConfirmDialog from '../common/ConfirmDialog';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      nextStatus: 'in-progress' as const,
      nextLabel: 'Start',
    },
    'in-progress': {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      nextStatus: 'completed' as const,
      nextLabel: 'Complete',
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700 border-green-200',
      nextStatus: 'pending' as const,
      nextLabel: 'Reopen',
    },
  };

  const currentStatus = statusConfig[task.status];

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
      setShowDeleteConfirm(false);
    } catch (err) {
      // Error is handled in parent component with toast
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleStatusToggle = async () => {
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(task._id, currentStatus.nextStatus);
    } catch (err) {
      // Error is handled in parent component with toast
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl p-4 sm:p-6 border transition-all duration-200 group bg-white dark:bg-[#1e293b] border-gray-200 dark:border-[#334155] hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500"
    >
      {/* Header with status badge */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 group-hover:text-[var(--color-purple-primary)] transition-colors break-words">
          {task.title}
        </h3>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.color} whitespace-nowrap flex-shrink-0`}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 break-words">
        {task.description}
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-[#334155]">
        <button
          onClick={handleStatusToggle}
          disabled={isUpdatingStatus}
          className="flex-1 px-3 sm:px-4 py-2.5 bg-[var(--color-purple-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-purple-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
        >
          {isUpdatingStatus ? 'Updating...' : currentStatus.nextLabel}
        </button>
        
        <button
          onClick={() => onEdit(task)}
          className="p-2.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--color-purple-primary)] hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          title="Edit task"
          aria-label="Edit task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="p-2.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          title="Delete task"
          aria-label="Delete task"
        >
          {isDeleting ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </motion.div>
  );
};

export default TaskCard;
