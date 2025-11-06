import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { DatingScreen } from "../screens/DatingScreen";
import { BasicInfoScreen } from "../screens/BasicInfoScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

    useEffect(() => {


        const handleGoogleSignIn = async () => {
            try {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });


                const userInfo = await GoogleSignin.signIn();
                console.log('userInfo: ', userInfo?.data);

            } catch (error: any) {

            }
        }

        handleGoogleSignIn()
    }, [])

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
