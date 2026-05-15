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
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signupUser } from '../../redux/slices/authSlice';
import { setCurrentScreen, initializeBasicInfo } from '../../redux/slices/profileFormSlice';

export default function SignupScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdult, setIsAdult] = useState(false);

    const { appType } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    const handleSignup = async () => {
        if (loading) return;
        setError('');
        if (!email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!isAdult) {
            setError('You must be 18+ to sign up');
            return;
        }
        setLoading(true);
        try {
            dispatch(setCurrentScreen('BasicInfo'));
            const resultAction = await dispatch(signupUser({
                email,
                password,
                name: displayName || 'User',
                accountMode: appType || 'matrimonial',
            }) as any);

            if (signupUser.fulfilled.match(resultAction)) {
                const userData = resultAction.payload as any;
                if (userData.user) {
                    const basicInfo = {
                        fullName: userData.user.fullName || displayName || '',
                        email: userData.user.email || email.trim(),
                    };
                    dispatch(initializeBasicInfo(basicInfo));
                    await AsyncStorage.setItem('userBasicInfo', JSON.stringify(basicInfo));
                }
            } else {
                setError(resultAction.payload ? (resultAction.payload as string) : 'Unable to create account. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Unable to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
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

                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={displayName}
                                onChangeText={(text) => {
                                    setDisplayName(text);
                                    setError('');
                                }}
                                autoCapitalize="words"
                                editable={!loading}
                            />

                            <TextInput
                                style={[styles.input, error && styles.inputError]}
                                placeholder="Email ID"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
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

                            <TextInput
                                style={[styles.input, error && styles.inputError]}
                                placeholder="Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError('');
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!loading}
                            />

                            <TextInput
                                style={[styles.input, error && styles.inputError]}
                                placeholder="Confirm Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setError('');
                                }}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setIsAdult(!isAdult);
                                setError('');
                            }}
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Ionicons
                                name={isAdult ? "checkbox" : "square-outline"}
                                size={22}
                                color="#FFFFFF"
                            />
                            <Text style={styles.checkboxLabel}>I confirm that I am 18 years or older</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.signupBtn,
                                (loading || !email || !password || !confirmPassword || !isAdult) && styles.buttonDisabled
                            ]}
                            onPress={handleSignup}
                            disabled={loading || !email || !password || !confirmPassword || !isAdult}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FF3366" />
                            ) : (
                                <Text style={styles.signupText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} disabled={loading}>
                                <Text style={styles.loginText}> Login</Text>
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
        marginBottom: 30,
        fontSize: 16,
    },
    inputSection: {
        width: '100%',
        gap: 12,
    },
    input: {
        height: 54,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 27,
        paddingHorizontal: 25,
        color: '#FFFFFF',
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    inputError: {
        borderColor: '#FFD700',
    },
    errorText: {
        color: '#FFD700',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 5,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    signupBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 27,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    signupText: {
        color: '#FF3366',
        fontSize: 18,
        fontWeight: '700',
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
    loginText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
