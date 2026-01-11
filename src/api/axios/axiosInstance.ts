import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as Keychain from 'react-native-keychain';

// Base URL - Update this with your API base URL
const BASE_URL = 'http://10.0.2.2:3001'; // TODO: Replace with your actual API URL

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - Add token to headers
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Get credentials from Keychain
            const credentials = await Keychain.getGenericPassword();

            if (credentials && config.headers) {
                const tokens = JSON.parse(credentials.password);
                const token = tokens.access;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            // Add any other default headers here
            if (config.headers) {
                config.headers['X-Platform'] = 'mobile';
                config.headers['X-App-Version'] = '1.0.0'; // You can get this from app version
            }

            return config;
        } catch (error) {
            console.error('Error in request interceptor:', error);
            return config;
        }
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return successful response
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Clear stored tokens from Keychain
                await Keychain.resetGenericPassword();

                // You can implement token refresh logic here if needed
                // For now, we'll just clear the token and let the app handle re-authentication

                // Optionally, you can dispatch a logout action here
                // This would require passing the store or dispatch function

            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
                isNetworkError: true,
            });
        }

        // Handle other errors
        const errorData = error.response?.data as any;
        const errorMessage = errorData?.message ||
            errorData?.error ||
            error.message ||
            'An error occurred. Please try again.';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default axiosInstance;

