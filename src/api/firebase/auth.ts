import { Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import type { NavigationProp } from '@react-navigation/native';
import {
  validateEmail,
  validatePassword,
  getFirebaseErrorMessage,
} from '../../utils/validators';
import { setUser as setReduxUser, logout } from '../../redux/slices/userSlice';
import { resetProfileForm, initializeBasicInfo } from '../../redux/slices/profileFormSlice';
import { resetAuth, setCredentials, fetchUserProfile } from '../../redux/slices/authSlice';
import authService from '../services/authService';
import axiosInstance from '../axios/axiosInstance';
import socialService from '../services/socialService';

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns User object on success
 * @throws Error with user-friendly message
 */
export const signInWithEmailPassword = async (
  email: string,
  password: string,
) => {
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.error);
  }

  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const userFriendlyMessage = getFirebaseErrorMessage(errorCode);
    console.error('Login error:', errorCode, error.message);
    throw new Error(userFriendlyMessage);
  }
};

/**
 * Create new user with email and password
 * @param email - User email
 * @param password - User password
 * @param displayName - Optional display name
 * @returns User object on success
 * @throws Error with user-friendly message
 */
export const createUserWithEmailPassword = async (
  email: string,
  password: string,
  displayName?: string,
) => {
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.error);
  }

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password,
    );
    const user = userCredential.user;

    // Update profile if display name provided
    if (displayName?.trim()) {
      await user.updateProfile({ displayName: displayName.trim() });
    }

    // Send email verification
    await user.sendEmailVerification();
    console.log('✅ User signed up:', user.email);
    return user;
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const userFriendlyMessage = getFirebaseErrorMessage(errorCode);
    console.error('❌ Signup error:', errorCode, error.message);
    throw new Error(userFriendlyMessage);
  }
};

/**
 * Sign in with Google
 * Handles complete Google Sign-In flow including Redux state update
 * @param dispatch - Redux dispatch function (optional)
 * @returns User info object on success
 * @throws Error with user-friendly message
 */
export const signInWithGoogle = async (dispatch?: any) => {
  try {
    console.log('🔄 Starting Google Sign-In process...');
    
    // 1. Configure
    GoogleSignin.configure({
      webClientId: "719942063573-votd1cg12nv5hti22v6oeks4kliuagbd.apps.googleusercontent.com",
      offlineAccess: false,
    });

    // 2. Check for Play Services
    await GoogleSignin.hasPlayServices();

    // 3. Robust delay for Android to ensure activity is attached
    if (Platform.OS === 'android') {
      console.log('⏳ Android detected, waiting for activity...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 4. Sign in
    console.log('📱 Calling GoogleSignin.signIn()...');
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo?.data) {
      throw new Error('Google Sign-In failed: No user data returned');
    }

    const { idToken, serverAuthCode, scopes } = userInfo.data;
    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID token returned');
    }

    // 1. Authenticate with Firebase (keeping Firebase session as requested)
    try {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (firebaseError) {
      console.warn('Firebase authentication failed, continuing with backend:', firebaseError);
    }

    // 2. Exchange Google ID Token for Backend Tokens
    const backendPayload = {
      scopes: scopes || [],
      serverAuthCode: serverAuthCode || null,
      idToken: idToken,
      user: {
        photo: userInfo.data.user.photo || null,
        givenName: userInfo.data.user.givenName || null,
        familyName: userInfo.data.user.familyName || null,
        email: userInfo.data.user.email,
        name: userInfo.data.user.name || '',
        id: userInfo.data.user.id,
      }
    };

    console.log('🚀 Calling backend google-login with payload');
    const backendResponse = await authService.googleLogin(backendPayload);

    if (!backendResponse.success || !backendResponse.data) {
      throw new Error(backendResponse.message || 'Backend Google Sign-In failed');
    }

    const { tokens: backendTokens, user: backendUser } = backendResponse.data;

    // Update Redux state if dispatch provided
    if (dispatch) {
      // 1. Update user data in userSlice with Backend user info
      dispatch(setReduxUser({
        id: backendUser.id,
        name: backendUser.fullName,
        email: backendUser.email,
        token: backendTokens.access,
      }));

      // 2. Update authentication state in authSlice
      dispatch(setCredentials({
        user: {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.fullName,
          accountMode: backendUser.accountMode || 'matrimony',
          isPremium: backendUser.isPremium || false,
          isVerified: backendUser.isVerified || false,
        },
        token: backendTokens.access,
        profile: backendUser, // 👈 PASSING BACKEND PROFILE DATA
      }));

      // 3. Persist BACKEND tokens to Keychain for session longevity
      try {
        await Keychain.setGenericPassword('auth_tokens', JSON.stringify({
          access: backendTokens.access,
          refresh: backendTokens.refresh
        }));
        console.log('✅ Backend tokens persisted to Keychain');
      } catch (error) {
        console.warn('Failed to persist tokens to Keychain:', error);
      }

      // 4. Manually set Axios header for immediate use in subsequent calls
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${backendTokens.access}`;

      // 5. Fetch full profile from backend to ensure state is synchronized
      await dispatch(fetchUserProfile());

      // Register in social graph (idempotent)
      try {
        console.log('Calling social/register-graph...');
        const graphRes = await socialService.registerGraph();
        console.log('Social Graph Reg Success:', graphRes);
      } catch (err) {
        console.error('Social Graph Reg Error:', err);
      }

      // 6. Initialize profile form with Backend user data
      const userDataPrefill = {
        fullName: backendUser.fullName,
        email: backendUser.email,
      };

      dispatch(initializeBasicInfo(userDataPrefill));

      // 7. Persist to AsyncStorage
      try {
        await AsyncStorage.setItem('userBasicInfo', JSON.stringify(userDataPrefill));
        console.log('✅ User basic info persisted to AsyncStorage');
      } catch (e) {
        console.warn('Failed to persist user info to AsyncStorage:', e);
      }
    }

    console.log('✅ Google Sign-In with Backend successful');
    return userInfo.data;
  } catch (error: any) {
    console.error('❌ Google Sign-In error:', error);

    // Handle user cancellation
    if (error?.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Sign in was cancelled');
    }

    throw new Error(
      error?.message || 'Google Sign-In failed. Please try again.',
    );
  }
};

/**
 * Authenticate with Google credential (internal use)
 * @param idToken - Google ID token
 * @returns User credential
 */
export const authenticateWithGoogleCredential = async (idToken: string) => {
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
};

export const handleLogout = async (
  navigation?: NavigationProp<any>,
  dispatch?: any,
) => {
  try {
    // 1. Clear stored tokens from Keychain FIRST (crucial)
    try {
      await Keychain.resetGenericPassword();
      console.log('✅ Keychain reset');
    } catch (error) {
      console.warn('Keychain reset failed:', error);
    }

    // 2. Sign out from Firebase
    try {
      await auth().signOut();
      console.log('✅ Firebase signed out');
    } catch (error) {
      console.warn('Firebase sign-out failed:', error);
    }

    // 3. Sign out from Google
    try {
      if (Platform.OS === 'android') {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      await GoogleSignin.signOut();
      console.log('✅ Google signed out');
    } catch (error: any) {
      // If it fails with "activity is null", we can still continue with the logout sequence
      console.warn('Google sign-out failed or activity was null:', error.message);
    }

    // 4. Clear Redux state
    // We clear auth state to trigger RootNavigator re-render
    if (dispatch) {
      console.log('Dispatching global RESET_STORE...');
      dispatch({ type: 'RESET_STORE' });
      console.log('Redux state reset dispatched.');
    }

    console.log('✅ Logout sequence complete');

  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout. Please try again.');
  }
};

/**
 * Send password reset email
 * @param email - User email
 * @throws Error with user-friendly message
 */
export const sendPasswordResetEmail = async (email: string) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error);
  }

  try {
    await auth().sendPasswordResetEmail(email.trim());
    console.log('✅ Password reset email sent');
  } catch (error: any) {
    const errorCode = error?.code || 'unknown';
    const userFriendlyMessage = getFirebaseErrorMessage(errorCode);
    console.error('❌ Password reset error:', errorCode, error.message);
    throw new Error(userFriendlyMessage);
  }
};
