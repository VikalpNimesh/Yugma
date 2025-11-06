import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import DiscoverScreen from "../screens/DiscoverScreen";
import { DatingScreen } from "../screens/DatingScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { BasicInfoScreen } from "../screens/BasicInfoScreen";
import MatchesScreen from "../screens/MatchesScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#000",
                tabBarStyle: {
                    // backgroundColor: "#fff",
                    // borderTopColor: "#eee",
                    height: 68,
                    // paddingBottom: 8,
                    paddingTop: 12,

                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "heart-outline";
                    let label = "Discover";

                    if (route.name === "Discover") {
                        iconName = "heart-outline";
                        label = "Discover";
                    } else if (route.name === "MatchesScreen") {
                        iconName = "people-outline";
                        label = "Matches";
                    } else if (route.name === "Messages") {
                        iconName = "chatbubble-outline";
                        label = "Messages";
                    } else if (route.name === "Settings") {
                        iconName = "settings-outline";
                        label = "Settings";
                    }

                    return (
                        <View
                            style={{
                                backgroundColor: focused ? "black" : "transparent",
                                // paddingVertical: 8,
                                // paddingHorizontal: 20,
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 90,
                                height: 60,
                                marginTop: 4
                            }}
                        >
                            <Icon
                                name={iconName}
                                size={24}
                                color={focused ? "#fff" : "#666"}
                            />
                            <Text
                                style={{
                                    color: focused ? "#fff" : "#666",
                                    fontSize: 14,
                                    fontWeight: focused ? "600" : "500",
                                    marginTop: 4,
                                }}
                            >
                                {label}
                            </Text>
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Discover" component={DiscoverScreen} />
            {/* <Tab.Screen name="Dating" component={BasicInfoScreen} /> */}
            <Tab.Screen name="MatchesScreen" component={MatchesScreen} />
            <Tab.Screen name="Messages" component={HomeScreen} />
            <Tab.Screen name="Settings" component={DatingScreen} />
        </Tab.Navigator>
    );
}