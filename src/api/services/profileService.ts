import axiosInstance from '../axios/axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Profile Service
 * Handles all profile-related API calls
 */
class ProfileService {
    /**
     * Get user profile
     */
    async getProfile(): Promise<any> {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.UPDATE_PROFILE);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData: any): Promise<any> {
        try {
            const response = await axiosInstance.put(
                API_ENDPOINTS.USER.UPDATE_PROFILE,
                profileData
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Get user verification status
     */
    async getVerificationStatus(): Promise<any> {
        try {
            const response = await axiosInstance.get('/users/verification-status');
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Update user profile with multipart form data (files)
     */
    async updateProfileMultipart(formData: any): Promise<any> {
        try {
            const response = await axiosInstance.put(
                API_ENDPOINTS.USER.UPDATE_PROFILE,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors and format them consistently
     */
    private handleError(error: any) {
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

export default new ProfileService();
