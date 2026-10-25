import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateAboutYou, setCurrentScreen } from "../../redux/slices/profileFormSlice";

export const AboutYouStep: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.profile);
  const { bio, interests, photos } = useAppSelector(
    (state) => state.profileForm.aboutYou
  );

  const [localBio, setLocalBio] = useState(bio || profile?.bio || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    interests && interests.length > 0
      ? interests
      : (profile?.interests || []).map((i: any) => typeof i === 'string' ? i : i.interest)
  );
  const [showAllInterests, setShowAllInterests] = useState(false);

  const primaryInterests = ["Travel", "Music", "Food", "Movies", "Books"];
  const extraInterests = ["Fitness", "Art", "Tech", "Nature", "Cooking", "Photography"];

  const visibleInterests = showAllInterests
    ? [...primaryInterests, ...extraInterests]
    : primaryInterests;

  React.useEffect(() => {
    dispatch(setCurrentScreen("AboutYouStep"));
  }, [dispatch]);

  const toggleInterest = (interest: string) => {
    let updated;
    if (selectedInterests.includes(interest)) {
      updated = selectedInterests.filter((item) => item !== interest);
    } else {
      updated = [...selectedInterests, interest];
    }
    setSelectedInterests(updated);
    dispatch(updateAboutYou({ interests: updated }));
  };

  const handleAddPhotos = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 4,
    });
    if (result.assets) {
      const uris = result.assets.map((a) => a.uri!) as string[];
      const updatedPhotos = [...(photos || []), ...uris].slice(0, 6);
      dispatch(updateAboutYou({ photos: updatedPhotos }));
    }
  };

  const handleNext = () => {
    if (!localBio.trim() || localBio.trim().length < 5) {
      Toast.show({
        type: "error",
        text1: "Bio required",
        text2: "Please write a brief bio about yourself.",
      });
      return;
    }

    dispatch(
      updateAboutYou({
        bio: localBio.trim(),
        interests: selectedInterests,
        photos: photos || [],
      })
    );

    navigation.navigate("PreferencesStep" as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Royal Wine Background Gradient */}
      <LinearGradient
        colors={["#2A020F", "#380415", "#1F020B", "#140106"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.innerContainer,
          {
            paddingTop: Math.max(insets.top, 24) + 6,
            paddingBottom: Math.max(insets.bottom, 16) + 4,
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step Progress Tracker (Step 2 of 4) */}
            <View style={styles.stepHeader}>
              <View style={styles.progressTracker}>
                {/* Step 1 Node (Completed Heart) */}
                <View style={styles.nodeCompleted}>
                  <MaterialCommunityIcons name="heart" size={14} color="#FFFFFF" />
                </View>

                {/* Connecting Line 1-2 (Active) */}
                <View style={styles.progressLineActive} />

                {/* Step 2 Node (Target Ring Active) */}
                <View style={styles.nodeTarget}>
                  <View style={styles.nodeTargetInner} />
                </View>

                {/* Connecting Line 2-3 */}
                <View style={styles.progressLineInactive} />

                {/* Step 3 Node */}
                <View style={styles.nodeInactive} />

                {/* Connecting Line 3-4 */}
                <View style={styles.progressLineInactive} />

                {/* Step 4 Node */}
                <View style={styles.nodeInactive} />
              </View>

              <Text style={styles.stepText}>Step 2 of 4</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>About You</Text>
              <Text style={styles.subtitle}>Help others know the real you</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Bio Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Bio</Text>
                <View style={styles.bioWrapper}>
                  <TextInput
                    style={styles.bioInput}
                    placeholder="Write something about yourself..."
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={localBio}
                    onChangeText={(text) => {
                      if (text.length <= 250) setLocalBio(text);
                    }}
                    multiline
                    numberOfLines={4}
                    maxLength={250}
                    textAlignVertical="top"
                  />
                  <Text style={styles.charCounter}>{localBio.length}/250</Text>
                </View>
              </View>

              {/* Interests Section */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Interests</Text>
                <Text style={styles.fieldSubLabel}>Select some of your interests</Text>

                <View style={styles.interestsGrid}>
                  {visibleInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <TouchableOpacity
                        key={interest}
                        style={[
                          styles.interestPill,
                          isSelected
                            ? styles.interestPillActive
                            : styles.interestPillInactive,
                        ]}
                        onPress={() => toggleInterest(interest)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.interestPillText,
                            isSelected && styles.interestPillTextActive,
                          ]}
                        >
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.addMorePill}
                    onPress={() => setShowAllInterests(!showAllInterests)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addMorePillText}>
                      {showAllInterests ? "- Show Less" : "+ Add More"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Preserved Extra Field: Photos */}
              <View style={styles.fieldGroup}>
                <View style={styles.photoHeaderRow}>
                  <Text style={styles.fieldLabel}>Photos</Text>
                  <TouchableOpacity onPress={handleAddPhotos}>
                    <Text style={styles.addPhotosText}>+ Add Photos</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.photoRow}
                >
                  {photos &&
                    photos.map((uri, idx) => (
                      <Image key={idx} source={{ uri }} style={styles.photoThumb} />
                    ))}
                  <TouchableOpacity
                    style={styles.uploadPlaceholder}
                    onPress={handleAddPhotos}
                  >
                    <Icon name="camera-outline" size={24} color="rgba(255, 255, 255, 0.55)" />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
              style={styles.nextBtnWrapper}
              onPress={handleNext}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={["#E82E5D", "#D91C50", "#BF1342"]}
                style={styles.nextBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextBtnText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F020B",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 22,
  },
  scrollContent: {
    paddingBottom: 36,
    paddingTop: 10,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  progressTracker: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeCompleted: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E82E5D",
    alignItems: "center",
    justifyContent: "center",
  },
  nodeTarget: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#F4BA78",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244, 186, 120, 0.15)",
  },
  nodeTargetInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F4BA78",
  },
  nodeInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  progressLineActive: {
    width: 32,
    height: 2,
    backgroundColor: "#F4BA78",
    opacity: 0.7,
  },
  progressLineInactive: {
    width: 32,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  stepText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 13,
    fontWeight: "600",
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4BA78",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 4,
    fontWeight: "500",
  },
  formContainer: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  fieldSubLabel: {
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 13,
    marginTop: -2,
    marginBottom: 4,
  },
  bioWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.13)",
    padding: 16,
    minHeight: 130,
    justifyContent: "space-between",
  },
  bioInput: {
    color: "#FFFFFF",
    fontSize: 15,
    minHeight: 75,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  charCounter: {
    alignSelf: "flex-end",
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  interestPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
  },
  interestPillActive: {
    backgroundColor: "rgba(232, 46, 93, 0.2)",
    borderColor: "#E82E5D",
    shadowColor: "#E82E5D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  interestPillInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  interestPillText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 14,
    fontWeight: "600",
  },
  interestPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  addMorePill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
  },
  addMorePillText: {
    color: "#F4BA78",
    fontSize: 13,
    fontWeight: "600",
  },
  photoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  addPhotosText: {
    color: "#F4BA78",
    fontSize: 13,
    fontWeight: "600",
  },
  photoRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  photoThumb: {
    width: 68,
    height: 68,
    borderRadius: 14,
    marginRight: 10,
  },
  uploadPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnWrapper: {
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 30,
    shadowColor: "#E82E5D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  nextBtn: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
