import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  unreadConversationIds: string[];
  onlineUserIds: string[];
}

const initialState: ChatState = {
  unreadConversationIds: [],
  onlineUserIds: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUnreadConversations: (state, action: PayloadAction<string[]>) => {
      state.unreadConversationIds = action.payload;
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
    }
  },
});

export const { 
  setUnreadConversations, 
  addUnreadConversation, 
  removeUnreadConversation, 
  setOnlineUsers, 
  addUserOnline, 
  removeUserOnline, 
  resetChatState 
} = chatSlice.actions;
export default chatSlice.reducer;
