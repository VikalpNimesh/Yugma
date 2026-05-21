import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function PremiumSettingsScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <BackButton color="#000" title="Premium Membership" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.premiumStatusCard}>
                    <View style={[styles.iconCircle, { backgroundColor: "#FFD700", width: 60, height: 60, borderRadius: 30, marginBottom: 16 }]}>
                        <Ionicons name="gift-outline" size={32} color="#fff" />
                    </View>
                    <Text style={styles.premiumStatusTitle}>Unlock All Features</Text>
                    <Text style={styles.premiumStatusSubtext}>
                        Send unlimited likes, see who likes you, and get verified with our premium plans.
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('PremiumPlans')}
                        style={styles.viewPlansBtn}
                    >
                        <Text style={styles.viewPlansText}>View All Plans</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionCard}>
                    <TouchableOpacity style={styles.menuRow}>
                        <Text style={styles.menuText}>Restore Purchase</Text>
                        <Ionicons name="refresh-outline" size={20} color="#ccc" />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.menuRow}>
                        <Text style={styles.menuText}>Redeem Code</Text>
                        <Ionicons name="card-outline" size={20} color="#ccc" />
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
    premiumStatusCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconCircle: { alignItems: "center", justifyContent: "center" },
    premiumStatusTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 8 },
    premiumStatusSubtext: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20, marginBottom: 24 },
    viewPlansBtn: {
        backgroundColor: "#FF5F6D",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
        shadowColor: "#FF5F6D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    viewPlansText: { color: "#fff", fontSize: 16, fontWeight: "700" },
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
    menuRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
    menuText: { fontSize: 15, color: "#333", fontWeight: "500" },
    separator: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 4 },
});
