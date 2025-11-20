import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface Category {
  _id: string;
  name: string;
  color: string;
}

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
  category?: Category | null;
  existingCategories?: Category[];
}

const PRESET_COLORS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  existingCategories = [],
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [errors, setErrors] = useState<{ name?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!category;

  // Populate form when editing existing category
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setCustomColor(category.color);
    } else {
      // Reset form for new category
      setName('');
      setColor(PRESET_COLORS[0]);
      setCustomColor('');
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
      setErrors(newErrors);
      return false;
    }

    if (name.trim().length > 50) {
      newErrors.name = 'Category name must be 50 characters or less';
      setErrors(newErrors);
      return false;
    }

    // Check for duplicate names (case-insensitive)
    const isDuplicate = existingCategories.some(
      (cat) =>
        cat.name.toLowerCase() === name.trim().toLowerCase() &&
        (!isEditMode || cat._id !== category._id)
    );

    if (isDuplicate) {
      newErrors.name = 'A category with this name already exists';
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const finalColor = customColor || color;
      await onSubmit({
        name: name.trim(),
        color: finalColor,
      });

      // Close modal after successful submission
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save category';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setColor(PRESET_COLORS[0]);
    setCustomColor('');
    setErrors({});
    onClose();
  };

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    setCustomColor('');
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    setColor(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Category' : 'Create New Category'}
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

        {/* Name Field */}
        <Input
          label="Category Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="e.g., Work, Learning, Health"
          required
          autoFocus
          maxLength={50}
        />

        {/* Color Picker */}
        <div className="w-full">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
            Category Color
          </label>

          {/* Preset Colors */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => handleColorSelect(presetColor)}
                className={`
                  w-full aspect-square rounded-lg
                  transition-all duration-200
                  hover:scale-110
                  ${
                    color === presetColor && !customColor
                      ? 'ring-2 ring-offset-2 ring-[var(--color-purple-primary)] scale-110'
                      : ''
                  }
                `}
                style={{ backgroundColor: presetColor }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                label="Custom Color (Hex)"
                type="text"
                value={customColor}
                onChange={handleCustomColorChange}
                placeholder="#8B5CF6"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0 mt-6"
              style={{ backgroundColor: color }}
              aria-label="Selected color preview"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter a hex color code (e.g., #8B5CF6) or select from presets above
          </p>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border text-sm"
              style={{
                backgroundColor: `${color}20`,
                borderColor: `${color}60`,
                color: color,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {name || 'Category Name'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
          >
            {isEditMode ? 'Update Category' : 'Create Category'}
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

export default CategoryForm;
