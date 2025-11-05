import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { TextInput, Chip } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AboutYouStep: React.FC = () => {
    const navigation = useNavigation();

    const [bio, setBio] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);

    const interests = [
        "Travel",
        "Music",
        "Reading",
        "Cooking",
        "Movies",
        "Sports",
        "Art",
        "Dancing",
        "Yoga",
        "Photography",
        "Technology",
        "Fitness",
        "Nature",
        "Spirituality",
    ];

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleAddPhotos = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 5,
        });

        if (result.assets) {
            const uris = result.assets.map((a) => a.uri!) as string[];
            setPhotos([...photos, ...uris]);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepText}>Step 2 of 4</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: "50%" }]} />
                </View>

                {/* About You Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>About You</Text>

                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Tell us about yourself, your values, and what you're looking for in a life partner..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={5}
                        value={bio}
                        onChangeText={setBio}
                        style={styles.textArea}
                        theme={{
                            roundness: 10,
                            colors: { text: "#000", placeholder: "#999" },
                        }}
                    />

                    {/* Interests */}
                    <Text style={[styles.label, { marginTop: 20 }]}>
                        Interests & Hobbies
                    </Text>
                    <Text style={styles.subText}>Select interests that describe you</Text>

                    <View style={styles.chipContainer}>
                        {interests.map((interest) => (
                            <Chip
                                key={interest}
                                mode="flat"
                                selected={selectedInterests.includes(interest)}
                                onPress={() => toggleInterest(interest)}
                                style={[
                                    styles.chip,
                                    selectedInterests.includes(interest) && styles.selectedChip,
                                ]}
                                textStyle={[
                                    styles.chipText,
                                    selectedInterests.includes(interest) && styles.selectedChipText,
                                ]}
                            >
                                {interest}
                            </Chip>
                        ))}
                    </View>

                    {/* Photos */}
                    <Text style={[styles.label, { marginTop: 20 }]}>Photos</Text>
                    <View style={styles.uploadBox}>
                        {photos.length === 0 ? (
                            <>
                                <Text style={styles.uploadIcon}>⬆️</Text>
                                <Text style={styles.uploadText}>Upload your photos</Text>
                                <Text style={styles.subText}>
                                    Add at least 2 photos to get better matches
                                </Text>
                                <TouchableOpacity
                                    onPress={handleAddPhotos}
                                    style={styles.addPhotoBtn}
                                >
                                    <Text style={styles.addPhotoText}>+ Add Photos</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.photoGrid}>
                                {photos.map((uri, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri }}
                                        style={styles.photoPreview}
                                    />
                                ))}
                                <TouchableOpacity
                                    style={[styles.addPhotoBtn, { alignSelf: "center" }]}
                                    onPress={handleAddPhotos}
                                >
                                    <Text style={styles.addPhotoText}>+ Add More</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.prevBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.prevText}>← Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => navigation.navigate("FamilyDetailsStep" as never)}
                    >
                        <Text style={styles.nextText}>Next →</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    backText: { color: "#333", fontSize: 16 },
    stepText: { color: "#555", fontSize: 14 },
    progressBarContainer: {
        height: 6,
        backgroundColor: "#eee",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 20,
    },
    progressBarFill: { height: "100%", backgroundColor: "#E94057" },
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        color: "#222",
    },
    label: {
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    subText: {
        color: "#777",
        fontSize: 12,
        marginBottom: 8,
    },
    textArea: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    selectedChip: {
        backgroundColor: "#E94057",
    },
    chipText: {
        color: "#000",
    },
    selectedChipText: {
        color: "#fff",
    },
    uploadBox: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderStyle: "dashed",
        marginTop: 8,
    },
    uploadIcon: {
        fontSize: 32,
        color: "#999",
        marginBottom: 8,
    },
    uploadText: {
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    addPhotoBtn: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
    },
    addPhotoText: { color: "#E94057", fontWeight: "600" },
    photoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
    },
    photoPreview: {
        width: 90,
        height: 90,
        borderRadius: 10,
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
    prevText: { color: "#333" },
    nextBtn: {
        backgroundColor: "#E94057",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    nextText: { color: "#fff", fontWeight: "700" },
});
