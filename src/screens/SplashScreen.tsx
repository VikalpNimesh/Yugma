import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkAuthState } from "../redux/slices/authSlice";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen = () => {
    const navigation = useNavigation<SplashNavProp>();
    const dispatch = useAppDispatch();
    const currentScreen = useAppSelector((state) => state.profileForm.currentScreen);
    const { isAuthenticated, profile, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);

    // Helper functions for navigation logic
    const getNavigationStack = (screen: string) => {
        const screenOrder = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
        const currentIndex = screenOrder.indexOf(screen);
        if (currentIndex === -1) return [{ name: screen as keyof RootStackParamList, key: screen }];
        const stack = [];
        for (let i = 0; i <= currentIndex; i++) {
            stack.push({
                name: screenOrder[i] as keyof RootStackParamList,
                key: screenOrder[i] + '_' + i
            });
        }
        return stack;
    };

    const getScreenIndex = (screen: string) => {
        const screenOrder = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
        const index = screenOrder.indexOf(screen);
        return index === -1 ? 0 : index;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(checkAuthState());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (isAuthLoading) return;

            try {
                if (isAuthenticated) {
                    if (profile && (profile.id || Object.keys(profile).length > 0)) {
                        navigation.replace("BottomTabs");
                    } else {
                        const validScreens = ['BasicInfo', 'AboutYouStep', 'FamilyDetailsStep', 'PreferencesStep'];
                        if (currentScreen && validScreens.includes(currentScreen)) {
                            navigation.reset({
                                index: getScreenIndex(currentScreen),
                                routes: getNavigationStack(currentScreen),
                            });
                        } else {
                            navigation.replace("BasicInfo");
                        }
                    }
                } else {
                    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
                    navigation.replace("AppTypeSelection");
                }
            } catch (error) {
                console.error('Error in splash navigation:', error);
                if (!isAuthenticated) {
                    navigation.replace("LoginScreen");
                }
            }
        }, 2000); // Increased delay for a more premium splash feel

        return () => clearTimeout(timer);
    }, [navigation, currentScreen, isAuthenticated, isAuthLoading, profile]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.logoWrapper}>
                <Image
                    source={require("../assets/new_yugma.png")}
                    style={styles.logo}
                    resizeMode="contain"
                    tintColor="#FFFFFF"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.brandName}>yugma</Text>
                    <View style={styles.separatorContainer}>
                        <View style={styles.line} />
                        <Text style={styles.brandSubtitle}>FOR BRAHMINS</Text>
                        <View style={styles.line} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrapper: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: -20,
    },
    brandName: {
        fontSize: 64,
        color: "#FFFFFF",
        fontWeight: "400",
        letterSpacing: 2,
        // Using serif font for that premium look
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: '80%',
        justifyContent: 'center',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#FFFFFF',
        opacity: 0.6,
    },
    brandSubtitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
        marginHorizontal: 15,
        letterSpacing: 3,
    },
});

export default SplashScreen;
