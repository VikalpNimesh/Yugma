import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

const MatchList = ({ data }: any) => {

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.avatar} />

            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.matchBadge}>
                    <Text style={styles.name}>
                        {item.name}, {item.age}
                    </Text>
                    <View style={styles.percent}>

                        <Text style={styles.matchText}>{item.matchPercent} match</Text>
                    </View>
                </View>

                <Text style={styles.subText}><Ionicons name="location-outline" size={12} /> {item.location}</Text>
                <Text style={styles.subText}>{item.job}</Text>
                <View style={styles.dateMsg}>

                    <Text style={styles.matchDate}><Ionicons name="calendar-clear-outline" size={12} /> Matched {item.matchedDays}</Text>
                    <Pressable style={styles.messageBtn}>
                        <Feather name="message-circle" size={24} color={"white"} />
                        <Text style={styles.messageText}>
                            {item.verified ? "Message" : "Reply"}
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.verifyBtn}>
                    <Octicons name="shield-check" size={18} color={"black"} />
                    <Text style={styles.verifyBtnText}> Request Verification</Text>
                </Pressable>
                {item.verified && (
                    <View style={styles.verifiedTag}>
                        <Text style={styles.verifiedText}>Verified Profile</Text>
                    </View>
                )}

            </View>

        </View>
    );
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
        />
    )
}

export default MatchList

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#dadada"
    },
    row: {
        flexDirection: "row",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },
    subText: {
        color: "#555",
        fontSize: 13,
        marginTop: 2,
    },
    matchDate: {
        color: "#999",
        fontSize: 12,
        marginTop: 2,
    },
    verifiedTag: {
        backgroundColor: "#d8f5dc",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 6,
        alignSelf: "flex-start",
    },
    verifiedText: {
        color: "#177245",
        fontWeight: "600",
        fontSize: 12,
    },
    verifyBtn: {
        borderWidth: 1,
        borderColor: "#ffb700",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        margin: 6,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 6

    },
    verifyBtnText: {
        color: "black",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",

    },
    matchBadge: {
        // backgroundColor: "#f5f5f5",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    matchText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    messageBtn: {
        backgroundColor: "black",
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 14,
        gap: 6
    },
    messageText: {
        color: "#fff",
        fontWeight: "600",
    },
    dateMsg: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"

    },
    percent: {
        borderWidth: 1,
        borderColor: "#dadada",
        padding: 6,
        borderRadius: 8,
        paddingHorizontal: 10
    }
})