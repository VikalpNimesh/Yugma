import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTypeSelectionScreen from '../screens/Auth/AppTypeSelectionScreen';
import GoogleLoginScreen from '../screens/Auth/GoogleLoginScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import { BasicInfoScreen } from '../screens/Profile/BasicInfoScreen';
import Header from '../components/Header';

export type AuthStackParamList = {
    AppTypeSelection: undefined;
    GoogleLogin: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    BasicInfo: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="AppTypeSelection"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="AppTypeSelection" component={AppTypeSelectionScreen} />
            <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ header: () => <Header />, headerShown: true }}
            />
            <Stack.Screen
                name="SignupScreen"
                component={SignupScreen}
                options={{ header: () => <Header />, headerShown: true }}
            />
            {/* BasicInfo is part of onboarding so we keep it here. 
                Once verified, AppNavigator takes over. */}
            <Stack.Screen
                name="BasicInfo"
                component={BasicInfoScreen}
                options={{ header: () => <Header />, headerShown: true }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
