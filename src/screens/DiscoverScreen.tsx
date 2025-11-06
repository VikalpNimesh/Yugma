import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCard from "../components/ProfileCard";
import Swiper from "react-native-deck-swiper";

export const profiles = [
    {
        id: 1,
        name: "Priya Sharma",
        age: 26,
        location: "Mumbai, Maharashtra",
        profession: "Software Engineer",
        education: "Master's in Computer Science",
        image:
            "https://images.pexels.com/photos/33402174/pexels-photo-33402174.jpeg",
        isVerified: true,
        isPremium: true,
        familyDetails: {
            father: "Business Owner",
            mother: "Teacher",
            siblings: "1 sister",
        },
    },
    {
        id: 2,
        name: "Riya Patel",
        age: 24,
        location: "Delhi, India",
        profession: "Fashion Designer",
        education: "Bachelor's in Arts",
        image:
            "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg",
        isVerified: true,
        isPremium: false,
        familyDetails: {
            father: "Doctor",
            mother: "Homemaker",
            siblings: "1 brother",
        },
    },
    {
        id: 3,
        name: "Sneha Verma",
        age: 27,
        location: "Bangalore, Karnataka",
        profession: "Product Manager",
        education: "MBA",
        image:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        isVerified: false,
        isPremium: true,
        familyDetails: {
            father: "Retired Army Officer",
            mother: "Teacher",
            siblings: "2 brothers",
        },
    },
];

const DiscoverScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Discover Partners</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="filter-outline" size={18} color="#000" />
                        <Text style={styles.filterText}>Filters</Text>
                    </TouchableOpacity>
                </View>

                {/* Swiper */}
                <View style={styles.swiperWrapper}>
                    <Swiper
                        cards={profiles}
                        renderCard={(card) => <ProfileCard {...card} />}
                        stackSize={2}
                        backgroundColor="transparent"
                        cardVerticalMargin={10}
                        cardHorizontalMargin={16}
                        animateCardOpacity
                        horizontalSwipe
                        verticalSwipe={false}
                        onSwipedLeft={(index) =>
                            console.log("Swiped left:", profiles[index]?.name)
                        }
                        onSwipedRight={(index) =>
                            console.log("Swiped right:", profiles[index]?.name)
                        }
                    />

                </View>
                <View style={styles.likeDislikebtn}>
                    <TouchableOpacity style={styles.passButton}>
                        <Ionicons name="close" size={28} color="#E64A8B" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <LinearGradient
                            colors={["#FF512F", "#DD2476"]}
                            style={styles.likeButton}
                        >
                            <Ionicons name="heart" size={28} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                    {/* <Text style={styles.swipeText}>
                    Swipe right to like • Swipe left to pass
                </Text> */}
                </View>


            </ScrollView>


        </SafeAreaView>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF9F6" },

    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingHorizontal: 16,
    },
    title: { fontSize: 20, fontWeight: "700", color: "#000" },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#E6E6E6",
    },
    filterText: { marginLeft: 4, color: "#000", fontWeight: "500" },

    swiperWrapper: {
        height: 500,
        marginTop: 10,

        paddingHorizontal: 16

    },

    swipeText: {
        textAlign: "center",
        marginTop: 12,
        color: "#555",
        fontSize: 13,
    },

    actions: {
        // position: "absolute",
        // bottom: 40,
        // left: 0,
        // right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 30,
    },
    passButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#E64A8B",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        elevation: 3,
    },
    likeButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    likeDislikebtn: {
        marginTop: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 30

    }
});
