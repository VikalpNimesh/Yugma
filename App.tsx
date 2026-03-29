import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View } from "react-native";
import { persistor, store } from "./src/redux/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

function RootNavigator() {
  const isLoggedIn = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  console.log("RootNavigator - isLoggedIn:", isLoggedIn);

  return (
    <NavigationContainer key={isLoggedIn ? 'app' : 'auth'}>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "1095972468168-qjvu8mmdmvb4599mkbvsu4l76c6g63qq.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <RootNavigator />
          <Toast />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}
