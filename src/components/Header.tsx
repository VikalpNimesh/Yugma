import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';


const Header = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    // Get the focused route name if it's a nested navigator (like BottomTabs)
    const focusedRoute = getFocusedRouteNameFromRoute(route);
    
    // Determine if we should show the notification icon
    // Show only if we are on 'Discover' (tab) or 'DiscoverScreen' (stack)
    const isDiscoverScreen = route.name === 'DiscoverScreen' || focusedRoute === 'Discover' || (route.name === 'BottomTabs' && !focusedRoute);

    return (
        <View style={styles.header}>
            <View style={styles.logoCon}>
                <Image
                    source={require("../assets/yugmaNew.jpg")}
                    style={{ width: 120, height: 40, resizeMode: "contain" }}
                />
            </View>

            {isAuthenticated && isDiscoverScreen && (
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Notifications')}
                        style={styles.iconButton}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#000" />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    logoCon: {

        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 4,
width:50
    },
    logo: {
        fontSize: 18,
        fontWeight: "700",


    },
    segmentContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        borderColor: "#dadada",
        borderWidth: 1,
        padding: 4


    },
    segmentButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4


    },
    activeSegment: {
        backgroundColor: "#FFE5EC",
        borderRadius: 25,
    },
    segmentActiveText:
        { color: "#E64A8B", fontWeight: "600", fontSize: 13 },
    segmentText:
        { marginLeft: 4, color: "#fff", fontSize: 13 },
    header: {

        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 8,
        elevation: 10,
        paddingHorizontal: 8
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#DD2476',
        borderWidth: 2,
        borderColor: '#fff',
    },
    gradientContainer: {
        borderRadius: 8,



    },

})