import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updatePreferences, setCurrentScreen, completeProfile } from "../../redux/slices/profileFormSlice";
import { useNavigation } from "@react-navigation/native";
import { indianStatesArray } from "../../constant/constant";
import { SelectionBottomSheet } from "../../components/common/SelectionBottomSheet";

const { width } = Dimensions.get("window");

export const PreferencesStep: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const profile = useAppSelector((state) => state.auth.profile);
  const form = useAppSelector((state) => state.profileForm.preferences);
  const basicInfo = useAppSelector((state) => state.profileForm.basicInfo);

  // Default to opposite gender preference dynamically
  const userGender = basicInfo.gender || profile?.gender || "";
  const defaultLookingFor = userGender.toLowerCase() === "male" ? "female" : (userGender.toLowerCase() === "female" ? "male" : "");
  const [lookingFor, setLookingFor] = useState<string>(
    form.preferredGender || profile?.preferences?.preferredGender || defaultLookingFor
  );
  const [minAge, setMinAge] = useState<number>(
    form.preferredAgeMin ? parseInt(form.preferredAgeMin, 10) : (profile?.preferences?.ageMin || 21)
  );
  const [maxAge, setMaxAge] = useState<number>(
    form.preferredAgeMax ? parseInt(form.preferredAgeMax, 10) : (profile?.preferences?.ageMax || 35)
  );
  const [preferredLocation, setPreferredLocation] = useState<string>(
    form.preferredLocations ||
    (profile?.preferences?.preferredLocations && profile.preferences.preferredLocations.length > 0
      ? profile.preferences.preferredLocations.map((l: any) => l.location || l).join(", ")
      : "Select preferred location")
  );

  const [sheetConfig, setSheetConfig] = useState<{
    visible: boolean;
    title: string;
    options: any[];
    selectedKey?: string;
    onSelect: (option: any) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
  }>({
    visible: false,
    title: "",
    options: [],
    selectedKey: undefined,
    onSelect: () => { },
    searchable: false,
  });

  React.useEffect(() => {
    dispatch(setCurrentScreen("PreferencesStep"));
  }, [dispatch]);

  const openLocationSheet = () => {
    setSheetConfig({
      visible: true,
      title: "Select Preferred Location",
      options: [{ key: "ANY", name: "Any Location" }, ...indianStatesArray],
      selectedKey: preferredLocation,
      onSelect: (item) => {
        setPreferredLocation(item.name);
        dispatch(updatePreferences({ preferredLocations: item.name }));
      },
      searchable: true,
      searchPlaceholder: "Search city or state...",
    });
  };

  const handleNext = async () => {
    try {
      dispatch(
        updatePreferences({
          preferredGender: lookingFor,
          preferredAgeMin: String(minAge),
          preferredAgeMax: String(maxAge),
          preferredLocations: preferredLocation === "Select preferred location" ? "" : preferredLocation,
        })
      );

      // Trigger profile completion dynamically with backend
      try {
        await dispatch(completeProfile() as any);
      } catch (e) {
        console.warn("Backend update skipped or failed:", e);
      }
      navigation.navigate("ProfileCompleteScreen" as never);
    } catch (err) {
      navigation.navigate("ProfileCompleteScreen" as never);
    }
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
            {/* Step Progress Tracker (Step 3 of 4) */}
            <View style={styles.stepHeader}>
              <View style={styles.progressTracker}>
                {/* Step 1 Node (Completed Heart) */}
                <View style={styles.nodeCompleted}>
                  <MaterialCommunityIcons name="heart" size={14} color="#FFFFFF" />
                </View>

                {/* Connecting Line 1-2 (Active) */}
                <View style={styles.progressLineActive} />

                {/* Step 2 Node (Completed) */}
                <View style={styles.nodeCompleted}>
                  <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                </View>

                {/* Connecting Line 2-3 (Active) */}
                <View style={styles.progressLineActive} />

                {/* Step 3 Node (Active Target) */}
                <View style={styles.nodeTarget}>
                  <View style={styles.nodeTargetInner} />
                </View>

                {/* Connecting Line 3-4 */}
                <View style={styles.progressLineInactive} />

                {/* Step 4 Node */}
                <View style={styles.nodeInactive} />
              </View>

              <Text style={styles.stepText}>Step 3 of 4</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Preferences</Text>
              <Text style={styles.subtitle}>Tell us what you're looking for</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Looking for: Gender cards */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>I am looking for</Text>
                <View style={styles.genderRow}>
                  {/* Male Card */}
                  <TouchableOpacity
                    style={[
                      styles.genderCard,
                      lookingFor.toLowerCase() === "male"
                        ? styles.genderCardActive
                        : styles.genderCardInactive,
                    ]}
                    onPress={() => setLookingFor("male")}
                    activeOpacity={0.85}
                  >
                    <View
                      style={
                        lookingFor.toLowerCase() === "male"
                          ? styles.genderIconActive
                          : styles.genderIconInactive
                      }
                    >
                      <Icon
                        name="person"
                        size={18}
                        color={lookingFor.toLowerCase() === "male" ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.genderText,
                        lookingFor.toLowerCase() === "male" && styles.genderTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  {/* Female Card */}
                  <TouchableOpacity
                    style={[
                      styles.genderCard,
                      lookingFor.toLowerCase() === "female"
                        ? styles.genderCardActive
                        : styles.genderCardInactive,
                    ]}
                    onPress={() => setLookingFor("female")}
                    activeOpacity={0.85}
                  >
                    <View
                      style={
                        lookingFor.toLowerCase() === "female"
                          ? styles.genderIconActive
                          : styles.genderIconInactive
                      }
                    >
                      <Icon
                        name="person"
                        size={18}
                        color={lookingFor.toLowerCase() === "female" ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.genderText,
                        lookingFor.toLowerCase() === "female" && styles.genderTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Age Range Slider */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Age Range</Text>
                <View style={styles.ageValuesRow}>
                  <View style={styles.agePill}>
                    <Text style={styles.ageValueNumber}>{minAge}</Text>
                  </View>
                  <View style={styles.agePill}>
                    <Text style={styles.ageValueNumber}>{maxAge}</Text>
                  </View>
                </View>

                {/* Interactive Age Track Controls */}
                <View style={styles.dualSliderWrapper}>
                  {/* Left Slider (Min Age: 18 - 35) */}
                  <View style={styles.sliderSegment}>
                    <View style={styles.sliderLineBg}>
                      <View
                        style={[
                          styles.sliderLineActive,
                          { width: `${((minAge - 18) / 17) * 100}%` },
                        ]}
                      />
                      <View style={styles.sliderKnob} />
                    </View>
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setMinAge((prev) => Math.max(18, prev - 1))}
                        activeOpacity={0.7}
                      >
                        <Icon name="remove" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.stepLabel}>Min: {minAge}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setMinAge((prev) => Math.min(maxAge - 1, prev + 1))}
                        activeOpacity={0.7}
                      >
                        <Icon name="add" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Right Slider (Max Age: minAge - 60) */}
                  <View style={styles.sliderSegment}>
                    <View style={styles.sliderLineBg}>
                      <View
                        style={[
                          styles.sliderLineActive,
                          { width: `${((maxAge - 22) / 38) * 100}%` },
                        ]}
                      />
                      <View style={styles.sliderKnob} />
                    </View>
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setMaxAge((prev) => Math.max(minAge + 1, prev - 1))}
                        activeOpacity={0.7}
                      >
                        <Icon name="remove" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.stepLabel}>Max: {maxAge}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setMaxAge((prev) => Math.min(60, prev + 1))}
                        activeOpacity={0.7}
                      >
                        <Icon name="add" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {/* Preferred Location */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Location</Text>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={openLocationSheet}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.locationText,
                      preferredLocation === "Select preferred location" && {
                        color: "rgba(255, 255, 255, 0.45)",
                      },
                    ]}
                  >
                    {preferredLocation}
                  </Text>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={22}
                    color="rgba(255, 255, 255, 0.55)"
                  />
                </TouchableOpacity>
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

      <SelectionBottomSheet
        visible={sheetConfig.visible}
        title={sheetConfig.title}
        options={sheetConfig.options}
        selectedKey={sheetConfig.selectedKey}
        onSelect={sheetConfig.onSelect}
        onClose={() => setSheetConfig((prev) => ({ ...prev, visible: false }))}
        searchable={sheetConfig.searchable}
        searchPlaceholder={sheetConfig.searchPlaceholder}
      />
    </View>
  );
};

export default PreferencesStep;

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
    gap: 22,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: 14,
  },
  genderCard: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  genderCardActive: {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    borderWidth: 1.5,
    borderColor: "#E82E5D",
    shadowColor: "#E82E5D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  genderCardInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  genderIconActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E82E5D",
    alignItems: "center",
    justifyContent: "center",
  },
  genderIconInactive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  genderText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 15,
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  ageValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  agePill: {
    alignItems: "center",
  },
  ageValueNumber: {
    color: "#F4BA78",
    fontSize: 16,
    fontWeight: "700",
  },
  dualSliderWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 16,
    gap: 14,
  },
  sliderSegment: {
    gap: 8,
  },
  sliderLineBg: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 2,
    position: "relative",
    justifyContent: "center",
  },
  sliderLineActive: {
    height: 4,
    backgroundColor: "#E82E5D",
    borderRadius: 2,
  },
  sliderKnob: {
    position: "absolute",
    left: "50%",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#F4BA78",
    borderWidth: 2,
    borderColor: "#E82E5D",
  },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 13,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.13)",
    paddingHorizontal: 18,
    height: 56,
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  nextBtnWrapper: {
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 28,
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
