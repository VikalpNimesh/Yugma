import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { DiscoveryProfile } from "../api/types/discovery.types";

interface ProfileCardProps extends DiscoveryProfile { }

const ProfileCard: React.FC<ProfileCardProps> = ({
    fullName,
    age,
    location,
    profession,
    education,
    photos,
    familyDetails,
}) => {
    console.log("sad",photos);
    // Get the first photo as the main image, or use a placeholder
    const image =  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=688&ixlib=rb-4.0.3";

    return (
        <View style={styles.card}>
            {/* Full Bleed Image */}
            <Image source={{ uri: image }} style={styles.profileImage} resizeMode="cover" />

            {/* Bottom Gradient Overlay */}
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
                style={styles.gradientOverlay}
            >
                {/* Profile Information */}
                <View style={styles.infoContent}>
                    <Text style={styles.name}>{`${fullName}, ${age}`}</Text>

                    <View style={styles.detailsRow}>
                        <View style={styles.tagLine}>
                            <Ionicons name="location-sharp" size={14} color="#FFF" />
                            <Text style={styles.tagText}>{location}</Text>
                        </View>
                        <View style={styles.tagLine}>
                            <Ionicons name="briefcase-sharp" size={14} color="#FFF" />
                            <Text style={styles.tagText}>{profession}</Text>
                        </View>
                    </View>

                    {/* Tags / Interests could be added here */}
                    <View style={styles.interestsRow}>
                        <View style={styles.interestTag}>
                            <Text style={styles.interestText}>{education}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};


export default ProfileCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#000",
        borderRadius: 20,
        height: 520, // Taller card for Tinder look
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        position: 'relative',
    },
    profileImage: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%', // Cover bottom part
        justifyContent: 'flex-end',
        padding: 20,
    },
    infoContent: {
        marginBottom: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFF",
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    detailsRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 15,
        marginBottom: 12,
    },
    tagLine: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    tagText: {
        fontSize: 15,
        color: "#FFF",
        fontWeight: '500',
    },
    interestsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    interestTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    interestText: {
        fontSize: 13,
        color: "#FFF",
        fontWeight: '600',
    },
});
