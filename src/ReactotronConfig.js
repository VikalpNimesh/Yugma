import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let reactotron = null;

if (__DEV__) {
    reactotron = Reactotron
        .setAsyncStorageHandler(AsyncStorage) // for Reactotron state sync
        .configure({
            name: 'VivahSetu App',
            host: 'localhost'

        })
        .useReactNative({
            networking: {
                ignoreUrls: /symbolicate/,
            },
        })
        .connect();

    console.tron = reactotron;
    reactotron.clear();
}

export default reactotron;
