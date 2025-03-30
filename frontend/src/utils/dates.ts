/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Formats a date to YYYY-MM-DD format
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toISOString().split('T')[0];
  };
  
  /**
   * Formats a date to MM/DD/YYYY format
   * @param date Date to format
   * @returns Formatted date string
   */
  export const formatDateUS = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${month}/${day}/${year}`;
  };
  
  /**
   * Formats a date with time (MM/DD/YYYY HH:MM AM/PM)
   * @param date Date to format
   * @returns Formatted date and time string
   */
  export const formatDateTime = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
  };
  
  /**
   * Creates a date object from a date string (YYYY-MM-DD)
   * @param dateString Date string to parse
   * @returns Date object
   */
  export const parseDate = (dateString: string): Date => {
    // Handle empty string
    if (!dateString) return new Date(NaN);
    
    // Try ISO format first
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;
    
    // Try to parse YYYY-MM-DD format
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    
    // Return invalid date if parsing fails
    return new Date(NaN);
  };
  
  /**
   * Gets the first day of the month for a given date
   * @param date Date to use
   * @returns Date object for first day of month
   */
  export const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  /**
   * Gets the last day of the month for a given date
   * @param date Date to use
   * @returns Date object for last day of month
   */
  export const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  
  /**
   * Gets the first day of the week for a given date (Sunday)
   * @param date Date to use
   * @returns Date object for first day of week
   */
  export const getFirstDayOfWeek = (date: Date): Date => {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  };
  
  /**
   * Gets the last day of the week for a given date (Saturday)
   * @param date Date to use
   * @returns Date object for last day of week
   */
  export const getLastDayOfWeek = (date: Date): Date => {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - day));
  };
  
  /**
   * Adds a specified number of days to a date
   * @param date Date to modify
   * @param days Number of days to add (negative to subtract)
   * @returns New date with days added
   */
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  /**
   * Adds a specified number of months to a date
   * @param date Date to modify
   * @param months Number of months to add (negative to subtract)
   * @returns New date with months added
   */
  export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };
  
  /**
   * Adds a specified number of years to a date
   * @param date Date to modify
   * @param years Number of years to add (negative to subtract)
   * @returns New date with years added
   */
  export const addYears = (date: Date, years: number): Date => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  };
  
  /**
   * Calculates the difference in days between two dates
   * @param date1 First date
   * @param date2 Second date
   * @returns Difference in days (positive if date2 > date1)
   */
  export const getDaysDifference = (date1: Date, date2: Date): number => {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };
  
  /**
   * Checks if a date is today
   * @param date Date to check
   * @returns True if date is today, false otherwise
   */
  export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  /**
   * Checks if a date is in the past
   * @param date Date to check
   * @returns True if date is in the past, false otherwise
   */
  export const isPast = (date: Date): boolean => {
    return date.getTime() < new Date().getTime();
  };
  
  /**
   * Checks if a date is in the future
   * @param date Date to check
   * @returns True if date is in the future, false otherwise
   */
  export const isFuture = (date: Date): boolean => {
    return date.getTime() > new Date().getTime();
  };
  
  /**
   * Gets a list of dates between two dates (inclusive)
   * @param startDate Start date
   * @param endDate End date
   * @returns Array of dates
   */
  export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  /**
   * Gets a list of month start dates between two dates
   * @param startDate Start date
   * @param endDate End date
   * @returns Array of month start dates
   */
  export const getMonthsBetween = (startDate: Date, endDate: Date): Date[] => {
    const months: Date[] = [];
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    while (currentDate <= endDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };
  
  /**
   * Gets the quarter (1-4) for a given date
   * @param date Date to check
   * @returns Quarter number (1-4)
   */
  export const getQuarter = (date: Date): number => {
    return Math.floor(date.getMonth() / 3) + 1;
  };
  
  /**
   * Gets the month name for a given date
   * @param date Date to check
   * @param format 'long' for full name, 'short' for abbreviated
   * @returns Month name
   */
  export const getMonthName = (date: Date, format: 'long' | 'short' = 'long'): string => {
    const options: Intl.DateTimeFormatOptions = { month: format };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  /**
   * Gets the day of week name for a given date
   * @param date Date to check
   * @param format 'long' for full name, 'short' for abbreviated
   * @returns Day of week name
   */
  export const getDayOfWeekName = (date: Date, format: 'long' | 'short' = 'long'): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: format };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };