import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { DiscoveryProfile } from "../api/types/discovery.types";
import THEME from "../constant/theme";

interface ProfileCardProps extends DiscoveryProfile {
  onReport?: () => void;
  onBlock?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  fullName,
  age,
  location,
  profession,
  education,
  photos,
  onReport,
  onBlock,
}) => {
  const rawImage = photos && photos.length > 0 ? photos[0] : null;
  const image: string =
    typeof rawImage === 'string'
      ? rawImage
      : (rawImage as any)?.url ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const handleOptionsPress = () => {
    Alert.alert(
      "Safety & Options",
      `Actions for ${fullName || "this user"}`,
      [
        {
          text: "Report User / Content",
          style: "destructive",
          onPress: () => {
            if (onReport) {
              onReport();
            } else {
              Alert.alert(
                "Report Submitted",
                "Thank you. Our moderation team reviews all reported content within 24 hours to ensure community safety."
              );
            }
          },
        },
        {
          text: "Block User",
          style: "destructive",
          onPress: () => {
            if (onBlock) {
              onBlock();
            } else {
              Alert.alert("User Blocked", `${fullName || "User"} has been blocked and will no longer appear.`);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Full Bleed Image */}
      <Image source={{ uri: image }} style={styles.profileImage} resizeMode="cover" />

      {/* Top Floating Bar with Report/Options */}
      <View style={styles.topBar}>
        <View style={styles.onlinePill}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={handleOptionsPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="ellipsis-horizontal" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(27, 2, 8, 0.7)", "rgba(27, 2, 8, 0.96)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.infoContent}>
          {/* Name, Age & Verified Blue Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{`${fullName || "Arjun"}, ${age || 26}`}</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={22}
              color={THEME.colors.verifiedBlue}
              style={styles.verifiedBadge}
            />
          </View>

          {/* Location & Profession */}
          <Text style={styles.subtitleText}>{location || "Bangalore, Karnataka"}</Text>
          <Text style={styles.professionText}>{profession || "Software Engineer at Google"}</Text>

          {/* Interests Tags */}
          <View style={styles.interestsRow}>
            <View style={styles.interestTag}>
              <Text style={styles.interestText}>Music</Text>
            </View>
            <View style={styles.interestTag}>
              <Text style={styles.interestText}>Travel</Text>
            </View>
            <View style={styles.interestTag}>
              <Text style={styles.interestText}>Fitness</Text>
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
    backgroundColor: "#200208",
    borderRadius: 24,
    height: 520,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  profileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CD964",
  },
  onlineText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  optionsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 50,
  },
  infoContent: {
    width: "100%",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    marginLeft: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  professionText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    marginTop: 2,
  },
  interestsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  interestTag: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  interestText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
});
