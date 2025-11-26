import React from "react";
import Toast from 'react-native-toast-message';
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";
import { persistor, store } from "./src/redux/store";


export default function App() {


  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppNavigator />
        <Toast />
      </PersistGate>
    </Provider>
  );
}
