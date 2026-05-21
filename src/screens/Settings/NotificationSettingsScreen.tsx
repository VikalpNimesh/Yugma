import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";

export default function NotificationSettingsScreen() {
    const [newMatches, setNewMatches] = useState(true);
    const [messages, setMessages] = useState(true);
    const [likes, setLikes] = useState(false);
    const [appUpdates, setAppUpdates] = useState(true);
    const [emailPromos, setEmailPromos] = useState(false);

    const NotificationItem = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (val: boolean) => void }) => (
        <View style={styles.notificationRow}>
            <Text style={styles.notificationLabel}>{label}</Text>
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
            <BackButton color="#000" title="Notification Settings" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Push Notifications</Text>
                    <NotificationItem label="New Matches" value={newMatches} onValueChange={setNewMatches} />
                    <View style={styles.separator} />
                    <NotificationItem label="Messages" value={messages} onValueChange={setMessages} />
                    <View style={styles.separator} />
                    <NotificationItem label="Likes & Comments" value={likes} onValueChange={setLikes} />
                    <View style={styles.separator} />
                    <NotificationItem label="App Updates & Tips" value={appUpdates} onValueChange={setAppUpdates} />
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Email Notifications</Text>
                    <NotificationItem label="Promotions & Offers" value={emailPromos} onValueChange={setEmailPromos} />
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
    notificationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
    notificationLabel: { fontSize: 14, color: "#444", fontWeight: "500" },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 4 },
});
