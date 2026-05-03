import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/common/Avatar';
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Ionicons";
import socialService from '../../api/services/socialService';
import Toast from 'react-native-toast-message';


const LikeList = ({ data, onRefresh }: any) => {
    const handleRespond = async (requesterId: string, action: 'accepted' | 'rejected') => {
        try {
            await socialService.respondToFriendRequest(requesterId, action);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Request ${action} successfully`,
            });
            if (onRefresh) onRefresh();
        } catch (error: any) {
            console.error(`Error responding to request:`, error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Failed to ${action} request`,
            });
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Avatar uri={item.image} name={item.name} size={60} style={styles.avatar} />
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

                <View style={styles.footer}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-clear-outline" size={14} color="#999" />
                        <Text style={styles.matchDate}>Liked {item.matchedDays}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => handleRespond(item.id, 'rejected')}
                            activeOpacity={0.7}
                        >
                            <Icon name="close" size={18} color="#ff3b30" />
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.acceptBtn]}
                            onPress={() => handleRespond(item.id, 'accepted')}
                            activeOpacity={0.7}
                        >
                            <Icon name="checkmark" size={18} color="white" />
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="heart-outline" size={40} color="#DD2476" />
            </View>
            <Text style={styles.emptyTitle}>No Likes Yet</Text>
            <Text style={styles.emptySubText}>
                When people like your profile, they'll appear here. Keep your profile updated to get more interest!
            </Text>
        </View>
    );
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={data.length > 0 ? () => (
                    <View style={styles.headerCon}>
                        <Text style={styles.header}>People who liked you</Text>
                        <Text style={styles.subHeader}>
                            These people have shown interest in your profile. Like them back to create a match!
                        </Text>
                    </View>
                ) : null}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{ paddingBottom: 40 }, data.length === 0 && { flex: 1, justifyContent: 'center' }]}
            />
        </View>
    )
}

export default LikeList

const styles = StyleSheet.create({
    headerCon: {
        backgroundColor: "#FFF6EE",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16
    },
    header: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 4
    },
    subHeader: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24
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
        marginLeft: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
        backgroundColor: "white",
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 14,
        gap: 6,
        borderWidth: 1,
        borderColor: "#dadada"
    },
    messageText: {
        color: "black",
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        flexWrap: 'wrap',
        gap: 8,
    },
    percent: {
        borderWidth: 1,
        borderColor: "#dadada",
        padding: 6,
        borderRadius: 8,
        paddingHorizontal: 10
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        gap: 4,
        borderWidth: 1,
        minWidth: 90,
        justifyContent: 'center',
    },
    acceptBtn: {
        backgroundColor: '#DD2476',
        borderColor: '#DD2476',
    },
    rejectBtn: {
        backgroundColor: 'white',
        borderColor: '#ff3b30',
    },
    acceptText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },
    rejectText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 13,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 100, // Offset for the tab bar/header
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF0F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    }
})