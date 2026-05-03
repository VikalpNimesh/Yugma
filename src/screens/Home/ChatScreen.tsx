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

    const flatListRef = useRef<FlatList>(null);
    const { socket, isConnected } = useSocket();
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            try {
                const data = await messageService.getConversation(otherUserId);
                console.log("data", data);
                if (isMounted) {
                    setMessages(data.messages);
                    setConversationId(data.conversationId);

                    // Mark as read immediately when opening the chat
                    if (data.conversationId) {
                        messageService.markAsRead(data.conversationId).catch(console.error);
                        if (socket) {
                            socket.emit('join_conversation', { conversationId: data.conversationId });
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
            if (conversationId && socket) {
                socket.emit('leave_conversation', { conversationId });
            }
        };
    }, [otherUserId, socket]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: any) => {
            // Only add the message if it belongs to the current conversation
            if (newMessage.senderId === otherUserId || newMessage.receiverId === otherUserId) {
                setMessages(prev => {
                    // Check if message already exists (e.g. from optimistic update)
                    if (prev.some(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });

                // If we received a message while in this screen, mark it as read
                if (conversationId && newMessage.senderId === otherUserId) {
                    messageService.markAsRead(conversationId).catch(console.error);
                }

                // Scroll to bottom
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, otherUserId, conversationId]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const tempContent = inputText.trim();
        setInputText('');

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
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            // Using socket emit directly for real-time speed if connected,
            // otherwise use REST API. The backend socket handler "send_message"
            // automatically saves the message using MessageService.
            if (isConnected && socket) {
                socket.emit('send_message', {
                    receiverId: otherUserId,
                    content: tempContent,
                });
            } else {
                const sentMessage = await messageService.sendMessage(otherUserId, tempContent);
                // Replace temp message with actual message from server
                setMessages(prev => prev.map(m => m.id === tempMessage.id ? sentMessage : m));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Optionally, remove the temp message or mark it as failed
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
        }
    };

    const renderMessage = ({ item }: { item: MessageItem }) => {
        const isMine = item.isMine || item.senderId === currentUserId;

        return (
            <View style={[styles.messageBubbleContainer, isMine ? styles.myMessageContainer : styles.theirMessageContainer]}>
                {!isMine && <Avatar uri={avatar} name={name} size={28} style={styles.messageAvatar} />}
                <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.timeText, isMine ? styles.myTime : styles.theirTime]}>
                        {dayjs(item.createdAt).format('HH:mm')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Avatar uri={avatar} name={name} size={40} style={styles.headerAvatar} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{name}</Text>
                        {/* Optionally add online status here */}
                    </View>
                </View>

                {/* Messages List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#DD2476" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
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
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
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
        backgroundColor: '#DD2476',
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
        marginTop: 4,
        alignSelf: 'flex-end',
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
        backgroundColor: '#DD2476',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});

export default ChatScreen;
