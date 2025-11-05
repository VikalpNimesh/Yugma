import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { DatingScreen } from "../screens/DatingScreen";
import { BasicInfoScreen } from "../screens/BasicInfoScreen";
import MultiStepForm from "../screens/MultiStepForm";
import FamilyDetailsStep from "../screens/FamilyDetailsStep";
import PreferencesStep from "../screens/PreferencesStep";
import DiscoverScreen from "../screens/DiscoverScreen";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            // screenOptions={{
            //     headerShown: false,
            //     tabBarActiveTintColor: "#E94057",
            //     tabBarInactiveTintColor: "#777",
            //     tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
            // }}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#ff5f6d",
                tabBarInactiveTintColor: "#999",
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderTopColor: "#eee",
                    height: 60,
                    paddingBottom: 6,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName = "home-outline";
                    if (route.name === "Matches") iconName = "heart-outline";
                    else if (route.name === "Messages") iconName = "chatbubble-outline";
                    else if (route.name === "Settings") iconName = "settings-outline";

                    return <Icon name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Discover" component={DatingScreen} />
            <Tab.Screen name="Dating" component={DatingScreen} />
            <Tab.Screen name="Matrimonial" component={HomeScreen} />
            <Tab.Screen name="BasicInfo" component={BasicInfoScreen} />

        </Tab.Navigator>
    );
}
