import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import DeviceInfo from 'react-native-device-info';

const version = DeviceInfo.getVersion();
import { useDispatch } from "react-redux";
import { handleLogout } from "../../api/firebase/auth";
import Toast from "react-native-toast-message";

type SettingItemProps = {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onPress, color = "#555" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const handleLogoutPress = async () => {
        try {
            Toast.show({ type: 'info', text1: 'Logging out...', position: 'bottom' });
            await handleLogout(navigation, dispatch);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error.message || 'Please try again',
                position: 'bottom',
            });
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Settings</Text>

            <View style={styles.section}>
                <SettingItem
                    icon="person-outline"
                    title="Profile Information"
                    subtitle="Edit your name, bio, and details"
                    color="#FF5F6D"
                    onPress={() => navigation.navigate("ProfileSettings")}
                />
                <View style={styles.separator} />
                <SettingItem
                    icon="notifications-outline"
                    title="Notifications"
                    subtitle="Message, match, and email alerts"
                    color="#4A90E2"
                    onPress={() => navigation.navigate("NotificationSettings")}
                />
                <View style={styles.separator} />
                {/* <SettingItem
                    icon="lock-closed-outline"
                    title="Privacy & Safety"
                    subtitle="Visibility and blocked contacts"
                    color="#50C878"
                    onPress={() => navigation.navigate("PrivacySettings")}
                /> */}
            </View>

            <View style={styles.section}>
                <SettingItem
                    icon="star-outline"
                    title="Premium Membership"
                    subtitle="Manage your subscriptions"
                    color="#FFD700"
                    onPress={() => navigation.navigate("PremiumSettings")}
                />
                <View style={styles.separator} />
                {/* <SettingItem
                    icon="shield-checkmark-outline"
                    title="Verification"
                    subtitle="Get the verified badge"
                    color="#9B59B6"
                    onPress={() => navigation.navigate("VerificationSettings")}
                /> */}
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
                    <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.versionText}>Yugma v{version}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    content: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 20,
        marginTop: 10,
    },
    section: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: "#888",
    },
    separator: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginLeft: 72, // Aligns with the text
    },
    footer: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    versionText: {
        fontSize: 14,
        color: "#aaa",
        fontWeight: "500",
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        gap: 8,
        backgroundColor: "#fff",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF3B30",
    },
});
