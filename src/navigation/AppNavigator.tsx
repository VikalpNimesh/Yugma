import React from "react";
import { NavigationContainer } from "@react-navigation/native";
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
    ProfileDetails: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} options={{ headerShown: false }}
                />
                <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="MultiStepForm" component={MultiStepForm} options={{ headerShown: false }} />
                <Stack.Screen name="FamilyDetailsStep" component={FamilyDetailsStep} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="PreferencesStep" component={PreferencesStep} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="BasicInfo" component={BasicInfoScreen} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="AboutYouStep" component={AboutYouStep} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="MatchesScreen" component={MatchesScreen} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ header: () => <Header />, headerShown: true }} />
                <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ header: () => <Header />, headerShown: true }} />

                {/* sample */}

                <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
