import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
// const SOCKET_URL = 'ws://13.204.218.120:3001/chat';
const SOCKET_URL = 'ws://192.168.29.27:3001/chat'; // Same IP as BASE_URL in axiosInstance, with /chat namespace
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
          Toast.show({
            type: 'info',
            text1: `New message from ${data.senderName || 'User'}`,
            text2: data.content,
            onPress: () => {
              // Navigation logic could go here
              Toast.hide();
            }
          });
        });

        socketInstance.on('new_notification', (data) => {
          console.log('🔔 New notification received:', data);
          Toast.show({
            type: 'success',
            text1: data.title || 'New Notification',
            text2: data.description || 'You have a new notification',
          });
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    };

    if (isAuthenticated) {
      connectSocket();
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
