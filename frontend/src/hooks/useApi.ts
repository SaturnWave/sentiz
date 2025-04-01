import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

interface ApiOptions<T> {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: any;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  immediate?: boolean;
}

function useApi<T = any>({
  url,
  method = 'get',
  body,
  onSuccess,
  onError,
  immediate = false,
}: ApiOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const execute = useCallback(async (overrideBody?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = overrideBody !== undefined ? overrideBody : body;
      let result;
      
      switch (method) {
        case 'post':
          result = await apiService.post<T>(url, payload);
          break;
        case 'put':
          result = await apiService.put<T>(url, payload);
          break;
        case 'delete':
          result = await apiService.delete<T>(url);
          break;
        default:
          result = await apiService.get<T>(url);
      }
      
      setData(result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      setError(err);
      if (onError) onError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body, onSuccess, onError]);
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  
  return {
    data,
    error,
    isLoading,
    execute,
  };
}

export default useApi;