import React, { useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { signupUser } from '../../redux/slices/authSlice';
import { setCurrentScreen, initializeBasicInfo } from '../../redux/slices/profileFormSlice';
import { signInWithGoogle, signInWithApple } from '../../api/firebase/auth';

export default function SignupScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { appType } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (loading) return;
    setError('');

    if (!displayName.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      dispatch(setCurrentScreen('BasicInfo'));
      const resultAction = await dispatch(
        signupUser({
          email: email.trim(),
          password,
          name: displayName.trim(),
          phone: mobileNumber.trim() || undefined,
          accountMode: appType || 'matrimonial',
        }) as any
      );

      if (signupUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload as any;
        if (userData?.user) {
          const basicInfo = {
            fullName: userData.user.fullName || displayName.trim(),
            email: userData.user.email || email.trim(),
            phone: mobileNumber.trim(),
          };
          dispatch(initializeBasicInfo(basicInfo));
          await AsyncStorage.setItem('userBasicInfo', JSON.stringify(basicInfo));
        }
      } else {
        setError(resultAction.payload ? String(resultAction.payload) : 'Unable to create account. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signInWithGoogle(dispatch);
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
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
      setError(err.message || 'Apple Sign-In failed.');
    } finally {
      setAppleLoading(false);
    }
  };

  const openTerms = () => {
    Alert.alert(
      'Terms of Use & EULA',
      'By using Yugma, you agree to our Terms of Service and End User License Agreement (EULA). We strictly prohibit inappropriate content, abusive behavior, and impersonation. Violators are immediately blocked and reported.',
      [{ text: 'I Understand' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Royal Burgundy Background Gradient */}
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

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
              <Text style={styles.titleLine}>Create your</Text>
              <Text style={styles.titleLine}>account</Text>

              {/* Subtitle with Heart Flourish */}
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Let's get you started</Text>
                <View style={styles.heartThread}>
                  <View style={styles.threadDot} />
                  <View style={styles.threadLine} />
                  <MaterialCommunityIcons name="heart-outline" size={20} color="#FF758C" />
                </View>
              </View>
            </View>

            {/* Form Inputs with Frosted Glass Look */}
            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    setError('');
                  }}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              {/* Mobile Number */}
              <View style={styles.inputWrapper}>
                <Icon name="phone-portrait-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={mobileNumber}
                  onChangeText={(text) => {
                    setMobileNumber(text);
                    setError('');
                  }}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>

              {/* Email Address */}
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
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
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
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
            </View>

            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Primary Create Account Button */}
            <TouchableOpacity
              style={[styles.createBtnWrapper, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#E82E5D', '#D91C50', '#BF1342']}
                style={styles.createBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.createBtnText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Or Continue With Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons (Google & Apple) */}
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={googleLoading || loading}
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
                disabled={appleLoading || loading}
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

            {/* EULA & Terms Disclaimer for Apple Compliance */}
            <TouchableOpacity onPress={openTerms} style={styles.termsWrapper}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> &{' '}
                <Text style={styles.termsLink}>EULA Policy</Text>.
              </Text>
            </TouchableOpacity>

            {/* Footer: Already have an account? Login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginLink}>Login</Text>
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  createBtnWrapper: {
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
  createBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
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
  termsWrapper: {
    marginTop: 18,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#FF8A65',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF758C',
    fontSize: 14,
    fontWeight: '800',
  },
});

