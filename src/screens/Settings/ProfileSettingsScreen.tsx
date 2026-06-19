import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { handleLogout } from "../../api/firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { updateBasicInfo, updateAboutYou } from "../../redux/slices/profileFormSlice";
import { updateUserProfile, fetchUserProfile } from "../../redux/slices/authSlice";
import profileService from "../../api/services/profileService";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import LinearGradient from "react-native-linear-gradient";
import { educationOptions, genderOptions, indianStatesArray } from "../../constant/constant";
import { SelectionBottomSheet } from "../../components/common/SelectionBottomSheet";

type InputFieldProps = {
    label: string;
    icon: string;
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    keyboardType?: "default" | "numeric" | "email-address";
    multiline?: boolean;
    numberOfLines?: number;
    editable?: boolean;
};

const getMimeType = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    onPress,
    keyboardType = "default",
    multiline = false,
    numberOfLines = 1,
    editable = true,
}) => {
    const renderInput = () => (
        <View style={[
            styles.inputWrapper,
            multiline && styles.inputWrapperMultiline,
            !editable && styles.inputWrapperDisabled
        ]}>
            <Ionicons name={icon} size={20} color="#888" style={styles.inputLeftIcon} />
            <TextInput
                style={[
                    styles.inputField,
                    multiline && styles.inputFieldMultiline,
                    !editable && styles.inputFieldDisabled
                ]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={onPress ? false : editable}
                pointerEvents={onPress ? "none" : undefined}
            />
            {onPress && editable && (
                <Ionicons name="chevron-down" size={20} color="#888" style={styles.inputRightIcon} />
            )}
        </View>
    );

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            {onPress ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!editable}>
                    {renderInput()}
                </TouchableOpacity>
            ) : (
                renderInput()
            )}
        </View>
    );
};

export default function ProfileSettingsScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const { email: reduxEmail, name: reduxName, photo: reduxPhoto } = useSelector((state: any) => state.user?.user || {});
    const reduxGender = useSelector((state: any) => state.user?.gender || state.user?.user?.gender || "");
    const profileForm = useSelector((state: any) => state.profileForm);
    const authProfile = useSelector((state: any) => state.auth?.profile || {});
    const { basicInfo, aboutYou } = profileForm;

    // Display variables mapped from Redux/Firebase profiles
    const displayName = authProfile.fullName || basicInfo.fullName || reduxName || "";
    const displayAge = authProfile.age ? String(authProfile.age) : basicInfo.age || "";
    const displayGender = authProfile.gender || basicInfo.gender || reduxGender;
    const displayLocation = authProfile.location || basicInfo.location || "";
    const displayProfession = authProfile.profession || basicInfo.profession || "";
    const displayEducation = authProfile.education || basicInfo.education || "";
    const displayRegion = authProfile.region || basicInfo.region || "";
    const displayAreaCover = authProfile.community || basicInfo.areaCover || "";
    const displayBio = authProfile.bio || aboutYou.bio || "";
    const displayEmail = authProfile.email || basicInfo.email || reduxEmail || "";

    // Local state for editing
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");
    const [profession, setProfession] = useState("");
    const [education, setEducation] = useState("");
    const [region, setRegion] = useState("");
    const [areaCover, setAreaCover] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");

    // Photo states for editing
    const [profilePhoto, setProfilePhoto] = useState("");
    const [newProfilePhoto, setNewProfilePhoto] = useState<string | null>(null);
    const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

    // Selection bottom sheet configuration
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

    const handleEditPress = () => {
        setName(displayName);
        setAge(displayAge);
        setGender(displayGender);
        setLocation(displayLocation);
        setProfession(displayProfession);
        setEducation(displayEducation);
        setRegion(displayRegion);
        setAreaCover(displayAreaCover);
        setBio(displayBio);
        setEmail(displayEmail);

        // Initialize photo states
        setProfilePhoto(authProfile.profilePhoto || (authProfile.photos && authProfile.photos.length > 0 ? authProfile.photos[0].url : ""));
        setNewProfilePhoto(null);
        setGalleryPhotos(authProfile.photos || []);

        setIsEditing(true);
    };

    const handlePickProfilePhoto = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1,
        });

        if (result.assets && result.assets[0]) {
            const picked = result.assets[0];
            setNewProfilePhoto(picked.uri || null);
        }
    };

    const handlePickGalleryPhoto = async () => {
        const remainingLimit = 6 - galleryPhotos.length;
        if (remainingLimit <= 0) {
            Toast.show({ type: 'error', text1: 'Maximum 6 photos allowed' });
            return;
        }

        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: remainingLimit,
        });

        if (result.assets) {
            const newPhotos = result.assets.map((a) => ({
                url: a.uri!,
                isLocal: true
            }));
            setGalleryPhotos(prev => [...prev, ...newPhotos]);
        }
    };

    const handleDeleteGalleryPhoto = (index: number) => {
        setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const openLocationSheet = () => {
        const selectedState = indianStatesArray.find(s => s.name === location);
        setSheetConfig({
            visible: true,
            title: "Select Location",
            options: indianStatesArray,
            selectedKey: selectedState ? selectedState.key : undefined,
            onSelect: (item) => setLocation(item.name),
            searchable: true,
            searchPlaceholder: "Search state...",
        });
    };

    const openGenderSheet = () => {
        setSheetConfig({
            visible: true,
            title: "Select Gender",
            options: genderOptions,
            selectedKey: gender,
            onSelect: (item) => setGender(item.key),
            searchable: false,
        });
    };

    const openEducationSheet = () => {
        setSheetConfig({
            visible: true,
            title: "Select Education Level",
            options: educationOptions,
            selectedKey: education,
            onSelect: (item) => setEducation(item.key),
            searchable: false,
        });
    };

    const handleLogoutPress = async () => {
        try {
            Toast.show({ type: 'info', text1: 'Logging out...', position: 'bottom' });
            await handleLogout(navigation, dispatch);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error.message || 'Please try again',
                position: 'bottom',
            });
        }
    };

    const handleSave = async () => {
        try {
            Toast.show({
                type: 'info',
                text1: 'Saving changes...',
                position: 'bottom',
            });

            // Filter remaining existing photos (remote URLs)
            const remainingExistingPhotos = galleryPhotos
                .filter(p => !p.isLocal)
                .map((p, idx) => ({
                    url: p.url || p,
                    order: idx
                }));

            // Construct profile payload for the backend API
            const payload = {
                ...authProfile,
                fullName: name,
                age: age ? Number(age) : undefined,
                gender: gender,
                location: location,
                profession: profession,
                education: education,
                bio: bio,
                // Overwrite remote photos array (deletes any removed photos)
                photos: remainingExistingPhotos,
            };

            // Call profile API to change text/static fields in backend (JSON step)
            console.log('handleSave: JSON update start');
            const resultAction = await dispatch(updateUserProfile(payload) as any);

            if (updateUserProfile.fulfilled.match(resultAction)) {
                // Step 2: Upload new photos (multipart step)
                const hasNewProfilePhoto = !!newProfilePhoto;
                const localGalleryPhotos = galleryPhotos.filter(p => p.isLocal);
                const hasNewGalleryPhotos = localGalleryPhotos.length > 0;

                if (hasNewProfilePhoto || hasNewGalleryPhotos) {
                    console.log('handleSave: Multipart update start');
                    Toast.show({
                        type: 'info',
                        text1: 'Uploading new photos...',
                        position: 'bottom',
                    });

                    const formData = new FormData();

                    if (hasNewProfilePhoto && newProfilePhoto) {
                        const filename = newProfilePhoto.substring(newProfilePhoto.lastIndexOf('/') + 1) || 'profile.jpg';
                        const type = getMimeType(filename);
                        formData.append('profilePhoto', {
                          uri: newProfilePhoto,
                          name: filename,
                          type: type,
                        } as any);
                    }

                    if (hasNewGalleryPhotos) {
                        localGalleryPhotos.forEach((photoObj: any, idx: number) => {
                          const uri = photoObj.url;
                          const filename = uri.substring(uri.lastIndexOf('/') + 1) || `photo_${idx}.jpg`;
                          const type = getMimeType(filename);
                          formData.append('photos', {
                            uri: uri,
                            name: filename,
                            type: type,
                          } as any);
                        });
                    }

                    // Append fullName to satisfy DTO validation (some backends require it)
                    formData.append('fullName', name);

                    const responseMultipart = await profileService.updateProfileMultipart(formData);
                    console.log('handleSave: Multipart update finished', responseMultipart);
                }

                // Refresh user profile state from database
                const refreshAction = await dispatch(fetchUserProfile() as any);
                console.log('handleSave: Refreshed user profile data:', refreshAction);

                // Update local offline slices upon success
                dispatch(updateBasicInfo({ fullName: name, email, age, location, profession, education, region, areaCover }));
                dispatch(updateAboutYou({ bio }));
                if (gender !== reduxGender) {
                    dispatch(updateUser({ gender }));
                }

                setIsEditing(false);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Profile updated successfully',
                    position: 'bottom',
                });
            } else {
                const errorMsg = resultAction.payload || 'Failed to save changes to server';
                Toast.show({
                    type: 'error',
                    text1: 'Save Failed',
                    text2: errorMsg,
                    position: 'bottom',
                });
            }
        } catch (error: any) {
            console.error("Failed to save user info:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'An unexpected error occurred',
                position: 'bottom',
            });
        }
    };

    const avatarUri = authProfile.profilePhoto || (authProfile.photos && authProfile.photos.length > 0 ? authProfile.photos[0].url : (basicInfo.photo || reduxPhoto));

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <BackButton color="#000" title="Profile Information" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {!isEditing ? (
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <View style={styles.profileAvatarContainer}>
                                {avatarUri ? (
                                    <Image source={{ uri: avatarUri }} style={styles.profileAvatar} />
                                ) : (
                                    <LinearGradient
                                        colors={["#FF5F6D", "#FF3366"]}
                                        style={[styles.profileAvatar, styles.defaultAvatarContainer]}
                                    >
                                        <Ionicons name="person" size={54} color="#FFFFFF" />
                                    </LinearGradient>
                                )}
                            </View>
                            <View style={styles.profileBadge}>
                                <Ionicons name="checkmark-circle" size={24} color="#FF3366" />
                            </View>
                        </View>

                        <Text style={styles.profileName}>{displayName}</Text>
                        <Text style={styles.profileHandle}>{displayEmail}</Text>

                        {/* Premium Tags View */}
                        <View style={styles.tagContainer}>
                            {displayGender ? (
                                <View style={styles.tag}>
                                    <Ionicons name="person-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayGender}</Text>
                                </View>
                            ) : null}
                            {displayAge ? (
                                <View style={styles.tag}>
                                    <Ionicons name="calendar-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayAge} years old</Text>
                                </View>
                            ) : null}
                            {displayLocation ? (
                                <View style={styles.tag}>
                                    <Ionicons name="location-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayLocation}</Text>
                                </View>
                            ) : null}
                            {displayRegion ? (
                                <View style={styles.tag}>
                                    <Ionicons name="people-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayRegion}</Text>
                                </View>
                            ) : null}
                            {displayProfession ? (
                                <View style={styles.tag}>
                                    <Ionicons name="briefcase-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayProfession}</Text>
                                </View>
                            ) : null}
                            {displayEducation ? (
                                <View style={styles.tag}>
                                    <Ionicons name="school-outline" size={14} color="#FF3366" />
                                    <Text style={styles.tagText}>{displayEducation}</Text>
                                </View>
                            ) : null}
                        </View>

                        {displayBio ? (
                            <View style={styles.bioContainer}>
                                <Text style={styles.bioLabel}>About Me</Text>
                                <Text style={styles.bioText}>{displayBio}</Text>
                            </View>
                        ) : null}

                        {/* Photo Gallery Section */}
                        {authProfile.photos && authProfile.photos.length > 0 ? (
                            <View style={styles.galleryViewContainer}>
                                <Text style={styles.galleryViewLabel}>Photos</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryViewScroll}>
                                    {authProfile.photos.map((photo: any, index: number) => (
                                        <Image 
                                            key={index} 
                                            source={{ uri: photo.url }} 
                                            style={styles.galleryViewImage} 
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        ) : null}

                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity onPress={handleEditPress} activeOpacity={0.8} style={styles.editBtnContainer}>
                                <LinearGradient
                                    colors={["#FF5F6D", "#FF3366"]}
                                    style={styles.gradientButton}
                                >
                                    <Ionicons name="create-outline" size={18} color="#fff" />
                                    <Text style={styles.primaryBtnText}>Edit Profile</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogoutPress} style={styles.outlineButton} activeOpacity={0.7}>
                                <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
                                <Text style={styles.outlineBtnText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.editCard}>
                        {/* Profile Photo Editor */}
                        <View style={styles.avatarEditContainer}>
                            <TouchableOpacity onPress={handlePickProfilePhoto} activeOpacity={0.8} style={styles.avatarTouch}>
                                {newProfilePhoto || profilePhoto ? (
                                    <Image source={{ uri: newProfilePhoto || profilePhoto }} style={styles.editAvatar} />
                                ) : (
                                    <LinearGradient
                                        colors={["#FF5F6D", "#FF3366"]}
                                        style={[styles.editAvatar, styles.defaultEditAvatarContainer]}
                                    >
                                        <Ionicons name="person" size={40} color="#FFFFFF" />
                                    </LinearGradient>
                                )}
                                <View style={styles.cameraIconBadge}>
                                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.avatarEditHint}>Tap avatar to change profile photo</Text>
                        </View>

                        <InputField label="Name" icon="person-outline" placeholder="Name" value={name} onChangeText={setName} />
                        <InputField label="Age" icon="calendar-outline" placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} editable={false} />
                        <InputField label="Gender" icon="transgender-outline" placeholder="Select Gender" value={gender} onPress={openGenderSheet} editable={false} />
                        <InputField label="Education" icon="school-outline" placeholder="Select Education" value={education} onPress={openEducationSheet} />
                        <InputField label="Profession" icon="briefcase-outline" placeholder="Profession" value={profession} onChangeText={setProfession} />
                        <InputField label="Location" icon="location-outline" placeholder="Select State" value={location} onPress={openLocationSheet} />
                        <InputField label="Bio" icon="document-text-outline" placeholder="Bio" multiline numberOfLines={3} value={bio} onChangeText={setBio} />

                        {/* Photo Gallery Editor */}
                        <View style={styles.galleryEditContainer}>
                            <Text style={styles.galleryEditLabel}>Photo Gallery</Text>
                            <Text style={styles.galleryEditSubLabel}>Manage your gallery (up to 6 photos)</Text>
                            <View style={styles.galleryGrid}>
                                {galleryPhotos.map((photo: any, index: number) => {
                                    const photoUri = photo.url || photo;
                                    return (
                                        <View key={index} style={styles.galleryEditItem}>
                                            <Image source={{ uri: photoUri }} style={styles.galleryEditImage} />
                                            <TouchableOpacity 
                                                style={styles.galleryDeleteBadge} 
                                                onPress={() => handleDeleteGalleryPhoto(index)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="close" size={12} color="#FFFFFF" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                                {galleryPhotos.length < 6 && (
                                    <TouchableOpacity style={styles.galleryAddButton} onPress={handlePickGalleryPhoto} activeOpacity={0.7}>
                                        <Ionicons name="add" size={24} color="#8E8E93" />
                                        <Text style={styles.galleryAddText}>Add Photo</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn} activeOpacity={0.7}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveBtnContainer} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={["#FF5F6D", "#FF3366"]}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.saveText}>Save Changes</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    content: {
        padding: 16,
    },
    profileCard: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        borderRadius: 24,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },
    profileHeader: {
        position: "relative",
        marginTop: 10,
        marginBottom: 10,
    },
    profileAvatarContainer: {
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 8,
    },
    profileAvatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: "#FFFFFF",
    },
    defaultAvatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF3366",
    },
    profileBadge: {
        position: "absolute",
        bottom: 8,
        right: 4,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    profileHandle: {
        fontSize: 14,
        color: "#8E8E93",
        fontWeight: "500",
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginVertical: 16,
        width: "100%",
    },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 51, 102, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    tagText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FF3366",
    },
    bioContainer: {
        width: "100%",
        backgroundColor: "#FAF9F6",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F2EFE9",
        marginBottom: 24,
    },
    bioLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#8E8E93",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    bioText: {
        fontSize: 14,
        color: "#3A3A3C",
        lineHeight: 22,
        fontWeight: "500",
    },
    actionButtonsRow: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10,
        gap: 12,
        justifyContent: "space-between",
    },
    editBtnContainer: {
        flex: 1.2,
    },
    outlineButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#FF3B30",
        borderRadius: 25,
        height: 50,
        gap: 6,
        backgroundColor: "#FFFFFF",
    },
    outlineBtnText: {
        color: "#FF3B30",
        fontSize: 15,
        fontWeight: "600",
    },
    gradientButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        height: 50,
        gap: 6,
        shadowColor: "#FF3366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        width: "100%",
    },
    primaryBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
    editCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E9ECEF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A4A4A",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E9ECEF",
        paddingHorizontal: 16,
        height: 56,
    },
    inputWrapperMultiline: {
        height: 110,
        alignItems: "flex-start",
        paddingVertical: 12,
    },
    inputWrapperDisabled: {
        backgroundColor: "#E9ECEF",
        borderColor: "#DEE2E6",
        opacity: 0.8,
    },
    inputLeftIcon: {
        marginRight: 12,
    },
    inputRightIcon: {
        marginLeft: 12,
    },
    inputField: {
        flex: 1,
        color: "#212529",
        fontSize: 15,
        fontWeight: "500",
        padding: 0,
    },
    inputFieldMultiline: {
        height: "100%",
        textAlignVertical: "top",
    },
    inputFieldDisabled: {
        color: "#6C757D",
    },
    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        gap: 12,
        width: "100%",
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: "#E5E5EA",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    cancelText: {
        color: "#8E8E93",
        fontSize: 15,
        fontWeight: "600",
    },
    saveBtnContainer: {
        flex: 2,
    },
    saveText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    galleryViewContainer: {
        width: "100%",
        marginBottom: 24,
        alignItems: "flex-start",
    },
    galleryViewLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#8E8E93",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    galleryViewScroll: {
        gap: 12,
        paddingHorizontal: 4,
    },
    galleryViewImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },
    avatarEditContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        width: "100%",
    },
    avatarTouch: {
        position: "relative",
    },
    editAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#FFFFFF",
    },
    defaultEditAvatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF3366",
    },
    cameraIconBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#FF3366",
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarEditHint: {
        fontSize: 12,
        color: "#8E8E93",
        fontWeight: "500",
        marginTop: 8,
    },
    galleryEditContainer: {
        width: "100%",
        marginBottom: 24,
        marginTop: 8,
    },
    galleryEditLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A4A4A",
        marginBottom: 2,
        marginLeft: 4,
    },
    galleryEditSubLabel: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 12,
        marginLeft: 4,
    },
    galleryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        paddingHorizontal: 4,
    },
    galleryEditItem: {
        position: "relative",
        width: 80,
        height: 80,
    },
    galleryEditImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },
    galleryDeleteBadge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#FF3B30",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    galleryAddButton: {
        width: 80,
        height: 80,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#D1D1D6",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
    },
    galleryAddText: {
        fontSize: 10,
        color: "#8E8E93",
        fontWeight: "600",
        marginTop: 4,
    },
});
