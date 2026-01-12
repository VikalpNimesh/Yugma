import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import discoveryService from '../../api/services/discoveryService';
import { DiscoveryProfile } from '../../api/types/discovery.types';

interface DiscoveryState {
    profiles: DiscoveryProfile[];
    loading: boolean;
    error: string | null;
}

const initialState: DiscoveryState = {
    profiles: [],
    loading: false,
    error: null,
};

export const fetchDiscoveryFeed = createAsyncThunk(
    'discovery/fetchFeed',
    async (_, { rejectWithValue }) => {
        try {
            const response = await discoveryService.getDiscoveryFeed();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch discovery feed');
        }
    }
);

export const likeDiscoveryProfile = createAsyncThunk(
    'discovery/likeProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            await discoveryService.swipeProfile(userId, 'like');
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to like profile');
        }
    }
);

export const passDiscoveryProfile = createAsyncThunk(
    'discovery/passProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            await discoveryService.swipeProfile(userId, 'pass');
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to pass profile');
        }
    }
);

const discoverySlice = createSlice({
    name: 'discovery',
    initialState,
    reducers: {
        clearDiscoveryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscoveryFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscoveryFeed.fulfilled, (state, action: PayloadAction<DiscoveryProfile[]>) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchDiscoveryFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(likeDiscoveryProfile.fulfilled, (state, action) => {
                state.profiles = state.profiles.filter(p => p.userId !== action.payload);
            })
            .addCase(passDiscoveryProfile.fulfilled, (state, action) => {
                state.profiles = state.profiles.filter(p => p.userId !== action.payload);
            });
    },
});

export const { clearDiscoveryError } = discoverySlice.actions;
export default discoverySlice.reducer;
