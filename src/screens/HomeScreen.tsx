import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';


export const HomeScreen: React.FC = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.logoText}>
                        <Text style={{ color: "#FF7A00" }}>♥ </Text>Vivah
                        <Text style={{ color: "#E94057" }}>Setu</Text>
                    </Text>
                    <Text style={styles.subHeading}>
                        Where Tradition Meets Modern Love
                    </Text>
                    <Text style={styles.desc}>
                        Bridging generations and hearts by blending timeless tradition with
                        contemporary connection
                    </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('BasicInfo')} style={styles.getStartedBtn}>
                        <Text style={styles.getStartedText}>Get Started </Text>
                        <Feather
                            name="arrow-right"
                            size={18}
                            color={"white"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Choose VivahSetu?</Text>
                    <Text style={styles.sectionDesc}>
                        Experience the perfect blend of traditional matchmaking with modern
                        technology
                    </Text>

                    <View style={styles.featuresRow}>
                        <FeatureCard
                            title="Dual Profiles"
                            desc="Switch between matrimonial and dating modes"
                            id="1"
                        />
                        <FeatureCard
                            title="Smart Matching"
                            desc="Cultural preferences and compatibility"
                            id="2"
                        />
                    </View>

                    <View style={styles.featuresRow}>
                        <FeatureCard
                            title="Verified Profiles"
                            desc="Enhanced security and privacy"
                            id="3"
                        />
                        <FeatureCard
                            title="Premium Experience"
                            desc="Enhanced visibility and priority matching"
                            id="4"
                        />
                    </View>
                </View>

                <View style={styles.imageSection}>
                    <Text style={styles.sectionTitle}>Find Your Life Partner</Text>
                    <Text style={styles.sectionDesc}>
                        Connect with compatible partners for meaningful relationships
                    </Text>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1601612628452-3c21666774e3?q=80&w=800",
                        }}
                        style={styles.image}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>Ready to Begin Your Journey?</Text>
                    <Text style={styles.footerDesc}>
                        Join thousands who have found meaningful connections
                    </Text>
                    <TouchableOpacity style={styles.profileBtn}>
                        <Text style={styles.profileBtnText}>Create Your Profile </Text>
                        <Feather
                            name="arrow-right"
                            size={18}
                            color={"#E94057"}

                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

type FeatureCardProps = {
    title: string;
    desc: string;
    id: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, id }) => (


    <View style={styles.card}>

        <View style={styles.icon}>
            {
                id == "1" ?
                    <MaterialIcons
                        name="people"
                        size={24} /> :
                    id == "2" ?
                        <Entypo
                            name="heart-outlined"
                            size={24} /> : id == "3" ?
                            <MaterialIcons
                                name="verified-user"
                                size={24} /> : id == "4" ?
                                <MaterialIcons
                                    name="star"
                                    size={24} /> : null
            }

        </View>

        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
    </View>
);

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#FFF0F3",
        alignItems: "center",
        padding: 24,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#E94057",
    },
    subHeading: {
        fontSize: 16,
        color: "#333",
        marginTop: 8,
        fontWeight: "500",
    },
    desc: {
        textAlign: "center",
        color: "#555",
        marginVertical: 12,
        lineHeight: 20,
    },
    getStartedBtn: {
        backgroundColor: "#E94057",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 30,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    getStartedText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: "#111",
    },
    sectionDesc: {
        fontSize: 14,
        textAlign: "center",
        color: "#555",
        marginTop: 6,
        marginBottom: 20,
    },
    featuresRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        flex: 1,
        backgroundColor: "#FFF8F8",
        padding: 14,
        borderRadius: 14,
        marginHorizontal: 6,
        elevation: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 50

    },
    cardTitle: {
        fontWeight: "700",
        color: "#E94057",
        marginBottom: 6,
        fontSize: 14,
    },
    cardDesc: {
        fontSize: 12,
        color: "#555",
    },
    imageSection: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 12,
        marginTop: 12,
    },
    footer: {
        backgroundColor: "#E94057",
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    footerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    footerDesc: {
        color: "#fff",
        marginVertical: 8,
        textAlign: "center",
    },
    profileBtn: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 30,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"

    },
    profileBtnText: {
        color: "#E94057",
        fontWeight: "700",
    },
});
