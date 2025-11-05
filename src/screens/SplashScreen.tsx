import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen = () => {
    const navigation = useNavigation<SplashNavProp>();

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
