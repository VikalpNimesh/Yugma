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
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { handleLogout } from "../../api/firebase/auth";
import { useNavigation } from "@react-navigation/native";

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
                {activeTab === "Premium" && <PremiumTab />}
                {activeTab === "Verification" && <Placeholder title="Verification" />}
            </ScrollView>
        </View>
    );
}

function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const user = useSelector((state: any) => state.user);
    const mode = user.appType || "Matrimonial";

    const setMode = (newMode: "Matrimonial" | "Dating") => {
        dispatch(updateUser({ appType: newMode }));
    };
    const handleLogoutPress = async () => {
        try {
            await handleLogout(navigation, dispatch);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    const { email, name, photo } = useSelector((state: any) => state.user?.user || {});


    return (
        <View>
            <Text style={styles.header}>Profile Information</Text>

            {!isEditing ? (
                <View style={styles.profileCard}>
                    <Image source={{
                        uri: photo
                    }} style={{ width: 100, height: 100, marginTop: 20, borderRadius: 50 }} />

                    <Text style={styles.text}>{name}</Text>
                    <Text style={styles.verified}> {email}</Text>

                    <TouchableOpacity onPress={handleLogoutPress} style={styles.editBtn}>
                        <Text style={styles.editText}>Log Out</Text>
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



// Premium Feature Data
const premiumPlans = {
    Plus: {
        color: "#533A7B", // Deep Purple
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
        pricing: [
            { duration: "1 week", price: "₹ 249.00", perWeek: null },
            { duration: "1 month", price: "₹ 116.43/wk", perWeek: null, save: "50%", total: "499.00" },
            { duration: "3 months", price: "₹ 77.70/wk", perWeek: null, save: "67%" },
            { duration: "6 months", price: "₹ 66.07/wk", perWeek: null, save: "72%" },
        ],
        btnText: "Get 1 month for ₹ 499.00"
    },
    Premium: {
        color: "#993366", // Wine
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
        pricing: [
            { duration: "1 week", price: "₹ 399.00", perWeek: null },
            { duration: "1 month", price: "₹ 186.43/wk", perWeek: null, save: "50%", total: "799.00" },
            { duration: "3 months", price: "₹ 112.70/wk", perWeek: null, save: "70%" },
            { duration: "6 months", price: "₹ 85.52/wk", perWeek: null, save: "77%" },
        ],
        btnText: "Get 1 month for ₹ 799.00"
    },
    Concierge: {
        color: "#D4AF37", // Gold
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
        pricing: [
            { duration: "1 week", price: "₹ 649.00", perWeek: null },
            { duration: "1 month", price: "₹ 349.77/wk", perWeek: null, save: "42%", total: "1,499.00" },
            { duration: "3 months", price: "₹ 174.92/wk", perWeek: null, save: "71%" },
            { duration: "6 months", price: "₹ 128.29/wk", perWeek: null, save: "79%" },
        ],
        btnText: "Get 1 month for ₹ 1,499.00"
    }
};

function PremiumTab() {
    const [selectedPlan, setSelectedPlan] = useState<"Plus" | "Premium" | "Concierge">("Premium");
    const [selectedDuration, setSelectedDuration] = useState("1 month");

    const plan = premiumPlans[selectedPlan];

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Plan Selector */}
            <View style={styles.planSelector}>
                {(Object.keys(premiumPlans) as Array<keyof typeof premiumPlans>).map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setSelectedPlan(type)}
                        style={[
                            styles.planTypeBtn,
                            selectedPlan === type && { backgroundColor: selectedPlan === "Concierge" ? "#D4AF37" : selectedPlan === "Premium" ? "#993366" : "#533A7B" }
                        ]}
                    >
                        <Text style={[styles.planTypeText, selectedPlan === type && { color: "#fff" }]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.planTitle}>Unlock new possibilities</Text>

            {/* Feature List */}
            <View style={styles.featureCard}>
                {plan.features.map((feature, index) => (
                    <View key={index} style={[styles.featureRow, feature.fade && { opacity: 0.4 }]}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={feature.icon as any} size={16} color="#fff" />
                        </View>
                        <Text style={styles.featureText}>{feature.text}</Text>
                        {feature.info && <Ionicons name="information-circle-outline" size={16} color="#999" style={{ marginLeft: "auto" }} />}
                    </View>
                ))}
            </View>

            {/* Pricing Options */}
            <View style={styles.pricingRow}>
                {plan.pricing.map((price, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedDuration(price.duration)}
                        style={[
                            styles.priceCard,
                            selectedDuration === price.duration && { borderColor: plan.color, borderWidth: 2 }
                        ]}
                    >
                        {price.save && <View style={styles.saveBadge}><Text style={styles.saveText}>Save {price.save}</Text></View>}
                        <Text style={styles.durationText}>{price.duration}</Text>
                        <Text style={styles.priceText}>{price.price}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Action Button */}
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#000" }]}>
                <Text style={styles.actionBtnText}>{plan.btnText}</Text>
            </TouchableOpacity>

            <Text style={styles.tncText}>
                The subscription can be cancelled anytime and renews for the same package length.
            </Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    sidebar: {
        width: 100,
        backgroundColor: "#f9f9f9",
        paddingVertical: 20,
        alignItems: "center"
    },
    tabItem: {
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#fff",
        borderLeftWidth: 3,
        borderLeftColor: "#DD2476",
    },
    tabText: { color: "#666", fontSize: 12, marginTop: 4 },
    activeTabText: { color: "#DD2476", fontWeight: "600" },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    header: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#222" },

    // Profile Styles...
    profileCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee"
    },
    text: { fontSize: 18, fontWeight: "600", color: "#333", marginTop: 8 },
    verified: { color: "green", fontSize: 12, marginTop: 4 },
    editBtn: {
        marginTop: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    editText: { color: "#333", fontSize: 12, fontWeight: "500" },

    // Edit Styles
    editCard: { padding: 10 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10 },
    textArea: { height: 80 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    cancelBtn: { padding: 10 },
    cancelText: { color: "#999" },
    saveBtn: { backgroundColor: "#DD2476", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    saveText: { color: "#fff" },

    // Premium Styles
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
        paddingVertical: 8,
        borderRadius: 20,
    },
    planTypeText: { fontSize: 13, fontWeight: "600", color: "#555" },
    planTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 16, textAlign: "center" },
    featureCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    featureText: { fontSize: 14, color: "#333", flex: 1 },

    pricingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 20
    },
    priceCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
        position: "relative"
    },
    saveBadge: {
        position: "absolute",
        top: -10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    saveText: { fontSize: 10, fontWeight: "700" },
    durationText: { fontSize: 14, fontWeight: "bold", marginTop: 4, color: "#000" },
    priceText: { fontSize: 12, color: "#666", marginTop: 2 },

    actionBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12
    },
    actionBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    tncText: { fontSize: 11, color: "#999", textAlign: "center", paddingHorizontal: 20 },

    placeholder: { alignItems: "center", justifyContent: "center", height: 200 },
    placeholderText: { color: "#999" }
});
