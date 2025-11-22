# Firebase Authentication Flow Documentation

## 📋 Overview
This document explains the complete authentication flow in your Yugma app, including email/password signup, login, Google sign-in, and logout.

---

## 🏗️ Architecture

### **Firebase Setup**
- **Location**: `src/api/firebase/firebaseConfig.ts`
- **SDK**: `@react-native-firebase/auth` (Native Firebase SDK)
- **Export**: Exports the `auth()` instance for use across the app

### **Auth Helpers**
- **Location**: `src/api/firebase/auth.ts`
- **Functions**:
  - `signInWithEmailPassword()` - Email/password login
  - `createUserWithEmailPassword()` - Email/password signup
  - `authenticateWithGoogleCredential()` - Google sign-in
  - `handleLogout()` - Logout functionality

### **State Management**
- **Redux Store**: `src/redux/store.ts`
- **User Slice**: `src/redux/slices/userSlice.tsx`
- **Actions**: `setUser()`, `logout()`, `updateUser()`

---

## 🔄 Complete Authentication Flows

### **1. App Initialization Flow**

```
App.tsx (Root)
  ↓
SplashScreen (Initial Route)
  ↓
  ├─→ Checks Firebase Auth State (onAuthStateChanged)
  │   ├─→ If User EXISTS → Navigate to "BottomTabs" (Main App)
  │   └─→ If User DOESN'T EXIST → Wait 5 seconds
  │       └─→ Navigate to "GoogleLogin" (Auth Screen)
```

**Code Reference**: `src/screens/SplashScreen.tsx`
- Lines 14-28: Sets up Google Sign-In configuration and auth state listener
- Lines 30-36: Auto-navigates to GoogleLogin after 5 seconds if no user

---

### **2. Email/Password Signup Flow**

```
GoogleLoginScreen
  ↓ (User clicks "Sign Up with Email")
SignupScreen
  ↓ (User enters email + password, clicks "Create")
  ↓
createUserWithEmailPassword(email, password)
  ↓
Firebase: auth().createUserWithEmailAndPassword()
  ↓
  ├─→ Success:
  │   ├─→ Update user profile (if displayName provided)
  │   ├─→ Send email verification
  │   └─→ Navigate to "SettingsScreen"
  │
  └─→ Error:
      └─→ Display error message
```

**Code Reference**:
- `src/screens/Auth/SignupScreen.tsx` (Lines 22-35)
- `src/api/firebase/auth.ts` (Lines 16-36)

**What Happens**:
1. User enters email and password
2. `createUserWithEmailPassword()` is called
3. Firebase creates the account
4. Email verification is sent automatically
5. User is navigated to SettingsScreen

**Note**: User data is NOT stored in Redux during email signup (only Google sign-in stores in Redux)

---

### **3. Email/Password Login Flow**

```
GoogleLoginScreen
  ↓ (User clicks "Login")
LoginScreen
  ↓ (User enters email + password, clicks "Login")
  ↓
signInWithEmailPassword(email, password)
  ↓
Firebase: auth().signInWithEmailAndPassword()
  ↓
  ├─→ Success:
  │   ├─→ User object returned
  │   └─→ (Currently no navigation - needs to be added!)
  │
  └─→ Error:
      └─→ Display error message
```

**Code Reference**:
- `src/screens/Auth/LoginScreen.tsx` (Lines 20-29)
- `src/api/firebase/auth.ts` (Lines 6-14)

**⚠️ ISSUE FOUND**: After successful login, there's no navigation! The user stays on LoginScreen.

**What Should Happen**:
- Navigate to "BottomTabs" or "HomeScreen" after successful login

---

### **4. Google Sign-In Flow**

```
GoogleLoginScreen
  ↓ (User clicks "Sign Up with Google")
handleGoogleSignIn()
  ↓
GoogleSignin.hasPlayServices() - Check if Google Play Services available
  ↓
GoogleSignin.signIn() - Get Google user info + idToken
  ↓
  ├─→ Extract idToken from userInfo.data
  ├─→ Dispatch setUser(userInfo) to Redux Store
  └─→ authenticateWithGoogleCredential(idToken)
      ↓
      Firebase: auth().signInWithCredential(googleCredential)
      ↓
      ├─→ Success:
      │   └─→ Navigate to "HomeScreen"
      │
      └─→ Error:
          └─→ Log error to console
```

**Code Reference**:
- `src/screens/Auth/GoogleLoginScreen.tsx` (Lines 15-31)
- `src/api/firebase/auth.ts` (Lines 60-63)

**What Happens**:
1. Google Sign-In SDK authenticates with Google
2. Gets user info (name, email, photo, idToken)
3. Stores user info in Redux via `setUser()`
4. Creates Firebase credential from idToken
5. Signs into Firebase with Google credential
6. Navigates to HomeScreen

**Redux State After Google Sign-In**:
```javascript
{
  user: {
    id: userInfo.data.user.id,
    name: userInfo.data.user.name,
    email: userInfo.data.user.email,
    photo: userInfo.data.user.photo,
    // ... other Google user data
  }
}
```

---

### **5. Logout Flow**

```
Any Screen (e.g., DatingScreen)
  ↓ (User clicks "Logout")
handleLogout(navigation)
  ↓
  ├─→ GoogleSignin.signOut() - Sign out from Google
  └─→ auth().signOut() - Sign out from Firebase
      ↓
      ├─→ Reset navigation stack
      ├─→ Navigate to "GoogleLogin"
      └─→ Show success alert
```

**Code Reference**:
- `src/screens/Home/DatingScreen.tsx` (Line 16)
- `src/api/firebase/auth.ts` (Lines 38-58)

**What Happens**:
1. Signs out from Google Sign-In
2. Signs out from Firebase Auth
3. Resets navigation stack (prevents back navigation)
4. Navigates to GoogleLogin screen
5. Shows "User logged out successfully" alert

**Note**: Redux state is NOT cleared automatically - you may want to dispatch `logout()` action

---

## 🔍 Key Components Breakdown

### **SplashScreen** (`src/screens/SplashScreen.tsx`)
- **Purpose**: Initial screen that checks authentication state
- **Behavior**:
  - Configures Google Sign-In on mount
  - Listens to Firebase auth state changes
  - If user exists → goes to BottomTabs
  - If no user → waits 5 seconds → goes to GoogleLogin

### **GoogleLoginScreen** (`src/screens/Auth/GoogleLoginScreen.tsx`)
- **Purpose**: Main authentication entry point
- **Options**:
  - Sign Up with Email → Navigate to SignupScreen
  - Sign Up with Mobile → (Not implemented)
  - Sign Up with Google → Direct Google authentication
  - Login → Navigate to LoginScreen

### **LoginScreen** (`src/screens/Auth/LoginScreen.tsx`)
- **Purpose**: Email/password login
- **Current Issue**: No navigation after successful login
- **UI**: Has Google button (not connected), email/password inputs

### **SignupScreen** (`src/screens/Auth/SignupScreen.tsx`)
- **Purpose**: Email/password signup
- **Flow**: Creates account → Sends verification email → Navigates to SettingsScreen

---

## 🐛 Known Issues & Recommendations

### **1. LoginScreen Missing Navigation**
**Problem**: After successful email/password login, user stays on LoginScreen
**Fix Needed**: Add navigation to HomeScreen or BottomTabs after successful login

```typescript
// In LoginScreen.tsx handleLogin function
const handleLogin = async () => {
    try {
        setError("");
        const userData = await signInWithEmailPassword(email, password);
        console.log('userData: ', userData);
        navigation.replace("HomeScreen"); // ADD THIS
    } catch (err: any) {
        setError(err?.message ?? 'Unable to login');
    }
};
```

### **2. Redux State Not Cleared on Logout**
**Problem**: When logging out, Redux user state persists
**Fix Needed**: Dispatch `logout()` action in `handleLogout()`

```typescript
// In auth.ts handleLogout function
import { logout } from '../../redux/slices/userSlice';
// ... in function
dispatch(logout()); // ADD THIS
```

### **3. Google Login Button in LoginScreen Not Connected**
**Problem**: "Continue with Google" button exists but doesn't do anything
**Fix Needed**: Either remove it or connect it to Google sign-in

### **4. Email Verification Not Checked**
**Problem**: App doesn't verify if email is verified before allowing access
**Recommendation**: Add email verification check in SplashScreen

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   SplashScreen  │
│  (Check Auth)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
User?    No User
    │        │
    ▼        ▼
┌─────────┐ ┌──────────────┐
│BottomTabs│ │GoogleLogin   │
│(Main App)│ │(Auth Screen) │
└─────────┘ └──────┬───────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
  ┌─────────┐ ┌─────────┐ ┌──────────┐
  │Signup   │ │Login    │ │Google    │
  │Screen   │ │Screen   │ │Sign-In   │
  └────┬────┘ └────┬────┘ └─────┬────┘
       │           │             │
       │           │             │
       ▼           ▼             ▼
  ┌─────────┐ ┌─────────┐ ┌──────────┐
  │Firebase  │ │Firebase │ │Firebase  │
  │Create    │ │Sign In  │ │Google    │
  │Account   │ │         │ │Credential│
  └────┬─────┘ └────┬────┘ └─────┬────┘
       │            │             │
       └────────────┴─────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  HomeScreen   │
            │  / BottomTabs │
            └───────────────┘
```

---

## 🔐 Security Notes

1. **Email Verification**: Currently sent but not enforced
2. **Password Requirements**: Not validated (Firebase has default requirements)
3. **Token Storage**: Handled by Firebase SDK automatically
4. **Session Persistence**: Firebase handles automatically via `onAuthStateChanged`

---

## 🚀 Next Steps / Improvements

1. ✅ Fix LoginScreen navigation after successful login
2. ✅ Clear Redux state on logout
3. ✅ Add email verification check
4. ✅ Connect Google button in LoginScreen
5. ✅ Add "Forgot Password" functionality
6. ✅ Add loading states during authentication
7. ✅ Add proper error handling with user-friendly messages
8. ✅ Store user profile data in Firestore after signup

---

## 📝 Summary

**Current Working Flows**:
- ✅ Google Sign-In (stores in Redux, navigates to HomeScreen)
- ✅ Email Signup (creates account, sends verification, navigates to Settings)
- ✅ Logout (signs out, navigates to GoogleLogin)

**Needs Fix**:
- ❌ Email Login (no navigation after success)
- ❌ Redux state cleanup on logout
- ❌ Email verification enforcement

