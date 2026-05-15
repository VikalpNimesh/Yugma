// GoogleAccountPickerScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const GoogleAccountPickerScreen = ({ navigation }: any) => {
    const accounts = [
        { id: "1", name: "Priya Sharma", email: "priyasharma1267@gmail.com", initial: "P", color: "#4B6E3D" },
        { id: "2", name: "Anamika Bhardwaj", email: "anamikabhardwaj1267@gmail.com", initial: "A", color: "#2B2D6E" },
        { id: "3", name: "Priya Sharma", email: "priyasharma1267@gmail.com", initial: "P", color: "#FF5E0E" },
    ];

    const handleAccountSelect = (account: any) => {
        // Mock selection logic
        navigation.replace("BottomTabs");
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#8E3A4A", "#5A2A35"]}
                style={styles.background}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.card}>
                    {/* Header Logo */}
                    <View style={styles.headerLogoContainer}>
                        <LinearGradient
                            colors={["#FF5F6D", "#FF3366"]}
                            style={styles.logoGradient}
                        >
                            <Image
                                source={require("../../assets/yugmaNew.png")}
                                style={styles.logo}
                                resizeMode="contain"
                                tintColor="#FFFFFF"
                            />
                            <View style={styles.logoTextContainer}>
                                <Text style={styles.logoText}>yugma</Text>
                                <View style={styles.logoLine} />
                                <Text style={styles.logoSubtitle}>FOR BRAHMINS</Text>
                                <View style={styles.logoLine} />
                            </View>
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>Choose an account</Text>
                    <Text style={styles.subtitle}>to continue to Yugma</Text>

                    <ScrollView style={styles.accountList} showsVerticalScrollIndicator={false}>
                        {accounts.map((account) => (
                            <TouchableOpacity
                                key={account.id}
                                style={styles.accountItem}
                                onPress={() => handleAccountSelect(account)}
                            >
                                <View style={[styles.avatar, { backgroundColor: account.color }]}>
                                    <Text style={styles.avatarText}>{account.initial}</Text>
                                </View>
                                <View style={styles.accountInfo}>
                                    <Text style={styles.accountName}>{account.name}</Text>
                                    <Text style={styles.accountEmail}>{account.email}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.addAccountItem}>
                            <View style={styles.addIconContainer}>
                                <Icon name="person-add-alt" size={24} color="#1a1a1a" />
                            </View>
                            <Text style={styles.addAccountText}>Add another account</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.divider} />

                    <Text style={styles.disclaimer}>
                        To continue, google will share your name, email address, profile picture with yugma
                    </Text>
                </View>

                {/* Footer Links */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to our{" "}
                        <Text style={styles.linkText}>Terms of Service</Text>
                        {"\n"}and <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    headerLogoContainer: {
        width: 120,
        height: 120,
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 20,
    },
    logoGradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    logo: {
        width: 60,
        height: 60,
    },
    logoTextContainer: {
        alignItems: "center",
        marginTop: -5,
    },
    logoText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "400",
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    logoLine: {
        height: 1,
        backgroundColor: "#FFFFFF",
        width: 20,
        opacity: 0.5,
    },
    logoSubtitle: {
        color: "#FFFFFF",
        fontSize: 5,
        letterSpacing: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 25,
    },
    accountList: {
        width: "100%",
        maxHeight: 300,
    },
    accountItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    accountEmail: {
        fontSize: 12,
        color: "#666",
    },
    addAccountItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    addIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    addAccountText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1a1a1a",
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#F0F0F0",
        marginVertical: 15,
    },
    disclaimer: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        lineHeight: 18,
        paddingHorizontal: 10,
    },
    footer: {
        marginTop: 30,
    },
    footerText: {
        color: "rgba(255, 255, 255, 0.7)",
        textAlign: "center",
        fontSize: 14,
        lineHeight: 20,
    },
    linkText: {
        color: "#FFFFFF",
        textDecorationLine: "underline",
        fontWeight: "600",
    },
});

export default GoogleAccountPickerScreen;
