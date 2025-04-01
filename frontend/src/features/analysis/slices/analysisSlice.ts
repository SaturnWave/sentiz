import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

export interface AnalysisResult {
  id: string;
  text: string;
  sentiment?: {
    positive: number;
    negative: number;
    neutral: number;
    mixed?: number;
  };
  sentimentScore?: number;
  keyPhrases?: Array<{ text: string; score?: number }>;
  entities?: Array<{ id: string; text: string; type: string; score?: number }>;
  language?: string;
  createdAt: string;
  analysis_id: string;
  user_id: string;
  text_length: number;
  source: string;
  timestamp: string;
  sentiment_scores: {
    Positive: number;
    Negative: number;
    Neutral: number;
    Mixed: number;
  };
  key_phrases: Array<{ text: string; score: number }>;
  text_sample: string;
}

interface AnalysisState {
  result: AnalysisResult | null;
  history: AnalysisResult[];
  isLoading: boolean;
  isAnalyzing: boolean;
  uploadProgress: number;
  error: string | null;
  currentText: string;
  source: string;
}

const initialState: AnalysisState = {
  result: null,
  history: [],
  isLoading: false,
  isAnalyzing: false,
  uploadProgress: 0,
  error: null,
  currentText: '',
  source: 'direct_input',
};

export const analyzeText = createAsyncThunk(
  'analysis/analyzeText',
  async (text: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/analysis/text', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to analyze text');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to analyze text');
    }
  }
);

export const analyzeSentiment = createAsyncThunk(
  'analysis/analyzeSentiment',
  async ({ text, source }: { text: string; source: string }, { rejectWithValue }) => {
    try {
      // Implementation would typically call an API
      // Simplified for this example
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, source }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to analyze sentiment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to analyze sentiment');
    }
  }
);

export const analyzeFile = createAsyncThunk(
  'analysis/analyzeFile',
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
        xhr.open('POST', '/api/analysis/file', true);
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
              reject(errorData.message || 'Failed to analyze file');
            } catch {
              reject('Failed to analyze file');
            }
          }
        };
        
        xhr.onerror = () => {
          reject('Network error occurred');
        };
        
        xhr.send(formData);
      });

      dispatch(setIsAnalyzing(true));
      const data = await uploadPromise;
      dispatch(setIsAnalyzing(false));
      dispatch(setUploadProgress(0));
      
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to analyze file');
    }
  }
);

export const fetchAnalysisResult = createAsyncThunk(
  'analysis/fetchResult',
  async (resultId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/analysis/results/${resultId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch analysis result');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch analysis result');
    }
  }
);

export const fetchRecentAnalysis = createAsyncThunk(
  'analysis/fetchRecentAnalysis',
  async (limit: number = 5, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/analysis/recent?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch recent analysis');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch recent analysis');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearAnalysisError: (state) => {
      state.error = null;
    },
    clearResult: (state) => {
      state.result = null;
    },
    setIsAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.currentText = action.payload;
    },
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Analyze Text
      .addCase(analyzeText.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
      })
      .addCase(analyzeText.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.result = action.payload;
        // Add to history if not already present
        if (!state.history.some(item => item.id === action.payload.id)) {
          state.history = [action.payload, ...state.history.slice(0, 4)];
        }
      })
      .addCase(analyzeText.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload as string;
      })
      // Analyze File
      .addCase(analyzeFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAnalyzing = false;
        state.uploadProgress = 0;
        state.result = action.payload;
        // Add to history if not already present
        if (!state.history.some(item => item.id === action.payload.id)) {
          state.history = [action.payload, ...state.history.slice(0, 4)];
        }
      })
      .addCase(analyzeFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isAnalyzing = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      })
      // Fetch Analysis Result
      .addCase(fetchAnalysisResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(fetchAnalysisResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Recent Analysis
      .addCase(fetchRecentAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchRecentAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Analyze Sentiment
      .addCase(analyzeSentiment.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
      })
      .addCase(analyzeSentiment.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.result = action.payload;
      })
      .addCase(analyzeSentiment.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearAnalysisError, 
  clearResult, 
  setIsAnalyzing, 
  setUploadProgress,
  setText,
  setSource
} = analysisSlice.actions;

export const selectAnalysisResult = (state: RootState) => state.analysis.result;
export const selectAnalysisHistory = (state: RootState) => state.analysis.history;
export const selectAnalysisLoading = (state: RootState) => state.analysis.isLoading;
export const selectAnalysisProcessing = (state: RootState) => state.analysis.isAnalyzing;
export const selectUploadProgress = (state: RootState) => state.analysis.uploadProgress;
export const selectAnalysisError = (state: RootState) => state.analysis.error;

export default analysisSlice.reducer;
