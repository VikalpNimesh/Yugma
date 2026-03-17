import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'match' | 'message' | 'like' | 'system';
    isRead: boolean;
}

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
    {
        id: '1',
        title: 'New Match!',
        description: 'You have a new potential match with Priya. Check it out!',
        time: '2 mins ago',
        type: 'match',
        isRead: false,
    },
    {
        id: '2',
        title: 'New Message',
        description: 'Rahul sent you a message: "Hi, how are you doing?"',
        time: '15 mins ago',
        type: 'message',
        isRead: false,
    },
    {
        id: '3',
        title: 'Someone Liked You',
        description: 'Your profile got a new like from a user in Mumbai.',
        time: '1 hour ago',
        type: 'like',
        isRead: true,
    },
    {
        id: '4',
        title: 'System Update',
        description: 'Your profile verification is in progress.',
        time: '3 hours ago',
        type: 'system',
        isRead: true,
    },
    {
        id: '5',
        title: 'Daily Reminder',
        description: 'Don\'t forget to check your daily matches!',
        time: '5 hours ago',
        type: 'system',
        isRead: true,
    }
];

const NotificationsScreen = () => {
    const navigation = useNavigation();

    const getIcon = (type: string) => {
        switch (type) {
            case 'match': return 'heart';
            case 'message': return 'chatbubble';
            case 'like': return 'thumbs-up';
            default: return 'notifications';
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <TouchableOpacity style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
            <View style={[styles.iconContainer, { backgroundColor: item.isRead ? '#f0f0f0' : '#FFE5EC' }]}>
                <Ionicons 
                    name={getIcon(item.type)} 
                    size={24} 
                    color={item.isRead ? '#666' : '#DD2476'} 
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity>
                    <Text style={styles.markReadText}>Mark all read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={DUMMY_NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
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
        color: '#DD2476',
        fontWeight: '600',
    },
    listContainer: {
        paddingBottom: 20,
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
        backgroundColor: '#DD2476',
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
});

export default NotificationsScreen;
