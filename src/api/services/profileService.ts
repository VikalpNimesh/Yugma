import axiosInstance from '../axios/axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Profile Service
 * Handles all profile-related API calls
 */
class ProfileService {
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
