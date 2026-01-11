import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import authService from '../../api/services/authService';
import type {
  LoginRequest,
  SignupRequest,
} from '../../api/types/auth.types';

// Types
interface User {
  id: string;
  email: string;
  fullName: string;
  accountMode: string;
  isPremium: boolean;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false, // Start loading to check auth state
  error: null,
};

// Async Thunks
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch }) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const tokens = JSON.parse(credentials.password);
        // Ideally we should validate the token or fetch user profile here
        // For now, we assume if tokens exist, we are somewhat authenticated
        // But we need the user data.
        // If we don't persist user data, we might need to fetch it.
        // For this step, let's assume we need to re-fetch user profile or valid tokens?
        // Actually, without user data in storage, we can't fully restore state.
        // Let's return just token to state, and maybe app should fetch profile.
        // OR: we can store user data in Async Storage for recovery.
        console.log(tokens);
        return { token: tokens.access };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      const { tokens, user } = response.data;

      // Store tokens in Keychain
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens));

      return { user, token: tokens.access };
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Login failed. Please try again.',
      );
    }
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      console.log(response);
      // Using the same pattern as loginUser
      // Assuming response is the Axios response and data contains tokens and user
      const { tokens, user } = response.data;
      console.log(tokens, user);

      // Store tokens in Keychain
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens));
      return { user, token: tokens.access };
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Signup failed. Please try again.',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      await Keychain.resetGenericPassword();
      return true;
    } catch (error: any) {
      await Keychain.resetGenericPassword();
      return rejectWithValue(error.message || 'Logout failed.');
    }
  },
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    resetAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Check Auth State
    builder.addCase(checkAuthState.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.token = action.payload.token;
        // state.isAuthenticated = true; // Wait, we don't have user data yet?
        // If we only have token, we are effectively authenticated but might need to fetch profile.
        // For now, let's set authenticated so we pass the navigation check, 
        // but we might want a splash screen to fetch profile.
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    });

    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Signup
    builder
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, resetAuth } = authSlice.actions;
export default authSlice.reducer;
