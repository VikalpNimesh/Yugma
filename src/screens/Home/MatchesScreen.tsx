import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import MatchList from "./MatchList";
import LikeList from "./LikeList";
import Icon from "react-native-vector-icons/Ionicons";
import socialService, { SocialUserItem } from "../../api/services/socialService";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

const MatchesScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Matches");
    const [matches, setMatches] = useState<SocialUserItem[]>([]);
    console.log('matches', matches);
    const [likes, setLikes] = useState<SocialUserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMatches = async () => {
        try {
            const data = await socialService.getMatches();
            setMatches(data || []);
        } catch (error: any) {
            console.error("Error fetching matches:", error);
        }
    };

    const fetchLikes = async () => {
        try {
            const data = await socialService.getLikesReceived();
            setLikes(data || []);
        } catch (error: any) {
            console.error("Error fetching likes:", error);
        }
    };

    const loadData = async () => {
        setIsLoading(true);
        await Promise.all([fetchMatches(), fetchLikes()]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Transform SocialUserItem to MatchList format
    const transformedMatches = matches.map(m => ({
        id: m.id,
        name: m.fullName || 'User',
        age: 'N/A',
        location: 'Hidden',
        job: 'N/A',
        matchedDays: dayjs(m.matchedSince).fromNow(),
        verified: true,
        matchPercent: "100%",
        image: m.profilePhoto,
    }));

    const transformedLikes = likes.map(l => ({
        id: l.id,
        name: l.fullName || 'User',
        age: 'N/A',
        location: 'Hidden',
        job: 'N/A',
        matchedDays: dayjs(l.likedAt).fromNow(),
        verified: false,
        matchPercent: "95%",
        image: l.profilePhoto,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Connections</Text>
            <Text style={styles.subHeader}>
                Connect with your matches and start chatting
            </Text>

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
                        {tab === "Matches" ? <Icon
                            name={"people-outline"}
                            size={20}
                            color={"black"}
                        /> : <Icon
                            name={"star-outline"}
                            size={20}
                            color={"black"}
                        />}

                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab} {tab === "Matches" ? `(${matches.length})` : `(${likes.length})`}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF5F6D" />
                </View>
            ) : selectedTab === "Matches" ? (
                <MatchList data={transformedMatches} />
            ) : (
                <LikeList data={transformedLikes} onRefresh={loadData} />
            )}
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
        fontSize: 16,
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
        flexDirection: "row",
        justifyContent: "center",
        gap: 6
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

});
