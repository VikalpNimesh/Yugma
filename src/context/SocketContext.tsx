import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Keychain from 'react-native-keychain';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addUnreadConversation, setUnreadConversations, addUserOnline, removeUserOnline } from '../redux/slices/chatSlice';
import { incrementUnreadCount as incrementNotificationCount } from '../redux/slices/notificationSlice';
import messageService from '../api/services/messageService';
import Toast from 'react-native-toast-message';
import { Vibration, DeviceEventEmitter } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
const SOCKET_URL = 'ws://13.204.218.120:3001/chat';
// const SOCKET_URL = 'ws://192.168.29.27:3001/chat'; // Same IP as BASE_URL in axiosInstance, with /chat namespace
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const connectSocket = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) return;

        const tokens = JSON.parse(credentials.password);
        const token = tokens.access;

        if (!token) return;

        socketInstance = io(SOCKET_URL, {
          auth: {
            token,
          },
          transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
          console.log('✅ Socket connected');
          setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
          console.log('❌ Socket disconnected');
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('⚠️ Socket connection error:', error);
        });

        // ── Global Listeners ──────────────────────────────────────────────

        socketInstance.on('new_message', (data) => {
          console.log('📩 New message received:', data);
          if (data.senderId !== currentUserId) {
            dispatch(addUnreadConversation(data.conversationId));

            // Check if user is not currently viewing this conversation
            if ((globalThis as any).activeConversationId !== data.conversationId) {
              ReactNativeHapticFeedback.trigger("notificationSuccess", {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              Vibration.vibrate([0, 100, 80, 100]);

              Toast.show({
                type: 'info',
                text1: 'New Message 💬',
                text2: data.content || 'You received a new message',
              });
            }
          }
        });

        socketInstance.on('messages_read', (data) => {
          // Re-fetch conversations to get updated unread status
          messageService.getConversations().then(conversations => {
            const unreadIds = conversations
              .filter(conv => (conv.unreadCount || 0) > 0)
              .map(conv => conv.conversationId);
            dispatch(setUnreadConversations(unreadIds));
          }).catch(console.error);
        });

        socketInstance.on('user_online', (data) => {
          console.log('Userasdedas online:', data.userId);
          if (data.userId) {
            dispatch(addUserOnline(data.userId));
          }
        });

        socketInstance.on('user_offline', (data) => {
          console.log('Userasdedas offline:', data.userId);
          if (data.userId) {
            dispatch(removeUserOnline(data.userId));
          }
        });

        socketInstance.on('new_notification', (data) => {
          console.log('🔔 New notification received:', data);
          dispatch(incrementNotificationCount());

          ReactNativeHapticFeedback.trigger("notificationSuccess", {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          Vibration.vibrate([0, 120, 80, 120]);

          Toast.show({
            type: 'success',
            text1: data.title || 'New Notification',
            text2: data.description || 'You have a new notification',
          });

          // Emit a global event for socket notification so active screens can refresh
          DeviceEventEmitter.emit('notification_received', { data, isSocket: true });
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    };

    if (isAuthenticated) {
      connectSocket();
      // Fetch initial unread conversations
      messageService.getConversations().then(conversations => {
        const unreadIds = conversations
          .filter(conv => (conv.unreadCount || 0) > 0)
          .map(conv => conv.conversationId);
        dispatch(setUnreadConversations(unreadIds));
      }).catch(console.error);
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
