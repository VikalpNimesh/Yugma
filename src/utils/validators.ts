/**
 * Email validation regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Password validation
 * Minimum 6 characters (Firebase requirement)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (!isValidPassword(password)) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  return { isValid: true };
};

/**
 * Get user-friendly Firebase error message
 */
export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "This email is already registered. Please login instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed": "Email/password accounts are not enabled. Please contact support.",
    "auth/weak-password": "Password is too weak. Please use a stronger password.",
    "auth/user-disabled": "This account has been disabled. Please contact support.",
    "auth/user-not-found": "No account found with this email. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password. Please check and try again.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your internet connection.",
    "auth/user-token-expired": "Your session has expired. Please login again.",
  };

  return errorMessages[errorCode] || "An error occurred. Please try again.";
};

