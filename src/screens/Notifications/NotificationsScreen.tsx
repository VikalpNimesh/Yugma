import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { resetUnreadCount } from '../../redux/slices/notificationSlice';
import notificationService, { NotificationItem } from '../../api/services/notificationService';
import socialService from '../../api/services/socialService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Toast from 'react-native-toast-message';
import BackButton from '../../components/common/BackButton';
import LinearGradient from 'react-native-linear-gradient';

dayjs.extend(relativeTime);

const NotificationsScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchNotifications = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await notificationService.getNotifications();
            console.log('🚀 Notifications Data:', JSON.stringify(data, null, 2));
            setNotifications(Array.isArray(data) ? data.filter(n => n && typeof n === 'object') : []);
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to fetch notifications',
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useFocusEffect(
        useCallback(() => {
            dispatch(resetUnreadCount());
        }, [dispatch])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchNotifications(false);
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                Array.isArray(prev)
                    ? prev.map(n => (n && n.id === notificationId ? { ...n, isRead: true } : n))
                    : []
            );
        } catch (error: any) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev =>
                Array.isArray(prev)
                    ? prev.map(n => (n ? { ...n, isRead: true } : n))
                    : []
            );
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'All notifications marked as read',
            });
        } catch (error: any) {
            console.error('Error marking all as read:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to mark all as read',
            });
        }
    };

    const handlePressNotification = async (item: NotificationItem) => {
        try {
            await handleMarkAsRead(item.id);
            if (item.type === 'like') {
                navigation.navigate('BottomTabs', {
                    screen: 'MatchesScreen',
                    params: { initialTab: 'Likes' }
                });
            } else if (item.type === 'match') {
                navigation.navigate('BottomTabs', {
                    screen: 'MatchesScreen',
                    params: { initialTab: 'Matches' }
                });
            }
        } catch (error) {
            console.error('Error handling notification press:', error);
        }
    };

    const handleAcceptRequest = async (requesterId: string | undefined, notificationId: string) => {
        if (!requesterId) return;
        try {
            await socialService.likeUser(requesterId);
            Toast.show({ type: 'success', text1: 'Match Created', text2: 'You can now chat with them!' });
            await handleMarkAsRead(notificationId);
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to accept like', text2: error?.response?.data?.message || 'Something went wrong' });
        }
    };

    const handleRejectRequest = async (requesterId: string | undefined, notificationId: string) => {
        if (!requesterId) return;
        try {
            await socialService.passUser(requesterId);
            Toast.show({ type: 'info', text1: 'Passed' });
            await handleMarkAsRead(notificationId);
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to pass', text2: error?.response?.data?.message || 'Something went wrong' });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'match': return 'heart';
            case 'message': return 'chatbubble';
            case 'like': return 'thumbs-up';
            default: return 'notifications';
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const isUnread = !item.isRead;
        return (
            <TouchableOpacity
                style={[
                    styles.notificationCard,
                    isUnread ? styles.unreadCard : styles.readCard
                ]}
                onPress={() => handlePressNotification(item)}
                activeOpacity={0.7}
            >
                {isUnread ? (
                    <LinearGradient
                        colors={["#FF5F6D", "#FF3366"]}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name={getIcon(item.type)}
                            size={22}
                            color="#FFFFFF"
                        />
                    </LinearGradient>
                ) : (
                    <View style={[styles.iconContainer, styles.readIconContainer]}>
                        <Ionicons
                            name={getIcon(item.type)}
                            size={22}
                            color="#de5972ff"
                        //    color="#FF8FA3"
                        />
                    </View>
                )}

                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, isUnread && styles.unreadTitle]}>{item.title}</Text>
                        <Text style={[styles.time, isUnread && styles.unreadTime]}>{dayjs(item.createdAt).fromNow()}</Text>
                    </View>
                    <Text style={[styles.description, isUnread && styles.unreadDescription]} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>

                {isUnread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton title="Notifications" color="#000" absolute={false} />
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead}>
                        <Text style={styles.markReadText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF5F6D" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#FF5F6D']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="notifications-outline" size={64} color="#FF5F6D" />
                            </View>
                            <Text style={styles.emptyTitle}>You're all caught up!</Text>
                            <Text style={styles.emptySubtitle}>When you get new matches, messages, or likes, they'll show up right here.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Muted off-white background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        padding: 4,
    },
    markReadText: {
        fontSize: 14,
        color: '#FF5F6D',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingTop: 16,
        paddingBottom: 30,
        paddingHorizontal: 16,
        flexGrow: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    unreadCard: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 95, 109, 0.1)',
    },
    readCard: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 95, 109, 0.06)',
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    readIconContainer: {
        backgroundColor: '#FFF0F5',
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2D3748',
        flex: 1,
        marginRight: 8,
    },
    unreadTitle: {
        color: '#1A202C',
        fontWeight: '800',
    },
    time: {
        fontSize: 12,
        color: '#FFB6C1',
        fontWeight: '500',
    },
    unreadTime: {
        color: '#FF5F6D',
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
    },
    unreadDescription: {
        color: '#4A5568',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF5F6D',
        marginLeft: 12,
        shadowColor: "#FF5F6D",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff0f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 40,
    },
});

export default NotificationsScreen;
