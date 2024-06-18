import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

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
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,
        borderWidth: 1,
        borderColor: isLoading
          ? "#ff4d4f"
          : hasFirstPressDrop
          ? "#820014"
          : "#cf1322",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        backgroundColor: isLoading
          ? "#ff4d4f"
          : hasFirstPressDrop
          ? "#820014"
          : "#cf1322",
        display: "flex",
        flexDirection: "row",
        height: 50,
        width: "auto",
        marginTop: 20,
        paddingHorizontal: 30,
        borderRadius: 100,
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          color="white"
          style={{ marginRight: 10, marginLeft: -10 }}
        />
      ) : (
        icon
      )}
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {isLoading ? textLoading : hasFirstPressDrop ? textConfirm : text}
      </Text>
    </TouchableOpacity>
  );
};
