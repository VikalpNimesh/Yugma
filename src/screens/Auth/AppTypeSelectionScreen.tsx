import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';

const { width } = Dimensions.get('window');

const AppTypeSelectionScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleSelection = async (type: 'dating' | 'matrimonial') => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
            dispatch(updateUser({ appType: type }));
            navigation.reset({
                index: 0,
                routes: [{ name: 'GoogleLogin' as never }],
            });
        } catch (error) {
            console.error('Error saving data', error);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#FF5F6D", "#FF3366"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Yugma</Text>
                <Text style={styles.subtitle}>Choose your journey</Text>

                <View style={styles.cardsContainer}>
                    {/* Dating Option */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelection('dating')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.cardIcon}>💘</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Dating</Text>
                                <Text style={styles.cardDesc}>Find love and meaningful connections</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Matrimony Option */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelection('matrimonial')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.cardIcon}>💍</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Matrimonial</Text>
                                <Text style={styles.cardDesc}>Find your perfect life partner</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 50,
        textAlign: 'center',
    },
    cardsContainer: {
        width: '100%',
        gap: 20,
    },
    card: {
        width: '100%',
        height: 140,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardIcon: {
        fontSize: 36,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 20,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default AppTypeSelectionScreen;
