import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";


const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.logo}>
                <Entypo name="heart" size={22} color="red" />
                <Text style={{ color: "#E64A8B" }}>Vivah</Text>Setu
            </Text>


            <View style={styles.segmentContainer}>
                <TouchableOpacity style={[styles.segmentButton, styles.activeSegment]}>
                    <Text style={styles.segmentActiveText}>Matrimonial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.segmentButton}>
                    <Ionicons name="heart-outline" size={14} color="#000" />
                    <Text style={styles.segmentText}>Dating</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.segmentButton}>
                    <Ionicons name="crown-outline" size={14} color="#000" />
                    <Text style={styles.segmentText}>Premium</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    logo: {
        fontSize: 20,
        fontWeight: "700",
        paddingHorizontal: 16
    },
    segmentContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 25,
        marginTop: 12,
        alignSelf: "flex-start",
        paddingHorizontal: 16
    },
    segmentButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    activeSegment: {
        backgroundColor: "#FFE5EC",
        borderRadius: 25,
    },
    segmentActiveText: { color: "#E64A8B", fontWeight: "600", fontSize: 13 },
    segmentText: { marginLeft: 4, color: "#000", fontSize: 13 },
    header: { marginTop: 10 },

})