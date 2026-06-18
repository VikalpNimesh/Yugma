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
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithGoogle, signInWithApple } from '../../api/firebase/auth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { initializeBasicInfo } from '../../redux/slices/profileFormSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from "../../components/common/BackButton";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const { isLoading, error: authError } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
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
        if (!email.trim() || !password.trim()) {
            setLocalError('Please enter both email and password');
            return;
        }
        try {
            const result = await dispatch(loginUser({ emailOrPhone: email.trim(), password })).unwrap();
            if (result.user) {
                const userData = {
                    fullName: result.user.fullName || '',
                    email: result.user.email || email.trim(),
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
            setLocalError(err.message || 'Google Sign-In failed. Please try again.');
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
            setLocalError(err.message || 'Apple Sign-In failed. Please try again.');
        } finally {
            setAppleLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
            <BackButton />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inner}>
                        <Text style={styles.title}>Begin Your Story</Text>
                        <Text style={styles.subtitle}>Your perfect match is just a login away</Text>

                        {/* Inputs Container */}
                        <View style={styles.inputSection}>
                            <TextInput
                                style={[styles.input, (localError || authError) && styles.inputError]}
                                placeholder="Email ID"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setLocalError('');
                                    if (authError) dispatch(clearError());
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading && !googleLoading}
                            />

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput, (localError || authError) && styles.inputError]}
                                    placeholder="Password"
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setLocalError('');
                                        if (authError) dispatch(clearError());
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    editable={!isLoading && !googleLoading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIconContainer}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={22}
                                        color="rgba(255, 255, 255, 0.8)"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Error Message */}
                        {(localError || authError) ? (
                            <Text style={styles.errorText}>{localError || authError}</Text>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, (isLoading || !email || !password) && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading || googleLoading || !email || !password}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FF3366" />
                            ) : (
                                <Text style={styles.loginText}>Login</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={[styles.googleBtn, googleLoading && styles.buttonDisabled]}
                            onPress={handleGoogleLogin}
                            disabled={googleLoading || isLoading || appleLoading}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <View style={styles.row}>
                                    <AntDesign name="google" size={20} color="#EA4335" />
                                    <Text style={styles.googleText}>Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Apple Button */}
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity
                                style={[styles.appleBtn, appleLoading && styles.buttonDisabled]}
                                onPress={handleAppleLogin}
                                disabled={appleLoading || isLoading || googleLoading}
                            >
                                {appleLoading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <View style={styles.row}>
                                        <AntDesign name="apple1" size={20} color="#000000" />
                                        <Text style={styles.appleText}>Continue with Apple</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')} disabled={isLoading || googleLoading}>
                                <Text style={styles.signupText}> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inner: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 40,
        fontSize: 16,
    },
    inputSection: {
        width: '100%',
        gap: 15,
        marginBottom: 10,
    },
    input: {
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 28,
        paddingHorizontal: 25,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
    },
    inputError: {
        borderColor: '#FFD700',
    },
    errorText: {
        color: '#FFD700',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    loginBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        height: 56,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    loginText: {
        color: '#FF3366',
        fontSize: 18,
        fontWeight: '700',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    orText: {
        marginHorizontal: 15,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    googleBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleText: {
        color: '#1a1a1a',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 12,
    },
    appleBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 15,
    },
    appleText: {
        color: '#1a1a1a',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    signupText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
