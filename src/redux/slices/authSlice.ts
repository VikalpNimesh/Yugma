import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import authService from '../../api/services/authService';
import profileService from '../../api/services/profileService';
import socialService from '../../api/services/socialService';
import type {
  LoginRequest,
  SignupRequest,
} from '../../api/types/auth.types';
import { getPushNotificationContext } from '../../utils/pushHelper';

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
  profile: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
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
        console.log(tokens);

        // Fetch profile
        await dispatch(fetchUserProfile());

        return { token: tokens.access };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      // The API returns { data: ... }
      console.log('Profile Response:', response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { dispatch, rejectWithValue }) => {
    try {
      const pushContext = await getPushNotificationContext();
      const payload = {
        ...credentials,
        // ...pushContext
      };
      console.log('🚀 Login Payload:', JSON.stringify(payload, null, 2));
      const response = await authService.login(payload);

      const { tokens, user } = response.data;

      // Store tokens in Keychain
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens));

      // Fetch profile after login
      await dispatch(fetchUserProfile());

      // Register in social graph (idempotent)
      try {
        console.log('Calling social/register-graph...');
        const graphRes = await socialService.registerGraph();
        console.log('Social Graph Reg Success:', graphRes);
      } catch (err) {
        console.error('Social Graph Reg Error:', err);
      }

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
      const pushContext = await getPushNotificationContext();
      const payload = {
        ...userData,
        // ...pushContext
      };
      console.log('🚀 Signup Payload:', JSON.stringify(payload, null, 2));
      const response = await authService.signup(payload);
      console.log(response);
      // Using the same pattern as loginUser
      // Assuming response is the Axios response and data contains tokens and user
      const { tokens, user } = response.data;
      console.log(tokens, user);

      // Store tokens in Keychain
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens));

      // Register in social graph (idempotent)
      try {
        console.log('Calling social/register-graph...');
        const graphRes = await socialService.registerGraph();
        console.log('Social Graph Reg Success:', graphRes);
      } catch (err) {
        console.error('Social Graph Reg Error:', err);
      }

      return { user, token: tokens.access };
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Signup failed. Please try again.',
      );
    }
  },
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(data);
      const { tokens, user } = response.data;

      // Store tokens in Keychain
      await Keychain.setGenericPassword('auth_tokens', JSON.stringify(tokens));

      // Fetch profile after login
      await dispatch(fetchUserProfile());

      // Register in social graph (idempotent)
      try {
        console.log('Calling social/register-graph...');
        const graphRes = await socialService.registerGraph();
        console.log('Social Graph Reg Success:', graphRes);
      } catch (err) {
        console.error('Social Graph Reg Error:', err);
      }

      return { user, token: tokens.access };
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Google login failed.',
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
      action: PayloadAction<{ user: User; token: string; profile?: any }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profile = action.payload.profile || null;
      state.isAuthenticated = true;
    },
    resetAuth: state => {
      state.user = null;
      state.profile = null;
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

    // Google Login
    builder
      .addCase(googleLogin.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
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
        state.profile = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload; // action.payload will be result.data which might be null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.profile = null;
      });
  },
});

export const { clearError, setCredentials, resetAuth } = authSlice.actions;
export default authSlice.reducer;
