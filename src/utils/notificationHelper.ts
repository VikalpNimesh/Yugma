import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, Vibration, DeviceEventEmitter, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../redux/store';
import { incrementUnreadCount } from '../redux/slices/notificationSlice';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';

/**
 * Notification Helper
 * Handles FCM permissions, token management, and listeners
 */
export const requestUserPermission = async () => {
    let enabled = false;

    if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Error requesting Android post notification permission:', error);
        }
    } else {
        try {
            const authStatus = await messaging().requestPermission();
            enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        } catch (error) {
            console.error('Error requesting FCM notification permission:', error);
        }
    }

    if (enabled) {
        console.log('Notification permission granted');
        getFcmToken();
    } else {
        console.log('Notification permission denied');
    }
};

export const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Old FCM Token:', fcmToken);

    if (!fcmToken) {
        try {
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
            }
            const token = await messaging().getToken();
            if (token) {
                console.log('New FCM Token:', token);
                await AsyncStorage.setItem('fcmToken', token);
                // In a real app, you would send this token to your backend here
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);
        }
    }
    return fcmToken;
};

export const notificationListener = () => {
    // 1. Foreground Message Handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground Message received:', JSON.stringify(remoteMessage));
        
        // Extract active chat details from global scope
        const activeConversationId = (globalThis as any).activeConversationId;
        const activeChatUserId = (globalThis as any).activeChatUserId;
        const activeChatUserName = (globalThis as any).activeChatUserName;

        // Check if this incoming message belongs to the currently active chat screen
        const isFromActiveChat = activeConversationId && (
            remoteMessage.data?.conversationId === activeConversationId ||
            remoteMessage.data?.senderId === activeChatUserId ||
            (activeChatUserName && remoteMessage.notification?.title?.includes(activeChatUserName))
        );

        if (isFromActiveChat) {
            console.log('[NotificationHelper] Skipping toast/vibration because user is in active chat');
            // Still broadcast the event so the active screen can receive updates
            DeviceEventEmitter.emit('notification_received', remoteMessage);
            return;
        }

        // Trigger haptic & double vibration pulse for the notification
        ReactNativeHapticFeedback.trigger("notificationSuccess", {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
        Vibration.vibrate([0, 120, 80, 120]);

        // Dispatch notification increment in redux store
        store.dispatch(incrementUnreadCount());

        // Show the beautiful premium Toast
        Toast.show({
            type: 'success',
            text1: remoteMessage.notification?.title || 'New Notification',
            text2: remoteMessage.notification?.body || 'You received a new notification',
        });

        // Emit a global event so active screens can refresh their data
        DeviceEventEmitter.emit('notification_received', remoteMessage);
    });

    // 2. Notification Opened Handler (When app is in background)
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    // 3. Notification Opened Handler (When app is closed)
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    // 4. Token Refresh Listener
    messaging().onTokenRefresh(token => {
        console.log('FCM Token refreshed:', token);
        AsyncStorage.setItem('fcmToken', token);
        // Send new token to backend
    });

    return unsubscribe;
};
