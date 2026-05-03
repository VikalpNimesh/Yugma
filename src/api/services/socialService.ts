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
    return response.data.data;
  },

  getIncomingRequests: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/social/friend-requests/incoming');
    return response.data.data;
  },

  getFriends: async (): Promise<FriendItem[]> => {
    const response = await axiosInstance.get('/social/friends');
    return response.data.data;
  },

  registerGraph: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/social/register-graph');
    return response.data.data;
  },
};

export default socialService;
