import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu, Button, Provider, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";

export const BasicInfoScreen: React.FC = () => {
    const navigation = useNavigation();

    const [form, setForm] = useState({
        fullName: "",
        age: "",
        location: "",
        profession: "",
        education: "",
        religion: "",
        community: "",
    });

    const [menuVisible, setMenuVisible] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const educationOptions = [
        { label: "High School", value: "High School" },
        { label: "Bachelor's", value: "Bachelor's" },
        { label: "Master's", value: "Master's" },
        { label: "PhD", value: "PhD" },
        { label: "Professional Degree", value: "Professional Degree" },
    ];

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>← Back</Text>
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
                                onChangeText={(text) => setForm({ ...form, fullName: text })}
                                onFocus={() => setFocusedField("fullName")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "fullName"}
                            />

                            <InputField
                                label="Age"
                                placeholder="Your age"
                                value={form.age}
                                onChangeText={(text) => setForm({ ...form, age: text })}
                                onFocus={() => setFocusedField("age")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "age"}
                            />
                        </View>

                        <View style={styles.row}>
                            <InputField
                                label="Location"
                                placeholder="City, State"
                                value={form.location}
                                onChangeText={(text) => setForm({ ...form, location: text })}
                                onFocus={() => setFocusedField("location")}
                                onBlur={() => setFocusedField(null)}
                                isFocused={focusedField === "location"}
                            />
                            <InputField
                                label="Profession"
                                placeholder="Your profession"
                                value={form.profession}
                                onChangeText={(text) => setForm({ ...form, profession: text })}
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
                                    onChange={(item) => setForm({ ...form, education: item.value })}
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
                                        { label: "Muslim", value: "Muslim" },
                                        { label: "Christian", value: "Christian" },
                                        { label: "Sikh", value: "Sikh" },
                                        { label: "Buddhist", value: "Buddhist" },
                                        { label: "Jain", value: "Jain" },
                                        { label: "Other", value: "Other" },
                                    ]}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select religion"
                                    value={form.religion}
                                    onChange={(item) => setForm({ ...form, religion: item.value })}
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
                                onChange={(item) => setForm({ ...form, community: item.value })}
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
                        <TouchableOpacity style={styles.prevBtn}>
                            <Text style={styles.prevText}>← Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.nextBtn}
                            onPress={() => navigation.navigate("MultiStepForm")}
                        >
                            <Text style={styles.nextText}>Next →</Text>
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
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    onFocus,
    onBlur,
    isFocused,
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
                { color: "red" },
                isFocused && { borderColor: "#E94057" },
            ]}
            theme={{
                roundness: 10,
                colors: { text: "#000", placeholder: "#999" },
            }}
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
    backText: {
        color: "#333",
        fontSize: 16,
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
        marginTop: 30,
    },
    prevBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    prevText: {
        color: "#333",
    },
    nextBtn: {
        backgroundColor: "#E94057",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    nextText: {
        color: "#fff",
        fontWeight: "700",
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
        borderColor: "#E94057",
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
