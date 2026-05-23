import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { Dropdown } from "react-native-element-dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateFamilyDetails, setCurrentScreen } from "../../redux/slices/profileFormSlice";

const { width } = Dimensions.get("window");

const FamilyDetailsStep = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const form = useAppSelector((state) => state.profileForm.familyDetails);
    const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});

    React.useEffect(() => {
        dispatch(setCurrentScreen('FamilyDetailsStep'));
    }, [dispatch]);

    const handleChange = (field: keyof typeof form, value: string) => {
        dispatch(updateFamilyDetails({ [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleNext = () => {
        const { fatherOccupation, motherOccupation, siblings, familyType } = form;
        const newErrors: { [key: string]: boolean } = {};

        if (!fatherOccupation) newErrors.fatherOccupation = true;
        if (!motherOccupation) newErrors.motherOccupation = true;
        if (!siblings) newErrors.siblings = true;
        if (!familyType) newErrors.familyType = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill in all highlighted fields.',
            });
            return;
        }

        setErrors({});
        navigation.navigate("PreferencesStep");
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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.stepText}>Step 3 of 4</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: "75%" }]} />
                        </View>
                    </View>

                    <Text style={styles.title}>Family Details</Text>

                    <View style={styles.inputSection}>
                        <InputField
                            label="Father's Occupation"
                            placeholder="Enter father's profession"
                            value={form.fatherOccupation}
                            onChangeText={(text) => handleChange("fatherOccupation", text)}
                            hasError={errors.fatherOccupation}
                        />

                        <InputField
                            label="Mother's Occupation"
                            placeholder="Enter mother's profession"
                            value={form.motherOccupation}
                            onChangeText={(text) => handleChange("motherOccupation", text)}
                            hasError={errors.motherOccupation}
                        />

                        <InputField
                            label="Siblings"
                            placeholder="e.g., 1 brother, 1 sister"
                            value={form.siblings}
                            onChangeText={(text) => handleChange("siblings", text)}
                            hasError={errors.siblings}
                        />

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Family Type</Text>
                            <Dropdown
                                data={[
                                    { label: "Joint Family", value: "Joint Family" },
                                    { label: "Nuclear Family", value: "Nuclear Family" },
                                    { label: "Extended Family", value: "Extended Family" },
                                ]}
                                labelField="label"
                                valueField="value"
                                placeholder="Select family type"
                                value={form.familyType}
                                onChange={(item) => handleChange("familyType", item.value)}
                                style={[
                                    styles.dropdown,
                                    errors.familyType && { borderColor: "#e31717ff", borderWidth: 2 }
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={{ color: "#333" }}
                                activeColor="#f4f4f4"
                                renderRightIcon={() => (
                                    <Ionicons name="chevron-down" size={20} color="rgba(255, 255, 255, 0.7)" />
                                )}
                            />
                        </View>
                    </View>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.previousButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                            <Text style={styles.previousText}>Back</Text>
                        </TouchableOpacity>

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
    hasError?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChangeText, hasError = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[
                styles.input,
                hasError && { borderColor: "#e31717ff", borderWidth: 2 }
            ]}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={value}
            onChangeText={onChangeText}
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
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: 8,
        marginLeft: 5,
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
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
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
    },
    nextText: {
        color: "#FF3366",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default FamilyDetailsStep;
