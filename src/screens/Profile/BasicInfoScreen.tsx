import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TextInput,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateBasicInfo, setCurrentScreen } from "../../redux/slices/profileFormSlice";
import { indianStatesArray, educationOptions } from "../../constant/constant";
import { SelectionBottomSheet } from "../../components/common/SelectionBottomSheet";

const { width } = Dimensions.get("window");

export const BasicInfoScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);
  const form = useAppSelector((state) => state.profileForm.basicInfo);

  const [dob, setDob] = useState(
    form.dob || (form.age ? `01/01/${new Date().getFullYear() - parseInt(form.age, 10)}` : "")
  );
  const [selectedGender, setSelectedGender] = useState<string>(
    form.gender || profile?.gender || ""
  );
  const [currentCity, setCurrentCity] = useState<string>(
    form.location || profile?.location || ""
  );
  const [fullName, setFullName] = useState<string>(
    form.fullName || profile?.fullName || user?.fullName || ""
  );
  const [education, setEducation] = useState<string>(
    form.education || profile?.education || ""
  );
  const [profession, setProfession] = useState<string>(
    form.profession || profile?.profession || ""
  );

  const handleDobChange = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, "");
    if (numbers.length <= 2) {
      setDob(numbers);
    } else if (numbers.length <= 4) {
      setDob(`${numbers.slice(0, 2)}/${numbers.slice(2)}`);
    } else {
      setDob(`${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`);
    }
  };

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
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

  const openLocationSheet = () => {
    const selectedState = indianStatesArray.find((s) => s.name === currentCity);
    setSheetConfig({
      visible: true,
      title: "Select Location",
      options: indianStatesArray,
      selectedKey: selectedState ? selectedState.key : undefined,
      onSelect: (item) => {
        setCurrentCity(item.name);
        dispatch(updateBasicInfo({ location: item.name }));
        setErrors((prev) => ({ ...prev, location: false }));
      },
      searchable: true,
      searchPlaceholder: "Search city or state...",
    });
  };

  const openEducationSheet = () => {
    const options = educationOptions.map((e) => ({ key: e, name: e }));
    setSheetConfig({
      visible: true,
      title: "Select Education",
      options,
      selectedKey: education,
      onSelect: (item) => {
        setEducation(item.name);
        dispatch(updateBasicInfo({ education: item.name }));
      },
    });
  };

  React.useEffect(() => {
    dispatch(setCurrentScreen("BasicInfo"));
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userBasicInfo");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (parsed.fullName && !fullName) {
            setFullName(parsed.fullName);
            dispatch(updateBasicInfo({ fullName: parsed.fullName }));
          }
        }
      } catch (e) {
        console.error("Error loading user basic info", e);
      }
    };
    loadUserData();

    // Dynamically sync profile and user data if state fields are empty
    if (!fullName && (profile?.fullName || user?.fullName)) {
      const name = profile?.fullName || user?.fullName || "";
      setFullName(name);
      dispatch(updateBasicInfo({ fullName: name }));
    }
    if (!selectedGender && (profile?.gender || form.gender)) {
      const g = profile?.gender || form.gender || "";
      setSelectedGender(g);
      dispatch(updateBasicInfo({ gender: g }));
    }
    if (!currentCity && (profile?.location || form.location)) {
      const loc = profile?.location || form.location || "";
      setCurrentCity(loc);
      dispatch(updateBasicInfo({ location: loc }));
    }
    if (!education && (profile?.education || form.education)) {
      const edu = profile?.education || form.education || "";
      setEducation(edu);
      dispatch(updateBasicInfo({ education: edu }));
    }
    if (!profession && (profile?.profession || form.profession)) {
      const prof = profile?.profession || form.profession || "";
      setProfession(prof);
      dispatch(updateBasicInfo({ profession: prof }));
    }
  }, [dispatch, profile, user]);

  const handleGenderSelect = (gender: "male" | "female") => {
    setSelectedGender(gender);
    dispatch(updateBasicInfo({ gender }));
    setErrors((prev) => ({ ...prev, gender: false }));
  };

  const handleNext = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!selectedGender) newErrors.gender = true;
    if (!currentCity) newErrors.location = true;

    // Estimate age dynamically from DOB or keep existing age
    let calculatedAge = form.age || "";
    if (dob) {
      const parts = dob.split("/");
      if (parts.length === 3) {
        const year = parseInt(parts[2], 10);
        const currentYear = new Date().getFullYear();
        if (!isNaN(year) && year > 1920 && year <= currentYear) {
          calculatedAge = String(currentYear - year);
        }
      }
    }

    dispatch(
      updateBasicInfo({
        fullName: fullName.trim() || undefined,
        gender: selectedGender,
        location: currentCity,
        age: calculatedAge,
        dob: dob || undefined,
        education: education.trim() || undefined,
        profession: profession.trim() || undefined,
      })
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please select your gender and location to proceed.",
      });
      return;
    }

    setErrors({});
    navigation.navigate("AboutYouStep" as never);
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
          { paddingTop: Math.max(insets.top, 24) + 6, paddingBottom: Math.max(insets.bottom, 16) + 4 },
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
            {/* Step Progress Tracker (Step 1 of 4) */}
            <View style={styles.stepHeader}>
              <View style={styles.progressTracker}>
                {/* Step 1 Node (Active Glowing Heart) */}
                <View style={styles.nodeActive}>
                  <MaterialCommunityIcons name="heart" size={14} color="#FFFFFF" />
                </View>

                {/* Connecting Line 1-2 */}
                <View style={styles.progressLineActive} />

                {/* Step 2 Node */}
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

              <Text style={styles.stepText}>Step 1 of 4</Text>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Basic Information</Text>
              <Text style={styles.subtitle}>Tell us about yourself</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Date of Birth */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="DD / MM / YYYY"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={dob}
                    onChangeText={handleDobChange}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <MaterialCommunityIcons
                    name="calendar-month-outline"
                    size={22}
                    color="rgba(255, 255, 255, 0.55)"
                  />
                </View>
              </View>

              {/* Gender Pill Selectors */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {/* Male Card */}
                  <TouchableOpacity
                    style={[
                      styles.genderCard,
                      selectedGender.toLowerCase() === "male"
                        ? styles.genderCardActive
                        : styles.genderCardInactive,
                    ]}
                    onPress={() => handleGenderSelect("male")}
                    activeOpacity={0.85}
                  >
                    <View
                      style={
                        selectedGender.toLowerCase() === "male"
                          ? styles.genderIconActive
                          : styles.genderIconInactive
                      }
                    >
                      <Icon
                        name="person"
                        size={18}
                        color={selectedGender.toLowerCase() === "male" ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.genderText,
                        selectedGender.toLowerCase() === "male" && styles.genderTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  {/* Female Card */}
                  <TouchableOpacity
                    style={[
                      styles.genderCard,
                      selectedGender.toLowerCase() === "female"
                        ? styles.genderCardActive
                        : styles.genderCardInactive,
                    ]}
                    onPress={() => handleGenderSelect("female")}
                    activeOpacity={0.85}
                  >
                    <View
                      style={
                        selectedGender.toLowerCase() === "female"
                          ? styles.genderIconActive
                          : styles.genderIconInactive
                      }
                    >
                      <Icon
                        name="person"
                        size={18}
                        color={selectedGender.toLowerCase() === "female" ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.genderText,
                        selectedGender.toLowerCase() === "female" && styles.genderTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Location */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Location</Text>
                <TouchableOpacity
                  style={[
                    styles.inputWrapper,
                    errors.location && { borderColor: "#FF6B6B" },
                  ]}
                  onPress={openLocationSheet}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.locationText,
                      !currentCity && { color: "rgba(255, 255, 255, 0.45)" },
                    ]}
                  >
                    {currentCity || "Current City"}
                  </Text>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={22}
                    color="rgba(255, 255, 255, 0.55)"
                  />
                </TouchableOpacity>
              </View>

              {/* Extra Field: Education (Preserved with beautiful matching UI) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Education</Text>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={openEducationSheet}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.locationText,
                      !education && { color: "rgba(255, 255, 255, 0.45)" },
                    ]}
                  >
                    {education || "Select Highest Education"}
                  </Text>
                  <Icon
                    name="school-outline"
                    size={20}
                    color="rgba(255, 255, 255, 0.55)"
                  />
                </TouchableOpacity>
              </View>

              {/* Extra Field: Profession (Preserved with beautiful matching UI) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Profession</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Software Engineer, Doctor"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={profession}
                    onChangeText={setProfession}
                  />
                  <Icon
                    name="briefcase-outline"
                    size={20}
                    color="rgba(255, 255, 255, 0.55)"
                  />
                </View>
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
  nodeActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E82E5D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E82E5D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
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
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
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
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
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
