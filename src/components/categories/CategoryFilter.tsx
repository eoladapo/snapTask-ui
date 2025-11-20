import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { categoryService } from '../../services/categoryService';
import { useToastContext } from '../../context/ToastContext';
import type { Category } from '../../types/category.types';
import type { Task } from '../../types/task.types';

interface CategoryFilterProps {
  tasks: Task[];
  selectedCategories: string[];
  onFilterChange: (categoryIds: string[]) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  tasks,
  selectedCategories,
  onFilterChange,
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showError } = useToastContext();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      showError('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate task counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: tasks.length,
      uncategorized: 0,
    };

    tasks.forEach((task) => {
      if (!task.category) {
        counts.uncategorized++;
      } else {
        const categoryId = task.category;
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });

    return counts;
  }, [tasks]);

  // Handle filter selection
  const handleFilterToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      // If "All" is selected, clear all filters
      onFilterChange([]);
    } else {
      // Toggle the category in the selection
      if (selectedCategories.includes(categoryId)) {
        onFilterChange(selectedCategories.filter((id) => id !== categoryId));
      } else {
        onFilterChange([...selectedCategories, categoryId]);
      }
    }
  };

  // Check if a category is selected
  const isCategorySelected = (categoryId: string) => {
    if (categoryId === 'all') {
      return selectedCategories.length === 0;
    }
    return selectedCategories.includes(categoryId);
  };

  // Get display text for the filter button
  const getFilterDisplayText = () => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    }
    if (selectedCategories.length === 1) {
      if (selectedCategories[0] === 'uncategorized') {
        return 'Uncategorized';
      }
      const category = categories.find((cat) => cat._id === selectedCategories[0]);
      return category?.name || 'Unknown';
    }
    return `${selectedCategories.length} Categories`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="
          inline-flex items-center justify-between gap-2
          px-4 py-2.5
          min-w-[200px]
          bg-white dark:bg-gray-800
          border-2 border-gray-200 dark:border-gray-700
          text-gray-700 dark:text-gray-300
          rounded-lg
          hover:border-[var(--color-purple-primary)]
          hover:bg-purple-50 dark:hover:bg-purple-900/20
          transition-all duration-200
          text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-[var(--color-purple-primary)] focus:ring-opacity-50
        "
      >
        <span className="flex items-center gap-2">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {getFilterDisplayText()}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="
                absolute top-full left-0 mt-2
                w-80
                bg-white dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                rounded-lg
                shadow-xl
                z-20
                max-h-96
                overflow-y-auto
              "
            >
              <div className="p-2">
                {/* All Categories Option */}
                <button
                  onClick={() => handleFilterToggle('all')}
                  className={`
                    w-full
                    flex items-center justify-between
                    px-3 py-2.5
                    rounded-lg
                    transition-all duration-150
                    ${
                      isCategorySelected('all')
                        ? 'bg-[var(--color-purple-primary)] text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
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
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    <span className="font-medium">All Categories</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${
                          isCategorySelected('all')
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      {categoryCounts.all}
                    </span>
                    {isCategorySelected('all') && <Check className="h-5 w-5" />}
                  </div>
                </button>

                {/* Uncategorized Option */}
                <button
                  onClick={() => handleFilterToggle('uncategorized')}
                  className={`
                    w-full
                    flex items-center justify-between
                    px-3 py-2.5
                    rounded-lg
                    transition-all duration-150
                    ${
                      isCategorySelected('uncategorized')
                        ? 'bg-[var(--color-purple-primary)] text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="font-medium">Uncategorized</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${
                          isCategorySelected('uncategorized')
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      {categoryCounts.uncategorized}
                    </span>
                    {isCategorySelected('uncategorized') && <Check className="h-5 w-5" />}
                  </div>
                </button>

                {/* Divider */}
                {categories.length > 0 && (
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                )}

                {/* Category Options */}
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleFilterToggle(category._id)}
                    className={`
                      w-full
                      flex items-center justify-between
                      px-3 py-2.5
                      rounded-lg
                      transition-all duration-150
                      ${
                        isCategorySelected(category._id)
                          ? 'bg-[var(--color-purple-primary)] text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isCategorySelected(category._id) ? (
                        <span className="font-medium truncate">{category.name}</span>
                      ) : (
                        <CategoryBadge
                          name={category.name}
                          color={category.color}
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded-full
                          ${
                            isCategorySelected(category._id)
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {categoryCounts[category._id] || 0}
                      </span>
                      {isCategorySelected(category._id) && <Check className="h-5 w-5" />}
                    </div>
                  </button>
                ))}

                {/* Empty State */}
                {categories.length === 0 && (
                  <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No categories yet. Create one to organize your tasks!
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
