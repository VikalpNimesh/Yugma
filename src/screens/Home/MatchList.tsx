import { FlatList, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import Avatar from '../../components/common/Avatar';
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import socialService from '../../api/services/socialService';
import Toast from 'react-native-toast-message';

interface MatchListProps {
    data: any[];
    onRefresh?: () => void;
}

const MatchList = ({ data, onRefresh }: MatchListProps) => {
    const navigation = useNavigation<any>();

    const handleMessagePress = (item: any) => {
        navigation.navigate('ChatScreen', {
            userId: item.id,
            name: item.name,
            avatar: item.image,
        });
    };

    const handleLongPress = (item: any) => {
        Alert.alert(
            "Delete Connection",
            `Are you sure you want to delete your match and chat with ${item.name}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await socialService.unmatch(item.id);
                            Toast.show({
                                type: 'success',
                                text1: 'Connection Deleted',
                                text2: `Your connection and chat with ${item.name} has been deleted.`,
                            });
                            if (onRefresh) {
                                onRefresh();
                            }
                        } catch (error) {
                            console.error("Error deleting connection:", error);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Failed to delete connection. Please try again.',
                            });
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleMessagePress(item)}
            onLongPress={() => handleLongPress(item)}
        >
            <View style={styles.avatarWrapper}>
                <Avatar uri={item.image} name={item.name} size={64} style={styles.avatar} />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}{item.age && item.age !== 'N/A' ? `, ${item.age}` : ''}
                    </Text>
                    <View style={styles.matchedBadge}>
                        <Ionicons name="heart" size={10} color="#FF3366" />
                        <Text style={styles.matchedText}>Matched</Text>
                    </View>
                </View>
                <Text style={styles.matchedDate}>
                    Connected {item.matchedDays || 'recently'}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.messageBtnWrapper}
                onPress={() => handleMessagePress(item)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={["#FF5F6D", "#FF3366"]}
                    style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
                />
                <View style={styles.messageBtnInner}>
                    <Feather name="message-circle" size={16} color="white" />
                    <Text style={styles.messageText}>Chat</Text>
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="people-outline" size={44} color="#FF3366" />
            </View>
            <Text style={styles.emptyTitle}>No Connections Yet</Text>
            <Text style={styles.emptySubText}>
                Your matches will appear here. Start swiping in Discover to find your perfect partner!
            </Text>
            <TouchableOpacity
                style={styles.discoverBtnWrapper}
                onPress={() => navigation.navigate('Discover')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={["#FF5F6D", "#FF3366"]}
                    style={[StyleSheet.absoluteFill, { borderRadius: 25 }]}
                />
                <View style={styles.discoverBtnInner}>
                    <Text style={styles.discoverBtnText}>Go to Discover</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{ paddingBottom: 40, paddingTop: 10 }, data.length === 0 && { flex: 1, justifyContent: 'center' }]}
            />
        </View>
    )
}

export default MatchList

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        marginHorizontal: 2,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
        borderWidth: 2,
        borderColor: "#FF3366",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
        paddingRight: 8,
        flexShrink: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    name: {
        fontSize: 17,
        fontWeight: "800",
        color: "#FFFFFF",
        flexShrink: 1,
    },
    matchedBadge: {
        backgroundColor: "rgba(255, 51, 102, 0.08)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    matchedText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#FF3366",
    },
    matchedDate: {
        color: "#8E8E93",
        fontSize: 13,
        fontWeight: "500",
        marginTop: 4,
    },
    messageBtnWrapper: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
        flexShrink: 0,
    },
    messageBtnInner: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: "center",
        flexDirection: "row",
        gap: 6,
    },
    messageText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
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
        marginBottom: 24,
    },
    discoverBtnWrapper: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 4,
    },
    discoverBtnInner: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    discoverBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
});