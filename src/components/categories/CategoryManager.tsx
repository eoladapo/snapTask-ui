import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBadge from './CategoryBadge';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { useToastContext } from '../../context/ToastContext';
import type { Category } from '../../types/category.types';

interface CategoryManagerProps {
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategoryId?: string | null;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  onCategorySelect,
  selectedCategoryId,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { showSuccess, showError } = useToastContext();

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

  const handleCreateClick = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (data: { name: string; color: string }) => {
    try {
      if (editingCategory) {
        // Update existing category
        const updated = await categoryService.updateCategory(editingCategory._id, data);
        setCategories((prev) =>
          prev.map((cat) => (cat._id === updated._id ? updated : cat))
        );
        showSuccess('Category updated successfully');
      } else {
        // Create new category
        const created = await categoryService.createCategory(data);
        setCategories((prev) => [...prev, created]);
        showSuccess('Category created successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
      showError(errorMessage);
      throw error; // Re-throw to let form handle it
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingCategoryId(categoryToDelete._id);
      // Delete with reassignTo='null' to set tasks as uncategorized
      await categoryService.deleteCategory(categoryToDelete._id, null);
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryToDelete._id));
      showSuccess('Category deleted successfully');
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
      showError(errorMessage);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <svg
          className="animate-spin h-8 w-8 text-[var(--color-purple-primary)]"
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Categories
        </h2>
        <button
          onClick={handleCreateClick}
          className="
            inline-flex items-center gap-2
            px-4 py-2
            bg-[var(--color-purple-primary)]
            text-white
            rounded-lg
            hover:bg-[var(--color-purple-dark)]
            transition-all duration-200
            hover:scale-105
            active:scale-95
            text-sm font-medium
          "
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
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
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first category to organize your tasks
          </p>
          <button
            onClick={handleCreateClick}
            className="
              inline-flex items-center gap-2
              px-6 py-3
              bg-[var(--color-purple-primary)]
              text-white
              rounded-lg
              hover:bg-[var(--color-purple-dark)]
              transition-all duration-200
              hover:scale-105
              active:scale-95
              font-medium
            "
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence mode="popLayout">
            {categories.map((category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center justify-between
                  p-4
                  rounded-lg
                  border-2
                  transition-all duration-200
                  hover:shadow-md
                  ${
                    selectedCategoryId === category._id
                      ? 'border-[var(--color-purple-primary)] bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }
                `}
                onClick={() => onCategorySelect?.(category._id)}
                role={onCategorySelect ? 'button' : undefined}
                tabIndex={onCategorySelect ? 0 : undefined}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CategoryBadge
                    name={category.name}
                    color={category.color}
                    size="md"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(category);
                    }}
                    className="
                      p-2
                      text-gray-600 dark:text-gray-400
                      hover:text-[var(--color-purple-primary)]
                      hover:bg-purple-50 dark:hover:bg-purple-500/10
                      rounded-lg
                      transition-all
                      min-w-[40px] min-h-[40px]
                      flex items-center justify-center
                    "
                    title="Edit category"
                    aria-label={`Edit ${category.name}`}
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(category);
                    }}
                    disabled={deletingCategoryId === category._id}
                    className="
                      p-2
                      text-gray-600 dark:text-gray-400
                      hover:text-red-500
                      hover:bg-red-50 dark:hover:bg-red-500/10
                      rounded-lg
                      transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      min-w-[40px] min-h-[40px]
                      flex items-center justify-center
                    "
                    title="Delete category"
                    aria-label={`Delete ${category.name}`}
                  >
                    {deletingCategoryId === category._id ? (
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        existingCategories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? Tasks in this category will be set as uncategorized.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deletingCategoryId !== null}
      />
    </div>
  );
};

export default CategoryManager;
