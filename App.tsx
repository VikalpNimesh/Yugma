import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { premiumToastConfig } from './src/components/common/PremiumToastConfig';
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, StatusBar } from "react-native";
import { persistor, store } from "./src/redux/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from './src/context/SocketContext';
import { requestUserPermission, notificationListener } from './src/utils/notificationHelper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IapProvider } from './src/context/IapContext';

// Import Rozenite debugging tools
import { useReactNavigationDevTools } from '@rozenite/react-navigation-plugin';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';

function RootNavigator() {
  const navigationRef = useRef<any>(null);
  const isLoggedIn = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  console.log("RootNavigator - isLoggedIn:", isLoggedIn);

  // Initialize Rozenite DevTools plugins
  useReactNavigationDevTools({ ref: navigationRef });
  useNetworkActivityDevTools();

  return (
    <NavigationContainer ref={navigationRef} key={isLoggedIn ? 'app' : 'auth'}>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "719942063573-votd1cg12nv5hti22v6oeks4kliuagbd.apps.googleusercontent.com",
      offlineAccess: false,
    });

    // Initialize Push Notifications
    requestUserPermission();
    const unsubscribe = notificationListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#FF5F6D" />
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#FF5F6D' }} />
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Provider store={store}>
            <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
              <IapProvider>
                <SocketProvider>
                  <RootNavigator />
                </SocketProvider>
              </IapProvider>
              <Toast config={premiumToastConfig} />
            </PersistGate>
          </Provider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
