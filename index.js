/**
 * @format
 */

if (__DEV__) {
    import('./src/ReactotronConfig')
        .then(() => {
            console.tron?.log('Reactotron Loaded');
            console.tron?.log({ user: 'vikalp', role: 'developer' });
        })
        .catch(error => {
            console.warn('Failed to load Reactotron', error);
        });
}

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
