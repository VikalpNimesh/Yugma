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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithGoogle } from '../../api/firebase/auth';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/authSlice';

export default function LoginScreen({ navigation }: any) {
    const dispatch = useAppDispatch();
    const { isLoading, error: authError, isAuthenticated } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    // Clear error when component mounts or when authError changes
    useEffect(() => {
        if (authError) {
            setLocalError(authError);
            dispatch(clearError());
        }
    }, [authError, dispatch]);

    // Navigate to home screen when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigation.replace('HomeScreen');
        }
    }, [isAuthenticated, navigation]);

    const handleLogin = async () => {
        if (isLoading) return;

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setLocalError('Please enter both email and password');
            return;
        }

        setLocalError('');

        try {
            await dispatch(loginUser({ email: email.trim(), password })).unwrap();
            // Navigation will happen automatically via useEffect when isAuthenticated becomes true
            console.log('✅ Login successful');
        } catch (err: any) {
            console.log('err: ', err);
            setLocalError(err || 'Unable to login. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        if (googleLoading) return;

        setLocalError('');
        setGoogleLoading(true);

        try {
            const googleResponse = await signInWithGoogle(dispatch);
            console.log('googleResponse: ', googleResponse);
            handleLogin()
            navigation.replace('BasicInfo');
        } catch (err: any) {
            setLocalError(err.message || 'Google Sign-In failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSignup = () => {
        navigation.navigate('SignupScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.inner}>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>Login to your account</Text>

                        {/* Google Button */}
                        <TouchableOpacity
                            style={[styles.googleBtn, googleLoading && styles.buttonDisabled]}
                            onPress={handleGoogleLogin}
                            disabled={googleLoading || isLoading}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.googleText}>Continue with Google</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Email Input */}
                        <TextInput
                            style={[styles.input, (localError || authError) && styles.inputError]}
                            placeholder="Email ID"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setLocalError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading && !googleLoading}
                        />

                        {/* Password Input */}
                        <TextInput
                            style={[styles.input, (localError || authError) && styles.inputError]}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setLocalError('');
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!isLoading && !googleLoading}
                        />

                        {/* Error Message */}
                        {(localError || authError) ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{localError || authError}</Text>
                            </View>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, (isLoading || !email || !password) && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading || googleLoading || !email || !password}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginText}>Login</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={handleSignup} disabled={isLoading || googleLoading}>
                                <Text style={styles.signupText}> Sign Up Free</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inner: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        color: '#111',
        marginBottom: 4,
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        fontSize: 14,
    },
    googleBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    googleText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 15,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 12,
        color: '#999',
        fontSize: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginVertical: 8,
        color: '#000',
        fontSize: 15,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff3b3b',
    },
    errorContainer: {
        marginTop: 8,
        marginBottom: 4,
    },
    errorText: {
        color: '#ff3b3b',
        fontSize: 13,
        textAlign: 'center',
    },
    loginBtn: {
        backgroundColor: '#00B2FF',
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    signupText: {
        color: '#00B2FF',
        fontWeight: '600',
        fontSize: 14,
    },
});
