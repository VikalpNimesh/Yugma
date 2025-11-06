import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ProfileCardProps {
    name: string;
    age: number;
    location: string;
    profession: string;
    education: string;
    image: string;
    isVerified?: boolean;
    isPremium?: boolean;
    familyDetails?: {
        father?: string;
        mother?: string;
        siblings?: string;
    };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    age,
    location,
    profession,
    education,
    image,
    isVerified = false,
    isPremium = false,
    familyDetails,
}) => {
    return (
        <View style={styles.card}>
            {/* Profile Image + Badges */}
            <View style={{ position: "relative" }}>
                <Image source={{ uri: image }} style={styles.profileImage} />

                {isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}

                {isPremium && (
                    <View style={styles.premiumBadge}>
                        <Ionicons name="star" color="#fff" size={12} />
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                )}
            </View>

            {/* Profile Details */}
            <View style={styles.details}>
                <Text style={styles.name}>{`${name}, ${age}`}</Text>

                <InfoRow icon="location-outline" text={location} />
                <InfoRow icon="briefcase-outline" text={profession} />
                <InfoRow icon="school-outline" text={education} />

                {/* Family Section */}
                {familyDetails && (
                    <View style={styles.familyBox}>
                        <Text style={styles.familyTitle}>Family Details</Text>
                        {familyDetails.father && (
                            <Text style={styles.familyText}>
                                Father: {familyDetails.father}
                            </Text>
                        )}
                        {familyDetails.mother && (
                            <Text style={styles.familyText}>
                                Mother: {familyDetails.mother}
                            </Text>
                        )}
                        {familyDetails.siblings && (
                            <Text style={styles.familyText}>
                                Siblings: {familyDetails.siblings}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

// ✅ Reusable Info Row (for icons + text)
const InfoRow = ({
    icon,
    text,
}: {
    icon: string;
    text: string;
}) => (
    <View style={styles.row}>
        <Ionicons name={icon} size={16} color="#555" />
        <Text style={styles.text}>{text}</Text>
    </View>
);

export default ProfileCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        marginVertical: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    profileImage: {
        width: "100%",
        height: 300,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    verifiedBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#3CB371",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    verifiedText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    premiumBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#E94057",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 4,
    },
    premiumText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    details: {
        padding: 14,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2,
    },
    text: {
        fontSize: 14,
        color: "#555",
        marginLeft: 6,
    },
    familyBox: {
        backgroundColor: "#FFF6EE",
        borderRadius: 10,
        padding: 10,
        marginTop: 12,
    },
    familyTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
        marginBottom: 4,
    },
    familyText: {
        fontSize: 13,
        color: "#444",
        lineHeight: 18,
    },
});
