import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";


const matchesData = [
    {
        id: "1",
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        job: "Software Engineer",
        matchedDays: "2 days ago",
        verified: true,
        matchPercent: "94%",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "2",
        name: "Arjun Patel",
        age: 29,
        location: "Bangalore, Karnataka",
        job: "Product Manager",
        matchedDays: "1 week ago",
        verified: true,
        matchPercent: "87%",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
];

const MatchesScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Matches");

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.avatar} />

            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.matchBadge}>
                    <Text style={styles.name}>
                        {item.name}, {item.age}
                    </Text>
                    <View style={styles.percent}>

                        <Text style={styles.matchText}>{item.matchPercent} match</Text>
                    </View>
                </View>

                <Text style={styles.subText}><Ionicons name="location-outline" size={12} /> {item.location}</Text>
                <Text style={styles.subText}>{item.job}</Text>
                <View style={styles.dateMsg}>

                    <Text style={styles.matchDate}><Ionicons name="calendar-clear-outline" size={12} /> Matched {item.matchedDays}</Text>
                    <Pressable style={styles.messageBtn}>
                        <Feather name="message-circle" size={24} color={"white"} />
                        <Text style={styles.messageText}>
                            {item.verified ? "Message" : "Reply"}
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.verifyBtn}>
                    <Octicons name="shield-check" size={18} color={"black"} />
                    <Text style={styles.verifyBtnText}> Request Verification</Text>
                </Pressable>
                {item.verified && (
                    <View style={styles.verifiedTag}>
                        <Text style={styles.verifiedText}>Verified Profile</Text>
                    </View>
                )}

            </View>

        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Matches</Text>
            <Text style={styles.subHeader}>
                Connect with compatible partners who share your values
            </Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["Matches", "Likes"]?.map((tab) => (
                    <Pressable
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab} {tab === "Matches" ? "(3)" : "(2)"}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <FlatList
                data={matchesData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
};

export default MatchesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    subHeader: {
        fontSize: 14,
        color: "#666",
        marginVertical: 10,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        marginBottom: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: "#fff",
        elevation: 2,
    },
    tabText: {
        color: "#666",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#000",
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#dadada"
    },
    row: {
        flexDirection: "row",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },
    subText: {
        color: "#555",
        fontSize: 13,
        marginTop: 2,
    },
    matchDate: {
        color: "#999",
        fontSize: 12,
        marginTop: 2,
    },
    verifiedTag: {
        backgroundColor: "#d8f5dc",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 6,
        alignSelf: "flex-start",
    },
    verifiedText: {
        color: "#177245",
        fontWeight: "600",
        fontSize: 12,
    },
    verifyBtn: {
        borderWidth: 1,
        borderColor: "#ffb700",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        margin: 6,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 6

    },
    verifyBtnText: {
        color: "black",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",

    },
    matchBadge: {
        // backgroundColor: "#f5f5f5",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    matchText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    messageBtn: {
        backgroundColor: "black",
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 14,
        gap: 6
    },
    messageText: {
        color: "#fff",
        fontWeight: "600",
    },
    dateMsg: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"

    },
    percent: {
        borderWidth: 1,
        borderColor: "#dadada",
        padding: 6,
        borderRadius: 8,
        paddingHorizontal: 10
    }
});
