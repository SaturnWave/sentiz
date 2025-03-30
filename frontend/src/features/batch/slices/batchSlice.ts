import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface BatchJob {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  completedAt?: string;
  resultUrl?: string;
  errorMessage?: string;
  progress?: number;
  totalDocuments?: number;
  processedDocuments?: number;
}

interface BatchState {
  jobs: BatchJob[];
  currentJob: BatchJob | null;
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

const initialState: BatchState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
};

export const fetchBatchJobs = createAsyncThunk(
  'batch/fetchJobs',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/batch/jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch batch jobs');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch batch jobs');
    }
  }
);

export const fetchBatchJob = createAsyncThunk(
  'batch/fetchJob',
  async (jobId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/batch/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch batch job');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch batch job');
    }
  }
);

export const createBatchJob = createAsyncThunk(
  'batch/createJob',
  async (file: File, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      // Create a new FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Create an XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Set up a new promise to handle the async XHR request
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.open('POST', '/api/batch/jobs', true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            dispatch(setUploadProgress(progress));
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(errorData.message || 'Failed to create batch job');
            } catch {
              reject('Failed to create batch job');
            }
          }
        };
        
        xhr.onerror = () => {
          reject('Network error occurred');
        };
        
        xhr.send(formData);
      });

      dispatch(setIsUploading(true));
      const data = await uploadPromise;
      dispatch(setIsUploading(false));
      dispatch(setUploadProgress(0));
      
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to create batch job');
    }
  }
);

export const cancelBatchJob = createAsyncThunk(
  'batch/cancelJob',
  async (jobId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/batch/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to cancel batch job');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to cancel batch job');
    }
  }
);

export const deleteBatchJob = createAsyncThunk(
  'batch/deleteJob',
  async (jobId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/batch/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete batch job');
      }

      return jobId;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to delete batch job');
    }
  }
);

const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    clearBatchError: (state) => {
      state.error = null;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    updateJobProgress: (state, action: PayloadAction<{ jobId: string; progress: number; processedDocuments: number }>) => {
      const { jobId, progress, processedDocuments } = action.payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (job) {
        job.progress = progress;
        job.processedDocuments = processedDocuments;
      }
      if (state.currentJob && state.currentJob.id === jobId) {
        state.currentJob.progress = progress;
        state.currentJob.processedDocuments = processedDocuments;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Batch Jobs
      .addCase(fetchBatchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBatchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchBatchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Batch Job
      .addCase(fetchBatchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBatchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
        // Also update the job in the jobs array if it exists
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(fetchBatchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Batch Job
      .addCase(createBatchJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBatchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.unshift(action.payload);
        state.currentJob = action.payload;
      })
      .addCase(createBatchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      })
      // Cancel Batch Job
      .addCase(cancelBatchJob.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        // Update the job in the jobs array
        const index = state.jobs.findIndex(job => job.id === updatedJob.id);
        if (index !== -1) {
          state.jobs[index] = updatedJob;
        }
        // Update currentJob if it's the same job
        if (state.currentJob && state.currentJob.id === updatedJob.id) {
          state.currentJob = updatedJob;
        }
      })
      // Delete Batch Job
      .addCase(deleteBatchJob.fulfilled, (state, action) => {
        const jobId = action.payload as string;
        state.jobs = state.jobs.filter(job => job.id !== jobId);
        // Clear currentJob if it's the deleted job
        if (state.currentJob && state.currentJob.id === jobId) {
          state.currentJob = null;
        }
      });
  }
});

export const { 
  clearBatchError, 
  setIsUploading, 
  setUploadProgress, 
  clearCurrentJob,
  updateJobProgress 
} = batchSlice.actions;

export const selectBatchJobs = (state: RootState) => state.batch.jobs;
export const selectCurrentBatchJob = (state: RootState) => state.batch.currentJob;
export const selectBatchLoading = (state: RootState) => state.batch.isLoading;
export const selectBatchUploading = (state: RootState) => state.batch.isUploading;
export const selectUploadProgress = (state: RootState) => state.batch.uploadProgress;
export const selectBatchError = (state: RootState) => state.batch.error;

export default batchSlice.reducer;