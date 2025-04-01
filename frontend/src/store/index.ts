import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import reducers
import analysisReducer from '../features/analysis/slices/analysisSlice';
import authReducer from '../features/auth/slices/authSlice';
import uiReducer from '../features/ui/slices/uiSlice';
import batchReducer from '../features/batch/slices/batchSlice';
import historyReducer from '../features/history/slices/historySlice';
import textToSpeechReducer from '../features/tts/slices/textToSpeechSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  // Only persist auth to keep user logged in
  whitelist: ['auth']
};

// Combine all reducers
const rootReducer = combineReducers({
  analysis: analysisReducer,
  auth: authReducer,
  ui: uiReducer,
  batch: batchReducer,
  history: historyReducer,
  textToSpeech: textToSpeechReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(thunk),
});

// Create persistor for PersistGate
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
