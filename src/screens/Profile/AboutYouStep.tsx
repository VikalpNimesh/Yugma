import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from "react-native";
import { Chip } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
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
    const [errors, setErrors] = React.useState<{
        bio?: boolean;
        interests?: boolean;
        photos?: boolean;
    }>({});

    const handleDeletePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        dispatch(updateAboutYou({ photos: newPhotos }));
        if (errors.photos && newPhotos.length >= 2) {
            setErrors((prev) => ({ ...prev, photos: false }));
        }
    };

    React.useEffect(() => {
        dispatch(setCurrentScreen('AboutYouStep'));
    }, [dispatch]);

    const interestOptions = [
        "Travel", "Music", "Reading", "Cooking", "Movies", "Sports", "Art", 
        "Dancing", "Yoga", "Photography", "Technology", "Fitness", "Nature", "Spirituality",
    ];

    const toggleInterest = (interest: string) => {
        let newInterests;
        if (interests.includes(interest)) {
            newInterests = interests.filter((i) => i !== interest);
        } else {
            newInterests = [...interests, interest];
        }
        dispatch(updateAboutYou({ interests: newInterests }));
        if (errors.interests && newInterests.length > 0) {
            setErrors((prev) => ({ ...prev, interests: false }));
        }
    };

    const handleAddPhotos = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 6,
        });

        if (result.assets) {
            const uris = result.assets.map((a) => a.uri!) as string[];
            if (photos.length + uris.length > 6) {
                Toast.show({ type: 'error', text1: 'Maximum 6 photos allowed' });
                return;
            }
            const updatedPhotos = [...photos, ...uris];
            dispatch(updateAboutYou({ photos: updatedPhotos }));
            if (errors.photos && updatedPhotos.length >= 2) {
                setErrors((prev) => ({ ...prev, photos: false }));
            }
        }
    };

    const handleNext = () => {
        const newErrors: { bio?: boolean; interests?: boolean; photos?: boolean } = {};
        if (!bio || bio.trim().length < 10) {
            newErrors.bio = true;
        }
        if (interests.length === 0) {
            newErrors.interests = true;
        }
        if (photos.length < 2) {
            newErrors.photos = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: newErrors.bio && bio.trim().length > 0 && bio.trim().length < 10
                    ? 'Bio must be at least 10 characters long.'
                    : newErrors.photos && photos.length > 0 && photos.length < 2
                    ? 'Please upload at least 2 photos.'
                    : 'Please fill in all highlighted fields.',
            });
            return;
        }

        setErrors({});
        navigation.navigate("FamilyDetailsStep" as never);
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
                        <Text style={styles.stepText}>Step 2 of 4</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: "50%" }]} />
                        </View>
                    </View>
 
                    <Text style={styles.title}>About You</Text>
 
                    {/* Bio Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            placeholder="Tell us about yourself, your values, and what you're looking for..."
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            multiline
                            numberOfLines={5}
                            value={bio}
                            onChangeText={(text) => {
                                dispatch(updateAboutYou({ bio: text }));
                                if (errors.bio && text.trim().length >= 10) {
                                    setErrors((prev) => ({ ...prev, bio: false }));
                                }
                            }}
                            style={[
                                styles.textArea,
                                errors.bio && { borderColor: "#e31717ff", borderWidth: 2 }
                            ]}
                        />
                    </View>
 
                    {/* Interests Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Interests & Hobbies</Text>
                        <Text style={styles.subText}>Select interests that describe you</Text>
                        <View style={[
                            styles.chipContainer,
                            errors.interests && { borderColor: "#e31717ff", borderWidth: 2, borderRadius: 15, padding: 10 }
                        ]}>
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
                    </View>
 
                    {/* Photos Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Photos</Text>
                        <Text style={styles.subText}>Add at least 2 photos to get better matches</Text>
                        
                        <View style={[
                            styles.photoGrid,
                            errors.photos && { borderColor: "#e31717ff", borderWidth: 2, borderRadius: 15, padding: 10 }
                        ]}>
                            {photos.map((uri, index) => (
                                <View key={index} style={styles.photoWrapper}>
                                    <Image source={{ uri }} style={styles.photoPreview} />
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() => handleDeletePhoto(index)}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#FF3366" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {photos.length < 6 && (
                                <TouchableOpacity
                                    onPress={handleAddPhotos}
                                    style={styles.uploadPlaceholder}
                                >
                                    <Ionicons name="camera-outline" size={32} color="#FFFFFF" />
                                    <Text style={styles.uploadText}>Add Photo</Text>
                                </TouchableOpacity>
                            )}
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
    section: {
        marginBottom: 30,
    },
    label: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    subText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 14,
        marginBottom: 15,
    },
    textArea: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 20,
        padding: 20,
        color: "#FFFFFF",
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    chip: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    selectedChip: {
        backgroundColor: "#FFFFFF",
    },
    chipText: {
        color: "#FFFFFF",
        fontSize: 13,
    },
    selectedChipText: {
        color: "#FF3366",
        fontWeight: "700",
    },
    photoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
    photoWrapper: {
        width: (Platform.OS === 'ios' ? 95 : 90),
        height: (Platform.OS === 'ios' ? 95 : 90),
        borderRadius: 15,
        position: 'relative',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    deleteIcon: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    uploadPlaceholder: {
        width: (Platform.OS === 'ios' ? 95 : 90),
        height: (Platform.OS === 'ios' ? 95 : 90),
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "600",
        marginTop: 5,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
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
