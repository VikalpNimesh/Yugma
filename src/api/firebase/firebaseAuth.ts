import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import type { NavigationProp } from '@react-navigation/native';
import {
  validateEmail,
  validatePassword,
  getFirebaseErrorMessage,
} from '../../utils/validators';
import { setUser, logout } from '../../redux/slices/userSlice';
import { resetProfileForm } from '../../redux/slices/profileFormSlice';
import { resetAuth } from '../../redux/slices/authSlice';

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

    // Update Redux state if dispatch provided
    if (dispatch) {
      dispatch(setUser(userInfo.data));
    }

    // Authenticate with Firebase
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);

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

/**
 * Sign out user from Firebase and Google
 * @param navigation - Navigation object (optional)
 * @param dispatch - Redux dispatch function (optional)
 */
export const handleLogout = async (
  navigation?: NavigationProp<any>,
  dispatch?: any,
) => {
  try {
    // Sign out from Google
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Google sign-out failed:', error);
    }

    // Sign out from Firebase
    try {
      await auth().signOut();
    } catch (error) {
      console.warn('Firebase sign-out failed:', error);
    }

    // Clear stored tokens from Keychain
    try {
      await Keychain.resetGenericPassword();
    } catch (error) {
      console.warn('Keychain reset failed:', error);
    }

    if (dispatch) {
      dispatch(logout()); // from userSlice
      dispatch(resetProfileForm());
      dispatch(resetAuth()); // from authSlice
    }

    Alert.alert('Success', 'You have been logged out successfully');
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
