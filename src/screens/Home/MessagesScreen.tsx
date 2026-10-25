// screens/MessagesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MessageCard from '../../components/MessageCard';
import messageService, { ConversationItem } from '../../api/services/messageService';
import socialService from '../../api/services/socialService';
import Toast from 'react-native-toast-message';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import THEME from '../../constant/theme';

dayjs.extend(relativeTime);

export default function MessagesScreen() {
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { socket } = useSocket();
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const onlineUserIds = useSelector((state: RootState) => state.chat.onlineUserIds);

  const storyBubbles = [
    { id: 'me', name: 'Your Story', isMe: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: '1', name: 'Priya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: '2', name: 'Neha', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
    { id: '3', name: 'Ananya', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
    { id: '4', name: 'Ritika', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  ];

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data || []);
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
        const index = prev.findIndex((c) => c.conversationId === newMessage.conversationId);
        if (index !== -1) {
          const updated = [...prev];
          const target = { ...updated[index] };
          target.lastMessage = newMessage.content;
          target.lastMessageTime = newMessage.createdAt;
          if (newMessage.senderId !== currentUserId) {
            target.unreadCount = (target.unreadCount || 0) + 1;
          }
          updated.splice(index, 1);
          updated.unshift(target);
          return updated;
        } else {
          fetchConversations(false);
          return prev;
        }
      });
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, currentUserId]);

  const navigateToChat = (item: ConversationItem) => {
    navigation.navigate('ChatScreen', {
      conversationId: item.conversationId,
      userId: item.user.id,
      name: item.user.fullName || 'User',
      avatar: item.user.previewPhoto,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchConversations(false);
  };

  const handleLongPress = (item: ConversationItem) => {
    Alert.alert(
      'Chat Options',
      `Actions for ${item.user.fullName || 'User'}`,
      [
        {
          text: 'Report User / Abuse',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Report Submitted',
              'Thank you. We review all reports within 24 hours to protect our members.'
            );
          },
        },
        {
          text: 'Delete Conversation',
          style: 'destructive',
          onPress: async () => {
            try {
              await socialService.unmatch(item.user.id);
              Toast.show({ type: 'success', text1: 'Conversation removed' });
              fetchConversations(false);
            } catch (err) {
              Toast.show({ type: 'error', text1: 'Failed to delete' });
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={THEME.colors.bgGradient}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.headerIconButton}>
          <Icon name="search" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Stories / Active Matches Horizontal Avatar Bar */}
      <View style={styles.storiesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContent}>
          {storyBubbles.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyBubble} activeOpacity={0.8}>
              <View style={[styles.avatarRing, story.isMe && styles.myAvatarRing]}>
                <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                {story.isMe && (
                  <View style={styles.addStoryBadge}>
                    <Icon name="add" size={12} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Conversations List */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversationId}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#FF3366" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Icon name="chatbubbles-outline" size={54} color="#FF3366" />
              </View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Matches will appear here once you both like each other. Start swiping on Discover!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MessageCard
              name={item.user.fullName || 'User'}
              message={typingUsers[item.conversationId] ? 'Typing...' : item.lastMessage}
              time={dayjs(item.lastMessageTime).fromNow(true)}
              avatar={item.user.previewPhoto}
              unreadCount={item.unreadCount}
              online={onlineUserIds.includes(item.user.id)}
              onPress={() => navigateToChat(item)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D0208',
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.4,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  storiesContainer: {
    marginBottom: 16,
  },
  storiesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyBubble: {
    alignItems: 'center',
    width: 62,
  },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  myAvatarRing: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  storyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  addStoryBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1D0208',
  },
  storyName: {
    color: '#F3D7E0',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 51, 102, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#B08092',
    textAlign: 'center',
    lineHeight: 18,
  },
});
