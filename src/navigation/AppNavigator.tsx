import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MultiStepForm from "../screens/MultiStepForm";
import FamilyDetailsStep from "../screens/FamilyDetailsStep";
import PreferencesStep from "../screens/PreferencesStep";
import DiscoverScreen from "../screens/DiscoverScreen";
import BottomTabs from "./BottomTabs";
import SplashScreen from "../screens/SplashScreen";
import { BasicInfoScreen } from "../screens/BasicInfoScreen";
import { AboutYouStep } from "../screens/AboutYouStep";
import GoogleLoginScreen from "../screens/GoogleLoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import Header from "../components/Header";
import MatchesScreen from "../screens/MatchesScreen";
import SignupScreen from '../sample/SignupScreen';
import LoginScreen from '../screens/LoginScreen';

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
    ProfileDetails: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            {/* <Header /> */}
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    header: () => <Header />,
                }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} options={{ headerShown: false }}
                />
                <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: true }} />
                <Stack.Screen name="MultiStepForm" component={MultiStepForm} options={{ headerShown: false }} />
                <Stack.Screen name="FamilyDetailsStep" component={FamilyDetailsStep} options={{ headerShown: true }} />
                <Stack.Screen name="PreferencesStep" component={PreferencesStep} options={{ headerShown: true }} />
                <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ headerShown: true }} />
                <Stack.Screen name="BasicInfo" component={BasicInfoScreen} options={{ headerShown: true }} />
                <Stack.Screen name="AboutYouStep" component={AboutYouStep} options={{ headerShown: true }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }} />
                <Stack.Screen name="MatchesScreen" component={MatchesScreen} options={{ headerShown: true }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: true }} />

                {/* sample */}

                <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
