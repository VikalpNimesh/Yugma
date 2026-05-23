import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    DeviceEventEmitter,
} from "react-native";

import MatchList from "./MatchList";
import LikeList from "./LikeList";
import Icon from "react-native-vector-icons/Ionicons";
import socialService, { SocialUserItem } from "../../api/services/socialService";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useSocket } from "../../context/SocketContext";
import messaging from '@react-native-firebase/messaging';

const MatchesScreen = () => {
    const route = useRoute<any>();
    const initialTab = route.params?.initialTab || "Matches";
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const [matches, setMatches] = useState<SocialUserItem[]>([]);
    console.log('matches', matches);
    const [likes, setLikes] = useState<SocialUserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { socket } = useSocket();

    // Dynamically update the selected tab if deep routing param changes
    useEffect(() => {
        if (route.params?.initialTab) {
            setSelectedTab(route.params.initialTab);
        }
    }, [route.params?.initialTab]);

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

    // Refetch data when screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    // Refetch data when a real-time socket event is received
    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data: any) => {
            console.log("[MatchesScreen] Received new_notification, refetching...", data);
            loadData();
        };

        socket.on('new_notification', handleNotification);

        return () => {
            socket.off('new_notification', handleNotification);
        };
    }, [socket]);

    // Refetch data when a foreground FCM push notification is received
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage.data?.type === 'like' || remoteMessage.data?.type === 'match') {
                console.log("[MatchesScreen] Received FCM message, refetching...");
                loadData();
            }
        });
        return unsubscribe;
    }, []);

    // Refetch data when a global notification event is received (via FCM or Socket broadcast)
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('notification_received', (event) => {
            console.log("[MatchesScreen] Received global notification event, refetching matches & likes...", event);
            loadData();
        });
        return () => {
            subscription.remove();
        };
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
                            color={selectedTab === tab ? "#FF3366" : "#8E8E93"}
                        /> : <Icon
                            name={"star-outline"}
                            size={20}
                            color={selectedTab === tab ? "#FF3366" : "#8E8E93"}
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
        backgroundColor: "#FFF5F6",
        borderRadius: 24,
        marginBottom: 24,
        padding: 5,
        borderWidth: 1,
        borderColor: "rgba(255, 95, 109, 0.12)",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    activeTab: {
        backgroundColor: "#ffffff",
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    tabText: {
        color: "#8E8E93",
        fontWeight: "600",
        fontSize: 14,
    },
    activeTabText: {
        color: "#FF3366",
        fontWeight: "700",
        fontSize: 14,
    },

});
