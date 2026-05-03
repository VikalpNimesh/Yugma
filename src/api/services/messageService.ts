import axiosInstance from '../axios/axiosInstance';

export interface ConversationParticipant {
  id: string;
  fullName: string | null;
  profilePhoto: string | null;
  isVerified: boolean;
  isPremium: boolean;
  accountMode: string | null;
  age: number | null;
  location: string | null;
  profession: string | null;
  previewPhoto: string | null;
}

export interface ConversationItem {
  conversationId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  user: ConversationParticipant;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetailResponse {
  conversationId: string;
  participant: ConversationParticipant & {
    profile: {
      bio: string | null;
      photos: any[];
    } | null;
  };
  messages: MessageItem[];
  totalMessages: number;
}

class MessageService {
  async getConversations(): Promise<ConversationItem[]> {
    const response = await axiosInstance.get('/messages');
    return response.data;
  }

  async getConversation(otherUserId: string, limit: number = 50): Promise<ConversationDetailResponse> {
    const response = await axiosInstance.get(`/messages/conversation/${otherUserId}`, {
      params: { limit },
    });
    return response.data;
  }

  async sendMessage(receiverId: string, content: string): Promise<MessageItem> {
    const response = await axiosInstance.post('/messages', {
      receiverId,
      content,
    });
    return response.data;
  }

  async markAsRead(conversationId: string): Promise<{ markedAsReadCount: number }> {
    const response = await axiosInstance.post(`/messages/mark-read/${conversationId}`);
    return response.data;
  }
}

export default new MessageService();
