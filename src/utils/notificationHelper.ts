import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Notification Helper
 * Handles FCM permissions, token management, and listeners
 */
export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken();
    }
};

export const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Old FCM Token:', fcmToken);
    
    if (!fcmToken) {
        try {
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
        Alert.alert(
            remoteMessage.notification?.title || 'New Notification',
            remoteMessage.notification?.body || 'You have a new message'
        );
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
