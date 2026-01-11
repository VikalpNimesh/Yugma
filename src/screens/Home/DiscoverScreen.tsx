import React, { useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";
import ProfileCard from "../../components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchDiscoveryFeed, likeDiscoveryProfile, passDiscoveryProfile } from "../../redux/slices/discoverySlice";

const DiscoverScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profiles, loading, error } = useSelector((state: RootState) => state.discovery);

    useEffect(() => {
        dispatch(fetchDiscoveryFeed());
    }, [dispatch]);

    const handleLike = (userId: string) => {
        dispatch(likeDiscoveryProfile(userId));
    };

    const handlePass = (userId: string) => {
        dispatch(passDiscoveryProfile(userId));
    };

    if (loading && profiles.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#E94057" />
            </SafeAreaView>
        );
    }

    if (error && profiles.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => dispatch(fetchDiscoveryFeed())} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
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

                {/* Swiper / Content */}
                {profiles.length > 0 ? (
                    <>
                        <View style={styles.swiperWrapper}>
                            <Swiper
                                key={profiles.length} // Force re-render on length change
                                cards={profiles}
                                renderCard={(card) => <ProfileCard {...card} />}
                                stackSize={Math.min(profiles.length, 3)}
                                backgroundColor="transparent"
                                cardVerticalMargin={10}
                                cardHorizontalMargin={16}
                                animateCardOpacity
                                horizontalSwipe
                                verticalSwipe={false}
                                onSwipedLeft={(index) => handlePass(profiles[index].userId)}
                                onSwipedRight={(index) => handleLike(profiles[index].userId)}
                            />
                        </View>
                        <View style={styles.likeDislikebtn}>
                            <TouchableOpacity
                                style={styles.passButton}
                                onPress={() => {
                                    if (profiles.length > 0) handlePass(profiles[0].userId);
                                }}
                            >
                                <Ionicons name="close" size={28} color="#E64A8B" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (profiles.length > 0) handleLike(profiles[0].userId);
                                }}
                            >
                                <LinearGradient
                                    colors={["#FF512F", "#DD2476"]}
                                    style={styles.likeButton}
                                >
                                    <Ionicons name="heart" size={28} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No more profiles found!</Text>
                        <TouchableOpacity onPress={() => dispatch(fetchDiscoveryFeed())} style={styles.retryButton}>
                            <Text style={styles.retryText}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF9F6" },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
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
    },
    errorText: {
        fontSize: 16,
        color: "#E64A8B",
        textAlign: "center",
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#555",
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#E94057",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
