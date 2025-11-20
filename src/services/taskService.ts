import api from './api';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';

export const taskService = {
  /**
   * Get all tasks for the authenticated user
   * @param categoryId - Optional category ID to filter tasks
   * @returns Promise with array of tasks
   */
  async getAllTasks(categoryId?: string): Promise<Task[]> {
    const params = categoryId ? { category: categoryId } : {};
    const response = await api.get<{ message: string; tasks: Task[] }>('/task', { params });
    // Backend returns { message, tasks } so we need to extract the tasks array
    return response.data.tasks;
  },

  /**
   * Get a single task by ID
   * @param id - Task ID
   * @returns Promise with task data
   */
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<{ message: string; task: Task }>(`/task/${id}`);
    return response.data.task;
  },

  /**
   * Create a new task
   * @param data - Task creation data (title, description, status)
   * @returns Promise with created task
   */
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post<{ message: string; task: Task }>('/task', data);
    return response.data.task;
  },

  /**
   * Update an existing task
   * @param id - Task ID
   * @param data - Task update data (title, description, status)
   * @returns Promise with updated task
   */
  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.put<{ message: string; task: Task }>(`/task/${id}`, data);
    return response.data.task;
  },

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Promise with void
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/task/${id}`);
  },

  /**
   * Mark a task as completed
   * @param id - Task ID
   * @returns Promise with updated task
   */
  async markAsCompleted(id: string): Promise<Task> {
    const response = await api.patch<{ message: string; task: Task }>(`/task/complete/${id}`);
    return response.data.task;
  },

  /**
   * Mark a task as in progress
   * @param id - Task ID
   * @returns Promise with updated task
   */
  async markAsInProgress(id: string): Promise<Task> {
    const response = await api.patch<{ message: string; task: Task }>(`/task/in-progress/${id}`);
    return response.data.task;
  },

  /**
   * Mark a task as pending
   * @param id - Task ID
   * @returns Promise with updated task
   */
  async markAsPending(id: string): Promise<Task> {
    const response = await api.patch<{ message: string; task: Task }>(`/task/pending/${id}`);
    return response.data.task;
  },
};
