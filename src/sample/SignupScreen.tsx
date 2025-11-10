// SignupScreen
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { auth } from '../services/firebase/firebaseConfig';
// import { auth } from '../utils/firebaseConfig';
import auth from '@react-native-firebase/auth';


export default function SignupScreen() {



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log('emailwedfds: ', email, password);

    async function registerUser() {
        if (!email || !password) {
            console.error('Email and password are required');
            return;
        }
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            console.log('User registered:', userCredential.user);
        } catch (error) {
            console.error('Signup error:', error.message);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Create  your account</Text>



                {/* Email / Mobile Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email ID"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#999"
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                />

                {/* <View style={styles.row}>
                    <TouchableOpacity>
                        <Text style={styles.link}>Login with OTP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.link}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Login Button */}
                <TouchableOpacity style={styles.loginBtn} onPress={registerUser}>
                    <Text style={styles.loginText}>Create</Text>
                </TouchableOpacity>

                {/* <View style={styles.footer}>
                    <Text style={styles.footerText}>Don’t have an account?</Text>
                    <TouchableOpacity>
                        <Text style={styles.signupText}> Sign Up Free</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
    inner: { paddingHorizontal: 24 },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        color: '#111',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        marginTop: 4,
    },
    googleBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    googleText: { color: '#000', fontWeight: '500' },
    orText: { textAlign: 'center', color: '#999', marginVertical: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginVertical: 8,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    link: { color: '#009DFF', fontWeight: '500' },
    loginBtn: {
        backgroundColor: '#00B2FF',
        borderRadius: 8,
        paddingVertical: 14,
        marginTop: 10,
    },
    loginText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },
    footerText: { color: '#666' },
    signupText: { color: '#00B2FF', fontWeight: '600' },
});
