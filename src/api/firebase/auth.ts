import { Alert } from 'react-native';
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
import { setUser, logout } from '../../redux/slices/userSlice';
import { resetProfileForm, initializeBasicInfo } from '../../redux/slices/profileFormSlice';
import { resetAuth, setCredentials } from '../../redux/slices/authSlice';

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
    // Check if Google Play Services is available
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Sign in with Google
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo?.data) {
      throw new Error('Google Sign-In failed: No user data returned');
    }

    const { idToken } = userInfo.data;
    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID token returned');
    }

    // Authenticate with Firebase
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    
    // 👈 Get the Firebase ID Token (this is what your backend expects)
    const firebaseToken = await userCredential.user.getIdToken();

    // Update Redux state if dispatch provided
    if (dispatch) {
      // 1. Update user data in userSlice with Firebase token mapping
      dispatch(setUser({
        id: userCredential.user.uid,
        name: userInfo.data.user.name || userCredential.user.displayName || '',
        email: userInfo.data.user.email || userCredential.user.email || '',
        token: firebaseToken, // 👈 Using Firebase token here
      }));
      
      // 2. Update authentication state in authSlice to trigger RootNavigator re-render
      dispatch(setCredentials({
        user: {
          id: userCredential.user.uid,
          email: userInfo.data.user.email || userCredential.user.email || '',
          fullName: userInfo.data.user.name || userCredential.user.displayName || '',
          accountMode: 'matrimony', // Default mode
          isPremium: false,
          isVerified: userCredential.user.emailVerified,
        },
        token: firebaseToken, // 👈 Using Firebase token here
      }));

      // 3. Persist tokens to Keychain for session longevity (crucial)
      try {
        await Keychain.setGenericPassword('auth_tokens', JSON.stringify({ 
          access: firebaseToken, // 👈 Using Firebase token here
          refresh: '' 
        }));
        console.log('✅ Firebase tokens persisted to Keychain');
      } catch (error) {
        console.warn('Failed to persist tokens to Keychain:', error);
      }

      // 4. Initialize profile form with Google user data
      const userData = {
        fullName: userInfo.data.user.name || userCredential.user.displayName || '',
        email: userInfo.data.user.email || userCredential.user.email || '',
      };
      
      dispatch(initializeBasicInfo(userData));

      // 5. Persist to AsyncStorage (needed for BasicInfoScreen)
      try {
        await AsyncStorage.setItem('userBasicInfo', JSON.stringify(userData));
        console.log('✅ User basic info persisted to AsyncStorage');
      } catch (e) {
        console.warn('Failed to persist user info to AsyncStorage:', e);
      }
    }

    console.log('✅ Google Sign-In successful');
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
      await GoogleSignin.signOut();
      console.log('✅ Google signed out');
    } catch (error) {
      console.warn('Google sign-out failed:', error);
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
