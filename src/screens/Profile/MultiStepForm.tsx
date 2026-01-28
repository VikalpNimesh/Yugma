import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";




import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const MultiStepForm = ({ navigation }: any) => {
    const { appType } = useSelector((state: any) => state.user); // Assuming user slice has appType
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        } else {
            navigation.replace("DiscoverScreen");
        }
    };

    const prevStep = () => {
        if (step > 1) setStep((prev) => prev - 1);
        else navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={prevStep}
                    disabled={step === 1}
                    style={[styles.backBtn, step === 1 && { opacity: 0.4 }]}
                >
                    <Ionicons name="arrow-back" size={20} color="#333" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${(step / totalSteps) * 100}%` },
                    ]}
                />
            </View>

            {/* Dynamic Form Content */}
            <View style={styles.card}>
                {step === 1 && <StepOne />}
                {step === 2 && <StepTwo />}
                {step === 3 && <StepThree appType={appType} />}
                {step === 4 && <StepFour />}
            </View>

            {/* Navigation buttons */}
            <View style={styles.navButtons}>
                <TouchableOpacity
                    style={[styles.prevBtn, step === 1 && { opacity: 0.5 }]}
                    disabled={step === 1}
                    onPress={prevStep}
                >
                    <Ionicons name="arrow-back" size={18} color="#333" />
                    <Text style={styles.prevText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                    <Text style={styles.nextText}>
                        {step === totalSteps ? "Complete Profile" : "Next"}
                    </Text>
                    <Ionicons
                        name={step === totalSteps ? "checkmark" : "arrow-forward"}
                        size={18}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


export default MultiStepForm;

const StepOne = () => (
    <View>
        <Text style={styles.title}>Basic Information</Text>
        <View style={styles.inputRow}>
            <InputField label="Full Name" placeholder="Enter your full name" />
            <InputField label="Age" placeholder="Your age" />
        </View>

        <View style={styles.inputRow}>
            <InputField label="Location" placeholder="City, State" />
            <InputField label="Profession" placeholder="Your profession" />
        </View>

        <View style={styles.inputRow}>
            <InputField label="Education" placeholder="Select education level" />
            <InputField label="Region" placeholder="Select region" />
        </View>

        <InputField label="Area Cover (Premium)" placeholder="Enter area details" />
    </View>
);

const StepTwo = () => (
    <View>
        <Text style={styles.title}>About You</Text>

        <Text style={styles.label}>Bio</Text>
        <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Tell us about yourself..."
            multiline
            placeholderTextColor={"#999"}

        />

        <Text style={[styles.label, { marginTop: 16 }]}>Interests & Hobbies</Text>
        <Text style={styles.subText}>Select interests that describe you</Text>
        <View style={styles.tagContainer}>
            {[
                "Travel",
                "Music",
                "Reading",
                "Cooking",
                "Movies",
                "Sports",
                "Yoga",
                "Photography",
                "Fitness",
                "Spirituality",
            ].map((hobby) => (
                <TouchableOpacity key={hobby} style={styles.tag}>
                    <Text style={styles.tagText}>{hobby}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={36} color="#999" />
            <Text style={styles.uploadTitle}>Upload your photos</Text>
            <Text style={styles.uploadSubText}>
                Add at least 2 photos to get better matches
            </Text>
            <TouchableOpacity style={styles.addPhotoBtn}>
                <Ionicons name="add-outline" size={20} color="#333" />
                <Text style={styles.addPhotoText}>Add Photos</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const StepThree = ({ appType }: { appType: string }) => {
    return (
        <View>
            <Text style={styles.title}>Family Details</Text>

            {appType === "matrimonial" && (
                <>
                    <View style={styles.inputRow}>
                        <InputField label="Father's Occupation" placeholder="Father's profession" />
                        <InputField label="Mother's Occupation" placeholder="Mother's profession" />
                    </View>
                </>
            )}

            <View style={styles.inputRow}>
                {appType === "matrimonial" ? (
                    <View style={{ flex: 1, gap: 12 }}>
                        <View style={styles.inputRow}>
                            <InputField label="Brothers" placeholder="No. of brothers" />
                            <InputField label="Sisters" placeholder="No. of sisters" />
                        </View>
                        <InputField label="Sibling Marital Status" placeholder="e.g. 1 married brother" />
                    </View>
                ) : (
                    <InputField label="Siblings" placeholder="e.g., 1 brother, 1 sister" />
                )}
                <InputField label="Family Type" placeholder="Select family type" />
            </View>
        </View>
    );
};


const StepFour = () => (
    <View>
        <Text style={styles.title}>Your Preferences</Text>

        <Text style={styles.label}>Preferred Age Range</Text>
        <View style={[styles.inputRow, { alignItems: "center" }]}>
            <TextInput style={[styles.input, { flex: 0.4 }]} placeholder="25" />
            <Text style={{ color: "#444", fontSize: 14 }}>to</Text>
            <TextInput style={[styles.input, { flex: 0.4 }]} placeholder="35" />
            <Text style={{ color: "#444", fontSize: 14 }}>years</Text>
        </View>

        <InputField
            label="Preferred Locations"
            placeholder="e.g., Mumbai, Delhi, Bangalore"
        />
        <InputField
            label="Preferred Education"
            placeholder="e.g., Bachelor's, Master's, PhD"
        />
    </View>
);


const InputField = ({
    label,
    placeholder,
}: {
    label: string;
    placeholder: string;
}) => (
    <View style={{ flex: 1, marginBottom: 12 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} placeholder={placeholder} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8F6",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    backText: { fontSize: 16, color: "#333" },
    stepText: { fontSize: 14, color: "#555" },
    progressContainer: {
        height: 6,
        backgroundColor: "#E5E5E5",
        borderRadius: 10,
        marginVertical: 12,
    },
    progressBar: {
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#F97316",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        elevation: 2,
    },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#111" },
    label: { fontSize: 14, fontWeight: "500", color: "#222", marginBottom: 6 },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#333",
    },
    inputRow: { flexDirection: "row", gap: 12 },
    navButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    prevBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F3F3",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    prevText: { color: "#333", fontSize: 15 },
    nextBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F97316",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    nextText: { color: "#fff", fontSize: 15, fontWeight: "600" },
    subText: { fontSize: 13, color: "#777", marginBottom: 8 },
    tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: {
        backgroundColor: "#F3F3F3",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    tagText: { color: "#333", fontSize: 13 },
    uploadBox: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#CCC",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginTop: 20,
    },
    uploadTitle: { fontWeight: "600", color: "#555", marginTop: 8 },
    uploadSubText: { fontSize: 13, color: "#999", marginVertical: 6 },
    addPhotoBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F3F3",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 4,
    },
    addPhotoText: { color: "#333", fontWeight: "500" },
});
