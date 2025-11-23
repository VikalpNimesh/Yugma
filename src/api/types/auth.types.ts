/**
 * Authentication API Types
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
            avatar?: string;
        };
        token: string;
        refreshToken?: string;
    };
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    // Add other signup fields as needed
}

export interface SignupResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    };
}

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
    isNetworkError?: boolean;
}

