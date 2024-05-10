import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";

export interface InputText extends TextInputProps {
  titleInput: string;
}

export const Input: React.FC<InputText> = ({ titleInput, ...props }) => {
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  const handleFocus = (): void => {
    setIsInputActive(true);
  };

  const handleBlur = (): void => {
    setIsInputActive(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{titleInput}</Text>
      <TextInput
        {...props}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={
          isInputActive
            ? {
                ...styles.input,
                ...styles.inputActive,
              }
            : styles.input
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 30, marginLeft: 20, marginRight: 20 },
  text: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,
  },
  input: {
    borderRadius: 5,
    height: 50,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#bfbfbf",
    padding: 10,
    fontSize: 18,
  },
  inputActive: {
    borderWidth: 2,
    borderColor: "#1890ff",
  },
});
