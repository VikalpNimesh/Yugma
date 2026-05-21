import axiosInstance from '../axios/axiosInstance';

export interface ActionResponse {
  message: string;
  isMatch?: boolean;
}

export interface SocialUserItem {
  id: string;
  fullName: string;
  profilePhoto: string;
  matchedSince?: string;
  likedAt?: string;
}

const socialService = {
  likeUser: async (targetUserId: string): Promise<ActionResponse> => {
    const response = await axiosInstance.post('/social/like', { targetUserId });
    return response.data?.data;
  },

  passUser: async (targetUserId: string): Promise<ActionResponse> => {
    const response = await axiosInstance.post('/social/pass', { targetUserId });
    return response.data?.data;
  },

  removeLike: async (targetUserId: string): Promise<ActionResponse> => {
    const response = await axiosInstance.delete(`/social/like/${targetUserId}`);
    return response.data?.data;
  },

  unmatch: async (targetUserId: string): Promise<ActionResponse> => {
    const response = await axiosInstance.delete('/social/matches/unmatch', { data: { targetUserId } });
    return response.data?.data;
  },

  getLikesReceived: async (): Promise<SocialUserItem[]> => {
    const response = await axiosInstance.get('/social/likes-received');
    return response.data?.data;
  },

  getLikesSent: async (): Promise<SocialUserItem[]> => {
    const response = await axiosInstance.get('/social/likes-sent');
    return response.data?.data;
  },

  getMatches: async (): Promise<SocialUserItem[]> => {
    const response = await axiosInstance.get('/social/matches');
    return response.data?.data;
  },

  registerGraph: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/social/register-graph');
    return response.data.data;
  },
};

export default socialService;
