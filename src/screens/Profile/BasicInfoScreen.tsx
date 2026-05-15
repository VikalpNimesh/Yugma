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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateBasicInfo, setCurrentScreen } from "../../redux/slices/profileFormSlice";
import { handleLogout } from "../../api/firebase/auth";

const { width } = Dimensions.get("window");

export const BasicInfoScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const form = useAppSelector((state) => state.profileForm.basicInfo);

    React.useEffect(() => {
        dispatch(setCurrentScreen('BasicInfo'));
        const loadUserData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('userBasicInfo');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    dispatch(updateBasicInfo({ ...userData, region: 'Brahmin' }));
                } else {
                    dispatch(updateBasicInfo({ region: 'Brahmin' }));
                }
            } catch (error) {
                console.error('Failed to load user data from AsyncStorage:', error);
                dispatch(updateBasicInfo({ region: 'Brahmin' }));
            }
        };
        loadUserData();
    }, [dispatch]);

    const handleChange = (field: keyof typeof form, value: string) => {
        dispatch(updateBasicInfo({ [field]: value }));
    };

    const handleNext = () => {
        const { fullName, email, age, location, profession, education, region } = form;
        if (!fullName || !email || !age || !location || !profession || !education || !region) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all required fields to proceed.',
            });
            return;
        }
        navigation.navigate("AboutYouStep" as never);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.stepText}>Step 1 of 4</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: "25%" }]} />
                        </View>
                    </View>

                    <Text style={styles.title}>Basic Information</Text>

                    <View style={styles.inputSection}>
                        <InputField
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChangeText={(text) => handleChange("fullName", text)}
                            editable={!form.fullName}
                        />

                        <InputField
                            label="Email"
                            placeholder="Your email"
                            value={form.email}
                            onChangeText={(text) => handleChange("email", text)}
                            keyboardType="email-address"
                            editable={!form.email}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <InputField
                                    label="Age"
                                    placeholder="Age"
                                    value={form.age}
                                    onChangeText={(text) => handleChange("age", text)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 2 }}>
                                <InputField
                                    label="Location"
                                    placeholder="City, State"
                                    value={form.location}
                                    onChangeText={(text) => handleChange("location", text)}
                                />
                            </View>
                        </View>

                        <InputField
                            label="Profession"
                            placeholder="Your profession"
                            value={form.profession}
                            onChangeText={(text) => handleChange("profession", text)}
                        />

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Education</Text>
                            <Dropdown
                                data={[
                                    { label: "High School", value: "High School" },
                                    { label: "Bachelor's", value: "Bachelor's" },
                                    { label: "Master's", value: "Master's" },
                                    { label: "PhD", value: "PhD" },
                                    { label: "Professional Degree", value: "Professional Degree" },
                                ]}
                                labelField="label"
                                valueField="value"
                                placeholder="Select education level"
                                value={form.education}
                                onChange={(item) => handleChange("education", item.value)}
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={{ color: "#333" }}
                                activeColor="#f4f4f4"
                                renderRightIcon={() => (
                                    <Ionicons name="chevron-down" size={20} color="rgba(255, 255, 255, 0.7)" />
                                )}
                            />
                        </View>

                        <InputField
                            label="Religion"
                            placeholder="Religion"
                            value="Brahmin"
                            onChangeText={() => {}}
                            editable={false}
                        />

                        <InputField
                            label="Area Cover (Premium)"
                            placeholder="Coverage area"
                            value={form.areaCover}
                            onChangeText={(text) => handleChange("areaCover", text)}
                            isPremium
                        />
                    </View>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        {/* <TouchableOpacity style={styles.previousButton} onPress={() => handleLogout(navigation, dispatch)}>
                            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
                            <Text style={styles.previousText}>Logout</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextText}>Next Step</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FF3366" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

type InputFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    editable?: boolean;
    isPremium?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    editable = true,
    isPremium = false,
}) => (
    <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            {isPremium && (
                <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
            )}
        </View>
        <TextInput
            style={[
                styles.input,
                !editable && styles.inputDisabled
            ]}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    stepText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        fontWeight: "600",
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        width: 100,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 30,
    },
    inputSection: {
        gap: 20,
    },
    inputContainer: {
        width: "100%",
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.9)",
    },
    input: {
        height: 56,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 28,
        paddingHorizontal: 25,
        color: "#FFFFFF",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    inputDisabled: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        opacity: 0.7,
    },
    row: {
        flexDirection: "row",
    },
    dropdown: {
        height: 56,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 28,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    placeholderStyle: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 16,
    },
    selectedTextStyle: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    premiumBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 10,
    },
    premiumText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#FFD700",
        marginLeft: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        width: "100%"
    },
    previousButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    previousText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    nextButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: "100%",
        justifyContent: "center"
    },
    nextText: {
        color: "#FF3366",
        fontSize: 16,
        fontWeight: "700",
    },
});
