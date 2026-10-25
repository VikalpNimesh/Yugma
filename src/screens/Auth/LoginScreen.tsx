import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithGoogle, signInWithApple } from '../../api/firebase/auth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { initializeBasicInfo } from '../../redux/slices/profileFormSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import THEME from '../../constant/theme';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      dispatch(clearError());
    }
  }, [authError, dispatch]);

  const handleLogin = async () => {
    if (isLoading) return;
    if (!emailOrPhone.trim() || !password.trim()) {
      setLocalError('Please enter your mobile/email and password.');
      return;
    }
    setLocalError('');
    try {
      const result = await dispatch(
        loginUser({ emailOrPhone: emailOrPhone.trim(), password })
      ).unwrap();

      if (result.user) {
        const userData = {
          fullName: result.user.fullName || '',
          email: result.user.email || emailOrPhone.trim(),
        };
        dispatch(initializeBasicInfo(userData));
        await AsyncStorage.setItem('userBasicInfo', JSON.stringify(userData));
      }
    } catch (err: any) {
      setLocalError(err || 'Unable to login. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signInWithGoogle(dispatch);
    } catch (err: any) {
      setLocalError(err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (appleLoading) return;
    setAppleLoading(true);
    try {
      await signInWithApple(dispatch);
    } catch (err: any) {
      setLocalError(err.message || 'Apple Sign-In failed.');
    } finally {
      setAppleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please enter your registered email/phone to receive a password reset link.',
      [{ text: 'OK' }]
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#2A020F', '#380415', '#1F020B', '#140106']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.innerContainer,
          { paddingTop: Math.max(insets.top, 24) + 6, paddingBottom: Math.max(insets.bottom, 16) + 4 },
        ]}
      >
        {/* Back Button */}
        {navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Titles */}
            <View style={styles.header}>
              <Text style={styles.titleLine}>Welcome</Text>
              <Text style={styles.titleLine}>back</Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Glad to see you again</Text>
                <View style={styles.heartThread}>
                  <View style={styles.threadDot} />
                  <View style={styles.threadLine} />
                  <MaterialCommunityIcons name="heart-outline" size={20} color="#FF758C" />
                </View>
              </View>
            </View>

            {/* Inputs Container */}
            <View style={styles.formContainer}>
              {/* Mobile / Email */}
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={emailOrPhone}
                  onChangeText={(text) => {
                    setEmailOrPhone(text);
                    setLocalError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setLocalError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordWrapper}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

            {/* Primary Login Button */}
            <TouchableOpacity
              style={[styles.loginBtnWrapper, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E82E5D', '#D91C50', '#BF1342']}
                style={styles.loginBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginBtnText}>Login</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Or Continue With */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={googleLoading || isLoading}
                activeOpacity={0.8}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <AntDesign name="google" size={18} color="#EA4335" />
                    <Text style={styles.socialBtnText}>Google</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
                disabled={appleLoading || isLoading}
                activeOpacity={0.8}
              >
                {appleLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <AntDesign name="apple1" size={18} color="#FFF" />
                    <Text style={styles.socialBtnText}>Apple</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer: Don't have an account? Sign Up */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F020B',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 22,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 2,
    marginBottom: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginTop: 6,
    marginBottom: 26,
  },
  titleLine: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 38,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: '500',
  },
  heartThread: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  threadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF758C',
  },
  threadLine: {
    width: 28,
    height: 1.5,
    backgroundColor: '#FF758C',
    opacity: 0.8,
  },
  formContainer: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.13)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  eyeIconContainer: {
    padding: 6,
  },
  forgotPasswordWrapper: {
    alignSelf: 'flex-end',
    marginTop: 2,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  loginBtnWrapper: {
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 22,
    shadowColor: '#E82E5D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  loginBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.13)',
    gap: 10,
  },
  socialBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
  },
  signupLink: {
    color: '#FF758C',
    fontSize: 14,
    fontWeight: '800',
  },
});
