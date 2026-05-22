// GoogleLoginScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BackButton from "../../components/common/BackButton";

const { width, height } = Dimensions.get("window");

const GoogleLoginScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
            
            {/* Floating Decorative Circles to fill space elegantly */}
            <View style={[styles.decoratorCircle, { top: -80, left: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: "rgba(255, 255, 255, 0.12)" }]} />
            <View style={[styles.decoratorCircle, { bottom: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: "rgba(255, 255, 255, 0.1)" }]} />
            <View style={[styles.decoratorCircle, { top: height * 0.32, right: -90, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255, 255, 255, 0.08)" }]} />
            <View style={[styles.decoratorCircle, { top: height * 0.55, left: -60, width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(255, 255, 255, 0.06)" }]} />

            <BackButton />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Centered Main Group */}
                    <View style={styles.mainGroup}>
                        {/* Circular Logo Container with elegant outer ring */}
                        <View style={styles.logoOuterRing}>
                            <View style={styles.logoCircle}>
                                <Image
                                    source={require("../../assets/yugma_png.png")}
                                    style={styles.logo}
                                    resizeMode="stretch"
                                />
                            </View>
                        </View>

                        {/* Text Section */}
                        <View style={styles.textSection}>
                            <Text style={styles.title}>Find your perfect match</Text>
                            <Text style={styles.subtitle}>
                                Dating or Marriage, Yugma helps you connect with the right person
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Action Group */}
                    <View style={styles.bottomGroup}>
                        {/* Buttons Section */}
                        <View style={styles.buttonSection}>
                            <TouchableOpacity
                                style={styles.whiteButton}
                                onPress={() => navigation.navigate("LoginScreen")}
                            >
                                <View style={styles.row}>
                                    <Text style={styles.buttonText}>Start</Text>
                                    <MaterialIcons name="arrow-forward" size={22} color="#FF3366" style={{ marginLeft: 8 }} />
                                </View>
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
        paddingVertical: 50,
        paddingHorizontal: 30,
    },
    decoratorCircle: {
        position: "absolute",
    },
    mainGroup: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 40,
    },
    logoOuterRing: {
        width: 190,
        height: 190,
        borderRadius: 95,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    logoCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 80,
        overflow: "hidden",
        marginTop: 30
    },
    textSection: {
        alignItems: "center",
        width: "100%",
    },
    title: {
        fontSize: 34,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 15,
        lineHeight: 40,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    bottomGroup: {
        width: "100%",
        alignItems: "center",
    },
    buttonSection: {
        width: "100%",
        marginBottom: 15,
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
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FF3366",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    footer: {
        marginTop: 10,
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
