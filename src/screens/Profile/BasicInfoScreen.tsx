import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Provider, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateBasicInfo, setCurrentScreen } from "../../redux/slices/profileFormSlice";

export const BasicInfoScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const form = useAppSelector((state) => state.profileForm.basicInfo);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    React.useEffect(() => {
        dispatch(setCurrentScreen('BasicInfo'));

        // Load user data from AsyncStorage
        const loadUserData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('userBasicInfo');
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    dispatch(updateBasicInfo(userData));
                }
            } catch (error) {
                console.error('Failed to load user data from AsyncStorage:', error);
            }
        };

        loadUserData();
    }, [dispatch]);

    const handleChange = (field: keyof typeof form, value: string) => {
        dispatch(updateBasicInfo({ [field]: value }));
    };

    const handleNext = () => {
        const { fullName, email, age, location, profession, education, religion, community } = form;

        if (!fullName || !email || !age || !location || !profession || !education || !religion || !community) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please fill in all fields to proceed.',
            });
            return;
        }

        if (fullName.trim().length < 3) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Name',
                text2: 'Full Name must be at least 3 characters long.',
            });
            return;
        }

        if (isNaN(Number(age))) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Age',
                text2: 'Age must be a valid number.',
            });
            return;
        }

        navigation.navigate("AboutYouStep" as never);
    };

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={20} color="#000" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.stepText}>Step 1 of 4</Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: "25%" }]} />
                    </View>

                    <Text style={styles.title}>Basic Information</Text>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <InputField
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={form.fullName}
                                onChangeText={(text) => handleChange("fullName", text)}
                                onFocus={() => setFocusedField("fullName")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "fullName"}
                                editable={false}
                            />

                            <InputField
                                label="Email"
                                placeholder="Your email"
                                value={form.email}
                                onChangeText={(text) => handleChange("email", text)}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "email"}
                                keyboardType="email-address"
                                editable={false}
                            />
                        </View>

                        <View style={styles.row}>
                            <InputField
                                label="Age"
                                placeholder="Your age"
                                value={form.age}
                                onChangeText={(text) => handleChange("age", text)}
                                onFocus={() => setFocusedField("age")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "age"}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.row}>
                            <InputField
                                label="Location"
                                placeholder="City, State"
                                value={form.location}
                                onChangeText={(text) => handleChange("location", text)}
                                onFocus={() => setFocusedField("location")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "location"}
                            />
                            <InputField
                                label="Profession"
                                placeholder="Your profession"
                                value={form.profession}
                                onChangeText={(text) => handleChange("profession", text)}
                                onFocus={() => setFocusedField("profession")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "profession"}
                            />
                        </View>

                        <View style={styles.row}>
                            {/* Education Dropdown */}
                            <View style={[styles.inputContainer, { flex: 1, margin: 6 }]}>
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
                                    style={[
                                        styles.dropdown,
                                        form.education ? styles.dropdownFilled : {},
                                    ]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    itemTextStyle={{ color: "#333" }}
                                    activeColor="#f4f4f4"
                                    renderRightIcon={() => null}
                                />
                            </View>

                            {/* Religion Dropdown */}
                            <View style={[styles.inputContainer, { flex: 1, margin: 6 }]}>
                                <Text style={styles.label}>Religion</Text>
                                <Dropdown
                                    data={[
                                        { label: "Hindu", value: "Hindu" },
                                        // { label: "Muslim", value: "Muslim" },
                                        // { label: "Christian", value: "Christian" },
                                        // { label: "Sikh", value: "Sikh" },
                                        // { label: "Buddhist", value: "Buddhist" },
                                        // { label: "Jain", value: "Jain" },
                                        // { label: "Other", value: "Other" },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select religion"
                                    value={form.religion}
                                    onChange={(item) => handleChange("religion", item.value)}
                                    style={[
                                        styles.dropdown,
                                        form.religion ? styles.dropdownFilled : {},
                                    ]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    itemTextStyle={{ color: "#333" }}
                                    activeColor="#f4f4f4"
                                    renderRightIcon={() => null}
                                />
                            </View>
                        </View>

                        {/* Community Dropdown */}
                        <View style={[styles.inputContainer, { marginHorizontal: 6, marginTop: 10 }]}>
                            <Text style={styles.label}>Community</Text>
                            <Dropdown
                                data={[
                                    { label: "Brahmin", value: "Brahmin" },
                                ]}
                                labelField="label"
                                valueField="value"
                                placeholder="Select community"
                                value={form.community}
                                onChange={(item) => handleChange("community", item.value)}
                                style={[
                                    styles.dropdown,
                                    form.community ? styles.dropdownFilled : {},
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={{ color: "#333" }}
                                activeColor="#f4f4f4"
                                renderRightIcon={() => null}
                            />
                        </View>



                    </View>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.previousButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={18} color="#000" />
                            <Text style={styles.previousText}>Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleNext}>
                            <LinearGradient
                                colors={["#FF512F", "#DD2476"]}
                                style={styles.nextButton}
                            >
                                <Text style={styles.nextText}>Next</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Provider>
    );
};

type InputFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    isFocused: boolean;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    editable?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    onFocus,
    onBlur,
    isFocused,
    keyboardType = "default",
    editable = true,
}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            mode="outlined"
            placeholder={placeholder}
            placeholderTextColor={"#999"}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            outlineColor="#ddd"
            activeOutlineColor="#dadada"
            style={[
                styles.paperInput,
                isFocused && { borderColor: "#E94057" },
                !editable && { backgroundColor: "#f0f0f0", opacity: 0.7 },
            ]}
            textColor='#000'
            theme={{
                roundness: 10,
                colors: {
                    text: "#000",            // 👈 Text color stays black
                    placeholder: "#999",     // 👈 Placeholder color
                    primary: "#E94057",      // 👈 Border color on focus
                    background: editable ? "#fff" : "#f0f0f0",      // 👈 Input background
                },
            }}
            keyboardType={keyboardType}
            editable={editable}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backText: {
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 4,
        color: "#000",
    },
    stepText: {
        color: "#555",
        fontSize: 14,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "#eee",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#E94057",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 16,
        color: "#222",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputContainer: {
        flex: 1,
        margin: 4,
    },
    label: {
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    paperInput: {
        backgroundColor: "#F9F9F9",
        fontSize: 14,
        padding: 0,
    },
    dropdownBtn: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#F9F9F9",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    previousButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    previousText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#000",
        marginLeft: 6,
    },
    nextButton: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    nextText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        marginRight: 6,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 12,
        height: 50,
    },
    dropdownFilled: {
        borderColor: "#dadada",
    },
    placeholderStyle: {
        color: "#999",
        fontSize: 14,
    },
    selectedTextStyle: {
        color: "#000",
        fontSize: 14,
    },
});
