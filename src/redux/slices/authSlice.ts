import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../api/services/authService';
import type { LoginRequest, SignupRequest, ApiError } from '../../api/types/auth.types';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);

            // Store token in AsyncStorage
            if (response.data.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
            }

            if (response.data.refreshToken) {
                await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed. Please try again.');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: SignupRequest, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData);

            // Store token in AsyncStorage
            if (response.data.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Signup failed. Please try again.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();

            // Clear tokens from AsyncStorage
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('refreshToken');

            return true;
        } catch (error: any) {
            // Even if API call fails, clear local storage
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('refreshToken');
            return rejectWithValue(error.message || 'Logout failed.');
        }
    }
);

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        // Initialize auth state from stored token
        initializeAuth: (state) => {
            // This will be handled by checking AsyncStorage on app start
            // You can dispatch this action after checking for stored token
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
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
            .addCase(signupUser.pending, (state) => {
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
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                // Even if logout fails, clear the state
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setCredentials, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

