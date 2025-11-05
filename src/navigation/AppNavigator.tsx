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

export type RootStackParamList = {
    MainTabs: undefined;
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
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="BottomTabs" component={BottomTabs} />
                <Stack.Screen name="MultiStepForm" component={MultiStepForm} />
                <Stack.Screen name="FamilyDetailsStep" component={FamilyDetailsStep} />
                <Stack.Screen name="PreferencesStep" component={PreferencesStep} />
                <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
                <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
                <Stack.Screen name="AboutYouStep" component={AboutYouStep} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
