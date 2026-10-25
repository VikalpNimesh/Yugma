import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AppTypeSelectionScreen from '../screens/Auth/AppTypeSelectionScreen';
import GenderSelectionScreen from '../screens/Auth/GenderSelectionScreen';
import GoogleLoginScreen from '../screens/Auth/GoogleLoginScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import { BasicInfoScreen } from '../screens/Profile/BasicInfoScreen';
import { AboutYouStep } from '../screens/Profile/AboutYouStep';
import PreferencesStep from '../screens/Profile/PreferencesStep';
import ProfileCompleteScreen from '../screens/Profile/ProfileCompleteScreen';
import BottomTabs from './BottomTabs';
import Header from '../components/Header';

export type AuthStackParamList = {
    Splash: undefined;
    AppTypeSelection: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    GenderSelection: undefined;
    GoogleLogin: undefined;
    BasicInfo: undefined;
    AboutYouStep: undefined;
    PreferencesStep: undefined;
    ProfileCompleteScreen: undefined;
    BottomTabs: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="AppTypeSelection" component={AppTypeSelectionScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
            <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
            <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
            <Stack.Screen name="AboutYouStep" component={AboutYouStep} />
            <Stack.Screen name="PreferencesStep" component={PreferencesStep} />
            <Stack.Screen name="ProfileCompleteScreen" component={ProfileCompleteScreen} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
