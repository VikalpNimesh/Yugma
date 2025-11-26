import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useAppSelector } from "../redux/hooks";

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen = () => {
    const navigation = useNavigation<SplashNavProp>();
    const currentScreen = useAppSelector((state) => state.profileForm.currentScreen);

    // Helper function to get the navigation stack based on current screen
    const getNavigationStack = (screen: string) => {
        const screenOrder = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
        const currentIndex = screenOrder.indexOf(screen);

        if (currentIndex === -1) return [{ name: screen as keyof RootStackParamList, key: screen }];

        // Build stack up to current screen
        const stack = [];
        for (let i = 0; i <= currentIndex; i++) {
            stack.push({
                name: screenOrder[i] as keyof RootStackParamList,
                key: screenOrder[i] + '_' + i
            });
        }
        return stack;
    };

    // Helper function to get the index of current screen in stack
    const getScreenIndex = (screen: string) => {
        const screenOrder = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
        const index = screenOrder.indexOf(screen);
        return index === -1 ? 0 : index;
    };

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "740740268985-l0u2tug9pq87r4bms19bjj2tihfc81o4.apps.googleusercontent.com",
            offlineAccess: false,
        });

        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                // If user is authenticated and has a saved screen, navigate to it
                const validScreens = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
                if (currentScreen && validScreens.includes(currentScreen)) {
                    // Build the navigation stack properly
                    navigation.reset({
                        index: getScreenIndex(currentScreen),
                        routes: getNavigationStack(currentScreen),
                    });
                } else {
                    navigation.replace("BottomTabs");
                }
            }
        });

        return unsubscribe;
    }, [currentScreen, navigation]);

    useEffect(() => {
        const timer = setTimeout(() => {
            // If no user is authenticated, check if there's a saved screen to resume
            const validScreens = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
            if (currentScreen && validScreens.includes(currentScreen)) {
                // Build the navigation stack properly
                navigation.reset({
                    index: getScreenIndex(currentScreen),
                    routes: getNavigationStack(currentScreen),
                });
            } else {
                navigation.replace("GoogleLogin");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation, currentScreen]);

    return (
        <View style={styles.container}>
            {/* <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            /> */}
            <Text style={styles.title}>Welcome to VivahSetu</Text>
            <Text style={styles.subtitle}>Find your perfect match</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.matrimonyButton]}
                    onPress={() => navigation.navigate("Matrimonial")}
                >
                    <Text style={styles.buttonText}>💍 Matrimonial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.datingButton]}
                    onPress={() => navigation.navigate("BasicInfo")}
                >
                    <Text style={styles.buttonText}>💘 Dating</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fffaf5",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    matrimonyButton: {
        backgroundColor: "linear-gradient(90deg, #ff5f6d, #ffc371)",
    },
    datingButton: {
        backgroundColor: "linear-gradient(90deg, #f77062, #fe5196)",
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default SplashScreen;
