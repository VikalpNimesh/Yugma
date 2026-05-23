import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/common/Avatar';
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import socialService from '../../api/services/socialService';
import Toast from 'react-native-toast-message';

const LikeList = ({ data, onRefresh }: any) => {
    const handleRespond = async (requesterId: string, action: 'accepted' | 'rejected') => {
        try {
            if (action === 'accepted') {
                await socialService.likeUser(requesterId);
            } else {
                await socialService.passUser(requesterId);
            }
            Toast.show({
                type: 'success',
                text1: action === 'accepted' ? 'Matched! 🎉' : 'Passed Successfully',
                text2: action === 'accepted' ? 'You created a new connection!' : 'User was successfully skipped.',
            });
            if (onRefresh) onRefresh();
        } catch (error: any) {
            console.error(`Error responding to request:`, error);
            Toast.show({
                type: 'error',
                text1: 'Response Failed',
                text2: `Failed to ${action === 'accepted' ? 'accept match' : 'pass user'}.`,
            });
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Avatar uri={item.image} name={item.name} size={64} style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {item.name}, {item.age || 'N/A'}
                </Text>
                <View style={styles.percentPill}>
                    <Ionicons name="heart" size={12} color="#FF3366" />
                    <Text style={styles.matchText}>{item.matchPercent || '90%'} match</Text>
                </View>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.circleRejectBtn}
                    onPress={() => handleRespond(item.id, 'rejected')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close" size={20} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.circleAcceptBtn}
                    onPress={() => handleRespond(item.id, 'accepted')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={["#FF5F6D", "#FF3366"]}
                        style={styles.gradientCircle}
                    >
                        <Ionicons name="heart" size={20} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="heart-outline" size={44} color="#FF3366" />
            </View>
            <Text style={styles.emptyTitle}>No Likes Yet</Text>
            <Text style={styles.emptySubText}>
                When people like your profile, they will appear here. Keep swiping and matching to discover new partners!
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <FlatList
                ListHeaderComponent={data.length > 0 ? () => (
                    <View style={styles.headerCon}>
                        <Text style={styles.header}>People who liked you</Text>
                        <Text style={styles.subHeader}>
                            These matches have shown interest in your profile. Match back to start chatting instantly!
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
    );
};

export default LikeList;

const styles = StyleSheet.create({
    headerCon: {
        backgroundColor: "rgba(255, 95, 109, 0.08)",
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 95, 109, 0.15)",
    },
    header: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FF3366",
        marginBottom: 6,
    },
    subHeader: {
        fontSize: 14,
        color: "#555555",
        lineHeight: 20,
        fontWeight: "500",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.04)",
        marginHorizontal: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 14,
        borderWidth: 2,
        borderColor: "#FF3366",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 17,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 6,
    },
    percentPill: {
        backgroundColor: "rgba(255, 51, 102, 0.08)",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    matchText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#FF3366",
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginLeft: 10,
    },
    circleRejectBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
    },
    circleAcceptBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    gradientCircle: {
        width: "100%",
        height: "100%",
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 80,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(255, 95, 109, 0.1)",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: "500",
    }
});