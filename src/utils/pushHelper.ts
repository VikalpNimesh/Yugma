import { Platform, PermissionsAndroid } from 'react-native';
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
    fcmToken?: string;
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
    let fcmToken: string | undefined = undefined;

    try {
        let enabled = false;

        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            enabled = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const authStatus = await messaging().requestPermission();
            enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        }

        if (enabled) {
            fcmToken = await messaging().getToken();
        } else {
            console.warn('Push notification permissions denied by user');
        }
    } catch (error) {
        console.warn('Failed to get FCM token', error);
    }

    return {
        fcmToken,
        deviceType,
        deviceId,
    };
};
