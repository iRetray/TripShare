import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

import * as Haptics from "expo-haptics";

interface ButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon: JSX.Element;
  title: string;
  pressableAditionalStyles?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  disabled,
  isLoading,
  loadingText,
  icon,
  title,
  pressableAditionalStyles,
  onPress,
}) => {
  const handlePress = (): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onPress();
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePress}
      style={[
        isLoading
          ? { ...styles.pressable, ...styles.presableLoading }
          : styles.pressable,
        pressableAditionalStyles,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="white" style={styles.iconView} />
      ) : (
        <View style={styles.iconView}>{icon}</View>
      )}
      <Text style={styles.title}>{isLoading ? loadingText : title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressable: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
    borderWidth: 1,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    backgroundColor: "#000000",
    display: "flex",
    flexDirection: "row",
    height: 50,
    width: "auto",
    paddingHorizontal: 30,
    borderRadius: 100,
  },
  iconView: { marginRight: 15 },
  presableLoading: {
    borderColor: "#8c8c8c",
    backgroundColor: "#8c8c8c",
  },
  title: { color: "white", fontSize: 20, fontWeight: "bold" },
});
