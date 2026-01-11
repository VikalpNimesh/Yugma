/**
 * API Endpoints
 * Centralized endpoint definitions for the application
 */

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `auth/login`,
        SIGNUP: `auth/register`,
        LOGOUT: `auth/logout`,
        REFRESH_TOKEN: `auth/refresh-token`,
        FORGOT_PASSWORD: `auth/forgot-password`,
        RESET_PASSWORD: `auth/reset-password`,
        VERIFY_EMAIL: `auth/verify-email`,
    },

    // User endpoints
    USER: {
        PROFILE: `user/profile`,
        UPDATE_PROFILE: `users/profile`,
        UPLOAD_AVATAR: `user/avatar`,
    },

    // Add more endpoint categories as needed
    // MATCHES: {
    //   GET_MATCHES: `${API_BASE}/matches`,
    //   LIKE_USER: `${API_BASE}/matches/like`,
    // },
};

