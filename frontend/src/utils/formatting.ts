/**
 * Utility functions for text formatting, number formatting, data transformations, etc.
 */

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length allowed
 * @param suffix Suffix to add (default: "...")
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
  };
  
  /**
   * Formats a timestamp to a human-readable date/time string
   * @param timestamp ISO timestamp or Date object
   * @param options Optional Intl.DateTimeFormat options
   * @returns Formatted date/time string
   */
  export const formatTimestamp = (
    timestamp: string | Date, 
    options: Intl.DateTimeFormatOptions = { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }
  ): string => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  /**
   * Formats a relative time (e.g., "2 hours ago")
   * @param timestamp ISO timestamp or Date object
   * @returns Relative time string
   */
  export const formatRelativeTime = (timestamp: string | Date): string => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Convert to seconds
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return diffSec === 1 ? '1 second ago' : `${diffSec} seconds ago`;
    }
    
    // Convert to minutes
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffMin < 60) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    }
    
    // Convert to hours
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffHour < 24) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    }
    
    // Convert to days
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay < 30) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    }
    
    // Convert to months
    const diffMonth = Math.floor(diffDay / 30);
    
    if (diffMonth < 12) {
      return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
    }
    
    // Convert to years
    const diffYear = Math.floor(diffMonth / 12);
    return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
  };
  
  /**
   * Formats a number with commas as thousand separators
   * @param num Number to format
   * @returns Formatted number string
   */
  export const formatNumber = (num: number): string => {
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US');
  };
  
  /**
   * Formats a decimal percentage (0-1) to a percentage string
   * @param value Decimal value (0-1)
   * @param decimalPlaces Number of decimal places
   * @returns Formatted percentage string
   */
  export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
    if (isNaN(value)) return '0%';
    return (value * 100).toFixed(decimalPlaces) + '%';
  };
  
  /**
   * Formats a file size in bytes to a readable string (KB, MB, GB)
   * @param bytes File size in bytes
   * @param decimals Number of decimal places
   * @returns Formatted file size string
   */
  export const formatFileSize = (bytes: number, decimals: number = 1): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };
  
  /**
   * Formats a duration in milliseconds to a readable time string
   * @param ms Duration in milliseconds
   * @returns Formatted time string
   */
  export const formatDuration = (ms: number): string => {
    if (ms < 0) return '0s';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    const parts = [];
    
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };
  
  /**
   * Capitalizes the first letter of a string
   * @param str String to capitalize
   * @returns Capitalized string
   */
  export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  /**
   * Formats a sentiment value to a readable string
   * @param sentiment Sentiment value (e.g., "POSITIVE", "NEGATIVE")
   * @returns Formatted sentiment string
   */
  export const formatSentiment = (sentiment: string): string => {
    if (!sentiment) return '';
    return capitalizeFirstLetter(sentiment);
  };
  
  /**
   * Formats a camelCase string to Title Case With Spaces
   * @param camelCase camelCase string
   * @returns Title Case string
   */
  export const camelCaseToTitleCase = (camelCase: string): string => {
    if (!camelCase) return '';
    
    const withSpaces = camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
      
    return withSpaces;
  };