import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

/**
 * Custom hook to consume TaskContext
 * @throws Error if used outside of TaskProvider
 * @returns TaskContext value
 */
export const useTasks = () => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  
  return context;
};
