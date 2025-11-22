import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import ProfileView from '../components/profile/ProfileView';
import StatisticsView from '../components/profile/StatisticsView';
import { CategoryFilter } from '../components/categories';
import DateNavigator from '../components/tasks/DateNavigator';
import { useTasks } from '../hooks/useTasks';
import { useToastContext } from '../context/ToastContext';
import { formatDateLocal, parseDateLocal } from '../utils/dateUtils';
import type { Task } from '../types/task.types';
import type { ViewType } from '../components/layout/Sidebar';

export const Dashboard: React.FC = () => {
  const { tasks, loading, error, fetchTasks, deleteTask, updateTaskStatus } = useTasks();
  const { showSuccess, showError } = useToastContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Default to open on desktop, closed on mobile
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskapp_sidebar_state');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    // Get today's date in local timezone (not UTC)
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  // Fetch tasks on component mount and when category filter changes
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // If no categories selected or multiple categories selected, fetch all tasks
        // We'll filter on the client side for multi-select
        if (selectedCategories.length === 0 || selectedCategories.length > 1) {
          await fetchTasks();
        } else {
          // Single category selected - use server-side filtering
          const categoryId = selectedCategories[0] === 'uncategorized' ? 'null' : selectedCategories[0];
          await fetchTasks(categoryId);
        }
      } catch (err) {
        // Error is already set in context, just show toast
        showError('Failed to load tasks. Please try again.');
      }
    };
    loadTasks();
  }, [selectedCategories, fetchTasks, showError]);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('taskapp_sidebar_state', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Filter tasks based on active view, category selection, and date
  const filteredTasks = useMemo(() => {
    if (activeView === 'profile' || activeView === 'statistics') return [];
    
    let filtered = tasks;
    
    // Apply date filter - only show tasks for the selected date
    // Use local date formatting to avoid timezone issues
    const selectedDateStr = formatDateLocal(selectedDate);
    filtered = filtered.filter((task) => {
      if (!task.taskDate) return false;
      const taskDateStr = parseDateLocal(task.taskDate);
      return taskDateStr === selectedDateStr;
    });
    
    // Apply status filter
    if (activeView !== 'all') {
      filtered = filtered.filter((task) => task.status === activeView);
    }
    
    // Apply category filter (client-side for multi-select)
    if (selectedCategories.length > 1) {
      filtered = filtered.filter((task) => {
        if (selectedCategories.includes('uncategorized') && !task.category) {
          return true;
        }
        return task.category && selectedCategories.includes(task.category);
      });
    }
    
    return filtered;
  }, [tasks, activeView, selectedCategories, selectedDate]);

  // Calculate task counts for the selected date
  const taskCounts = useMemo(() => {
    const selectedDateStr = formatDateLocal(selectedDate);
    const tasksForDate = tasks.filter((task) => {
      if (!task.taskDate) return false;
      const taskDateStr = parseDateLocal(task.taskDate);
      return taskDateStr === selectedDateStr;
    });
    
    return {
      all: tasksForDate.length,
      pending: tasksForDate.filter((t) => t.status === 'pending').length,
      'in-progress': tasksForDate.filter((t) => t.status === 'in-progress').length,
      completed: tasksForDate.filter((t) => t.status === 'completed').length,
    };
  }, [tasks, selectedDate]);

  const handleCreateTask = () => {
    // Check if trying to create task for past date
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (selectedDate.getTime() < todayLocal.getTime()) {
      showError('Cannot create tasks for past dates. Please select today or a future date.');
      return;
    }
    
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      showSuccess('Task deleted successfully.');
    } catch (err) {
      showError('Failed to delete task. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await updateTaskStatus(id, status);
      showSuccess('Task status updated successfully.');
    } catch (err) {
      showError('Failed to update task status. Please try again.');
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
  };

  const handleCategoryFilterChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    // Also update selectedCategories for compatibility
    if (categoryId === null) {
      setSelectedCategories(['uncategorized']);
    } else {
      setSelectedCategories([categoryId]);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Check if selected date is in the past
  const isPastDate = useMemo(() => {
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return selectedDate.getTime() < todayLocal.getTime();
  }, [selectedDate]);

  return (
    <Layout
      showSidebar={true}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={handleSidebarToggle}
      activeView={activeView}
      onViewChange={handleViewChange}
      taskCounts={taskCounts}
      onCreateTask={handleCreateTask}
      selectedCategoryId={selectedCategoryId}
      onCategorySelect={handleCategorySelect}
      disableCreateTask={isPastDate}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Page Header - Only show for task views */}
        {activeView !== 'profile' && activeView !== 'statistics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  My Tasks
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Manage your tasks and stay productive
                </p>
              </div>
            </div>
            
            {/* Date Navigator */}
            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            
            {/* Category Filter */}
            <CategoryFilter
              tasks={tasks}
              selectedCategories={selectedCategories}
              onFilterChange={handleCategoryFilterChange}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            role="alert"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl flex-shrink-0">⚠️</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Error loading tasks</h3>
                <p className="text-xs sm:text-sm break-words">{error}</p>
                <button
                  onClick={() => fetchTasks()}
                  className="mt-2 text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 underline min-h-[44px] py-2 touch-manipulation"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active view */}
        <AnimatePresence mode="wait">
          {activeView === 'profile' ? (
            <ProfileView key="profile" />
          ) : activeView === 'statistics' ? (
            <StatisticsView key="statistics" />
          ) : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TaskList
                tasks={filteredTasks}
                loading={loading}
                error={error}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onRetry={() => fetchTasks()}
                activeFilter={activeView === 'all' || activeView === 'pending' || activeView === 'in-progress' || activeView === 'completed' ? activeView : 'all'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button - Hidden on desktop since sidebar has Create Task button */}
        {/* Only show if not viewing past date */}
        {!isPastDate && activeView !== 'profile' && activeView !== 'statistics' && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTask}
            className="
              md:hidden
              fixed bottom-6 right-6 sm:bottom-8 sm:right-8
              w-14 h-14 sm:w-16 sm:h-16
              bg-[var(--color-purple-primary)]
              hover:bg-[var(--color-purple-dark)]
              text-white
              rounded-full
              shadow-lg hover:shadow-xl
              flex items-center justify-center
              transition-colors duration-200
              focus:outline-none focus:ring-4 focus:ring-[var(--color-purple-light)] focus:ring-opacity-50
              z-50
              touch-manipulation
            "
            aria-label="Create new task"
          >
            <Plus size={24} strokeWidth={2.5} className="sm:w-7 sm:h-7" />
          </motion.button>
        )}

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={handleCloseTaskForm}
          task={selectedTask}
          taskDate={selectedDate}
        />
      </motion.div>
    </Layout>
  );
};
