import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface Feature {
    text: string;
    icon: string;
    fade?: boolean;
    info?: boolean;
}

interface Pricing {
    duration: string;
    price: string;
    perWeek?: string | null;
    save?: string;
    total?: string;
}

interface Plan {
    color: string;
    features: Feature[];
    btnText: string;
}

const premiumPlans: Record<string, Plan> = {
    Plus: {
        color: "#533A7B",
        features: [
            { text: "Send unlimited likes", icon: "infinite" },
            { text: "Send the first message", icon: "chatbubble-ellipses-outline" },
            { text: "Send 5 comments daily", icon: "lock-closed-outline", fade: true },
            { text: "Set more preferences", icon: "options-outline", info: true },
            { text: "Explore 2x profiles in 'For You'", icon: "lock-closed-outline", fade: true },
            { text: "Recheck up to 25 passed profiles", icon: "lock-closed-outline", fade: true },
            { text: "See who likes you", icon: "lock-closed-outline", fade: true },
            { text: "Browse in Private Mode", icon: "lock-closed-outline", fade: true },
            { text: "See all curated profiles at once", icon: "lock-closed-outline", fade: true },
        ],
        btnText: "Upgrade Now"
    },
    Premium: {
        color: "#993366",
        features: [
            { text: "Send unlimited likes", icon: "infinite" },
            { text: "Send the first message", icon: "chatbubble-ellipses-outline" },
            { text: "Send 5 comments daily", icon: "chatbox-outline" },
            { text: "Set more preferences", icon: "options-outline", info: true },
            { text: "Explore 2x profiles in 'For You'", icon: "star-outline", info: true },
            { text: "Recheck up to 25 passed profiles", icon: "refresh-outline", info: true },
            { text: "See who likes you", icon: "heart-outline" },
            { text: "Browse in Private Mode", icon: "eye-off-outline", info: true },
            { text: "See all curated profiles at once", icon: "lock-closed-outline", fade: true },
        ],
        btnText: "Upgrade Now"
    },
    Concierge: {
        color: "#D4AF37",
        features: [
            { text: "Send unlimited likes and comments", icon: "infinite" },
            { text: "Send the first message", icon: "chatbubble-ellipses-outline" },
            { text: "Boost your comments to the top", icon: "trending-up-outline" },
            { text: "Set more preferences", icon: "options-outline", info: true },
            { text: "Explore 2x profiles in 'For You'", icon: "star-outline", info: true },
            { text: "Recheck up to 25 passed profiles", icon: "refresh-outline", info: true },
            { text: "See who likes you", icon: "heart-outline" },
            { text: "Browse in Private Mode", icon: "eye-off-outline", info: true },
            { text: "See all curated profiles at once", icon: "people-outline", info: true },
        ],
        btnText: "Upgrade Now"
    }
};

const pricingData: Record<string, any[]> = {
    dating: [
        { duration: "1 month", price: "₹ 199.00" },
        { duration: "3 months", price: "₹ 599.00", save: "10%" },
        { duration: "6 months", price: "₹ 999.00", save: "15%" },
        { duration: "12 months", price: "₹ 1,499.00", save: "37%" },
    ],
    matrimonial: [
        { duration: "1 month", price: "₹ 999.00" },
        { duration: "3 months", price: "₹ 1,999.00", save: "33%" },
        { duration: "6 months", price: "₹ 4,999.00", save: "16%" },
        { duration: "12 months", price: "₹ 7,999.00", save: "33%" },
    ]
};

const PremiumPlansScreen = () => {
    const navigation = useNavigation();
    const appType = useSelector((state: RootState) => state.user.appType) || 'dating';
    const [selectedPlan, setSelectedPlan] = useState<"Plus" | "Premium" | "Concierge">("Premium");
    const [selectedDuration, setSelectedDuration] = useState("1 month");

    const plan = premiumPlans[selectedPlan];
    const currentPricing = pricingData[appType] || pricingData.dating;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium Plans</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.planSelector}>
                    {(Object.keys(premiumPlans) as Array<keyof typeof premiumPlans>).map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedPlan(type as "Plus" | "Premium" | "Concierge")}
                            style={[
                                styles.planTypeBtn,
                                selectedPlan === type && { 
                                    backgroundColor: premiumPlans[type].color 
                                }
                            ]}
                        >
                            <Text style={[styles.planTypeText, selectedPlan === type && { color: "#fff" }]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.planTitle}>Unlock new possibilities</Text>

                <View style={styles.featureCard}>
                    {plan.features.map((feature, index) => (
                        <View key={index} style={[styles.featureRow, feature.fade && { opacity: 0.4 }]}>
                            <View style={[styles.iconCircle, { backgroundColor: plan.color }]}>
                                <Ionicons name={feature.icon as any} size={16} color="#fff" />
                            </View>
                            <Text style={styles.featureText}>{feature.text}</Text>
                            {feature.info && <Ionicons name="information-circle-outline" size={16} color="#999" style={{ marginLeft: "auto" }} />}
                        </View>
                    ))}
                </View>

                <View style={styles.pricingRow}>
                    {currentPricing.map((price, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedDuration(price.duration)}
                            style={[
                                styles.priceCard,
                                selectedDuration === price.duration && { borderColor: plan.color, borderWidth: 2 }
                            ]}
                        >
                            {price.save && (
                                <View style={[styles.saveBadge, { borderColor: plan.color }]}>
                                    <Text style={[styles.priceSaveText, { color: plan.color }]}>Save {price.save}</Text>
                                </View>
                            )}
                            <Text style={styles.durationText}>{price.duration}</Text>
                            <Text style={styles.priceText}>{price.price}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: plan.color }]}>
                    <Text style={styles.actionBtnText}>
                        Upgrade {selectedPlan} ({appType === 'dating' ? 'Dating' : 'Matrimonial'})
                    </Text>
                </TouchableOpacity>

                <Text style={styles.tncText}>
                    The subscription can be cancelled anytime and renews for the same package length.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    planSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f0f0f0",
        borderRadius: 25,
        padding: 4,
        marginBottom: 20
    },
    planTypeBtn: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 20,
    },
    planTypeText: { 
        fontSize: 14, 
        fontWeight: "600", 
        color: "#555" 
    },
    planTitle: { 
        fontSize: 20, 
        fontWeight: "700", 
        color: "#333", 
        marginBottom: 16, 
        textAlign: "center" 
    },
    featureCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    featureText: { 
        fontSize: 15, 
        color: "#333", 
        flex: 1,
        lineHeight: 20
    },
    pricingRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20
    },
    priceCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        position: "relative",
        marginBottom: 10
    },
    saveBadge: {
        position: "absolute",
        top: -10,
        backgroundColor: "#fff",
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    },
    priceSaveText: { 
        fontSize: 10, 
        fontWeight: "700" 
    },
    durationText: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginTop: 4, 
        color: "#000" 
    },
    priceText: { 
        fontSize: 14, 
        color: "#666", 
        marginTop: 4 
    },
    actionBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionBtnText: { 
        color: "#fff", 
        fontSize: 18, 
        fontWeight: "700" 
    },
    tncText: { 
        fontSize: 12, 
        color: "#999", 
        textAlign: "center", 
        paddingHorizontal: 20,
        lineHeight: 18
    },
});

export default PremiumPlansScreen;
