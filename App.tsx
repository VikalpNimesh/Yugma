import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";
import { persistor, store } from "./src/redux/store";
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';


export default function App() {

  useNetworkActivityDevTools()

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppNavigator />
        <Toast />
      </PersistGate>
    </Provider>
  );
}
