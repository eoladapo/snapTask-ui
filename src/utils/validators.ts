/**
 * Form validation utility functions
 */

/**
 * Validate email format using regex pattern
 * @param email - Email string to validate
 * @returns Boolean indicating if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 compliant email regex (simplified version)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password length meets minimum requirement
 * @param password - Password string to validate
 * @param minLength - Minimum required length (default: 6)
 * @returns Boolean indicating if password meets length requirement
 */
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  return password.length >= minLength;
};

/**
 * Validate that a field is not empty
 * @param value - Value to validate
 * @returns Boolean indicating if value is not empty
 */
export const isRequired = (value: string): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Get email validation error message
 * @param email - Email to validate
 * @returns Error message or empty string if valid
 */
export const getEmailError = (email: string): string => {
  if (!isRequired(email)) {
    return 'Email is required';
  }
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

/**
 * Get password validation error message
 * @param password - Password to validate
 * @param minLength - Minimum required length (default: 6)
 * @returns Error message or empty string if valid
 */
export const getPasswordError = (password: string, minLength: number = 6): string => {
  if (!isRequired(password)) {
    return 'Password is required';
  }
  
  if (!isValidPassword(password, minLength)) {
    return `Password must be at least ${minLength} characters long`;
  }
  
  return '';
};

/**
 * Get required field validation error message
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message or empty string if valid
 */
export const getRequiredError = (value: string, fieldName: string = 'This field'): string => {
  if (!isRequired(value)) {
    return `${fieldName} is required`;
  }
  
  return '';
};
