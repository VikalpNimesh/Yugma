import axiosInstance from '../axios/axiosInstance';
import { DiscoveryResponse } from '../types/discovery.types';

const discoveryService = {
    getDiscoveryFeed: async (): Promise<DiscoveryResponse> => {
        const response = await axiosInstance.get<DiscoveryResponse>('/discovery/feed');
        return response.data;
    },

    swipeProfile: async (targetUserId: string, action: 'like' | 'pass') => {
        const response = await axiosInstance.post('/discovery/swipe', { targetUserId, action });
        return response.data;
    },
};

export default discoveryService;
