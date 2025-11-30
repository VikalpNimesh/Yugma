import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    Switch,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';

type TabType = "Profile" | "Notifications" | "Privacy" | "Premium" | "Verification";

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<TabType>("Profile");

    return (
        <View style={styles.container}>
            {/* Sidebar Tabs */}
            <View style={styles.sidebar}>
                {(["Profile", "Notifications", "Privacy", "Premium", "Verification"] as TabType[]).map(
                    (tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Main Content */}
            <ScrollView style={styles.content}>
                {activeTab === "Profile" && <ProfileTab />}
                {activeTab === "Notifications" && <Placeholder title="Notifications" />}
                {activeTab === "Privacy" && <Placeholder title="Privacy & Safety" />}
                {activeTab === "Premium" && <Placeholder title="Premium" />}
                {activeTab === "Verification" && <Placeholder title="Verification" />}
            </ScrollView>
        </View>
    );
}

function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const mode = user.appType || "Matrimonial";

    const setMode = (newMode: "Matrimonial" | "Dating") => {
        dispatch(updateUser({ appType: newMode }));
    };

    return (
        <View>
            <Text style={styles.header}>Profile Information</Text>

            {!isEditing ? (
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/80" }}
                        style={styles.profilePic}
                    />
                    <Text style={styles.text}>NaN years old</Text>
                    <Text style={styles.verified}>✔ Verified</Text>
                    <Text style={styles.text}>Location: —</Text>
                    <Text style={styles.text}>Profession: —</Text>

                    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.editCard}>
                    <TextInput style={styles.input} placeholder="Name" />
                    <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Location" />
                    <TextInput style={styles.input} placeholder="Profession" />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Bio"
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.saveBtn}>
                            <Text style={styles.saveText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Profile Mode Toggle */}
            <View style={styles.modeContainer}>
                <Text style={styles.modeTitle}>Profile Mode</Text>
                <View style={styles.modeSwitch}>
                    <TouchableOpacity
                        onPress={() => setMode("Matrimonial")}
                        style={[styles.modeBtn, mode === "Matrimonial" && styles.activeMode]}
                    >
                        <Text
                            style={[
                                styles.modeText,
                                mode === "Matrimonial" && styles.activeModeText,
                            ]}
                        >
                            Matrimonial
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMode("Dating")}
                        style={[styles.modeBtn, mode === "Dating" && styles.activeMode]}
                    >
                        <Text
                            style={[
                                styles.modeText,
                                mode === "Dating" && styles.activeModeText,
                            ]}
                        >
                            Dating
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function Placeholder({ title }: { title: string }) {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{title} Settings Coming Soon</Text>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fffaf9",
    },
    sidebar: {
        width: 120,
        borderRightWidth: 1,
        borderRightColor: "#eee",
        backgroundColor: "#fff",
        paddingVertical: 20,
    },
    tabItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    activeTab: {
        backgroundColor: "#ff8e53",
        borderRadius: 8,
    },
    tabText: {
        color: "#444",
        fontSize: 14,
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "600",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    profileCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    verified: {
        color: "green",
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: "#555",
    },
    editBtn: {
        marginTop: 10,
        backgroundColor: "#ff8e53",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    editText: {
        color: "#fff",
        fontWeight: "600",
    },
    editCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    textArea: {
        height: 80,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelBtn: {
        padding: 10,
    },
    cancelText: {
        color: "#999",
    },
    saveBtn: {
        backgroundColor: "#ff8e53",
        borderRadius: 8,
        padding: 10,
    },
    saveText: {
        color: "#fff",
        fontWeight: "600",
    },
    modeContainer: {
        marginTop: 20,
    },
    modeTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    modeSwitch: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        overflow: "hidden",
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },
    modeText: {
        color: "#555",
    },
    activeMode: {
        backgroundColor: "#ff8e53",
    },
    activeModeText: {
        color: "#fff",
        fontWeight: "600",
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
    },
    placeholderText: {
        color: "#888",
    },
});
