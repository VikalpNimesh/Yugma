import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
} from "react-native";

import MatchList from "./MatchList";
import LikeList from "./LikeList";
import Icon from "react-native-vector-icons/Ionicons";



const matchesData = [
    {
        id: "1",
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        job: "Software Engineer",
        matchedDays: "2 days ago",
        verified: true,
        matchPercent: "94%",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "2",
        name: "Arjun Patel",
        age: 29,
        location: "Bangalore, Karnataka",
        job: "Product Manager",
        matchedDays: "1 week ago",
        verified: true,
        matchPercent: "87%",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: "1",
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        job: "Software Engineer",
        matchedDays: "2 days ago",
        verified: true,
        matchPercent: "94%",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "2",
        name: "Arjun Patel",
        age: 29,
        location: "Bangalore, Karnataka",
        job: "Product Manager",
        matchedDays: "1 week ago",
        verified: true,
        matchPercent: "87%",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    }, {
        id: "1",
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        job: "Software Engineer",
        matchedDays: "2 days ago",
        verified: true,
        matchPercent: "94%",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "2",
        name: "Arjun Patel",
        age: 29,
        location: "Bangalore, Karnataka",
        job: "Product Manager",
        matchedDays: "1 week ago",
        verified: true,
        matchPercent: "87%",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    }, {
        id: "1",
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        job: "Software Engineer",
        matchedDays: "2 days ago",
        verified: true,
        matchPercent: "94%",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: "2",
        name: "Arjun Patel",
        age: 29,
        location: "Bangalore, Karnataka",
        job: "Product Manager",
        matchedDays: "1 week ago",
        verified: true,
        matchPercent: "87%",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
];

const MatchesScreen = () => {
    const [selectedTab, setSelectedTab] = useState("Matches");

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Matches</Text>
            <Text style={styles.subHeader}>
                Connect with compatible partners who share your values
            </Text>


            <View style={styles.tabContainer}>
                {["Matches", "Likes"]?.map((tab) => (
                    <Pressable
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        {tab === "Matches" ? <Icon
                            name={"heart-outline"}
                            size={20}
                            color={"black"}
                        /> : <Icon
                            name={"star-outline"}
                            size={20}
                            color={"black"}
                        />}

                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab} {tab === "Matches" ? "(3)" : "(2)"}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {selectedTab == "Matches" ? <MatchList data={matchesData} /> :

                <LikeList data={matchesData} />
            }


        </View>
    );
};

export default MatchesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    subHeader: {
        fontSize: 16,
        color: "#666",
        marginVertical: 10,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        marginBottom: 20,
        padding: 4,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6
    },
    activeTab: {
        backgroundColor: "#fff",
        elevation: 2,
    },
    tabText: {
        color: "#666",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#000",
        fontWeight: "600",
    },

});
