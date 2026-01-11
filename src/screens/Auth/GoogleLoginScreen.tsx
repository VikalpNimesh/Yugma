// GoogleLoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { signInWithGoogle } from "../../api/firebase/auth";
import { initializeBasicInfo } from "../../redux/slices/profileFormSlice";

const GoogleLoginScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const googleUserData = await signInWithGoogle(dispatch);

            // Initialize basic info with Google user data
            if (googleUserData) {
                const userData = {
                    fullName: googleUserData.user?.name || '',
                    email: googleUserData.user?.email || '',
                };

                dispatch(initializeBasicInfo(userData));

                // Persist to AsyncStorage
                await AsyncStorage.setItem('userBasicInfo', JSON.stringify(userData));
            }

            navigation.replace("HomeScreen");
        } catch (err: any) {
            setError(err.message || "Google Sign-In failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={["#6f1478ff", "#dd2477ff"]}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
        >
            <View style={styles.logoContainer}>
                {/* Logo placeholder */}
                <Image
                    source={require("../../assets/yugma.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.newText}>New to Yugma ?</Text>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={() => navigation.navigate("SignupScreen")}
                    disabled={loading}
                >
                    <Icon name="email" size={20} color="#ff3b3b" />
                    <Text style={styles.buttonText}>Sign Up with Email</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={[styles.button, styles.buttonDisabled]}
                    disabled
                >
                    <Icon name="phone" size={20} color="#ff3b3b" />
                    <Text style={styles.buttonText}>Sign Up with Mobile</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ff3b3b" />
                    ) : (
                        <>
                            <AntDesign name="google" size={20} color="#ff3b3b" />
                            <Text style={styles.buttonText}>Sign Up with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("LoginScreen")}
                        disabled={loading}
                    >
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default GoogleLoginScreen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        // flex: 1,
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
    },
    newText: {
        color: "#ff3b3b",
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "500",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        width: "85%",
        paddingVertical: 14,
        borderRadius: 30,
        justifyContent: "center",
        marginBottom: 15,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#ff3b3b",
        fontWeight: "600",
        fontSize: 15,
        marginLeft: 10,
    },
    errorContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    errorText: {
        color: "#ff3b3b",
        fontSize: 13,
        textAlign: "center",
    },
    footer: {
        flexDirection: "row",
        marginTop: 20,
    },
    footerText: {
        color: "#ff3b3b",
        fontSize: 14,
    },
    loginLink: {
        color: "#ff3b3b",
        fontWeight: "700",
        marginLeft: 5,
        textDecorationLine: "underline",
    },
    logo: {
        width: 400,
        height: 400,
        // marginBottom: 30,
    },
});
