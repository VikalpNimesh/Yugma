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
import socialService, { FriendItem } from "../../api/services/socialService";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

const MatchesScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Friends");
    const [friends, setFriends] = useState<FriendItem[]>([]);
    const [likes, setLikes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFriends = async () => {
        try {
            const data = await socialService.getFriends();
            setFriends(data || []);
        } catch (error: any) {
            console.error("Error fetching friends:", error);
        }
    };

    const fetchLikes = async () => {
        try {
            const data = await socialService.getIncomingRequests();
            setLikes(data || []);
        } catch (error: any) {
            console.error("Error fetching likes:", error);
        }
    };

    const loadData = async () => {
        setIsLoading(true);
        await Promise.all([fetchFriends(), fetchLikes()]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Transform FriendItem to MatchList format
    const transformedFriends = friends.map(f => ({
        id: f.id,
        name: f.fullName || 'User',
        age: 'N/A',
        location: 'Hidden',
        job: 'N/A',
        matchedDays: dayjs(f.friendsSince).fromNow(),
        verified: true,
        matchPercent: "100%",
        image: f.profilePhoto,
    }));

    const transformedLikes = likes.map(l => ({
        id: l.id,
        name: l.fullName || 'User',
        age: 'N/A',
        location: 'Hidden',
        job: 'N/A',
        matchedDays: dayjs(l.requestedAt).fromNow(),
        verified: false,
        matchPercent: "95%",
        image: l.profilePhoto,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Connections</Text>
            <Text style={styles.subHeader}>
                Connect with your friends and start chatting
            </Text>

            <View style={styles.tabContainer}>
                {["Friends", "Likes"]?.map((tab) => (
                    <Pressable
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        {tab === "Friends" ? <Icon
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
                            {tab} {tab === "Friends" ? `(${friends.length})` : `(${likes.length})`}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#DD2476" />
                </View>
            ) : selectedTab === "Friends" ? (
                <MatchList data={transformedFriends} />
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
