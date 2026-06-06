import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Keyboard,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/common/Avatar';
import { useRoute, useNavigation } from '@react-navigation/native';
import messageService, { MessageItem } from '../../api/services/messageService';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';

interface RouteParams {
    userId: string;
    name: string;
    avatar: string;
}

const ChatScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { userId: otherUserId, name, avatar } = route.params as RouteParams;

    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef<any>(null);

    const flatListRef = useRef<FlatList>(null);
    const { socket, isConnected } = useSocket();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        let isMounted = true;

        // Generate conversationId based on guide: [userId1, userId2].sort().join('-')
        const ids = [currentUserId, otherUserId].sort();
        const generatedId = ids.join('-');
        setConversationId(generatedId);
        (globalThis as any).activeConversationId = generatedId;
        (globalThis as any).activeChatUserId = otherUserId;
        (globalThis as any).activeChatUserName = name;

        const fetchMessages = async () => {
            try {
                const data = await messageService.getConversation(otherUserId);
                if (isMounted) {
                    setMessages(data.messages);

                    // Mark as read immediately when opening the chat
                    if (generatedId) {
                        messageService.markAsRead(generatedId).catch(console.error);
                        if (socket) {
                            socket.emit('join_conversation', { conversationId: generatedId });
                            socket.emit('mark_read', { conversationId: generatedId });
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchMessages();

        return () => {
            isMounted = false;
            (globalThis as any).activeConversationId = null;
            (globalThis as any).activeChatUserId = null;
            (globalThis as any).activeChatUserName = null;
            if (generatedId && socket) {
                socket.emit('leave_conversation', { conversationId: generatedId });
            }
        };
    }, [otherUserId, socket, currentUserId]);

    useEffect(() => {
        if (!socket || !conversationId) return;

        const handleNewMessage = (newMessage: any) => {
            if (newMessage.conversationId === conversationId) {
                setMessages(prev => {
                    // 1. If message already exists by ID, do nothing
                    if (prev.some(m => m.id === newMessage.id)) return prev;

                    // 2. If it's my message, try to replace the optimistic 'temp-' message
                    if (newMessage.isMine) {
                        const tempMessageIndex = prev.findIndex(m =>
                            m.id.toString().startsWith('temp-') &&
                            m.content === newMessage.content
                        );

                        if (tempMessageIndex !== -1) {
                            const updatedMessages = [...prev];
                            updatedMessages[tempMessageIndex] = newMessage;
                            return updatedMessages;
                        }
                    }

                    // 3. Otherwise, append the new message
                    return [...prev, newMessage];
                });

                if (newMessage.senderId === otherUserId) {
                    socket.emit('mark_read', { conversationId });
                }
            }
        };

        const handleTyping = (data: any) => {
            if (data.conversationId === conversationId && data.senderId === otherUserId) {
                setIsOtherUserTyping(true);
            }
        };

        const handleStopTyping = (data: any) => {
            if (data.conversationId === conversationId && data.senderId === otherUserId) {
                setIsOtherUserTyping(false);
            }
        };

        const handleMessagesRead = (data: any) => {
            if (data.conversationId === conversationId && data.readBy === otherUserId) {
                setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
            }
        };

        const handleMessageDeleted = (data: any) => {
            if (data.conversationId === conversationId) {
                setMessages(prev => prev.map(m =>
                    m.id === data.messageId
                        ? { ...m, content: '🚫 This message was deleted.' }
                        : m
                ));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        socket.on('messages_read', handleMessagesRead);
        socket.on('message_deleted', handleMessageDeleted);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('messages_read', handleMessagesRead);
            socket.off('message_deleted', handleMessageDeleted);
        };
    }, [socket, otherUserId, conversationId]);

    const handleTypingBroadcast = (text: string) => {
        setInputText(text);
        if (!socket || !conversationId) return;

        // Emit typing event
        socket.emit('typing', { conversationId, receiverId: otherUserId });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to emit stop_typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { conversationId, receiverId: otherUserId });
        }, 2000);
    };

    const handleLongPressMessage = (message: MessageItem) => {
        if (message.id.toString().startsWith('temp-') || message.content === '🚫 This message was deleted.') return;

        Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (isConnected && socket && conversationId) {
                                socket.emit('delete_message', {
                                    conversationId,
                                    messageId: message.id,
                                });
                            } else if (conversationId) {
                                await messageService.deleteMessage(conversationId, message.id);
                                setMessages(prev => prev.map(m =>
                                    m.id === message.id
                                        ? { ...m, content: '🚫 This message was deleted.' }
                                        : m
                                ));
                            }
                        } catch (error) {
                            console.error('Failed to delete message:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const tempContent = inputText.trim();
        setInputText('');

        // Immediately stop typing indicator when sending
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            socket?.emit('stop_typing', { conversationId, receiverId: otherUserId });
        }

        // Optimistic update
        const tempMessage: MessageItem = {
            id: `temp-${Date.now()}`,
            conversationId: conversationId || '',
            senderId: currentUserId || '',
            receiverId: otherUserId,
            content: tempContent,
            isRead: false,
            isMine: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, tempMessage]);

        try {
            if (isConnected && socket) {
                socket.emit('send_message', {
                    receiverId: otherUserId,
                    content: tempContent,
                });
            } else {
                const sentMessage = await messageService.sendMessage(otherUserId, tempContent);
                setMessages(prev => prev.map(m => m.id === tempMessage.id ? sentMessage : m));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        if (item.isTyping) {
            return (
                <View style={[styles.messageBubbleContainer, styles.theirMessageContainer]}>
                    <View style={[styles.messageBubble, styles.theirBubble, { backgroundColor: '#F1F3F5', borderBottomLeftRadius: 4 }]}>
                        <Text style={[styles.messageText, styles.theirText, { fontStyle: 'italic', color: '#8E8E93' }]}>
                            typing...
                        </Text>
                    </View>
                </View>
            );
        }

        const isMine = item.isMine || item.senderId === currentUserId;
        const isDeleted = item.content === '🚫 This message was deleted.';

        if (isMine) {
            return (
                <View style={[styles.messageBubbleContainer, styles.myMessageContainer]}>
                    <TouchableOpacity
                        activeOpacity={isDeleted ? 1.0 : 0.8}
                        onLongPress={() => handleLongPressMessage(item)}
                        disabled={isDeleted}
                    >
                        <LinearGradient
                            colors={isDeleted ? ["#E2E8F0", "#CBD5E1"] : ["#FF5F6D", "#FF3366"]}
                            style={[styles.messageBubble, styles.myBubble]}
                        >
                            <Text style={[styles.messageText, isDeleted ? { color: '#64748B', fontStyle: 'italic' } : styles.myText]}>
                                {item.content}
                            </Text>
                            <View style={styles.messageFooter}>
                                <Text style={[styles.timeText, isDeleted ? { color: '#94A3B8' } : styles.myTime]}>
                                    {dayjs(item.createdAt).format('HH:mm')}
                                </Text>
                                {!isDeleted && (
                                    <Ionicons
                                        name="checkmark-done-sharp"
                                        size={15}
                                        color={item.isRead ? "#00F0FF" : "rgba(255, 255, 255, 0.6)"}
                                        style={{ marginLeft: 4 }}
                                    />
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={[styles.messageBubbleContainer, styles.theirMessageContainer]}>
                <View style={[styles.messageBubble, styles.theirBubble, isDeleted && { backgroundColor: '#E2E8F0' }]}>
                    <Text style={[styles.messageText, styles.theirText, isDeleted && { color: '#64748B', fontStyle: 'italic' }]}>
                        {item.content}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[styles.timeText, styles.theirTime]}>
                            {dayjs(item.createdAt).format('HH:mm')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerAvatarContainer}>
                        <Avatar uri={avatar} name={name} size={40} style={styles.headerAvatar} />
                        <View style={styles.onlineBadge} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{name}</Text>
                        <Text style={styles.onlineStatus}>Online</Text>
                    </View>
                </View>

                {/* Messages List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF5F6D" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={(() => {
                            const chatData = [...messages].reverse();
                            if (isOtherUserTyping) {
                                chatData.unshift({
                                    id: 'typing-indicator',
                                    isTyping: true,
                                } as any);
                            }
                            return chatData;
                        })()}
                        inverted
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardDismissMode="on-drag"
                    />
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#94A3B8"
                        value={inputText}
                        onChangeText={handleTypingBroadcast}
                        multiline
                        maxLength={500}
                    />
                    {inputText.trim() ? (
                        <TouchableOpacity
                            style={styles.sendButtonWrapper}
                            onPress={handleSend}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={["#FF5F6D", "#FF3366"]}
                                style={styles.sendButton}
                            >
                                <Ionicons name="send" size={16} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.sendButton, styles.sendButtonDisabled]}>
                            <Ionicons name="send" size={16} color="#CCCCCC" />
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FAF9F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    backButton: {
        padding: 5,
        marginRight: 8,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerAvatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 11,
        height: 11,
        borderRadius: 5.5,
        backgroundColor: '#2ECC71',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    typingIndicator: {
        fontSize: 12,
        color: '#FF3366',
        fontWeight: '600',
    },
    onlineStatus: {
        fontSize: 12,
        color: '#2ECC71',
        fontWeight: '600',
        marginTop: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
    messageBubbleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    theirMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
    },
    myBubble: {
        borderBottomRightRadius: 4,
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    theirBubble: {
        backgroundColor: '#F1F3F5',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: "500",
    },
    myText: {
        color: '#FFFFFF',
    },
    theirText: {
        color: '#1E293B',
    },
    timeText: {
        fontSize: 10,
        fontWeight: "600",
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    myTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTime: {
        color: '#94A3B8',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.04)',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F5F6F8',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 40,
        maxHeight: 100,
        fontSize: 15,
        color: '#1A1A1A',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.03)',
        fontWeight: "500",
    },
    sendButtonWrapper: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF5F6D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#F1F3F5',
    },
});

export default ChatScreen;
