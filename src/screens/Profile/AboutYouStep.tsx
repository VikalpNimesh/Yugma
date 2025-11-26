import React from "react";
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
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateAboutYou, setCurrentScreen } from "../../redux/slices/profileFormSlice";

export const AboutYouStep: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { bio, interests, photos } = useAppSelector(
        (state) => state.profileForm.aboutYou
    );

    const handleDeletePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        dispatch(updateAboutYou({ photos: newPhotos }));
    };

    React.useEffect(() => {
        dispatch(setCurrentScreen('AboutYouStep'));
    }, [dispatch]);

    const interestOptions = [
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
        if (interests.includes(interest)) {
            dispatch(updateAboutYou({ interests: interests.filter((i) => i !== interest) }));
        } else {
            dispatch(updateAboutYou({ interests: [...interests, interest] }));
        }
    };

    const handleAddPhotos = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 6,
        });

        if (result.assets) {
            const uris = result.assets.map((a) => a.uri!) as string[];
            // Check if adding these exceeds the limit of 6 photos
            if (photos.length + uris.length > 6) {
                // Show toast notification
                Toast.show({
                    type: 'error',
                    text1: 'Maximum 6 photos allowed',
                });
                return;
            }
            dispatch(updateAboutYou({ photos: [...photos, ...uris] }));
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={20} color="#000" />
                        <Text style={styles.backText}>Back</Text>
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
                        onChangeText={(text) => dispatch(updateAboutYou({ bio: text }))}
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
                        {interestOptions.map((interest) => (
                            <Chip
                                key={interest}
                                mode="flat"
                                selected={interests.includes(interest)}
                                onPress={() => toggleInterest(interest)}
                                style={[
                                    styles.chip,
                                    interests.includes(interest) && styles.selectedChip,
                                ]}
                                textStyle={[
                                    styles.chipText,
                                    interests.includes(interest) && styles.selectedChipText,
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
                        <View key={index} style={styles.photoContainer}>
                            <Image source={{ uri }} style={styles.photoPreview} />
                            <TouchableOpacity
                                style={styles.deleteIcon}
                                onPress={() => handleDeletePhoto(index)}
                            >
                                <Ionicons name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
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
                    <TouchableOpacity style={styles.previousButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={18} color="#000" />
                        <Text style={styles.previousText}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("FamilyDetailsStep" as never)}>
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
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
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
    photoContainer: {
        position: 'relative',
    },
    deleteIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 2,
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
