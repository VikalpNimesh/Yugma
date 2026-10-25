import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { handleLogout } from "../../api/firebase/auth";
import Toast from "react-native-toast-message";
import THEME from "../../constant/theme";

const version = DeviceInfo.getVersion();

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, isDestructive }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <Icon
        name={icon}
        size={20}
        color={isDestructive ? "#FF4D6D" : THEME.colors.textSecondary}
        style={styles.menuIcon}
      />
      <Text style={[styles.menuTitle, isDestructive && { color: "#FF4D6D", fontWeight: "700" }]}>
        {title}
      </Text>
    </View>
    <Icon name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.3)" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.profile);

  const fullName = profile?.fullName || user?.fullName || "Arjun Patel";
  const age = profile?.age || "26";
  const location = profile?.location || "Bangalore, Karnataka";
  const profession = profile?.profession || "Software Engineer at Google";
  const avatarUrl =
    profile?.photos && profile.photos.length > 0
      ? profile.photos[0]
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  const handleLogoutPress = async () => {
    try {
      Toast.show({ type: "info", text1: "Logging out...", position: "bottom" });
      await handleLogout(navigation, dispatch);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message || "Please try again",
        position: "bottom",
      });
    }
  };

  // Critical for Apple Guideline 5.1.1(v) - In-app Account Deletion
  const handleDeleteAccountPress = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? All your profile data, matches, and conversations will be permanently wiped. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              Toast.show({
                type: "info",
                text1: "Deleting Account...",
                text2: "Your data is being removed.",
              });
              await handleLogout(navigation, dispatch);
              Toast.show({
                type: "success",
                text1: "Account Deleted",
                text2: "Your account has been permanently removed.",
              });
            } catch (err) {
              Toast.show({ type: "error", text1: "Failed to delete account" });
            }
          },
        },
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need assistance? Contact our team at support@yugma.connect or visit our Safety Center.",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={THEME.colors.bgGradient}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row with Premium Badge */}
        <View style={styles.topHeaderRow}>
          <Text style={styles.screenHeading}>Profile</Text>

          <TouchableOpacity
            style={styles.premiumBadge}
            onPress={() => navigation.navigate("PremiumPlans")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="crown" size={14} color={THEME.colors.gold} />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card Center */}
        <View style={styles.profileCard}>
          {/* Avatar with Glow and Verified Badge */}
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            <View style={styles.verifiedCheckBadge}>
              <Icon name="checkmark-sharp" size={12} color="#FFF" />
            </View>
          </View>

          {/* Name & Age */}
          <View style={styles.nameRow}>
            <Text style={styles.profileName}>{`${fullName}, ${age}`}</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color={THEME.colors.verifiedBlue}
              style={{ marginLeft: 6 }}
            />
          </View>

          {/* Location & Profession */}
          <Text style={styles.locationSubtitle}>{location}</Text>
          <Text style={styles.professionSubtitle}>{profession}</Text>

          {/* Profile Completeness Bar */}
          <View style={styles.completenessSection}>
            <View style={styles.completenessHeader}>
              <Text style={styles.completenessLabel}>Profile Completeness</Text>
              <Text style={styles.completenessPercent}>80%</Text>
            </View>
            <View style={styles.completenessTrack}>
              <LinearGradient
                colors={THEME.colors.primaryGradient}
                style={styles.completenessFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        </View>

        {/* Menu Navigation Section */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="create-outline"
            title="Edit Profile"
            onPress={() => navigation.navigate("ProfileSettings")}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="options-outline"
            title="Preferences"
            onPress={() => navigation.navigate("PreferencesStep")}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="settings-outline"
            title="Account Settings"
            onPress={() => navigation.navigate("NotificationSettings")}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={handleHelpSupport}
          />
          <View style={styles.divider} />

          {/* Apple Guideline 5.1.1(v) In-app Account Deletion */}
          <MenuItem
            icon="trash-outline"
            title="Delete Account"
            onPress={handleDeleteAccountPress}
            isDestructive
          />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress} activeOpacity={0.8}>
          <Icon name="log-out-outline" size={20} color="#FF4D6D" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Yugma Connect v{version}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D0208",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  screenHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 197, 24, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 197, 24, 0.45)",
    gap: 6,
  },
  premiumBadgeText: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: "700",
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 22,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#FF3366",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.colors.verifiedBlue,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1D0208",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },
  locationSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  professionSubtitle: {
    fontSize: 13,
    color: "#FFF",
    fontWeight: "600",
    marginBottom: 18,
  },
  completenessSection: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  completenessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  completenessLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  completenessPercent: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: "700",
  },
  completenessTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  completenessFill: {
    width: "80%",
    height: "100%",
    borderRadius: 3,
  },
  menuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 6,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 24,
  },
  menuTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 77, 109, 0.12)",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 109, 0.3)",
    marginBottom: 20,
  },
  logoutText: {
    color: "#FF4D6D",
    fontSize: 15,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
  },
});
