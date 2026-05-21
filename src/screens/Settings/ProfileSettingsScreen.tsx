import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { handleLogout } from "../../api/firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { updateBasicInfo, updateAboutYou } from "../../redux/slices/profileFormSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";

export default function ProfileSettingsScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    
    const { email: reduxEmail, name: reduxName, photo: reduxPhoto } = useSelector((state: any) => state.user?.user || {});
    const reduxGender = useSelector((state: any) => state.user?.gender || state.user?.user?.gender || "");
    const profileForm = useSelector((state: any) => state.profileForm);
    const authProfile = useSelector((state: any) => state.auth?.profile || {});
    const { basicInfo, aboutYou } = profileForm;

    // Local state for editing
    const [name, setName] = useState(authProfile.fullName || basicInfo.fullName || reduxName || "");
    const [age, setAge] = useState(authProfile.age ? String(authProfile.age) : basicInfo.age || "");
    const [gender, setGender] = useState(reduxGender);
    const [location, setLocation] = useState(authProfile.location || basicInfo.location || "");
    const [profession, setProfession] = useState(authProfile.profession || basicInfo.profession || "");
    const [education, setEducation] = useState(authProfile.education || basicInfo.education || "");
    const [region, setRegion] = useState(authProfile.region || basicInfo.region || "");
    const [areaCover, setAreaCover] = useState(authProfile.community || basicInfo.areaCover || "");
    const [bio, setBio] = useState(authProfile.bio || aboutYou.bio || "");
    const [email, setEmail] = useState(authProfile.email || basicInfo.email || reduxEmail || "");

    React.useEffect(() => {
        if (!isEditing) {
            setName(authProfile.fullName || basicInfo.fullName || reduxName || "");
            setAge(authProfile.age ? String(authProfile.age) : basicInfo.age || "");
            setGender(reduxGender);
            setLocation(authProfile.location || basicInfo.location || "");
            setProfession(authProfile.profession || basicInfo.profession || "");
            setEducation(authProfile.education || basicInfo.education || "");
            setRegion(authProfile.region || basicInfo.region || "");
            setAreaCover(authProfile.community || basicInfo.areaCover || "");
            setBio(authProfile.bio || aboutYou.bio || "");
            setEmail(authProfile.email || basicInfo.email || reduxEmail || "");
        }
    }, [authProfile, basicInfo, aboutYou, reduxName, reduxEmail, reduxGender, isEditing]);

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
        } catch (error) {
            console.error("Failed to save user info:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton color="#000" title="Profile Information" absolute={false} style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 10 }} />
            <ScrollView contentContainerStyle={styles.content}>

                {!isEditing ? (
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <Image source={{
                                uri: (authProfile.photos && authProfile.photos.length > 0) ? authProfile.photos[0].url : (basicInfo.photo || reduxPhoto || "https://via.placeholder.com/150")
                            }} style={styles.profileAvatar} />
                            <View style={styles.profileBadge}>
                                <Ionicons name="checkmark-circle" size={24} color="#FF5F6D" />
                            </View>
                        </View>

                        <Text style={styles.profileName}>{name}</Text>
                        <Text style={styles.profileHandle}>{email}</Text>

                        <View style={styles.profileDetails}>
                            {(age || gender) && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="person-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>
                                        {gender ? `${gender}` : ""}
                                        {gender && age ? " • " : ""}
                                        {age ? `${age} years old` : ""}
                                    </Text>
                                </View>
                            )}
                            {(location || region || areaCover) && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="location-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>
                                        {[location, region, areaCover].filter(Boolean).join(", ")}
                                    </Text>
                                </View>
                            )}
                            {profession ? (
                                <View style={styles.detailRow}>
                                    <Ionicons name="briefcase-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>{profession}</Text>
                                </View>
                            ) : null}
                            {education ? (
                                <View style={styles.detailRow}>
                                    <Ionicons name="school-outline" size={16} color="#666" />
                                    <Text style={styles.detailText}>{education}</Text>
                                </View>
                            ) : null}
                        </View>

                        {bio ? (
                            <View style={styles.bioContainer}>
                                <Text style={styles.bioLabel}>About Me</Text>
                                <Text style={styles.bioText}>{bio}</Text>
                            </View>
                        ) : null}

                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.primaryBtn}>
                                <Ionicons name="create-outline" size={16} color="#fff" />
                                <Text style={styles.primaryBtnText}>Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogoutPress} style={styles.secondaryBtn}>
                                <Ionicons name="log-out-outline" size={16} color="#333" />
                                <Text style={styles.secondaryBtnText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.editCard}>
                        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
                        <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
                        <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
                        <TextInput style={styles.input} placeholder="Education" value={education} onChangeText={setEducation} />
                        <TextInput style={styles.input} placeholder="Profession" value={profession} onChangeText={setProfession} />
                        <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
                        <TextInput style={styles.input} placeholder="Region" value={region} onChangeText={setRegion} />
                        <TextInput style={styles.input} placeholder="Address / Area Cover" value={areaCover} onChangeText={setAreaCover} />
                        <TextInput style={[styles.input, styles.textArea]} placeholder="Bio" multiline numberOfLines={3} value={bio} onChangeText={setBio} />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                                <Text style={styles.saveText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: { padding: 16 },
    header: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#222", textAlign: "center" },
    profileCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "#eee" },
    profileHeader: { position: "relative", marginTop: 10, marginBottom: 10 },
    profileAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#fff" },
    profileBadge: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12 },
    profileName: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 4 },
    profileHandle: { fontSize: 14, color: "#666", marginBottom: 16 },
    profileDetails: { flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 },
    detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    detailText: { fontSize: 14, color: "#555" },
    bioContainer: { width: "100%", backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8, marginBottom: 20 },
    bioLabel: { fontSize: 12, fontWeight: "600", color: "#999", marginBottom: 4, textTransform: "uppercase" },
    bioText: { fontSize: 14, color: "#444", lineHeight: 20, fontStyle: "italic" },
    actionButtonsRow: { flexDirection: "row", marginTop: 20, gap: 12, width: "100%", justifyContent: "center" },
    primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF5F6D", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, gap: 6 },
    primaryBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
    secondaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0f0", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, gap: 6 },
    secondaryBtnText: { color: "#333", fontSize: 13, fontWeight: "600" },
    editCard: { padding: 10 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10, color: "#000" },
    textArea: { height: 80, textAlignVertical: "top" },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    cancelBtn: { padding: 10 },
    cancelText: { color: "#999" },
    saveBtn: { backgroundColor: "#FF5F6D", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    saveText: { color: "#fff" },
});
