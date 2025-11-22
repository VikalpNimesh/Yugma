import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { handleLogout } from "../../api/firebase/auth";
import { useSelector, useDispatch } from "react-redux";

export const DatingScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { email, name, photo } = useSelector((state: any) => state.user?.user || {});
    console.log('email: ', email);

    const handleLogoutPress = async () => {
        try {
            await handleLogout(navigation, dispatch);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dating Mode</Text>
            <Text style={styles.desc}>
                Discover and connect with people who share your vibe.
            </Text>

            <TouchableOpacity onPress={handleLogoutPress} style={{
                width: 200,
                height: 60,
                backgroundColor: "#dadada",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                marginTop: 20
            }}>
                <Text>
                    Logout
                </Text>

            </TouchableOpacity>
            <Text>
                {email}
            </Text>
            <Text>
                {name}
            </Text>
            <Image source={{
                uri: photo
            }} style={{ width: 100, height: 100, marginTop: 20, borderRadius: 50 }} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF8F8",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#E94057",
    },
    desc: {
        fontSize: 14,
        color: "#555",
        marginTop: 10,
    },
});
