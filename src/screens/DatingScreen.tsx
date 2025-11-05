import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { handleLogout } from "../utils/firebaseConfig";

export const DatingScreen: React.FC = () => {
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
