import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const DiscoverScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>
                    ❤️ <Text style={{ color: "#E64A8B" }}>Vivah</Text>Setu
                </Text>

                {/* Segmented Buttons */}
                <View style={styles.segmentContainer}>
                    <TouchableOpacity style={[styles.segmentButton, styles.activeSegment]}>
                        <Text style={styles.segmentActiveText}>Matrimonial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.segmentButton}>
                        <Ionicons name="heart-outline" size={14} color="#000" />
                        <Text style={styles.segmentText}>Dating</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.segmentButton}>
                        <Ionicons name="crown-outline" size={14} color="#000" />
                        <Text style={styles.segmentText}>Premium</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Discover Title + Filters */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Discover Partners</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter-outline" size={18} color="#000" />
                    <Text style={styles.filterText}>Filters</Text>
                </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.card}>
                <View>
                    <Image
                        source={{
                            uri: "https://i.ibb.co/4tYcx7W/sample-lady.jpg",
                        }}
                        style={styles.profileImage}
                    />

                    {/* Verified Badge */}
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>

                    {/* Premium Badge */}
                    <View style={styles.premiumBadge}>
                        <Ionicons name="star" color="#fff" size={12} />
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>Priya Sharma, 26</Text>
                    <View style={styles.row}>
                        <Ionicons name="location-outline" size={16} color="#555" />
                        <Text style={styles.text}>Mumbai, Maharashtra</Text>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="briefcase-outline" size={16} color="#555" />
                        <Text style={styles.text}>Software Engineer</Text>
                    </View>
                    <View style={styles.row}>
                        <Ionicons name="school-outline" size={16} color="#555" />
                        <Text style={styles.text}>Master's in Computer Science</Text>
                    </View>

                    <View style={styles.familyBox}>
                        <Text style={styles.familyTitle}>Family Details</Text>
                        <Text style={styles.familyText}>Father: Business Owner</Text>
                        <Text style={styles.familyText}>Mother: Teacher</Text>
                        <Text style={styles.familyText}>Siblings: 1 sister</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.passButton}>
                    <Ionicons name="close" size={28} color="#E64A8B" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <LinearGradient
                        colors={["#FF512F", "#DD2476"]}
                        style={styles.likeButton}
                    >
                        <Ionicons name="heart" size={28} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <Text style={styles.swipeText}>
                Swipe right to like • Swipe left to pass
            </Text>

            {/* Bottom Tabs */}
            <View style={styles.bottomTabs}>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="heart" size={22} color="#000" />
                    <Text style={styles.activeTabText}>Discover</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="people-outline" size={22} color="#777" />
                    <Text style={styles.tabText}>Matches</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="chatbubble-outline" size={22} color="#777" />
                    <Text style={styles.tabText}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="settings-outline" size={22} color="#777" />
                    <Text style={styles.tabText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF9F6", paddingHorizontal: 16 },
    header: { marginTop: 10 },
    logo: { fontSize: 20, fontWeight: "700" },
    segmentContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        marginTop: 12,
        alignSelf: "flex-start",
    },
    segmentButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    activeSegment: {
        backgroundColor: "#FFE5EC",
        borderRadius: 25,
    },
    segmentActiveText: { color: "#E64A8B", fontWeight: "600", fontSize: 13 },
    segmentText: { marginLeft: 4, color: "#000", fontSize: 13 },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },
    title: { fontSize: 20, fontWeight: "700" },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6",
    },
    filterText: { marginLeft: 4, color: "#000", fontWeight: "500" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginTop: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 2,
    },
    profileImage: {
        width: "100%",
        height: 250,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    verifiedBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#00C851",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    verifiedText: { color: "#fff", fontSize: 12, fontWeight: "600" },
    premiumBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E89C1E",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    premiumText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 3,
    },
    details: { padding: 14 },
    name: { fontSize: 18, fontWeight: "700", color: "#000" },
    row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    text: { marginLeft: 6, color: "#555", fontSize: 14 },
    familyBox: {
        backgroundColor: "#FFF4EB",
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    familyTitle: { fontWeight: "700", color: "#000", marginBottom: 4 },
    familyText: { color: "#555", fontSize: 14 },
    actions: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
        gap: 30,
    },
    passButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#E64A8B",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    likeButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    swipeText: {
        textAlign: "center",
        marginTop: 10,
        color: "#555",
        fontSize: 13,
    },
    bottomTabs: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#E6E6E6",
        paddingVertical: 10,
        marginTop: 20,
    },
    tab: { alignItems: "center" },
    tabText: { fontSize: 12, color: "#777", marginTop: 4 },
    activeTabText: { fontSize: 12, color: "#000", marginTop: 4, fontWeight: "600" },
});
