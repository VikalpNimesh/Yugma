import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    DeviceEventEmitter,
} from "react-native";

import MatchList from "./MatchList";
import LikeList from "./LikeList";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import socialService, { SocialUserItem } from "../../api/services/socialService";
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
            <LinearGradient
                colors={["#22020B", "#3E0616", "#630D25", "#801231"]}
                style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.header}>Matches</Text>
            <Text style={styles.subHeader}>
                People who matched with your profile
            </Text>

            <View style={styles.tabContainer}>
                {["All Matches", "Liked You"]?.map((tab) => {
                    const isTabSelected = (tab === "All Matches" && selectedTab === "Matches") || (tab === "Liked You" && selectedTab === "Likes");
                    return (
                        <Pressable
                            key={tab}
                            style={[
                                styles.tab,
                                isTabSelected && styles.activeTab,
                            ]}
                            onPress={() => setSelectedTab(tab === "All Matches" ? "Matches" : "Likes")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isTabSelected && styles.activeTabText,
                                ]}
                            >
                                {tab} {tab === "All Matches" ? `(${matches.length})` : `(${likes.length})`}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF3366" />
                </View>
            ) : selectedTab === "Matches" ? (
                <MatchList data={transformedMatches} onRefresh={loadData} />
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
        backgroundColor: "#200208",
        paddingHorizontal: 18,
        paddingTop: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: -0.4,
    },
    subHeader: {
        fontSize: 14,
        color: "#F3D7E0",
        marginTop: 4,
        marginBottom: 18,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 24,
        marginBottom: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.14)",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: "#FF3366",
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
    },
    tabText: {
        color: "#B08092",
        fontWeight: "600",
        fontSize: 14,
    },
    activeTabText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
