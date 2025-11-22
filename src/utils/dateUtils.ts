/**
 * Format a date to YYYY-MM-DD string in local timezone
 * This avoids timezone conversion issues when comparing dates
 */
export const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string or Date object to local date string
 */
export const parseDateLocal = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return formatDateLocal(date);
};
