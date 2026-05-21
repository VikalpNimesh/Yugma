/**
 * Authentication API Types
 */

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
    fcmToken?: string;
    deviceType?: string;
    deviceId?: string;
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

export interface GoogleLoginRequest {
    scopes: string[];
    serverAuthCode: string | null;
    idToken: string;
    user: {
        photo: string | null;
        givenName: string | null;
        familyName: string | null;
        email: string;
        name: string;
        id: string;
    };
    fcmToken?: string;
    deviceType?: string;
    deviceId?: string;
}

export interface SignupRequest {
    email?: string;
    phone?: string;
    password: string;
    name: string;
    accountMode: string;
    fcmToken?: string;
    deviceType?: string;
    deviceId?: string;
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

