import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useTasks } from '../../hooks/useTasks';
import { useToastContext } from '../../context/ToastContext';
import { categoryService } from '../../services/categoryService';
import CategoryBadge from '../categories/CategoryBadge';
import type { Task } from '../../types/task.types';
import type { Category } from '../../types/category.types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  taskDate?: Date; // Date for which this task is being created
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task, taskDate }) => {
  const { createTask, updateTask } = useTasks();
  const { showSuccess, showError } = useToastContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!task;

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen) {
        try {
          setLoadingCategories(true);
          const fetchedCategories = await categoryService.getAllCategories();
          setCategories(fetchedCategories);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [isOpen]);

  // Populate form when editing existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setCategoryId(task.category || '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setStatus('pending');
      setCategoryId('');
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isEditMode && task) {
        // Update existing task
        await updateTask(task._id, {
          title: title.trim(),
          description: description.trim(),
          status,
          category: categoryId || null,
        });
        showSuccess('Task updated successfully!');
      } else {
        // Create new task with the selected date
        await createTask({
          title: title.trim(),
          description: description.trim(),
          status,
          category: categoryId || null,
          taskDate: taskDate?.toISOString(),
        });
        showSuccess('Task created successfully!');
      }

      // Close modal after successful submission
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save task';
      setErrors({ general: errorMessage });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setCategoryId('');
    setErrors({});
    onClose();
  };

  // Get selected category for badge display
  const selectedCategory = categories.find((cat) => cat._id === categoryId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error Message */}
        {errors.general && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            role="alert"
          >
            {errors.general}
          </div>
        )}

        {/* Title Field */}
        <Input
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Enter task title"
          required
          autoFocus
        />

        {/* Description Field */}
        <div className="w-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
            className="
              w-full px-4 py-3
              rounded-[var(--radius-button)]
              border-2 border-[var(--color-border)]
              bg-white
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-secondary)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-2 focus:ring-[var(--color-purple-light)] focus:ring-opacity-20
              resize-none
            "
          />
        </div>

        {/* Category Selector */}
        <div className="w-full">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loadingCategories}
            className="
              w-full px-4 py-3
              rounded-[var(--radius-button)]
              border-2 border-[var(--color-border)]
              bg-white
              text-[var(--color-text-primary)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-2 focus:ring-[var(--color-purple-light)] focus:ring-opacity-20
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {/* Selected Category Badge Preview */}
          {selectedCategory && (
            <div className="mt-2">
              <CategoryBadge
                name={selectedCategory.name}
                color={selectedCategory.color}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Status Selector */}
        <div className="w-full">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')
            }
            className="
              w-full px-4 py-3
              rounded-[var(--radius-button)]
              border-2 border-[var(--color-border)]
              bg-white
              text-[var(--color-text-primary)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-2 focus:ring-[var(--color-purple-light)] focus:ring-opacity-20
              cursor-pointer
            "
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
          >
            {isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
