import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DiscoverScreen from "../screens/Home/DiscoverScreen";
import MatchesScreen from "../screens/Home/MatchesScreen";
import MessagesScreen from "../screens/Home/MessagesScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import THEME from "../constant/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const chatUnreadCount = useSelector((state: RootState) =>
    state.chat.unreadMessageCount !== undefined && state.chat.unreadMessageCount > 0
      ? state.chat.unreadMessageCount
      : state.chat.unreadConversationIds.length
  );
  const matchCount = useSelector((state: RootState) => state.chat.matchCount || 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#1B0208",
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = "compass-outline";
          let label = "Discover";
          let isHeart = false;
          let isChat = false;
          let isProfile = false;

          if (route.name === "Discover") {
            iconName = focused ? "compass" : "compass-outline";
            label = "Discover";
          } else if (route.name === "MatchesScreen") {
            iconName = focused ? "heart" : "heart-outline";
            label = "Matches";
            isHeart = true;
          } else if (route.name === "Messages") {
            iconName = focused ? "chatbubble-ellipses" : "chatbubble-outline";
            label = "Messages";
            isChat = true;
          } else if (route.name === "Settings") {
            iconName = focused ? "person" : "person-outline";
            label = "Profile";
            isProfile = true;
          }

          const activeColor = "#FF3366";
          const inactiveColor = "#8C6070";

          return (
            <View style={styles.tabItem}>
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                <Icon
                  name={iconName}
                  size={22}
                  color={focused ? activeColor : inactiveColor}
                />
              </View>

              {/* Messages Badge */}
              {isChat && chatUnreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
                  </Text>
                </View>
              )}

              {/* Matches Badge */}
              {isHeart && matchCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {matchCount > 9 ? "9+" : matchCount}
                  </Text>
                </View>
              )}

              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? activeColor : inactiveColor },
                  focused && styles.tabLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="MatchesScreen" component={MatchesScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
    position: "relative",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  iconWrapperActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: 12,
    backgroundColor: "#FF3366",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#1B0208",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
});