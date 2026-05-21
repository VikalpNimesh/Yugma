import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PrivacySettingsScreen() {
    const [showProfile, setShowProfile] = useState(true);
    const [showAge, setShowAge] = useState(true);
    const [showDistance, setShowDistance] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [activityStatus, setActivityStatus] = useState(true);

    const PrivacyItem = ({ label, value, onValueChange, description }: { label: string, value: boolean, onValueChange: (val: boolean) => void, description?: string }) => (
        <View style={styles.privacyRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.notificationLabel}>{label}</Text>
                {description && <Text style={styles.privacyDescription}>{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#FF5F6D" }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <BackButton color="#000" title="Privacy & Safety" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Visibility</Text>
                    <PrivacyItem
                        label="Show me on Yugma"
                        description="Turn this off to hide your profile. You won't be seen by new people."
                        value={showProfile}
                        onValueChange={setShowProfile}
                    />
                    <View style={styles.separator} />
                    <PrivacyItem label="Show my Age" value={showAge} onValueChange={setShowAge} />
                    <View style={styles.separator} />
                    <PrivacyItem label="Show my Distance" value={showDistance} onValueChange={setShowDistance} />
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Data & Activity</Text>
                    <PrivacyItem label="Read Receipts" value={readReceipts} onValueChange={setReadReceipts} />
                    <View style={styles.separator} />
                    <PrivacyItem label="Share Activity Status" value={activityStatus} onValueChange={setActivityStatus} />
                </View>

                <View style={styles.sectionCard}>
                    <TouchableOpacity style={styles.menuRow}>
                        <Text style={styles.menuText}>Blocked Contacts</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.menuRow}>
                        <Text style={[styles.menuText, { color: 'red' }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: { padding: 16 },
    header: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#222", textAlign: "center" },
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 16 },
    privacyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
    notificationLabel: { fontSize: 14, color: "#444", fontWeight: "500" },
    privacyDescription: { fontSize: 12, color: "#888", marginTop: 2, lineHeight: 16 },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 4 },
    menuRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
    menuText: { fontSize: 15, color: "#333", fontWeight: "500" },
});
