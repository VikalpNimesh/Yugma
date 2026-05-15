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

dayjs.extend(relativeTime);

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchNotifications = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await notificationService.getNotifications();
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

    const handleAcceptRequest = async (requesterId: string | undefined, notificationId: string) => {
        if (!requesterId) return;
        try {
            await socialService.respondToFriendRequest(requesterId, 'accepted');
            Toast.show({ type: 'success', text1: 'Request Accepted', text2: 'You are now friends!' });
            await handleMarkAsRead(notificationId);
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to accept request', text2: error?.response?.data?.message || 'Something went wrong' });
        }
    };

    const handleRejectRequest = async (requesterId: string | undefined, notificationId: string) => {
        if (!requesterId) return;
        try {
            await socialService.respondToFriendRequest(requesterId, 'rejected');
            Toast.show({ type: 'info', text1: 'Request Rejected' });
            await handleMarkAsRead(notificationId);
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to reject request', text2: error?.response?.data?.message || 'Something went wrong' });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'match': return 'heart';
            case 'message': return 'chatbubble';
            case 'like': return 'thumbs-up';
            case 'friend_request': return 'person-add';
            default: return 'notifications';
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity
            style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
            onPress={() => handleMarkAsRead(item.id)}
            disabled={item.type === 'friend_request' && !item.isRead}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.isRead ? '#f0f0f0' : '#FFE5EC' }]}>
                <Ionicons
                    name={getIcon(item.type)}
                    size={24}
                    color={item.isRead ? '#666' : '#FF5F6D'}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                {item.type === 'friend_request' && !item.isRead && (
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAcceptRequest(item.relatedUserId, item.id)}
                        >
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleRejectRequest(item.relatedUserId, item.id)}
                        >
                            <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {!item.isRead && item.type !== 'friend_request' && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
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
                            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>No notifications yet</Text>
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
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
        paddingBottom: 20,
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        alignItems: 'center',
    },
    unreadItem: {
        backgroundColor: '#fff9fa',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5F6D',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 10,
    },
    acceptButton: {
        backgroundColor: '#FF5F6D',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    rejectButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    acceptText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    rejectText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 13,
    },
});

export default NotificationsScreen;
