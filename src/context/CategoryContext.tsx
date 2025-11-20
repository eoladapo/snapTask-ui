import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CreateCategoryData, UpdateCategoryData } from '../types/category.types';
import { getErrorMessage } from '../services/api';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<Category>;
  updateCategory: (id: string, data: UpdateCategoryData) => Promise<void>;
  deleteCategory: (id: string, reassignTo?: string | null) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  clearCategories: () => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all categories from the API
   */
  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new category with optimistic UI update
   */
  const createCategory = useCallback(async (data: CreateCategoryData): Promise<Category> => {
    // Create temporary category for optimistic update
    const tempCategory: Category = {
      _id: `temp-${Date.now()}`,
      name: data.name,
      color: data.color,
      user: '',
    };

    try {
      setError(null);
      // Optimistic update
      setCategories((prevCategories) => [...prevCategories, tempCategory]);

      // Make API call
      const createdCategory = await categoryService.createCategory(data);

      // Replace temporary category with real category
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === tempCategory._id ? createdCategory : category
        )
      );

      return createdCategory;
    } catch (err) {
      // Rollback optimistic update on error
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== tempCategory._id)
      );

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Update an existing category with optimistic UI update
   */
  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryData): Promise<void> => {
      // Store previous state for rollback
      const previousCategories = categories;

      try {
        setError(null);
        // Optimistic update
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === id ? { ...category, ...data } : category
          )
        );

        // Make API call
        const updatedCategory = await categoryService.updateCategory(id, data);

        // Update with actual response
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === id ? updatedCategory : category
          )
        );
      } catch (err) {
        // Rollback optimistic update on error
        setCategories(previousCategories);

        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [categories]
  );

  /**
   * Delete a category with optimistic UI update
   */
  const deleteCategory = useCallback(
    async (id: string, reassignTo?: string | null): Promise<void> => {
      // Store previous state for rollback
      const previousCategories = categories;

      try {
        setError(null);
        // Optimistic update
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );

        // Make API call
        await categoryService.deleteCategory(id, reassignTo);
      } catch (err) {
        // Rollback optimistic update on error
        setCategories(previousCategories);

        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [categories]
  );

  /**
   * Get a category by ID from the cached categories
   */
  const getCategoryById = useCallback(
    (id: string): Category | undefined => {
      return categories.find((category) => category._id === id);
    },
    [categories]
  );

  /**
   * Clear all cached category data (used on logout)
   */
  const clearCategories = useCallback((): void => {
    setCategories([]);
    setError(null);
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearCategories,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
