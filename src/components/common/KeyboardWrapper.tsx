import React, { useRef } from 'react'
import { Animated, Keyboard } from 'react-native'


/**
 * @description The AnimatedKeyboardView component is designed to smoothly animate the view when the keyboard appears or disappears in a React Native app. It can be used to uplift or shift the view when the keyboard is shown, providing a better user experience when dealing with input fields
 */
export const KeyboardWrapper = (props: any) => {
    const {
        children,
        containerStyle,
        upliftHeightDivisor = 1.75,
    } = props
    const shift = useRef(new Animated.Value(0)).current

    const onShowKeyboard = (e: any) => {
        const height = e.endCoordinates.height / upliftHeightDivisor
        upliftView(height)
    }

    const onHideKeyboard = () => {
        resetView()
    }

    const upliftView = (keyboardHeight: number) => {
        Animated.timing(shift, {
            toValue: -keyboardHeight,
            useNativeDriver: true,
        }).start()
    }

    const resetView = () => {
        Animated.timing(shift, {
            toValue: 0,
            useNativeDriver: true,
        }).start()
    }

    React.useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            onShowKeyboard,
        )
        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            onHideKeyboard,
        )
        return () => {
            showSubscription?.remove?.()
            hideSubscription?.remove?.()
        }
    }, [])

    return (
        <Animated.View style={[{ transform: [{ translateY: shift }] }, containerStyle]}>
            {children}
        </Animated.View>
    )
}
