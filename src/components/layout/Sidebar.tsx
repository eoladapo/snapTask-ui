import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Rocket, CheckCircle, LayoutGrid, X, Menu, User, TrendingUp } from 'lucide-react';
import { userService, type Statistics } from '../../services/userService';

export type TaskFilter = 'all' | 'pending' | 'in-progress' | 'completed';
export type ViewType = TaskFilter | 'profile' | 'statistics';

interface TaskCounts {
  all: number;
  pending: number;
  'in-progress': number;
  completed: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  taskCounts: TaskCounts;
  onCreateTask: () => void;
}

interface NavigationItem {
  id: TaskFilter | 'create';
  label: string;
  icon: React.ReactNode;
  count?: number;
  action: 'filter' | 'create';
  color?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  taskCounts,
  onCreateTask,
}) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await userService.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Failed to load statistics');
      }
    };
    if (isOpen) {
      loadStats();
    }
  }, [isOpen, taskCounts]); // Reload when task counts change
  const navigationItems: NavigationItem[] = [
    {
      id: 'create',
      label: 'Create Task',
      icon: <Plus className="w-5 h-5" />,
      action: 'create',
      color: 'text-[var(--color-purple-primary)]',
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: <LayoutGrid className="w-5 h-5" />,
      count: taskCounts.all,
      action: 'filter',
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: <Clock className="w-5 h-5" />,
      count: taskCounts.pending,
      action: 'filter',
      color: 'text-orange-600',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      icon: <Rocket className="w-5 h-5" />,
      count: taskCounts['in-progress'],
      action: 'filter',
      color: 'text-blue-600',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle className="w-5 h-5" />,
      count: taskCounts.completed,
      action: 'filter',
      color: 'text-green-600',
    },
  ];

  const handleItemClick = (item: NavigationItem) => {
    if (item.action === 'create') {
      onCreateTask();
    } else if (item.action === 'filter') {
      onViewChange(item.id as TaskFilter);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Toggle Button on Right Edge - Always visible, outside sidebar */}
      <div
        className={`
          fixed left-0 top-20 z-50
          transition-all duration-300 ease-in-out
          hidden md:block
          ${isOpen ? 'translate-x-[280px]' : 'translate-x-0'}
        `}
      >
        <button
          onClick={onToggle}
          className={`
            w-8 h-10
            bg-[var(--color-sidebar-bg)] 
            border border-[var(--color-sidebar-border)]
            border-l-0
            rounded-r-lg
            flex items-center justify-center
            hover:bg-[var(--color-sidebar-item-hover)]
            transition-colors
            shadow-md
          `}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          title={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? (
            <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
          ) : (
            <Menu className="w-4 h-4 text-[var(--color-text-secondary)]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-[280px] 
          bg-[var(--color-sidebar-bg)] border-r border-[var(--color-sidebar-border)] 
          shadow-lg md:shadow-none z-50 md:z-30 overflow-y-auto
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}
        `}
      >

        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-[var(--color-sidebar-item-hover)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 flex-1">
          {navigationItems.map((item, index) => {
            const isActive = item.action === 'filter' && activeView === item.id;
            const isCreateButton = item.action === 'create';

            return (
              <React.Fragment key={item.id}>
                {/* Divider after Create Task */}
                {index === 1 && (
                  <div className="my-4 border-t border-[var(--color-gray-100)]" />
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 min-h-[44px]
                    ${
                      isActive
                        ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                        : isCreateButton
                        ? 'bg-[var(--color-purple-primary)] text-white hover:bg-[var(--color-purple-dark)] font-medium'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text-primary)]'
                    }
                  `}
                >
                  <span className={isActive ? item.color : isCreateButton ? '' : item.color}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.count !== undefined && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${
                          isActive
                            ? 'bg-[var(--color-purple-primary)] text-white'
                            : 'bg-[var(--color-gray-100)] text-[var(--color-gray-600)]'
                        }
                      `}
                    >
                      {item.count}
                    </motion.span>
                  )}
                </motion.button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Profile & Stats Section - Bottom */}
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-[#334155] mt-auto">
          {/* Quick Stats */}
          {statistics && (
            <div className="mt-4 mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">This Week</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {statistics.periods.week.completed}/{statistics.periods.week.total}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${statistics.periods.week.completionRate}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>
          )}

          {/* Profile & Stats Buttons */}
          <div className="space-y-2">
            {/* Profile Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onViewChange('profile');
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 min-h-[44px]
                ${
                  activeView === 'profile'
                    ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              <User className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Profile</span>
            </motion.button>

            {/* Stats Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onViewChange('statistics');
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 min-h-[44px]
                ${
                  activeView === 'statistics'
                    ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Statistics</span>
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
