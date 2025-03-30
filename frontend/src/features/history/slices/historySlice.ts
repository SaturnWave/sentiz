import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface AnalysisHistory {
  id: string;
  userId: string;
  type: 'text' | 'file' | 'batch';
  text?: string;
  fileName?: string;
  fileUrl?: string;
  createdAt: string;
  sentiment?: {
    positive: number;
    negative: number;
    neutral: number;
    mixed?: number;
  };
  sentimentScore?: number;
  keyPhrases?: Array<{ text: string; score?: number }>;
  entities?: Array<{ id: string; text: string; type: string; score?: number }>;
  audioUrl?: string;
}

interface HistoryState {
  items: AnalysisHistory[];
  selectedItem: AnalysisHistory | null;
  isLoading: boolean;
  error: string | null;
  filter: {
    type: string | null;
    dateRange: [string | null, string | null];
    searchQuery: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: HistoryState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filter: {
    type: null,
    dateRange: [null, null],
    searchQuery: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const fetchHistoryItems = createAsyncThunk(
  'history/fetchItems',
  async (
    {
      page = 1,
      limit = 10,
      type = null,
      startDate = null,
      endDate = null,
      searchQuery = '',
    }: {
      page?: number;
      limit?: number;
      type?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      searchQuery?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      // Build the query string
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (type) {
        queryParams.append('type', type);
      }
      
      if (startDate) {
        queryParams.append('startDate', startDate);
      }
      
      if (endDate) {
        queryParams.append('endDate', endDate);
      }
      
      if (searchQuery) {
        queryParams.append('query', searchQuery);
      }

      const response = await fetch(`/api/history?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch history items');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch history items');
    }
  }
);

export const fetchHistoryItem = createAsyncThunk(
  'history/fetchItem',
  async (itemId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/history/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch history item');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch history item');
    }
  }
);

export const deleteHistoryItem = createAsyncThunk(
  'history/deleteItem',
  async (itemId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/history/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete history item');
      }

      return itemId;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to delete history item');
    }
  }
);

export const clearAllHistory = createAsyncThunk(
  'history/clearAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to clear history');
      }

      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to clear history');
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearHistoryError: (state) => {
      state.error = null;
    },
    setFilter: (state, action: PayloadAction<{
      type?: string | null;
      dateRange?: [string | null, string | null];
      searchQuery?: string;
    }>) => {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
      // Reset pagination when filter changes
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History Items
      .addCase(fetchHistoryItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoryItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination.total = action.payload.total;
        state.pagination.page = action.payload.page;
        state.pagination.limit = action.payload.limit;
      })
      .addCase(fetchHistoryItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch History Item
      .addCase(fetchHistoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
        // Also update the item in the items array if it exists
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fetchHistoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete History Item
      .addCase(deleteHistoryItem.fulfilled, (state, action) => {
        const itemId = action.payload as string;
        state.items = state.items.filter(item => item.id !== itemId);
        // Clear selectedItem if it's the deleted item
        if (state.selectedItem && state.selectedItem.id === itemId) {
          state.selectedItem = null;
        }
      })
      // Clear All History
      .addCase(clearAllHistory.fulfilled, (state) => {
        state.items = [];
        state.selectedItem = null;
        state.pagination.total = 0;
        state.pagination.page = 1;
      });
  },
});

export const { 
  clearHistoryError, 
  setFilter, 
  setPage, 
  clearSelectedItem 
} = historySlice.actions;

export const selectHistoryItems = (state: RootState) => state.history.items;
export const selectSelectedHistoryItem = (state: RootState) => state.history.selectedItem;
export const selectHistoryLoading = (state: RootState) => state.history.isLoading;
export const selectHistoryError = (state: RootState) => state.history.error;
export const selectHistoryFilter = (state: RootState) => state.history.filter;
export const selectHistoryPagination = (state: RootState) => state.history.pagination;

export default historySlice.reducer;