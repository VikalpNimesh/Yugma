import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";
import { persistor, store } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';

function RootNavigator() {
  const isLoggedIn = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  console.log("isLoggedIn", isLoggedIn);
  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  const navigationRef = useRef(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <RootNavigator />
          <Toast />
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
}
