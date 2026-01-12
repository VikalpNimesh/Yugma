# API Structure

This directory contains all API-related code for the application.

## Folder Structure

```
src/api/
├── axios/
│   └── axiosInstance.ts      # Axios instance with interceptors for token management
├── services/
│   └── authService.ts        # Authentication API service
├── types/
│   └── auth.types.ts         # TypeScript types for authentication
├── endpoints.ts              # Centralized API endpoint definitions
└── firebase/                 # Firebase-specific API (existing)
    ├── auth.ts
    └── firebaseConfig.ts
```

## Axios Instance

The axios instance (`axios/axiosInstance.ts`) is configured with:

- **Request Interceptor**: Automatically adds authentication token from AsyncStorage to all requests
- **Response Interceptor**: Handles errors, token expiration, and network issues
- **Base URL**: Configured in `axiosInstance.ts` (update `BASE_URL` with your actual API URL)

### Usage

```typescript
import axiosInstance from '../api/axios/axiosInstance';

// All requests automatically include the token
const response = await axiosInstance.get('/some-endpoint');
```

## Services

API services are organized by domain (e.g., `authService.ts` for authentication).

### Example: Auth Service

```typescript
import authService from '../api/services/authService';

// Login
const response = await authService.login({ email, password });

// Signup
const response = await authService.signup({ email, password, name });
```

## Redux Integration

API calls are integrated with Redux using async thunks:

```typescript
import { useAppDispatch } from '../redux/hooks';
import { loginUser } from '../redux/slices/authSlice';

const dispatch = useAppDispatch();
await dispatch(loginUser({ email, password })).unwrap();
```

## Token Management

- Tokens are automatically stored in AsyncStorage when login succeeds
- Tokens are automatically added to request headers via axios interceptor
- Tokens are cleared on logout or 401 errors

## Adding New APIs

1. **Add endpoint** to `endpoints.ts`
2. **Create types** in `types/` directory
3. **Create service** in `services/` directory
4. **Create Redux slice** with async thunk in `redux/slices/`
5. **Update store** to include new slice

## Configuration

Update the `BASE_URL` in `src/api/axios/axiosInstance.ts` with your actual API base URL.

