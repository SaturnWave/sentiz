// Storage service for local storage management
const PREFIX = 'sentiment_analyzer_';

export const storageService = {
  // Set item with prefix
  setItem: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${PREFIX}${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  // Get item with prefix
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const serializedValue = localStorage.getItem(`${PREFIX}${key}`);
      if (serializedValue === null) return defaultValue || null;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  // Remove item with prefix
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  // Clear all items with prefix
  clear: (): void => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
  
  // Get all keys with prefix
  getKeys: (): string[] => {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(PREFIX))
        .map(key => key.replace(PREFIX, ''));
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  },
  
  // Check if key exists
  hasKey: (key: string): boolean => {
    try {
      return localStorage.getItem(`${PREFIX}${key}`) !== null;
    } catch (error) {
      console.error('Error checking key in localStorage:', error);
      return false;
    }
  }
};