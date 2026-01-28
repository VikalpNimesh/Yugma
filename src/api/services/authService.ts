import axiosInstance from '../axios/axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse, ApiError } from '../types/auth.types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await axiosInstance.post<LoginResponse>(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Sign up new user
     */
    async signup(userData: SignupRequest): Promise<SignupResponse> {
        try {
            const response = await axiosInstance.post<SignupResponse>(
                API_ENDPOINTS.AUTH.SIGNUP,
                userData
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error: any) {
            // Even if logout fails on server, we should still clear local token
            console.error('Logout error:', error);
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<{ token: string }> {
        try {
            const response = await axiosInstance.post<{ token: string }>(
                API_ENDPOINTS.AUTH.REFRESH_TOKEN,
                { refreshToken }
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors and format them consistently
     */
    private handleError(error: any): ApiError {
        if (error.isNetworkError) {
            return {
                message: error.message || 'Network error. Please check your internet connection.',
                isNetworkError: true,
            };
        }

        return {
            message: error.message || 'An error occurred. Please try again.',
            status: error.status,
            data: error.data,
        };
    }
}

export default new AuthService();

