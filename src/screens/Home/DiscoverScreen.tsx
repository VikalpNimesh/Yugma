import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal,
    Image,
    Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-deck-swiper";
import ProfileCard from "../../components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchDiscoveryFeed, passDiscoveryProfile, likeDiscoveryProfile } from "../../redux/slices/discoverySlice";
import socialService from "../../api/services/socialService";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const DiscoverScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const swiperRef = useRef<any>(null);
    const { profiles, loading, error } = useSelector((state: RootState) => state.discovery);
    const [showFilter, setShowFilter] = React.useState(false);
    const [showSwipeTutorial, setShowSwipeTutorial] = React.useState(false);

    useEffect(() => {
        checkTutorial();
    }, []);

    const checkTutorial = async () => {
        const hasSeen = await AsyncStorage.getItem("hasSeenSwipeTutorial");
        if (!hasSeen) {
            setShowSwipeTutorial(true);
        }
    };

    const closeTutorial = async () => {
        setShowSwipeTutorial(false);
        await AsyncStorage.setItem("hasSeenSwipeTutorial", "true");
    };

    useEffect(() => {
        dispatch(fetchDiscoveryFeed());
    }, [dispatch]);

    const handleLike = async (userId: string) => {
        // Dispatch the like action to remove the card from the UI
        dispatch(likeDiscoveryProfile(userId));

        try {
            // Send actual friend request
            await socialService.sendFriendRequest(userId);
            Toast.show({
                type: 'success',
                text1: 'Friend Request Sent!',
                text2: 'They will be notified.',
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to send request',
                text2: error?.response?.data?.message || 'Something went wrong',
            });
        }
    };

    const handlePass = (userId: string) => {
        dispatch(passDiscoveryProfile(userId));
    };

    if (loading && profiles.length === 0) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#E94057" />
            </View>
        );
    }

    if (error && profiles.length === 0) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => dispatch(fetchDiscoveryFeed())} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Discover Partners</Text>
                    {/* <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilter(true)}
                    >
                        <Ionicons name="filter-outline" size={18} color="#000" />
                        <Text style={styles.filterText}>Filters</Text>
                    </TouchableOpacity> */}
                </View>

                {/* Swiper / Content */}
                {profiles.length > 0 ? (
                    <>
                        <View style={styles.swiperWrapper}>
                            <Swiper
                                ref={swiperRef}
                                key={profiles.length} // Force re-render on length change
                                cards={profiles}
                                renderCard={(card) => <ProfileCard {...card} />}
                                stackSize={Math.min(profiles.length, 3)}
                                backgroundColor="transparent"
                                cardVerticalMargin={0}
                                cardHorizontalMargin={16}
                                animateCardOpacity
                                horizontalSwipe
                                verticalSwipe={false}
                                onSwipedLeft={(index) => handlePass(profiles[index].userId)}
                                onSwipedRight={(index) => handleLike(profiles[index].userId)}
                                overlayLabels={{
                                    left: {
                                        title: " ",
                                        style: {
                                            label: {
                                                display: "none",
                                            },
                                            wrapper: {
                                                backgroundColor: "rgba(255, 64, 87, 0.5)", // Light Red for NOPE
                                                borderRadius: 20,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            },
                                        },
                                    },
                                    right: {
                                        title: " ",
                                        style: {
                                            label: {
                                                display: "none",
                                            },
                                            wrapper: {
                                                backgroundColor: "rgba(60, 179, 113, 0.5)", // Light Green for LIKE
                                                borderRadius: 20,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            },
                                        },
                                    },
                                }}
                            />
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

            {/* Absolute Buttons - Outside ScrollView */}
            {profiles.length > 0 && (
                <View style={styles.likeDislikebtn}>
                    <TouchableOpacity
                        style={styles.passButton}
                        onPress={() => {
                            if (profiles.length > 0) swiperRef.current?.swipeLeft();
                        }}
                    >
                        <Ionicons name="close" size={28} color="#E64A8B" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (profiles.length > 0) swiperRef.current?.swipeRight();
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
            )}

            {/* Filter Modal */}
            <Modal visible={showFilter} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowFilter(false)}>
                                <Text style={styles.clearText}>Clear</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilter(false)}>
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Gender Selection */}
                            <Text style={styles.sectionTitle}>Interested In</Text>
                            <View style={styles.chipRow}>
                                {["Mens", "Womens", "Both"].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.chip,
                                            type === "Both" ? styles.activeChip : {},
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            type === "Both" ? styles.activeChipText : {},
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Age Range Slider (Dummy) */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Age Range</Text>
                                <Text style={styles.rangeValue}>20 - 32</Text>
                            </View>
                            <View style={styles.dummySliderTrack}>
                                <View style={styles.dummySliderRange} />
                                <View style={[styles.dummySliderKnob, { left: "20%" }]} />
                                <View style={[styles.dummySliderKnob, { left: "60%" }]} />
                            </View>

                            {/* Distance Slider (Dummy) */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Distance</Text>
                                <Text style={styles.rangeValue}>15 km</Text>
                            </View>
                            <View style={styles.dummySliderTrack}>
                                <View style={[styles.dummySliderRange, { width: "40%" }]} />
                                <View style={[styles.dummySliderKnob, { left: "40%" }]} />
                            </View>

                            {/* Interests */}
                            <Text style={styles.sectionTitle}>Interests</Text>
                            <View style={styles.chipRow}>
                                {["Music", "Cooking", "Travel", "Art", "Gym", "Movies", "Reading"].map((interest) => (
                                    <TouchableOpacity key={interest} style={styles.interestChip}>
                                        <Text style={styles.interestChipText}>{interest}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={() => setShowFilter(false)}
                            >
                                <LinearGradient
                                    colors={["#FF512F", "#DD2476"]}
                                    style={styles.applyButtonGradient}
                                >
                                    <Text style={styles.applyButtonText}>Confirm Filters</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Swipe Tutorial Overlay */}
            <Modal visible={showSwipeTutorial} transparent animationType="fade">
                <TouchableOpacity style={styles.tutorialOverlay} activeOpacity={1} onPress={closeTutorial}>
                    <View style={styles.tutorialContent}>
                        <View style={styles.handRow}>
                            <Ionicons name="hand-left-outline" size={50} color="#fff" />
                            <Text style={styles.tutorialText}>Swipe Left to Pass</Text>
                        </View>
                        <View style={styles.handRow}>
                            <Text style={styles.tutorialText}>Swipe Right to Like</Text>
                            <Ionicons name="hand-right-outline" size={50} color="#fff" />
                        </View>
                        <Text style={styles.tapText}>Tap to start</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
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
        height: 540,
        marginTop: 10,
        paddingHorizontal: 0
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
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        paddingBottom: 20, // Add some safe space
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
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        height: height * 0.7,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: "800", color: "#000" },
    clearText: { color: "#666", fontWeight: "600" },
    doneText: { color: "#E94057", fontWeight: "700" },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 16, marginTop: 8 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    rangeValue: { color: "#E94057", fontWeight: "600" },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#F4F4F4",
    },
    activeChip: {
        backgroundColor: "#FF512F",
    },
    chipText: { color: "#666", fontWeight: "600" },
    activeChipText: { color: "#FFF" },
    dummySliderTrack: {
        height: 6,
        backgroundColor: "#F0F0F0",
        borderRadius: 3,
        marginHorizontal: 10,
        marginBottom: 30,
        position: "relative",
    },
    dummySliderRange: {
        position: "absolute",
        height: "100%",
        backgroundColor: "#FF512F",
        width: "40%",
        left: "20%",
    },
    dummySliderKnob: {
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FFF",
        borderWidth: 2,
        borderColor: "#FF512F",
        top: -9,
        elevation: 3,
    },
    interestChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#EEE",
        backgroundColor: "#FFF",
    },
    interestChipText: { color: "#444", fontSize: 13, fontWeight: "500" },
    applyButton: { marginTop: 30, marginBottom: 40 },
    applyButtonGradient: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    applyButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
    tutorialOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    tutorialContent: { alignItems: "center", gap: 40 },
    handRow: { flexDirection: "row", alignItems: "center", gap: 20 },
    tutorialText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    tapText: { color: "#ddd", marginTop: 40, fontSize: 14 },
});
