import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const useHaptics = () => {
  const trigger = (type: "selection" | "impactLight" | "impactMedium" | "impactHeavy" | "notificationSuccess" | "notificationWarning" | "notificationError" = "impactLight") => {
    ReactNativeHapticFeedback.trigger(type, options);
  };

  return { trigger };
};
