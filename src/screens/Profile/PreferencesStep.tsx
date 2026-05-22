import React, { useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updatePreferences, setCurrentScreen, completeProfile } from "../../redux/slices/profileFormSlice";
import { useNavigation } from "@react-navigation/native";
import { educationOptions, indianStatesArray } from "../../constant/constant";
import { SelectionBottomSheet } from "../../components/common/SelectionBottomSheet";

const { width } = Dimensions.get("window");

const PreferencesStep = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const form = useAppSelector((state) => state.profileForm.preferences);
    const { updateStatus } = useAppSelector(state => state.profileForm);
    const nav = useNavigation();

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
        dispatch(setCurrentScreen('PreferencesStep'));
    }, [dispatch]);

    React.useEffect(() => {
        if (updateStatus === 'succeeded') {
            nav.navigate('BottomTabs' as never);
        }
    }, [updateStatus, nav]);

    const handleChange = (field: keyof typeof form, value: string) => {
        dispatch(updatePreferences({ [field]: value }));
    };

    const openLocationSheet = () => {
        const selectedState = indianStatesArray.find(s => s.name === form.preferredLocations);
        setSheetConfig({
            visible: true,
            title: "Select Preferred Location",
            options: indianStatesArray,
            selectedKey: selectedState ? selectedState.key : undefined,
            onSelect: (item) => handleChange("preferredLocations", item.name),
            searchable: true,
            searchPlaceholder: "Search state...",
        });
    };

    const openEducationSheet = () => {
        setSheetConfig({
            visible: true,
            title: "Select Preferred Education",
            options: educationOptions,
            selectedKey: form.preferredEducation,
            onSelect: (item) => handleChange("preferredEducation", item.key),
            searchable: false,
        });
    };

    const handleComplete = () => {
        const { preferredAgeMin, preferredAgeMax, preferredLocations, preferredEducation } = form;
        if (!preferredAgeMin || !preferredAgeMax || !preferredLocations || !preferredEducation) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields to proceed.',
            });
            return;
        }

        const minAge = parseInt(preferredAgeMin, 10);
        const maxAge = parseInt(preferredAgeMax, 10);
        if (isNaN(minAge) || isNaN(maxAge)) {
            Toast.show({ type: 'error', text1: 'Invalid Age', text2: 'Please enter valid numbers.' });
            return;
        }
        if (minAge >= maxAge) {
            Toast.show({ type: 'error', text1: 'Invalid Age Range', text2: 'Min age must be less than max age.' });
            return;
        }

        dispatch(completeProfile());
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
                        <Text style={styles.stepText}>Step 4 of 4</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: "100%" }]} />
                        </View>
                    </View>

                    <Text style={styles.title}>Your Preferences</Text>

                    <View style={styles.inputSection}>
                        {/* Age Range */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Preferred Age Range</Text>
                            <View style={styles.ageRow}>
                                <TextInput
                                    placeholder="25"
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    style={[styles.input, styles.ageInput]}
                                    keyboardType="numeric"
                                    value={form.preferredAgeMin}
                                    onChangeText={(text) => handleChange("preferredAgeMin", text)}
                                />
                                <Text style={styles.toText}>to</Text>
                                <TextInput
                                    placeholder="35"
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                    style={[styles.input, styles.ageInput]}
                                    keyboardType="numeric"
                                    value={form.preferredAgeMax}
                                    onChangeText={(text) => handleChange("preferredAgeMax", text)}
                                />
                                <Text style={styles.yearsText}>years</Text>
                            </View>
                        </View>

                        {/* Preferred Locations */}
                        <InputField
                            label="Preferred Locations"
                            placeholder="Select Preferred State"
                            value={form.preferredLocations}
                            onPress={openLocationSheet}
                        />

                        {/* Preferred Education */}
                        <InputField
                            label="Preferred Education"
                            placeholder="Select Preferred Education"
                            value={form.preferredEducation}
                            onPress={openEducationSheet}
                        />
                    </View>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.previousButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                            <Text style={styles.previousText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={handleComplete}>
                            <Text style={styles.nextText}>Complete Profile</Text>
                            <Ionicons name="checkmark-circle" size={22} color="#FF3366" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Unified Selection Bottom Sheet */}
            <SelectionBottomSheet
                visible={sheetConfig.visible}
                onClose={() => setSheetConfig(prev => ({ ...prev, visible: false }))}
                title={sheetConfig.title}
                options={sheetConfig.options}
                selectedKey={sheetConfig.selectedKey}
                onSelect={sheetConfig.onSelect}
                searchable={sheetConfig.searchable}
                searchPlaceholder={sheetConfig.searchPlaceholder}
            />
        </View>
    );
};

type InputFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    onPress,
}) => {
    const renderInput = () => (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={value}
            onChangeText={onChangeText}
            editable={onPress ? false : true}
            pointerEvents={onPress ? "none" : undefined}
        />
    );

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            {onPress ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    {renderInput()}
                </TouchableOpacity>
            ) : (
                renderInput()
            )}
        </View>
    );
};

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
        gap: 25,
    },
    inputContainer: {
        width: "100%",
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: 10,
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
    ageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    ageInput: {
        width: 100,
        textAlign: "center",
    },
    toText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    yearsText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 60,
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

export default PreferencesStep;
