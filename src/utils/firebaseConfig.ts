import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const navigation = useNavigation()
export { auth };

export const handleLogout = async () => {
    try {
        await GoogleSignin.signOut();
        await auth().signOut();
        navigation.reset({
            index: 0,
            routes: [{ name: 'GoogleLogin' }],
        });
        Alert.alert("User logged out successfully");
    } catch (error) {
        console.error("Logout error: ", error);
    }
};
