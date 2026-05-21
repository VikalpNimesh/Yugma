import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function VerificationSettingsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <BackButton color="#000" title="Verification" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.verificationCard}>
                    <View style={styles.badgeContainer}>
                        <Ionicons name="shield-checkmark" size={64} color="#FF5F6D" />
                    </View>
                    <Text style={styles.verificationStatus}>Get Verified</Text>
                    <Text style={styles.verificationSubtext}>
                        Prove you're real, build trust, and get more matches with the Verification Badge.
                    </Text>

                    <View style={styles.benefitsList}>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF5F6D" />
                            <Text style={styles.benefitText}>Exclusive Verification Badge</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF5F6D" />
                            <Text style={styles.benefitText}>Higher trust from other users</Text>
                        </View>
                        <View style={styles.benefitItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF5F6D" />
                            <Text style={styles.benefitText}>Priority support</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.verifyBtn}>
                        <Text style={styles.verifyBtnText}>Verify Now</Text>
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
    verificationCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fcebf2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    verificationStatus: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 8 },
    verificationSubtext: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20, marginBottom: 24 },
    benefitsList: { width: "100%", marginBottom: 24 },
    benefitItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
    benefitText: { fontSize: 15, color: "#444", fontWeight: "500" },
    verifyBtn: { backgroundColor: "#FF5F6D", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30, width: "100%", alignItems: "center" },
    verifyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
