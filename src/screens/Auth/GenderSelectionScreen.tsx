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
import BackButton from '../../components/common/BackButton';

const { width } = Dimensions.get('window');

const GenderSelectionScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const handleSelection = async (gender: 'male' | 'female' | 'prefer_not_to_say') => {
        try {
            await AsyncStorage.setItem('userGender', gender);
            dispatch(updateUser({ gender }));
            navigation.navigate('GoogleLogin' as never);
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
            <BackButton />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Yugma</Text>
                <Text style={styles.subtitle}>Select your gender</Text>

                <View style={styles.cardsContainer}>
                    {/* Male Option */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelection('male')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.cardIcon}>👨</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Male</Text>
                                <Text style={styles.cardDesc}>I am a man</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Female Option */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelection('female')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.cardIcon}>👩</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Female</Text>
                                <Text style={styles.cardDesc}>I am a woman</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Prefer not to say Option */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelection('prefer_not_to_say')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconCircle}>
                                <Text style={styles.cardIcon}>👤</Text>
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Prefer not to say</Text>
                                <Text style={styles.cardDesc}>Keep it private</Text>
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
        height: 120,
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
        width: 70,
        height: 70,
        borderRadius: 35,
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

export default GenderSelectionScreen;
