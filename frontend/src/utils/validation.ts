/**
 * Utility functions for form validation and data validation
 */

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password regex (min 8 chars, at least one number, uppercase and lowercase)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// URL regex pattern
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  return EMAIL_REGEX.test(email);
};

/**
 * Validates a password based on security requirements
 * @param password Password to validate
 * @returns True if valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  return PASSWORD_REGEX.test(password);
};

/**
 * Gets password validation error message
 * @param password Password to validate
 * @returns Error message or empty string if valid
 */
export const getPasswordError = (password: string): string => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!isValidPassword(password)) return 'Password does not meet security requirements';
  return '';
};

/**
 * Checks if two passwords match
 * @param password Primary password
 * @param confirmPassword Confirmation password
 * @returns True if matching, false otherwise
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates a URL
 * @param url URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  return URL_REGEX.test(url);
};

/**
 * Validates file type against allowed types
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types (e.g., ['text/csv', 'application/csv'])
 * @returns True if valid, false otherwise
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validates file size against maximum size
 * @param file File to validate
 * @param maxSizeBytes Maximum file size in bytes
 * @returns True if valid, false otherwise
 */
export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
  if (!file) return false;
  return file.size <= maxSizeBytes;
};

/**
 * Validates username (alphanumeric, underscore, 3-20 chars)
 * @param username Username to validate
 * @returns True if valid, false otherwise
 */
export const isValidUsername = (username: string): boolean => {
  if (!username) return false;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Checks if a value is empty (null, undefined, empty string, or whitespace)
 * @param value Value to check
 * @returns True if empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Checks if a value is a valid number
 * @param value Value to check
 * @returns True if valid number, false otherwise
 */
export const isValidNumber = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(Number(value));
};

/**
 * Checks if a string is within a specified length range
 * @param str String to check
 * @param min Minimum length
 * @param max Maximum length
 * @returns True if within range, false otherwise
 */
export const isValidLength = (str: string, min: number, max: number): boolean => {
  if (str === null || str === undefined) return false;
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Validates a CSV file contents by checking for required headers
 * @param csvContent CSV content as string
 * @param requiredHeaders Array of required header names
 * @returns True if valid, false otherwise
 */
export const validateCsvHeaders = (csvContent: string, requiredHeaders: string[]): boolean => {
  if (!csvContent) return false;
  
  // Get the first line of the CSV (headers)
  const lines = csvContent.split('\n');
  if (lines.length === 0) return false;
  
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  
  // Check if all required headers are present
  return requiredHeaders.every(required => 
    headers.includes(required.toLowerCase())
  );
};

/**
 * Gets form field validation status and message
 * @param value Field value
 * @param validationRules Object with validation rules
 * @returns Object with isValid and errorMessage
 */
export const validateField = (
  value: any, 
  validationRules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    errorMessage?: string;
  }
): { isValid: boolean; errorMessage: string } => {
  const { required, min, max, pattern, custom, errorMessage } = validationRules;
  
  // Required check
  if (required && isEmpty(value)) {
    return { isValid: false, errorMessage: errorMessage || 'This field is required' };
  }
  
  // Skip other validations if empty and not required
  if (isEmpty(value) && !required) {
    return { isValid: true, errorMessage: '' };
  }
  
  // Length check for strings
  if (typeof value === 'string' && (min !== undefined || max !== undefined)) {
    const length = value.trim().length;
    if (min !== undefined && length < min) {
      return { 
        isValid: false, 
        errorMessage: errorMessage || `Must be at least ${min} characters` 
      };
    }
    if (max !== undefined && length > max) {
      return { 
        isValid: false, 
        errorMessage: errorMessage || `Must be no more than ${max} characters` 
      };
    }
  }
  
  // Pattern check
  if (pattern && typeof value === 'string' && !pattern.test(value)) {
    return { 
      isValid: false, 
      errorMessage: errorMessage || 'Invalid format' 
    };
  }
  
  // Custom validation
  if (custom && !custom(value)) {
    return { 
      isValid: false, 
      errorMessage: errorMessage || 'Invalid value' 
    };
  }
  
  return { isValid: true, errorMessage: '' };
};