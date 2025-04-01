import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { apiService } from '../../../services/api';

// Types
interface User {
  username: string;
  email: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsConfirmation: boolean;
  userToConfirm: string | null;
  token: string | null; // Adding token property to fix errors
}

// Auth async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/login', { username, password });
      return response;
    } catch (error: any) {
      if (error.response?.data?.error === 'UserNotConfirmedException') {
        return { needsConfirmation: true, userToConfirm: username };
      }
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/register', { username, email, password });
      return { ...response, userToConfirm: username };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const confirmSignUp = createAsyncThunk(
  'auth/confirmSignUp',
  async ({ username, confirmationCode }: { username: string; confirmationCode: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/confirm', { username, confirmation_code: confirmationCode });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Confirmation failed');
    }
  }
);

export const resendConfirmationCode = createAsyncThunk(
  'auth/resendConfirmationCode',
  async (username: string, { rejectWithValue }) => {
    try {
      await Auth.resendSignUp(username);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resend confirmation code');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await Auth.signOut();
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  needsConfirmation: false,
  userToConfirm: null,
  token: null, // Initialize token as null
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken; // Set token when user is set
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null; // Clear token on logout
    },
    setNeedsConfirmation: (state, action: PayloadAction<{ needsConfirmation: boolean; userToConfirm: string | null }>) => {
      state.needsConfirmation = action.payload.needsConfirmation;
      state.userToConfirm = action.payload.userToConfirm;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle confirmation needed
        if (action.payload.needsConfirmation) {
          state.needsConfirmation = true;
          state.userToConfirm = action.payload.userToConfirm;
          return;
        }
        // Handle successful login
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.needsConfirmation = true;
        state.userToConfirm = action.payload.userToConfirm;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Confirm Sign Up
      .addCase(confirmSignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmSignUp.fulfilled, (state) => {
        state.isLoading = false;
        state.needsConfirmation = false;
        state.userToConfirm = null;
      })
      .addCase(confirmSignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Resend Confirmation Code
      .addCase(resendConfirmationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendConfirmationCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendConfirmationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, clearUser, setNeedsConfirmation, setToken } = authSlice.actions;

export default authSlice.reducer;