import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoCon}>

                <Entypo name="heart-outlined" size={20} color="#E64A8B" />
                <Text style={styles.logo}>
                    <Text style={{ color: "#E64A8B" }}>Vivah</Text> Setu
                </Text>
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
            <TouchableOpacity style={[styles.segmentButton]}>

                <FontAwesome5 name="crown" size={14} color="#000" />
                <Text style={styles.segmentText}>Premium</Text>
            </TouchableOpacity>
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
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    activeSegment: {
        backgroundColor: "#FFE5EC",
        borderRadius: 25,
    },
    segmentActiveText:
        { color: "#E64A8B", fontWeight: "600", fontSize: 13 },
    segmentText:
        { marginLeft: 4, color: "#000", fontSize: 13 },
    header: {

        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "white",
        paddingVertical: 12,
        elevation: 10,
        paddingHorizontal: 12
    },

})