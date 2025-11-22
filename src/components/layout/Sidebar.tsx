import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Rocket, CheckCircle, LayoutGrid, X, Menu, User, TrendingUp, Folder, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userService, type Statistics } from '../../services/userService';
import { useCategories } from '../../hooks/useCategories';
import { categoryService } from '../../services/categoryService';

export type TaskFilter = 'all' | 'pending' | 'in-progress' | 'completed';
export type ViewType = TaskFilter | 'profile' | 'statistics' | 'category';

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
  selectedCategoryId?: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  disableCreateTask?: boolean;
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
  selectedCategoryId,
  onCategorySelect,
  disableCreateTask = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const { categories, loading: categoriesLoading, createCategory, fetchCategories } = useCategories();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1');

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories();
      } catch (error) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, [fetchCategories]);

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

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    // Confirm deletion
    const confirmMessage = `Delete "${categoryName}" category? Tasks in this category will be moved to "Uncategorized".`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Delete the category
      await categoryService.deleteCategory(categoryId);
      
      // If this was the selected category, clear selection
      if (selectedCategoryId === categoryId) {
        onCategorySelect(null);
      }
      
      // Refresh categories
      await fetchCategories();
      
      // Show success message
      console.log(`Category "${categoryName}" deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
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
        <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
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
                  whileHover={{ scale: isCreateButton && disableCreateTask ? 1 : 1.02 }}
                  whileTap={{ scale: isCreateButton && disableCreateTask ? 1 : 0.98 }}
                  onClick={() => handleItemClick(item)}
                  disabled={isCreateButton && disableCreateTask}
                  title={isCreateButton && disableCreateTask ? 'Cannot create tasks for past dates' : undefined}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 min-h-[44px]
                    ${
                      isActive
                        ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                        : isCreateButton
                        ? disableCreateTask
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                          : 'bg-[var(--color-purple-primary)] text-white hover:bg-[var(--color-purple-dark)] font-medium'
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

          {/* Categories Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </span>
            </div>

            {/* Uncategorized */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onCategorySelect(null);
                onViewChange('category');
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                transition-all duration-200 min-h-[40px]
                ${
                  activeView === 'category' && selectedCategoryId === null
                    ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              <Folder className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-left text-sm">Uncategorized</span>
            </motion.button>

            {/* User Categories */}
            {!categoriesLoading && categories.map((category) => (
              <motion.div
                key={category._id}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <button
                  onClick={() => {
                    onCategorySelect(category._id);
                    onViewChange('category');
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                    transition-all duration-200 min-h-[40px]
                    ${
                      activeView === 'category' && selectedCategoryId === category._id
                        ? 'bg-[var(--color-sidebar-item-active-bg)] text-[var(--color-sidebar-item-active-text)] font-semibold border-l-4 border-[var(--color-purple-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text-primary)]'
                    }
                  `}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-left text-sm truncate">{category.name}</span>
                </button>
                
                {/* Delete Button (shows on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category._id, category.name);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                    opacity-0 group-hover:opacity-100 transition-opacity
                    hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            {/* Add Category Button */}
            {!showCategoryForm ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCategoryForm(true)}
                className="
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                  text-[var(--color-purple-primary)] hover:bg-purple-50 dark:hover:bg-purple-900/20
                  transition-all duration-200 min-h-[40px] mt-2
                "
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Category</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2"
              >
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategoryName.trim()) {
                      createCategory({ name: newCategoryName.trim(), color: newCategoryColor });
                      setNewCategoryName('');
                      setNewCategoryColor('#6366f1');
                      setShowCategoryForm(false);
                    } else if (e.key === 'Escape') {
                      setShowCategoryForm(false);
                      setNewCategoryName('');
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <button
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        createCategory({ name: newCategoryName.trim(), color: newCategoryColor });
                        setNewCategoryName('');
                        setNewCategoryColor('#6366f1');
                        setShowCategoryForm(false);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryForm(false);
                      setNewCategoryName('');
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
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
                navigate('/profile');
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 min-h-[44px]
                ${
                  location.pathname === '/profile'
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
