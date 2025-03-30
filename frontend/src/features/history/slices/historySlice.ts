import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import { RootState } from '../../../store';
import { AnalysisResult } from '../../../types/models';

// Types
interface HistoryItem extends AnalysisResult {
  source: string;
  timestamp: string;
}

interface HistoryState {
  items: HistoryItem[];
  recentAnalyses: HistoryItem[];
  totalAnalyses: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  lastEvaluatedKey: string | null;
}

// Helper function to get the user ID from state
const getUserId = (state: RootState) => state.auth.user?.userId || 'anonymous';

// Async thunks for history
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async ({ limit = 20, lastKey = null }: { limit?: number; lastKey?: string | null }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const params: Record<string, any> = { user_id: userId, limit };
      if (lastKey) params.lastKey = lastKey;
      
      const response = await apiService.get('/history', { params });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history');
    }
  }
);

export const fetchHistorySummary = createAsyncThunk(
  'history/fetchHistorySummary',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.get('/history/summary', {
        params: { user_id: userId }
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history summary');
    }
  }
);

export const fetchRecentAnalyses = createAsyncThunk(
  'history/fetchRecentAnalyses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getUserId(state);
      
      const response = await apiService.get('/history', {
        params: { user_id: userId, limit: 5 }
      });
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recent analyses');
    }
  }
);

// Initial state
const initialState: HistoryState = {
  items: [],
  recentAnalyses: [],
  totalAnalyses: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  lastEvaluatedKey: null,
};

// History slice
const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addToHistory: (state, action: PayloadAction<AnalysisResult>) => {
      const newItem: HistoryItem = {
        ...action.payload,
        source: action.payload.source || 'direct_input',
        timestamp: new Date().toISOString(),
      };
      
      state.items.unshift(newItem);
      state.recentAnalyses.unshift(newItem);
      
      // Keep recent analyses limited to 5 items
      if (state.recentAnalyses.length > 5) {
        state.recentAnalyses.pop();
      }
      
      // Increment total analyses count
      state.totalAnalyses += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If it's the first page or a reload, replace items
        if (state.currentPage === 1) {
          state.items = action.payload.items;
        } else {
          // Otherwise append new items
          state.items = [...state.items, ...action.payload.items];
        }
        
        state.lastEvaluatedKey = action.payload.lastEvaluatedKey;
        
        // Update total pages (approximate calculation)
        if (action.payload.items.length > 0) {
          const itemsPerPage = action.payload.items.length;
          state.totalPages = Math.ceil(state.totalAnalyses / itemsPerPage);
        }
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch History Summary
      .addCase(fetchHistorySummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistorySummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalAnalyses = action.payload.total_analyses;
      })
      .addCase(fetchHistorySummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Recent Analyses
      .addCase(fetchRecentAnalyses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentAnalyses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentAnalyses = action.payload.items;
      })
      .addCase(fetchRecentAnalyses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentPage, addToHistory } = historySlice.actions;

export default historySlice.reducer;