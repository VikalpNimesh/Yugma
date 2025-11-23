/**
 * @format
 */

if (__DEV__) {
    import('./src/ReactotronConfig').then(() =>
        console.log("Reactotron Loaded")
    );
}
console.tron.log("Hello from Reactotron");
console.tron.log({ user: 'vaibhav', role: 'developer' });

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
