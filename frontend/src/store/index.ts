import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import all slice reducers
import authReducer from '../features/auth/slices/authSlice';
import analysisReducer from '../features/analysis/slices/analysisSlice';
import historyReducer from '../features/history/slices/historySlice';
import batchReducer from '../features/batch/slices/batchSlice';
import ttsReducer from '../features/tts/slices/textToSpeechSlice';
import uiReducer from '../features/ui/slices/uiSlice';

// Feature flags and configurations
export const FEATURES = {
    // Core features
    SENTIMENT_ANALYSIS: true,
    KEY_PHRASES: true,
    TEXT_TO_SPEECH: true,
    BATCH_PROCESSING: true,
    
    // Auth features
    AUTH_REQUIRED: process.env.REACT_APP_AUTH_REQUIRED === 'true',
    GUEST_MODE: process.env.REACT_APP_GUEST_MODE === 'true',
    
    // UI features
    DARK_MODE: true,
    ANIMATIONS: true,
    VIDEO_BACKGROUNDS: true,
    
    // Analytics and reporting
    HISTORY: true,
    EXPORT_RESULTS: true,
    
    // Sources supported for analysis
    SOURCES: {
      DIRECT_INPUT: true,
      TWITTER: true,
      FACEBOOK: true,
      INSTAGRAM: true,
      CSV_UPLOAD: true,
    },
    
    // Maximum limits
    MAX_TEXT_LENGTH: 5000, // characters for direct input
    MAX_BATCH_SIZE: 100, // rows for batch processing
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for file uploads
  };
  
  // Feature strings for display
  export const FEATURE_LABELS = {
    SOURCES: {
      DIRECT_INPUT: 'Direct Input',
      TWITTER: 'Twitter',
      FACEBOOK: 'Facebook',
      INSTAGRAM: 'Instagram',
      CSV_UPLOAD: 'CSV Upload',
    },
  };

// Configure the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  history: historyReducer,
  batch: batchReducer,
  tts: ttsReducer,
  ui: uiReducer,
});

// Configure persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;