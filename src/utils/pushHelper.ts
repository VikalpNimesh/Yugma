import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We use a simple fallback since uuid is not installed
const generateFallbackUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export interface PushNotificationContext {
    deviceToken?: string;
    deviceType: string;
    deviceId: string;
}

/**
 * Gets the device ID, creating and persisting one if it doesn't exist
 */
const getOrCreateDeviceId = async (): Promise<string> => {
    try {
        let deviceId = await AsyncStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = generateFallbackUUID();
            await AsyncStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    } catch (error) {
        console.warn('Failed to get/set deviceId, generating ephemeral one', error);
        return generateFallbackUUID();
    }
};

/**
 * Requests push notification permissions and fetches FCM token + device metadata
 * Suitable for appending to Auth login/signup requests
 */
export const getPushNotificationContext = async (): Promise<PushNotificationContext> => {
    const deviceType = Platform.OS;
    const deviceId = await getOrCreateDeviceId();
    let deviceToken: string | undefined = undefined;

    try {
        // Request permissions (primarily for iOS, Android 13+ handles this via prompt later usually, 
        // but messaging().requestPermission() is safe to call on both)
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            deviceToken = await messaging().getToken();
        } else {
            console.warn('Push notification permissions denied by user');
        }
    } catch (error) {
        console.warn('Failed to get FCM token', error);
    }

    return {
        deviceToken,
        deviceType,
        deviceId,
    };
};
