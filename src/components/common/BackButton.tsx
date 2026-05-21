import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackButtonProps {
    onPress?: () => void;
    color?: string;
    style?: StyleProp<ViewStyle>;
    absolute?: boolean;
    title?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
    onPress,
    color = '#FFFFFF',
    style,
    absolute = true,
    title
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const buttonContent = (
        <TouchableOpacity
            style={[
                styles.container,
                !title && absolute && {
                    position: 'absolute',
                    top: Math.max(insets.top, 20),
                    left: 20,
                    zIndex: 10
                },
                !title && style
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <Ionicons name="chevron-back" size={32} color={color} />
        </TouchableOpacity>
    );

    if (title) {
        return (
            <View style={[
                styles.headerWrapper,
                absolute && {
                    position: 'absolute',
                    top: Math.max(insets.top, 20),
                    left: 20,
                    right: 20,
                    zIndex: 10
                },
                style
            ]}>
                {buttonContent}
                <Text style={[styles.titleText, { color }]}>{title}</Text>
            </View>
        );
    }

    return buttonContent;
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slight background for visibility
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 16,
    }
});

export default BackButton;
