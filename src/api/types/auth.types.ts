/**
 * Authentication API Types
 */

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        tokens: {
            access: string;
            refresh: string;
        };
        user: {
            id: string;
            email: string;
            fullName: string;
            accountMode: string;
            isPremium: boolean;
            isVerified: boolean;
        };
    };
}

export interface SignupRequest {
    email?: string;
    phone?: string;
    password: string;
    name: string;
    accountMode: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    data: {
        tokens: {
            access: string;
            refresh: string;
        };
        user: {
            id: string;
            email: string;
            fullName: string;
            accountMode: string;
            isVerified: boolean;
            isPremium: boolean;
        };
    };
}

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
    isNetworkError?: boolean;
}

