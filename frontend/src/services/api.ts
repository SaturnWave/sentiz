import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Auth } from 'aws-amplify';
import { API_CONFIG } from '../config/api';
import { store } from '../store';
import { clearUser } from '../features/auth/slices/authSlice';
import { addNotification } from '../features/ui/slices/uiSlice';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Try to get the current authenticated user
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // User is not authenticated, proceed without token
      console.log('No current user session');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Handle auth errors
    if (error.response?.status === 401) {
      // Dispatch logout action
      store.dispatch(clearUser());
      
      // Show notification
      store.dispatch(
        addNotification({
          type: 'error',
          message: 'Your session has expired. Please log in again.',
        })
      );
    }
    
    // Generic error handling
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
    
    // Return rejected promise
    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

// API service
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config);
  },
  
  // Direct upload to S3 with presigned URL
  uploadToS3: async (presignedUrl: string, file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    };
    
    await axios.put(presignedUrl, file, config);
    
    // Return the URL without the query string parameters
    return presignedUrl.split('?')[0];
  },
};