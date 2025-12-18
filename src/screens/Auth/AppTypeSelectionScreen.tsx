import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
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

    const handleSelection = async (type: 'Dating' | 'Matrimonial') => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
            // Store the selected type in Redux
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
                colors={['#FFF9F6', '#FFF0E6']}
                style={styles.background}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Welcome to Yugma</Text>
                    <Text style={styles.subtitle}>Choose your journey</Text>

                    <View style={styles.cardsContainer}>
                        {/* Dating Option */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleSelection('Dating')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#FF9A9E', '#FECFEF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.cardGradient}
                            >
                                <Text style={styles.cardIcon}>💘</Text>
                                <Text style={styles.cardTitle}>Dating</Text>
                                <Text style={styles.cardDesc}>Find love and meaningful connections</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Matrimony Option */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleSelection('Matrimonial')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#a18cd1', '#fbc2eb']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.cardGradient}
                            >
                                <Text style={styles.cardIcon}>💍</Text>
                                <Text style={styles.cardTitle}>Matrimonial</Text>
                                <Text style={styles.cardDesc}>Find your perfect life partner</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    cardsContainer: {
        width: '100%',
        gap: 20,
    },
    card: {
        width: '100%',
        height: 160,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
});

export default AppTypeSelectionScreen;
