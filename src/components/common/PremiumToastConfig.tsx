import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export const premiumToastConfig = {
    success: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.successBorder]}>
            <View style={[styles.iconWrapper, styles.successBg]}>
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
            </View>
            <View style={styles.textContainer}>
                {text1 && <Text style={styles.titleText}>{text1}</Text>}
                {text2 && <Text style={styles.messageText}>{text2}</Text>}
            </View>
        </View>
    ),
    error: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.errorBorder]}>
            <View style={[styles.iconWrapper, styles.errorBg]}>
                <Ionicons name="alert-circle" size={24} color="#FF3366" />
            </View>
            <View style={styles.textContainer}>
                {text1 && <Text style={styles.titleText}>{text1}</Text>}
                {text2 && <Text style={styles.messageText}>{text2}</Text>}
            </View>
        </View>
    ),
    info: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.infoBorder]}>
            <View style={[styles.iconWrapper, styles.infoBg]}>
                <Ionicons name="information-circle" size={24} color="#00F0FF" />
            </View>
            <View style={styles.textContainer}>
                {text1 && <Text style={styles.titleText}>{text1}</Text>}
                {text2 && <Text style={styles.messageText}>{text2}</Text>}
            </View>
        </View>
    ),
};

const styles = StyleSheet.create({
    toastContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 18,
        width: width * 0.9,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        marginVertical: 10,
    },
    successBorder: {
        borderLeftWidth: 6,
        borderLeftColor: '#2ECC71',
    },
    errorBorder: {
        borderLeftWidth: 6,
        borderLeftColor: '#FF3366',
    },
    infoBorder: {
        borderLeftWidth: 6,
        borderLeftColor: '#00F0FF',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successBg: {
        backgroundColor: 'rgba(46, 204, 113, 0.12)',
    },
    errorBg: {
        backgroundColor: 'rgba(255, 51, 102, 0.12)',
    },
    infoBg: {
        backgroundColor: 'rgba(0, 240, 255, 0.12)',
    },
    textContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    messageText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666666',
        marginTop: 2,
    },
});
