// GoogleLoginScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

const GoogleLoginScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();

    const handleGoogleSignIn = async () => {
        try {

            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();

            const { idToken }: any = userInfo?.data;
            if (!idToken) throw new Error("Google Sign-In failed: no idToken returned");
            dispatch(setUser(userInfo?.data));

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);
            navigation.replace("HomeScreen");
        } catch (error: any) {
            console.error("Google Sign-In error:::::::", error);
        }
    };

    return (
        <LinearGradient
            colors={['#FFDAB9', 'white',]}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
        >

            <View style={styles.logoContainer}>
                {/* <Image
                    source={{
                        uri: "https://images.pexels.com/photos/7359158/pexels-photo-7359158.jpeg?_gl=1*1457uc6*_ga*MjAxNDg2NzI3NC4xNzYyNDI4MzM5*_ga_8JE65Q40S6*czE3NjI1MDU0MjMkbzMkZzEkdDE3NjI1MDU0NDQkajM5JGwwJGgw",
                    }}
                    style={styles.logo}
                    resizeMode="contain"
                /> */}
            </View>

            <View style={styles.content}>
                <Text style={styles.newText}>New to VivhaSetu ?</Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignupScreen")}>
                    <Icon name="email" size={20} color="#ff3b3b" />
                    <Text style={styles.buttonText}>Sign Up with Email</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Icon name="phone" size={20} color="#ff3b3b" />
                    <Text style={styles.buttonText}>Sign Up with Mobile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
                    <AntDesign name="google" size={20} color="#ff3b3b" />
                    <Text style={styles.buttonText}>Sign Up with Google</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 50
    },
    content: {
        flex: 1,
        alignItems: "center",
        width: "100%",
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
    buttonText: {
        color: "#ff3b3b",
        fontWeight: "600",
        fontSize: 15,
        marginLeft: 10,
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
});
