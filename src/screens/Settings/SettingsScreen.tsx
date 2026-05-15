import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    Switch,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { handleLogout } from "../../api/firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { updateBasicInfo, updateAboutYou } from "../../redux/slices/profileFormSlice";
import { version } from '../../../package.json';

type TabType = "Profile" | "Notifications" | "Privacy" | "Premium" | "Verification";

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<TabType>("Profile");

    return (
        <View style={styles.container}>
            {/* Sidebar Tabs */}
            <View style={styles.sidebar}>
                <View style={{ width: '100%' }}>
                    {(["Profile", "Notifications", "Privacy", "Premium", "Verification"] as TabType[]).map(
                        (tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[styles.tabItem, activeTab === tab && styles.activeTab]}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>

                <View style={styles.sidebarFooter}>
                    <Text style={styles.versionText}>v{version}</Text>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.content}>
                {activeTab === "Profile" && <ProfileTab />}
                {activeTab === "Notifications" && <NotificationTab />}
                {activeTab === "Privacy" && <PrivacyTab />}
                {activeTab === "Premium" && <PremiumTab />}
                {activeTab === "Verification" && <VerificationTab />}
            </ScrollView>
        </View>
    );
}

function NotificationTab() {
    // Dummy state for notifications
    const [newMatches, setNewMatches] = useState(true);
    const [messages, setMessages] = useState(true);
    const [likes, setLikes] = useState(false);
    const [appUpdates, setAppUpdates] = useState(true);
    const [emailPromos, setEmailPromos] = useState(false);

    const NotificationItem = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (val: boolean) => void }) => (
        <View style={styles.notificationRow}>
            <Text style={styles.notificationLabel}>{label}</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#DD2476" }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <View>
            <Text style={styles.header}>Notification Settings</Text>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Push Notifications</Text>
                <NotificationItem label="New Matches" value={newMatches} onValueChange={setNewMatches} />
                <View style={styles.separator} />
                <NotificationItem label="Messages" value={messages} onValueChange={setMessages} />
                <View style={styles.separator} />
                <NotificationItem label="Likes & Comments" value={likes} onValueChange={setLikes} />
                <View style={styles.separator} />
                <NotificationItem label="App Updates & Tips" value={appUpdates} onValueChange={setAppUpdates} />
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Email Notifications</Text>
                <NotificationItem label="Promotions & Offers" value={emailPromos} onValueChange={setEmailPromos} />
            </View>
        </View>
    );
}

function PrivacyTab() {
    // Dummy state for privacy
    const [showProfile, setShowProfile] = useState(true);
    const [showAge, setShowAge] = useState(true);
    const [showDistance, setShowDistance] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [activityStatus, setActivityStatus] = useState(true);

    const PrivacyItem = ({ label, value, onValueChange, description }: { label: string, value: boolean, onValueChange: (val: boolean) => void, description?: string }) => (
        <View style={styles.privacyRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.notificationLabel}>{label}</Text>
                {description && <Text style={styles.privacyDescription}>{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#DD2476" }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <View>
            <Text style={styles.header}>Privacy & Safety</Text>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Visibility</Text>
                <PrivacyItem
                    label="Show me on Yugma"
                    description="Turn this off to hide your profile. You won't be seen by new people."
                    value={showProfile}
                    onValueChange={setShowProfile}
                />
                <View style={styles.separator} />
                <PrivacyItem label="Show my Age" value={showAge} onValueChange={setShowAge} />
                <View style={styles.separator} />
                <PrivacyItem label="Show my Distance" value={showDistance} onValueChange={setShowDistance} />
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Data & Activity</Text>
                <PrivacyItem label="Read Receipts" value={readReceipts} onValueChange={setReadReceipts} />
                <View style={styles.separator} />
                <PrivacyItem label="Share Activity Status" value={activityStatus} onValueChange={setActivityStatus} />
            </View>

            <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.menuRow}>
                    <Text style={styles.menuText}>Blocked Contacts</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.menuRow}>
                    <Text style={[styles.menuText, { color: 'red' }]}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function VerificationTab() {
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.header}>Verification</Text>

            <View style={styles.verificationCard}>
                <View style={styles.badgeContainer}>
                    <Ionicons name="shield-checkmark" size={64} color="#DD2476" />
                </View>
                <Text style={styles.verificationStatus}>Get Verified</Text>
                <Text style={styles.verificationSubtext}>
                    Prove you're real, build trust, and get more matches with the Verification Badge.
                </Text>

                <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#DD2476" />
                        <Text style={styles.benefitText}>Exclusive Verification Badge</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#DD2476" />
                        <Text style={styles.benefitText}>Higher trust from other users</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#DD2476" />
                        <Text style={styles.benefitText}>Priority support</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.verifyBtn}>
                    <Text style={styles.verifyBtnText}>Verify Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const user = useSelector((state: any) => state.user);
    const mode = user.appType || "Matrimonial";

    const setMode = (newMode: "Matrimonial" | "Dating") => {
        dispatch(updateUser({ appType: newMode }));
    };
    const handleLogoutPress = async () => {
        try {
            Toast.show({
                type: 'info',
                text1: 'Logging out...',
                position: 'bottom',
            });
            await handleLogout(navigation, dispatch);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error.message || 'Please try again',
                position: 'bottom',
            });
            console.error("Logout error:", error);
        }
    };
    const { email: reduxEmail, name: reduxName, photo: reduxPhoto } = useSelector((state: any) => state.user?.user || {});
    const profileForm = useSelector((state: any) => state.profileForm);
    const { basicInfo, aboutYou } = profileForm;

    // Local state for editing - initialized with profileForm data or fallback to user slice
    const [name, setName] = useState(basicInfo.fullName || reduxName || "");
    const [age, setAge] = useState(basicInfo.age || "");
    const [location, setLocation] = useState(basicInfo.location || "");
    const [profession, setProfession] = useState(basicInfo.profession || "");
    const [bio, setBio] = useState(aboutYou.bio || "");
    const [email, setEmail] = useState(basicInfo.email || reduxEmail || "");

    // Sync local state if Redux changes externally (though less likely here)
    React.useEffect(() => {
        if (!isEditing) {
            setName(basicInfo.fullName || reduxName || "");
            setAge(basicInfo.age || "");
            setLocation(basicInfo.location || "");
            setProfession(basicInfo.profession || "");
            setBio(aboutYou.bio || "");
            setEmail(basicInfo.email || reduxEmail || "");
        }
    }, [basicInfo, aboutYou, reduxName, reduxEmail, isEditing]);

    const handleSave = async () => {
        try {
            // Update profileForm slice
            dispatch(updateBasicInfo({
                fullName: name,
                email,
                age,
                location,
                profession,
            }));

            dispatch(updateAboutYou({
                bio,
            }));

            setIsEditing(false);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully',
                position: 'bottom',
            });
            console.log("✅ Profile updated in profileFormSlice");
        } catch (error) {
            console.error("Failed to save user info:", error);
        }
    };


    return (
        <View>
            <Text style={styles.header}>Profile Information</Text>

            {!isEditing ? (
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Image source={{
                            uri: basicInfo.photo || reduxPhoto || "https://via.placeholder.com/150"
                        }} style={styles.profileAvatar} />
                        <View style={styles.profileBadge}>
                            <Ionicons name="checkmark-circle" size={24} color="#DD2476" />
                        </View>
                    </View>

                    <Text style={styles.profileName}>{name}</Text>
                    <Text style={styles.profileHandle}>{email}</Text>

                    <View style={styles.profileDetails}>
                        {(age || location) && (
                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={16} color="#666" />
                                <Text style={styles.detailText}>
                                    {age ? `${age} years old` : ""}
                                    {age && location ? " • " : ""}
                                    {location}
                                </Text>
                            </View>
                        )}
                        {profession ? (
                            <View style={styles.detailRow}>
                                <Ionicons name="briefcase-outline" size={16} color="#666" />
                                <Text style={styles.detailText}>{profession}</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Profession"
                        value={profession}
                        onChangeText={setProfession}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Bio"
                        multiline
                        numberOfLines={3}
                        value={bio}
                        onChangeText={setBio}
                    />

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

            {/* Profile Mode Toggle */}
            {/* <View style={styles.modeContainer}>
                <Text style={styles.modeTitle}>Profile Mode</Text>
                <View style={styles.modeSwitch}>
                    <TouchableOpacity
                        onPress={() => setMode("Matrimonial")}
                        style={[styles.modeBtn, mode === "Matrimonial" && styles.activeMode]}
                    >
                        <Text
                            style={[
                                styles.modeText,
                                mode === "Matrimonial" && styles.activeModeText,
                            ]}
                        >
                            Matrimonial
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMode("Dating")}
                        style={[styles.modeBtn, mode === "Dating" && styles.activeMode]}
                    >
                        <Text
                            style={[
                                styles.modeText,
                                mode === "Dating" && styles.activeModeText,
                            ]}
                        >
                            Dating
                        </Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    );
}

function Placeholder({ title }: { title: string }) {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{title} Settings Coming Soon</Text>
        </View>
    );
}



interface Feature {
    text: string;
    icon: string;
    fade?: boolean;
    info?: boolean;
}

interface Pricing {
    duration: string;
    price: string;
    perWeek: string | null;
    save?: string;
    total?: string;
}

interface Plan {
    color: string;
    features: Feature[];
    pricing: Pricing[];
    btnText: string;
}

function PremiumTab() {
    const navigation = useNavigation<any>();

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.header}>Premium Membership</Text>

            <View style={styles.premiumStatusCard}>
                <View style={[styles.iconCircle, { backgroundColor: "#FFD700", width: 60, height: 60, borderRadius: 30, marginBottom: 16 }]}>
                    <Ionicons name="gift-outline" size={32} color="#fff" />
                </View>
                <Text style={styles.premiumStatusTitle}>Unlock All Features</Text>
                <Text style={styles.premiumStatusSubtext}>
                    Send unlimited likes, see who likes you, and get verified with our premium plans.
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('PremiumPlans')}
                    style={styles.viewPlansBtn}
                >
                    <Text style={styles.viewPlansText}>View All Plans</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.menuRow}>
                    <Text style={styles.menuText}>Restore Purchase</Text>
                    <Ionicons name="refresh-outline" size={20} color="#ccc" />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.menuRow}>
                    <Text style={styles.menuText}>Redeem Code</Text>
                    <Ionicons name="card-outline" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    sidebar: {
        width: 100,
        backgroundColor: "#f9f9f9",
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "space-between"
    },
    sidebarFooter: {
        marginBottom: -10,
        alignItems: 'center',
        width: "100%"

    },
    versionText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    tabItem: {
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#fff",
        borderLeftWidth: 3,
        borderLeftColor: "#DD2476",
    },
    tabText: { color: "#666", fontSize: 12, marginTop: 4 },
    activeTabText: { color: "#DD2476", fontWeight: "600" },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    header: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#222" },

    // Profile Styles...
    profileCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee"
    },
    text: { fontSize: 18, fontWeight: "600", color: "#333", marginTop: 8 },
    verified: { color: "green", fontSize: 12, marginTop: 4 },
    editText: { color: "#333", fontSize: 12, fontWeight: "500" },

    actionButtonsRow: {
        flexDirection: "row",
        marginTop: 20,
        gap: 12,
        width: "100%",
        justifyContent: "center",
    },
    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DD2476",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    primaryBtnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    secondaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    secondaryBtnText: {
        color: "#333",
        fontSize: 13,
        fontWeight: "600",
    },

    // Edit Styles
    editCard: { padding: 10 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10 },
    textArea: { height: 80 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    cancelBtn: { padding: 10 },
    cancelText: { color: "#999" },
    saveBtn: { backgroundColor: "#DD2476", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    saveText: { color: "#fff" },

    // Premium Styles
    planSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f0f0f0",
        borderRadius: 25,
        padding: 4,
        marginBottom: 20
    },
    planTypeBtn: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 20,
    },
    planTypeText: { fontSize: 13, fontWeight: "600", color: "#555" },
    planTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 16, textAlign: "center" },
    featureCard: {
        backgroundColor: "#f9f9f9",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    featureText: { fontSize: 14, color: "#333", flex: 1 },

    pricingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 20
    },
    priceCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 10,
        alignItems: "center",
        position: "relative"
    },
    saveBadge: {
        position: "absolute",
        top: -10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    priceSaveText: { fontSize: 10, fontWeight: "700" },
    durationText: { fontSize: 14, fontWeight: "bold", marginTop: 4, color: "#000" },
    priceText: { fontSize: 12, color: "#666", marginTop: 2 },

    actionBtn: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12
    },
    actionBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    tncText: { fontSize: 11, color: "#999", textAlign: "center", paddingHorizontal: 20 },

    placeholder: { alignItems: "center", justifyContent: "center", height: 200 },
    placeholderText: { color: "#999" },

    // Mode Toggle Styles
    modeContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    modeTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
        marginBottom: 12,
    },
    modeSwitch: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        padding: 4,
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
    },
    activeMode: {
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    modeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
    },
    activeModeText: {
        color: "#DD2476",
    },

    // Notification Styles
    sectionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginBottom: 16,
    },
    notificationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    notificationLabel: {
        fontSize: 14,
        color: "#444",
        fontWeight: "500",
    },
    separator: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 4,
    },
    privacyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    privacyDescription: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
        lineHeight: 16,
    },
    menuRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
    },
    menuText: {
        fontSize: 15,
        color: "#333",
        fontWeight: "500",
    },

    // Verification Styles
    verificationCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    badgeContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fcebf2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    verificationStatus: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 8,
    },
    verificationSubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    benefitsList: {
        width: "100%",
        marginBottom: 24,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    benefitText: {
        fontSize: 15,
        color: "#444",
        fontWeight: "500",
    },
    verifyBtn: {
        backgroundColor: "#DD2476",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: "100%",
        alignItems: "center",
    },
    verifyBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    // Enhanced Profile Styles
    profileHeader: {
        position: "relative",
        marginTop: 10,
        marginBottom: 10,
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#fff",
    },
    profileBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    profileName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 4,
    },
    profileHandle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    profileDetails: {
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: "#555",
    },
    bioContainer: {
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    bioLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#999",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    bioText: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
        fontStyle: "italic",
    },

    // New Premium Entry Styles
    premiumStatusCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    premiumStatusTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginBottom: 8,
    },
    premiumStatusSubtext: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    viewPlansBtn: {
        backgroundColor: "#DD2476",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
        shadowColor: "#DD2476",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    viewPlansText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});
