import api, { getErrorMessage } from './api';
import type { Category, CreateCategoryData, UpdateCategoryData } from '../types/category.types';

/**
 * Category Service
 * Handles all API calls related to category management
 */
export const categoryService = {
  /**
   * Get all categories for the authenticated user
   * @returns Promise with array of categories
   * @throws Error with user-friendly message on failure
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get<{ message: string; categories: Category[] }>('/categories');
      return response.data.categories;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  },

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @returns Promise with category data
   * @throws Error with user-friendly message on failure
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Category ID is required');
      }

      const response = await api.get<{ message: string; category: Category }>(
        `/categories/${id}`
      );
      return response.data.category;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  },

  /**
   * Create a new category
   * @param data - Category creation data (name, color)
   * @returns Promise with created category
   * @throws Error with user-friendly message on failure
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      // Client-side validation
      if (!data.name || data.name.trim() === '') {
        throw new Error('Category name is required');
      }

      if (data.name.trim().length > 50) {
        throw new Error('Category name cannot exceed 50 characters');
      }

      if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
        throw new Error('Color must be a valid hex code (e.g., #FF5733)');
      }

      const response = await api.post<{ message: string; category: Category }>(
        '/categories',
        data
      );
      return response.data.category;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  },

  /**
   * Update an existing category
   * @param id - Category ID
   * @param data - Category update data (name, color)
   * @returns Promise with updated category
   * @throws Error with user-friendly message on failure
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Category ID is required');
      }

      // Client-side validation
      if (data.name !== undefined) {
        if (data.name.trim() === '') {
          throw new Error('Category name cannot be empty');
        }

        if (data.name.trim().length > 50) {
          throw new Error('Category name cannot exceed 50 characters');
        }
      }

      if (data.color !== undefined && !/^#[0-9A-F]{6}$/i.test(data.color)) {
        throw new Error('Color must be a valid hex code (e.g., #FF5733)');
      }

      const response = await api.put<{ message: string; category: Category }>(
        `/categories/${id}`,
        data
      );
      return response.data.category;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  },

  /**
   * Delete a category
   * @param id - Category ID
   * @param reassignTo - Optional category ID to reassign tasks to, or 'null' for uncategorized
   * @returns Promise with deletion result including number of tasks reassigned
   * @throws Error with user-friendly message on failure
   */
  async deleteCategory(
    id: string,
    reassignTo?: string | null
  ): Promise<{ message: string; tasksReassigned: number }> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Category ID is required');
      }

      const params = reassignTo !== undefined ? { reassignTo: reassignTo || 'null' } : {};
      const response = await api.delete<{ message: string; tasksReassigned: number }>(
        `/categories/${id}`,
        { params }
      );
      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  },
};
