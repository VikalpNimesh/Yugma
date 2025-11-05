import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation()
export { auth };

export const handleLogout = async () => {
    try {
        await GoogleSignin.signOut();
        await auth().signOut();
        navigation.navigate("GoogleLogin")
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Logout error: ", error);
    }
};
