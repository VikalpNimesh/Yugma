import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  unreadConversationIds: string[];
  onlineUserIds: string[];
  unreadMessageCount: number;
  matchCount: number;
}

const initialState: ChatState = {
  unreadConversationIds: [],
  onlineUserIds: [],
  unreadMessageCount: 0,
  matchCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUnreadConversations: (state, action: PayloadAction<string[]>) => {
      state.unreadConversationIds = action.payload;
    },
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.unreadMessageCount = action.payload;
    },
    setMatchCount: (state, action: PayloadAction<number>) => {
      state.matchCount = action.payload;
    },
    addUnreadConversation: (state, action: PayloadAction<string>) => {
      if (!state.unreadConversationIds.includes(action.payload)) {
        state.unreadConversationIds.push(action.payload);
      }
    },
    removeUnreadConversation: (state, action: PayloadAction<string>) => {
      state.unreadConversationIds = state.unreadConversationIds.filter(id => id !== action.payload);
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUserIds = action.payload;
    },
    addUserOnline: (state, action: PayloadAction<string>) => {
      if (!state.onlineUserIds.includes(action.payload)) {
        state.onlineUserIds.push(action.payload);
      }
    },
    removeUserOnline: (state, action: PayloadAction<string>) => {
      state.onlineUserIds = state.onlineUserIds.filter(id => id !== action.payload);
    },
    resetChatState: (state) => {
      state.unreadConversationIds = [];
      state.onlineUserIds = [];
      state.unreadMessageCount = 0;
      state.matchCount = 0;
    }
  },
});

export const { 
  setUnreadConversations, 
  setUnreadMessageCount,
  setMatchCount,
  addUnreadConversation, 
  removeUnreadConversation, 
  setOnlineUsers, 
  addUserOnline, 
  removeUserOnline, 
  resetChatState 
} = chatSlice.actions;
export default chatSlice.reducer;
