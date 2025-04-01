import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

export interface Voice {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'neutral';
  language?: string;
  languageCode?: string;
}

export interface TTSRecord {
  id: string;
  userId: string;
  text: string;
  voice: string;
  audioUrl: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
}

interface TextToSpeechState {
  voices: Voice[];
  recentlyCreated: TTSRecord[];
  currentRecord: TTSRecord | null;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: TextToSpeechState = {
  voices: [],
  recentlyCreated: [],
  currentRecord: null,
  isLoading: false,
  isProcessing: false,
  error: null,
};

export const fetchVoices = createAsyncThunk(
  'tts/fetchVoices',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/tts/voices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch voices');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch voices');
    }
  }
);

export const createSpeech = createAsyncThunk(
  'tts/createSpeech',
  async (
    { text, voiceId }: { text: string; voiceId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create speech');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to create speech');
    }
  }
);

export const fetchRecentSpeech = createAsyncThunk(
  'tts/fetchRecentSpeech',
  async (limit: number = 5, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/tts/history?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch recent speech');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch recent speech');
    }
  }
);

export const fetchSpeechRecord = createAsyncThunk(
  'tts/fetchSpeechRecord',
  async (recordId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`/api/tts/records/${recordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch speech record');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch speech record');
    }
  }
);

const textToSpeechSlice = createSlice({
  name: 'textToSpeech',
  initialState,
  reducers: {
    clearTTSError: (state) => {
      state.error = null;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Voices
      .addCase(fetchVoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.voices = action.payload;
      })
      .addCase(fetchVoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Speech
      .addCase(createSpeech.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(createSpeech.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentRecord = action.payload;
        
        // Add the new record to recentlyCreated, maintaining most recent at the beginning
        state.recentlyCreated = [action.payload, ...state.recentlyCreated.slice(0, 4)];
      })
      .addCase(createSpeech.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      // Fetch Recent Speech
      .addCase(fetchRecentSpeech.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentSpeech.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentlyCreated = action.payload;
      })
      .addCase(fetchRecentSpeech.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Speech Record
      .addCase(fetchSpeechRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpeechRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchSpeechRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTTSError, clearCurrentRecord, setIsProcessing } = textToSpeechSlice.actions;

export const selectVoices = (state: RootState) => state.textToSpeech.voices;
export const selectRecentSpeech = (state: RootState) => state.textToSpeech.recentlyCreated;
export const selectCurrentRecord = (state: RootState) => state.textToSpeech.currentRecord;
export const selectTTSLoading = (state: RootState) => state.textToSpeech.isLoading;
export const selectTTSProcessing = (state: RootState) => state.textToSpeech.isProcessing;
export const selectTTSError = (state: RootState) => state.textToSpeech.error;

export default textToSpeechSlice.reducer;