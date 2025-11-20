import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { taskService } from '../services/taskService';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';
import { getErrorMessage } from '../services/api';

type TaskFilter = 'all' | 'pending' | 'in-progress' | 'completed';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  setFilter: (filter: TaskFilter) => void;
  clearTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('all');

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new task with optimistic UI update
   */
  const createTask = useCallback(async (data: CreateTaskData): Promise<void> => {
    // Create temporary task for optimistic update
    const tempTask: Task = {
      _id: `temp-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      user: '',
    };

    try {
      setError(null);
      // Optimistic update
      setTasks((prevTasks) => [...prevTasks, tempTask]);

      // Make API call
      const createdTask = await taskService.createTask(data);

      // Replace temporary task with real task
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === tempTask._id ? createdTask : task))
      );
    } catch (err) {
      // Rollback optimistic update on error
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== tempTask._id));
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Update an existing task with optimistic UI update
   */
  const updateTask = useCallback(async (id: string, data: UpdateTaskData): Promise<void> => {
    // Store previous state for rollback
    const previousTasks = tasks;

    try {
      setError(null);
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...data } : task
        )
      );

      // Make API call
      const updatedTask = await taskService.updateTask(id, data);

      // Update with actual response
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (err) {
      // Rollback optimistic update on error
      setTasks(previousTasks);
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks]);

  /**
   * Delete a task with optimistic UI update
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    // Store previous state for rollback
    const previousTasks = tasks;

    try {
      setError(null);
      // Optimistic update
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

      // Make API call
      await taskService.deleteTask(id);
    } catch (err) {
      // Rollback optimistic update on error
      setTasks(previousTasks);
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks]);

  /**
   * Update task status with optimistic UI update
   */
  const updateTaskStatus = useCallback(async (
    id: string,
    status: Task['status']
  ): Promise<void> => {
    // Store previous state for rollback
    const previousTasks = tasks;

    try {
      setError(null);
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status } : task
        )
      );

      // Make API call based on status
      let updatedTask: Task;
      switch (status) {
        case 'completed':
          updatedTask = await taskService.markAsCompleted(id);
          break;
        case 'in-progress':
          updatedTask = await taskService.markAsInProgress(id);
          break;
        case 'pending':
          updatedTask = await taskService.markAsPending(id);
          break;
        default:
          throw new Error('Invalid status');
      }

      // Update with actual response
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (err) {
      // Rollback optimistic update on error
      setTasks(previousTasks);
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks]);

  /**
   * Clear all cached task data (used on logout)
   */
  const clearTasks = useCallback((): void => {
    setTasks([]);
    setError(null);
    setFilter('all');
  }, []);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    filter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilter,
    clearTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
