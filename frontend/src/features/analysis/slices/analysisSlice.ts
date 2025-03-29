import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import { AnalysisResult, SentimentType } from '../../../types/models';

interface AnalysisState {
  currentText: string;
  source: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

const initialState: AnalysisState = {
  currentText: '',
  source: 'direct',
  isAnalyzing: false,
  result: null,
  error: null,
};

export const analyzeSentiment = createAsyncThunk(
  'analysis/analyzeSentiment',
  async ({ text, source }: { text: string; source: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<AnalysisResult>('/analyze', { 
        text,
        source
      });
      return response;
    } catch (error) {
      return rejectWithValue('Failed to analyze sentiment');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.currentText = action.payload;
    },
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    clearResult: (state) => {
      state.result = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
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

export const { setText, setSource, clearResult, resetState } = analysisSlice.actions;

export default analysisSlice.reducer;