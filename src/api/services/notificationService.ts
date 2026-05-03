import axiosInstance from '../axios/axiosInstance';

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    createdAt: string;
    type: 'match' | 'message' | 'like' | 'system';
    isRead: boolean;
}

const notificationService = {
    getNotifications: async (limit: number = 20): Promise<NotificationItem[]> => {
        const response = await axiosInstance.get('/notifications', { params: { limit } });
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await axiosInstance.get('/notifications/unread-count');
        return response.data.unreadCount;
    },

    markAsRead: async (notificationId: string): Promise<any> => {
        const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<any> => {
        const response = await axiosInstance.put('/notifications/mark-all-read');
        return response.data;
    }
};

export default notificationService;
