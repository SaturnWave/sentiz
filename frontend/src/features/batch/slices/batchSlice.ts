import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import { RootState } from '../../../store';
import { FEATURES } from '../../../config/features';

// Types
interface BatchJob {
  jobId: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileName: string;
  timestamp: string;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  s3InputPath: string;
  s3ResultPath?: string;
  errorMessage?: string;
}

interface BatchState {
  currentJob: BatchJob | null;
  jobHistory: BatchJob[];
  isUploading: boolean;
  uploadProgress: number;
  isProcessing: boolean;
  error: string | null;
  presignedUrl: string | null;
}

// Helper function to get the user ID from state
const getUserId = (state: RootState) => state.auth.user?.userId || 'anonymous';

// Async thunks for batch processing
export const getPresignedUrl = createAsyncThunk(
  'batch/getPresignedUrl',
  async ({ fileName, contentType }: { fileName: string; contentType: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.post('/batch/presign', {
        filename: fileName,
        contentType,
        userId
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get presigned URL');
    }
  }
);

export const startBatchJob = createAsyncThunk(
  'batch/startJob',
  async ({ jobId, s3Key, filename }: { jobId: string; s3Key: string; filename: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.post('/batch/start', {
        jobId,
        s3Key,
        filename,
        userId
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start batch job');
    }
  }
);

export const getBatchJobStatus = createAsyncThunk(
  'batch/getJobStatus',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.get(`/batch/status/${jobId}`, {
        params: { user_id: userId }
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get job status');
    }
  }
);

export const getBatchJobResults = createAsyncThunk(
  'batch/getJobResults',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.get(`/batch/results/${jobId}`, {
        params: { user_id: userId }
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get job results');
    }
  }
);

export const getBatchJobHistory = createAsyncThunk(
  'batch/getJobHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.get('/batch/history', {
        params: { user_id: userId }
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get job history');
    }
  }
);

// Initial state
const initialState: BatchState = {
  currentJob: null,
  jobHistory: [],
  isUploading: false,
  uploadProgress: 0,
  isProcessing: false,
  error: null,
  presignedUrl: null,
};

// Batch slice
const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateJobStatus: (state, action: PayloadAction<Partial<BatchJob>>) => {
      if (state.currentJob && state.currentJob.jobId === action.payload.jobId) {
        state.currentJob = { ...state.currentJob, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Presigned URL
      .addCase(getPresignedUrl.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(getPresignedUrl.fulfilled, (state, action) => {
        state.isUploading = false;
        state.presignedUrl = action.payload.url;
        state.uploadProgress = 0;
      })
      .addCase(getPresignedUrl.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })
      
      // Start Batch Job
      .addCase(startBatchJob.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(startBatchJob.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentJob = action.payload.job;
      })
      .addCase(startBatchJob.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      
      // Get Job Status
      .addCase(getBatchJobStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(getBatchJobStatus.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob.jobId === action.payload.jobId) {
          state.currentJob = action.payload;
        }
      })
      .addCase(getBatchJobStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Get Job Results
      .addCase(getBatchJobResults.pending, (state) => {
        state.error = null;
      })
      .addCase(getBatchJobResults.fulfilled, (state, action) => {
        // Handle job results as needed
      })
      .addCase(getBatchJobResults.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Get Job History
      .addCase(getBatchJobHistory.pending, (state) => {
        state.error = null;
      })
      .addCase(getBatchJobHistory.fulfilled, (state, action) => {
        state.jobHistory = action.payload.jobs;
      })
      .addCase(getBatchJobHistory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUploadProgress, clearCurrentJob, clearError, updateJobStatus } = batchSlice.actions;

export default batchSlice.reducer;