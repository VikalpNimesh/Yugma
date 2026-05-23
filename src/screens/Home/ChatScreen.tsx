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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/common/Avatar';
import { useRoute, useNavigation } from '@react-navigation/native';
import messageService, { MessageItem } from '../../api/services/messageService';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import dayjs from 'dayjs';

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

        socket.on('new_message', handleNewMessage);
        socket.on('typing', handleTyping);
        socket.on('stop_typing', handleStopTyping);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('messages_read', handleMessagesRead);
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
                    <Avatar uri={avatar} name={name} size={28} style={styles.messageAvatar} />
                    <View style={[styles.messageBubble, styles.theirBubble, { backgroundColor: '#F0F0F0', borderBottomLeftRadius: 4 }]}>
                        <Text style={[styles.messageText, styles.theirText, { fontStyle: 'italic', color: '#666' }]}>
                            typing...
                        </Text>
                    </View>
                </View>
            );
        }

        const isMine = item.isMine || item.senderId === currentUserId;

        return (
            <View style={[styles.messageBubbleContainer, isMine ? styles.myMessageContainer : styles.theirMessageContainer]}>
                {!isMine && <Avatar uri={avatar} name={name} size={28} style={styles.messageAvatar} />}
                <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                        {item.content}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[styles.timeText, isMine ? styles.myTime : styles.theirTime]}>
                            {dayjs(item.createdAt).format('HH:mm')}
                        </Text>
                        {isMine && (
                            <Ionicons
                                name="checkmark-done-sharp"
                                size={15}
                                color={item.isRead ? "#00F0FF" : "#FFFFFF"}
                                style={{ marginLeft: 4 }}
                            />
                        )}
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
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={handleTypingBroadcast}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
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
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
    },
    typingIndicator: {
        fontSize: 12,
        color: '#FF5F6D',
        fontWeight: '500',
    },
    onlineStatus: {
        fontSize: 12,
        color: '#4CAF50',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
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
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: '#FF5F6D',
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myText: {
        color: '#fff',
    },
    theirText: {
        color: '#333',
    },
    timeText: {
        fontSize: 11,
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
        color: '#999',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        minHeight: 40,
        maxHeight: 100,
        fontSize: 15,
        color: '#333',
        marginRight: 12,
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
        backgroundColor: '#ccc',
    },
});

export default ChatScreen;
