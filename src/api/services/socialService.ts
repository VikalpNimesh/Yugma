import axiosInstance from '../axios/axiosInstance';

export interface FriendRequestResponse {
  message: string;
}

export interface FriendItem {
  id: string;
  fullName: string;
  profilePhoto: string;
  friendsSince: string;
}

const socialService = {
  sendFriendRequest: async (targetUserId: string): Promise<FriendRequestResponse> => {
    const response = await axiosInstance.post('/social/friend-request', { targetUserId });
    return response.data;
  },

  respondToFriendRequest: async (requesterId: string, action: 'accepted' | 'rejected'): Promise<FriendRequestResponse> => {
    const response = await axiosInstance.patch('/social/friend-request/respond', { requesterId, action });
    return response.data;
  },

  getFriends: async (): Promise<FriendItem[]> => {
    const response = await axiosInstance.get('/social/friends');
    return response.data.data;
  },
};

export default socialService;
