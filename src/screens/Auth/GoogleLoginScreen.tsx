// GoogleLoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { signInWithGoogle } from "../../api/firebase/auth";

const { width, height } = Dimensions.get("window");

const GoogleLoginScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        if (loading) return;
        setError("");
        setLoading(true);
        try {
            await signInWithGoogle(dispatch);
            navigation.replace("HomeScreen");
        } catch (err: any) {
            setError(err.message || "Google Sign-In failed.");
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
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Circular Logo Container */}
                    <View style={styles.logoCircle}>
                        <Image
                            source={require("../../assets/yugma_png.png")}
                            style={styles.logo}
                            resizeMode="stretch"
                        />
                    </View>

                    {/* Text Section */}
                    <View style={styles.textSection}>
                        <Text style={styles.title}>Find your perfect match</Text>
                        <Text style={styles.subtitle}>
                            Dating or Marriage, Yugma helps you connect with the right person
                        </Text>
                    </View>

                    {/* Buttons Section */}
                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={styles.whiteButton}
                            onPress={handleGoogleSignIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <View style={styles.row}>
                                    <AntDesign name="google" size={20} color="#EA4335" />
                                    <Text style={[styles.buttonText, { marginLeft: 10 }]}>Continue with Google</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.emailLink}
                            onPress={() => navigation.navigate("SignupScreen")}
                        >
                            <Text style={styles.emailText}>Continue with Email</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By continuing, you agree to our{" "}
                            <Text style={styles.linkText} onPress={() => { }}>Terms of Service</Text>
                            {"\n"}and <Text style={styles.linkText} onPress={() => { }}>Privacy Policy</Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 100,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 0,
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
        overflow: "hidden",
    },
    textSection: {
        alignItems: "center",
        width: "100%",
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 15,
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    buttonSection: {
        width: "100%",
        gap: 15,
        alignItems: "center",
    },
    whiteButton: {
        width: "100%",
        height: 56,
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    emailLink: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    emailText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
    footer: {
        marginTop: 20,
    },
    footerText: {
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
        fontSize: 13,
        lineHeight: 18,
    },
    linkText: {
        color: "#FFFFFF",
        textDecorationLine: "underline",
        fontWeight: "600",
    },
});

export default GoogleLoginScreen;
