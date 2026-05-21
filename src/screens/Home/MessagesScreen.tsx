// screens/MessagesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MessageCard from '../../components/MessageCard';
import messageService, { ConversationItem } from '../../api/services/messageService';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MessagesScreen = () => {
    const navigation = useNavigation<any>();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { socket } = useSocket();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const onlineUserIds = useSelector((state: RootState) => state.chat.onlineUserIds);

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

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: any) => {
            setConversations((prev) => {
                const index = prev.findIndex(c => c.conversationId === newMessage.conversationId);

                if (index !== -1) {
                    const updatedConversations = [...prev];
                    const target = { ...updatedConversations[index] };

                    target.lastMessage = newMessage.content;
                    target.lastMessageTime = newMessage.createdAt;

                    // Increment unread count only if message is from the other person
                    // Note: If we are in ChatScreen, this component might still be mounted but not focused.
                    // But usually, navigation stacks keep it mounted.
                    if (newMessage.senderId !== currentUserId) {
                        target.unreadCount = (target.unreadCount || 0) + 1;
                    }

                    // Move to top
                    updatedConversations.splice(index, 1);
                    updatedConversations.unshift(target);
                    return updatedConversations;
                } else {
                    // If it's a new conversation, re-fetch to get all metadata (user object, etc.)
                    fetchConversations(false);
                    return prev;
                }
            });
        };

        const handleMessagesRead = (data: any) => {
            setConversations((prev) => {
                const index = prev.findIndex(c => c.conversationId === data.conversationId);
                if (index !== -1) {
                    const updatedConversations = [...prev];
                    updatedConversations[index] = {
                        ...updatedConversations[index],
                        unreadCount: 0
                    };
                    return updatedConversations;
                }
                return prev;
            });
        };

        const handleTyping = (data: any) => {
            setTypingUsers(prev => ({ ...prev, [data.conversationId]: true }));
        };

        const handleStopTyping = (data: any) => {
            setTypingUsers(prev => ({ ...prev, [data.conversationId]: false }));
        };

        socket.on('new_message', handleNewMessage);
        socket.on('messages_read', handleMessagesRead);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
        };
    }, [socket, currentUserId]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchConversations(false);
    };

    const navigateToChat = (conversation: ConversationItem) => {
        navigation.navigate('ChatScreen', {
            userId: conversation.user.id,
            name: conversation.user.fullName || 'User',
            avatar: conversation.user.previewPhoto,
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
        <View style={styles.container}>
            {renderHeader()}
            {isLoading && !isRefreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF5F6D" />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.conversationId}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#FF5F6D" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <Ionicons name="chatbubbles-outline" size={64} color="#FF5F6D" />
                                </View>
                                <Text style={styles.emptyTitle}>Say Hello!</Text>
                                <Text style={styles.emptySubtitle}>You don't have any messages yet. Start a conversation with your matches to break the ice.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <MessageCard
                                name={item.user.fullName || 'Unknown User'}
                                message={typingUsers[item.conversationId] ? 'Typing...' : item.lastMessage}
                                time={dayjs(item.lastMessageTime).fromNow(true)}
                                avatar={item.user.previewPhoto}
                                unreadCount={item.unreadCount}
                                online={onlineUserIds.includes(item.user.id)}
                                onPress={() => navigateToChat(item)}
                            />
                        )}
                    />
                )}
        </View>
    );
};

export default MessagesScreen;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        marginVertical: 10,
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
        marginTop: 60,
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
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 30,
    },
});
