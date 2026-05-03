// screens/MessagesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MessageCard from '../../components/MessageCard';
import messageService, { ConversationItem } from '../../api/services/messageService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MessagesScreen = () => {
    const navigation = useNavigation<any>();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchConversations = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const data = await messageService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConversations(true);
        }, [])
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchConversations(false);
    };

    const navigateToChat = (conversation: ConversationItem) => {
        navigation.navigate('ChatScreen', {
            userId: conversation.user.id,
            name: conversation.user.fullName || 'User',
            avatar: conversation.user.previewPhoto || 'https://via.placeholder.com/150',
        });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
                Connect with your matches and build meaningful relationships
            </Text>
        </View>
    );

    return (
        <LinearGradient
            colors={['#FFDAB9', 'white', "pink"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientContainer}
        >
            <View style={styles.container}>
                {isLoading && !isRefreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#DD2476" />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.conversationId}
                        contentContainerStyle={styles.list}
                        ListHeaderComponent={renderHeader}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#DD2476" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No messages yet.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <MessageCard
                                name={item.user.fullName || 'Unknown User'}
                                message={item.lastMessage}
                                time={dayjs(item.lastMessageTime).fromNow(true)}
                                avatar={item.user.previewPhoto || 'https://via.placeholder.com/150'}
                                unreadCount={item.unreadCount}
                                online={false} // Currently not provided by backend GET /messages
                                onPress={() => navigateToChat(item)}
                            />
                        )}
                    />
                )}
            </View>
        </LinearGradient>
    );
};

export default MessagesScreen;




const styles = StyleSheet.create({
    gradientContainer: {
        borderRadius: 12,
        // marginBottom: 12,
        flex: 1,
    },
    container: {
        // backgroundColor: '#fafafa',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        marginBottom: 20,
    },
    list: {
        marginTop: 8,
        paddingBottom: 20,
    },
    headerContainer: {
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
