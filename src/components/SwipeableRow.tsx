import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  GestureDetector,
  Gesture,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useHaptics } from '../hooks/useHaptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export interface SwipeableRowProps extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  children: React.ReactNode;
  onDelete?: () => void;
  onArchive?: () => void;
  onRead?: () => void;
  onSwipeStart?: () => void;
  renderLeftActions?: boolean;
  renderRightActions?: boolean;
}

export interface SwipeableRowMethods {
  close: () => void;
}

const SwipeableRow = forwardRef<SwipeableRowMethods, SwipeableRowProps>(
  ({ children, onDelete, onArchive, onRead, onSwipeStart, simultaneousHandlers }, ref) => {
    const translateX = useSharedValue(0);
    const context = useSharedValue(0);
    const { trigger } = useHaptics();

    const close = useCallback(() => {
      translateX.value = withSpring(0);
    }, [translateX]);

    useImperativeHandle(ref, () => ({
      close,
    }));

    const panGesture = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onStart(() => {
        context.value = translateX.value;
        if (onSwipeStart) runOnJS(onSwipeStart)();
      })
      .onUpdate((event) => {
        translateX.value = event.translationX + context.value;
      })
      .onEnd(() => {
        if (translateX.value > SWIPE_THRESHOLD) {
          // Swipe Right (Archive/Read)
          translateX.value = withSpring(SCREEN_WIDTH);
          if (onArchive) runOnJS(onArchive)();
          else if (onRead) runOnJS(onRead)();
          runOnJS(trigger)('notificationSuccess');
        } else if (translateX.value < -SWIPE_THRESHOLD) {
          // Swipe Left (Delete)
          translateX.value = withSpring(-SCREEN_WIDTH);
          if (onDelete) runOnJS(onDelete)();
          runOnJS(trigger)('notificationWarning');
        } else {
          translateX.value = withSpring(0);
        }
      });

    // Handle simultaneous gestures if provided
    const gesture = simultaneousHandlers 
      ? Gesture.Simultaneous(panGesture, Gesture.Native()) 
      : panGesture;

    const rStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const rIconLeftStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP);
      const scale = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.5, 1.2], Extrapolation.CLAMP);
      return { opacity, transform: [{ scale }] };
    });

    const rIconRightStyle = useAnimatedStyle(() => {
      const opacity = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP);
      const scale = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1.2, 0.5], Extrapolation.CLAMP);
      return { opacity, transform: [{ scale }] };
    });

    const rBackgroundStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        ['#FF3B30', '#F2F2F7', '#34C759'] // Red for delete, Grey for neutral, Green for archive
      );
      return { backgroundColor };
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.background, rBackgroundStyle]}>
          <Animated.View style={[styles.iconContainer, styles.leftIcon, rIconLeftStyle]}>
            <Ionicons name="archive-outline" size={28} color="white" />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, styles.rightIcon, rIconRightStyle]}>
            <Ionicons name="trash-outline" size={28} color="white" />
          </Animated.View>
        </Animated.View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.content, rStyle]}>{children}</Animated.View>
        </GestureDetector>
      </View>
    );
  }
);


const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: 'white',
  },
  iconContainer: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    alignItems: 'flex-start',
  },
  rightIcon: {
    alignItems: 'flex-end',
  },
});

export default SwipeableRow;
