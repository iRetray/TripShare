import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const DELAY_TO_CANCEL = 1500;

interface ButtonConfirmProps {
  isLoading?: boolean;
  textLoading?: string;
  text: string;
  textConfirm: string;
  icon: JSX.Element;
  onPressConfirmed: () => void;
}

export const ButtonConfirm: React.FC<ButtonConfirmProps> = ({
  isLoading,
  textLoading,
  text,
  textConfirm,
  icon,
  onPressConfirmed,
}) => {
  const [hasFirstPressDrop, setHasFirstPressDrop] = useState<boolean>(false);

  const handlePressDropTrip = (): void => {
    if (hasFirstPressDrop) {
      onPressConfirmed();
    } else {
      setHasFirstPressDrop(true);
      setTimeout(() => {
        setHasFirstPressDrop(false);
      }, DELAY_TO_CANCEL);
    }
  };

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={handlePressDropTrip}
      style={{
        ...styles.pressable,
        borderColor: isLoading
          ? "#ff4d4f"
          : hasFirstPressDrop
          ? "#820014"
          : "#cf1322",
        backgroundColor: isLoading
          ? "#ff4d4f"
          : hasFirstPressDrop
          ? "#820014"
          : "#cf1322",
      }}
    >
      {isLoading ? (
        <ActivityIndicator color="white" style={styles.icon} />
      ) : (
        <View style={styles.icon}>{icon}</View>
      )}
      <Text style={styles.text}>
        {isLoading ? textLoading : hasFirstPressDrop ? textConfirm : text}
      </Text>
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    height: 50,
    width: "auto",
    paddingHorizontal: 30,
    borderRadius: 100,
  },
  icon: { marginRight: 10, marginLeft: -10 },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
