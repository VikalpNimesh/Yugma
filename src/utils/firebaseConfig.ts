import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

export const signInWithEmailPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error: any) {
        console.log("Login error:", error.code, error.message);
        throw error;
    }
};

export const createUserWithEmailPassword = async (
    email: string,
    password: string,
    displayName?: string
) => {
    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, { displayName });
        }
        await sendEmailVerification(user);

        console.log("✅ User signed up:", user.email);
        return user;
    } catch (error: any) {
        console.error("❌ Signup error:", error.code, error.message);
        throw error;
    }
};
