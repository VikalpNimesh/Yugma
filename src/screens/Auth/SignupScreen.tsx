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
import { createUserWithEmailPassword } from '../../api/firebase/auth';

export default function SignupScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (loading) return;

        setError('');

        // Client-side validation
        if (!email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const user = await createUserWithEmailPassword(
                email,
                password,
                displayName || undefined
            );

            console.log('✅ User registered:', user.email);

            // Show success message and navigate
            navigation.replace('BasicInfo');
        } catch (err: any) {
            setError(err.message || 'Unable to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigation.navigate('LoginScreen');
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>

                        {/* Display Name Input (Optional) */}
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name (Optional)"
                            placeholderTextColor="#999"
                            value={displayName}
                            onChangeText={(text) => {
                                setDisplayName(text);
                                setError('');
                            }}
                            autoCapitalize="words"
                            editable={!loading}
                        />

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
                            editable={!loading}
                        />

                        {/* Password Input */}
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="Password (min. 6 characters)"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />

                        {/* Confirm Password Input */}
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="Confirm Password"
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setError('');
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />

                        {/* Error Message */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Signup Button */}
                        <TouchableOpacity
                            style={[
                                styles.signupBtn,
                                (loading || !email || !password || !confirmPassword) && styles.buttonDisabled
                            ]}
                            onPress={handleSignup}
                            disabled={loading || !email || !password || !confirmPassword}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signupText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={handleLogin} disabled={loading}>
                                <Text style={styles.loginText}> Login</Text>
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
    signupBtn: {
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
    signupText: {
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
    loginText: {
        color: '#00B2FF',
        fontWeight: '600',
        fontSize: 14,
    },
});
