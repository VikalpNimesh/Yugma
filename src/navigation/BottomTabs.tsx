import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import DiscoverScreen from "../screens/Home/DiscoverScreen";
import { DatingScreen } from "../screens/Home/DatingScreen";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { BasicInfoScreen } from "../screens/Profile/BasicInfoScreen";
import MatchesScreen from "../screens/Home/MatchesScreen";
import MessagesScreen from "../screens/Home/MessagesScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const unreadCount = useSelector((state: RootState) => state.chat.unreadConversationIds.length);
    const unreadNotifications = useSelector((state: RootState) => state.notification.unreadCount);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#FF5F6D",
                tabBarStyle: {
                    height: 58,
                    paddingTop: 8,
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
                                backgroundColor: focused ? "#FF5F6D" : "transparent",
                                borderRadius: 8,
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 70,
                                height: 48,
                                marginTop: 2
                            }}
                        >
                            <Icon
                                name={iconName}
                                size={20}
                                color={focused ? "#fff" : "#666"}
                            />
                            {route.name === "Messages" && unreadCount > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 18,
                                    backgroundColor: '#ff3b30',
                                    borderRadius: 10,
                                    minWidth: 18,
                                    height: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 4,
                                    zIndex: 1
                                }}>
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Text>
                                </View>
                            )}

                            <Text
                                style={{
                                    color: focused ? "#fff" : "#666",
                                    fontSize: 11,
                                    fontWeight: focused ? "600" : "500",
                                    marginTop: 2,
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
            <Tab.Screen name="Messages" component={MessagesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}