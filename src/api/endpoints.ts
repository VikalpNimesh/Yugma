/**
 * API Endpoints
 * Centralized endpoint definitions for the application
 */

const API_BASE = '/api'; // Adjust based on your API structure

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE}/auth/login`,
        SIGNUP: `${API_BASE}/auth/signup`,
        LOGOUT: `${API_BASE}/auth/logout`,
        REFRESH_TOKEN: `${API_BASE}/auth/refresh-token`,
        FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
        VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
    },

    // User endpoints
    USER: {
        PROFILE: `${API_BASE}/user/profile`,
        UPDATE_PROFILE: `${API_BASE}/user/profile`,
        UPLOAD_AVATAR: `${API_BASE}/user/avatar`,
    },

    // Add more endpoint categories as needed
    // MATCHES: {
    //   GET_MATCHES: `${API_BASE}/matches`,
    //   LIKE_USER: `${API_BASE}/matches/like`,
    // },
};

