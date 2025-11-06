import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { handleLogout } from "../utils/firebaseConfig";
import { useSelector } from "react-redux";

export const DatingScreen: React.FC = () => {
    const { email, name, photo } = useSelector(state => state.user?.user);
    const data = useSelector(state => state.user?.user);
    console.log('data: ', data);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dating Mode</Text>
            <Text style={styles.desc}>
                Discover and connect with people who share your vibe.
            </Text>

            <TouchableOpacity onPress={handleLogout} style={{
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
