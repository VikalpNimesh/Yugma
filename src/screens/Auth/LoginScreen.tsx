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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailPassword, signInWithGoogle } from '../../api/firebase/auth';
import { useDispatch } from 'react-redux';

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) return;

        setError('');
        setLoading(true);

        try {
            const user = await signInWithEmailPassword(email, password);
            console.log('✅ Login successful:', user.email);

            // Navigate to home screen
            navigation.replace('HomeScreen');
        } catch (err: any) {
            setError(err.message || 'Unable to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (googleLoading) return;

        setError('');
        setGoogleLoading(true);

        try {
            await signInWithGoogle(dispatch);
            navigation.replace('BottomScreen');
        } catch (err: any) {
            setError(err.message || 'Google Sign-In failed. Please try again.');
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
                            disabled={googleLoading || loading}
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
                            style={[styles.input, error && styles.inputError]}
                            placeholder="Email ID"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading && !googleLoading}
                        />

                        {/* Password Input */}
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading && !googleLoading}
                        />

                        {/* Error Message */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, (loading || !email || !password) && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading || googleLoading || !email || !password}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginText}>Login</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={handleSignup} disabled={loading || googleLoading}>
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
