import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

/**
 * Custom hook to access the Category context
 * 
 * Provides access to category state and operations with built-in caching and optimistic updates.
 * 
 * @example
 * ```tsx
 * const { categories, loading, fetchCategories, createCategory } = useCategories();
 * 
 * useEffect(() => {
 *   fetchCategories();
 * }, [fetchCategories]);
 * 
 * const handleCreate = async (data) => {
 *   try {
 *     await createCategory(data);
 *   } catch (error) {
 *     console.error('Failed to create category:', error);
 *   }
 * };
 * ```
 * 
 * @throws Error if used outside of CategoryProvider
 * @returns CategoryContextType with all category operations and state
 */
export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }

  return context;
};
