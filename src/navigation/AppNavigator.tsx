import React, { useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MultiStepForm from "../screens/Profile/MultiStepForm";
import FamilyDetailsStep from "../screens/Profile/FamilyDetailsStep";
import PreferencesStep from "../screens/Profile/PreferencesStep";
import DiscoverScreen from "../screens/Home/DiscoverScreen";
import BottomTabs from "./BottomTabs";
import SplashScreen from "../screens/SplashScreen";
import { BasicInfoScreen } from "../screens/Profile/BasicInfoScreen";
import { AboutYouStep } from "../screens/Profile/AboutYouStep";
import GoogleLoginScreen from "../screens/Auth/GoogleLoginScreen";
import { HomeScreen } from "../screens/Home/HomeScreen";
import Header from "../components/Header";
import MatchesScreen from "../screens/Home/MatchesScreen";
import SignupScreen from "../screens/Auth/SignupScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import ProfileSettingsScreen from "../screens/Settings/ProfileSettingsScreen";
import NotificationSettingsScreen from "../screens/Settings/NotificationSettingsScreen";
import PrivacySettingsScreen from "../screens/Settings/PrivacySettingsScreen";
import PremiumSettingsScreen from "../screens/Settings/PremiumSettingsScreen";
import VerificationSettingsScreen from "../screens/Settings/VerificationSettingsScreen";
import NotificationsScreen from "../screens/Notifications/NotificationsScreen";
import PremiumPlansScreen from "../screens/Premium/PremiumPlansScreen";
import AppTypeSelectionScreen from "../screens/Auth/AppTypeSelectionScreen";
import ChatScreen from "../screens/Home/ChatScreen";
import WaitingScreen from "../screens/Auth/WaitingScreen";

export type RootStackParamList = {
    Splash: undefined;
    GoogleLogin: undefined;
    BottomTabs: undefined;
    MultiStepForm: undefined;
    FamilyDetailsStep: undefined;
    PreferencesStep: undefined;
    DiscoverScreen: undefined;
    BasicInfo: undefined;
    AboutYouStep: undefined;
    HomeScreen: undefined;
    MatchesScreen: undefined;
    LoginScreen: undefined;
    SettingsScreen: undefined;
    ProfileSettings: undefined;
    NotificationSettings: undefined;
    PrivacySettings: undefined;
    PremiumSettings: undefined;
    VerificationSettings: undefined;
    Notifications: undefined;
    PremiumPlans: undefined;
    ProfileDetails: { userId: string };
    Matrimonial: undefined;
    AppTypeSelection: undefined;
    SignupScreen: undefined;
    ChatScreen: { userId: string, name: string, avatar: string };
    WaitingScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {

    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ header: () => <Header />, headerShown: true }} />
            <Stack.Screen name="MultiStepForm" component={MultiStepForm} options={{ headerShown: false }} />
            <Stack.Screen name="FamilyDetailsStep" component={FamilyDetailsStep} options={{ headerShown: false }} />
            <Stack.Screen name="PreferencesStep" component={PreferencesStep} options={{ headerShown: false }} />
            <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ header: () => <Header />, headerShown: true }} />
            <Stack.Screen name="BasicInfo" component={BasicInfoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AboutYouStep" component={AboutYouStep} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ header: () => <Header />, headerShown: true }} />
            <Stack.Screen name="MatchesScreen" component={MatchesScreen} options={{ header: () => <Header />, headerShown: true }} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ header: () => <Header />, headerShown: true }} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PremiumSettings" component={PremiumSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerificationSettings" component={VerificationSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PremiumPlans" component={PremiumPlansScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AppTypeSelection" component={AppTypeSelectionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WaitingScreen" component={WaitingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
