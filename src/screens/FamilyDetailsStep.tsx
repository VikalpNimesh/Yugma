import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

const FamilyDetailsStep = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#000" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 3 of 4</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressFill} />
            </View>

            {/* Card Section */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Family Details</Text>

                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Father's Occupation</Text>
                        <TextInput
                            placeholder="Father's profession"
                            placeholderTextColor="#A0A0A0"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mother's Occupation</Text>
                        <TextInput
                            placeholder="Mother's profession"
                            placeholderTextColor="#A0A0A0"
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Siblings</Text>
                        <TextInput
                            placeholder="e.g., 1 brother, 1 sister"
                            placeholderTextColor="#A0A0A0"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Family Type</Text>
                        <View style={styles.dropdown}>
                            <Text style={styles.dropdownText}>Select family type</Text>
                            <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
                        </View>
                    </View>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.previousButton}>
                    <Ionicons name="arrow-back" size={18} color="#000" />
                    <Text style={styles.previousText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("PreferencesStep")}>
                    <LinearGradient
                        colors={["#FF512F", "#DD2476"]}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Next</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FamilyDetailsStep;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF9F6",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        fontSize: 14,
        color: "#6B6B6B",
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: "#E6E6E6",
        borderRadius: 4,
        marginVertical: 12,
        overflow: "hidden",
    },
    progressFill: {
        width: "75%", // 3 of 4 steps
        height: "100%",
        backgroundColor: "#E64A8B",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    inputContainer: {
        width: "48%",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 42,
        fontSize: 14,
        color: "#000",
    },
    dropdown: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownText: {
        color: "#A0A0A0",
        fontSize: 14,
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
});
