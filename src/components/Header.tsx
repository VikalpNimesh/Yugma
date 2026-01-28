import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';


const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoCon}>
                <Image
                    source={require("../assets/yugmaNew.jpg")}
                    style={{ width: 120, height: 40, resizeMode: "contain" }}
                />
            </View>

            {/* <View style={styles.segmentContainer}>
                <TouchableOpacity style={[styles.segmentButton, styles.activeSegment]}>
                    <Text style={styles.segmentActiveText}>Matrimonial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.segmentButton}>
                    <Ionicons name="heart-outline" size={14} color="#000" />
                    <Text style={styles.segmentText}>Dating</Text>
                </TouchableOpacity>
            </View> */}
            {/* <LinearGradient
                colors={['#FEC001', '#FF6E00']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientContainer}
            >

                <TouchableOpacity style={[styles.segmentButton]}>

                    <FontAwesome5 name="crown" size={14} color="#fff" />
                    <Text style={styles.segmentText}>Premium</Text>
                </TouchableOpacity>
            </LinearGradient> */}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    logoCon: {

        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 4

    },
    logo: {
        fontSize: 18,
        fontWeight: "700",


    },
    segmentContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        borderColor: "#dadada",
        borderWidth: 1,
        padding: 4


    },
    segmentButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4


    },
    activeSegment: {
        backgroundColor: "#FFE5EC",
        borderRadius: 25,
    },
    segmentActiveText:
        { color: "#E64A8B", fontWeight: "600", fontSize: 13 },
    segmentText:
        { marginLeft: 4, color: "#fff", fontSize: 13 },
    header: {

        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 12,
        elevation: 10,
        paddingHorizontal: 8
    },
    gradientContainer: {
        borderRadius: 8,



    },

})