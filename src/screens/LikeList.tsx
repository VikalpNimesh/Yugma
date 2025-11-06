import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Ionicons";


const LikeList = ({ data }: any) => {

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

                    <Text style={styles.matchDate}><Ionicons name="calendar-clear-outline" size={14} />  Liked {item.matchedDays}</Text>
                    <Pressable style={styles.messageBtn}>
                        <Icon
                            name={"heart-outline"}
                            size={24}
                            color={"black"}
                        />
                        <Text style={styles.messageText}>
                            Like Back
                        </Text>
                    </Pressable>
                </View>




            </View>

        </View>
    );
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.headerCon}>

                        <Text style={styles.header}>People who liked you
                        </Text>
                        <Text style={styles.subHeader}>
                            These people have shown interest in your profile. Like them back to create a match!
                        </Text>
                    </View>
                )}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    )
}

export default LikeList

const styles = StyleSheet.create({
    headerCon: {
        backgroundColor: "#FFF6EE",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16
    },
    header: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 4
    },
    subHeader: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24
    },
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
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
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
        backgroundColor: "white",
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 14,
        gap: 6,
        borderWidth: 1,
        borderColor: "#dadada"
    },
    messageText: {
        color: "black",
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