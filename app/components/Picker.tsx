import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface PickerProps {
  title: string;
  useAlternativeIcon?: boolean;
  options: string[];
  onOptionSelected: (name: string) => void;
}

export const Picker: React.FC<PickerProps> = ({
  title,
  useAlternativeIcon,
  options,
  onOptionSelected,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>("");

  const handleSelect = (name: string): void => {
    setSelectedItem(name);
    onOptionSelected(name);
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {options.map((name, key) => (
            <Option
              key={key}
              useAlternativeIcon={useAlternativeIcon || false}
              name={name}
              isSelected={name === selectedItem}
              onPress={handleSelect}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 20,
    marginTop: 30,
  },
});

import * as Haptics from "expo-haptics";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

interface OptionProps {
  name: string;
  useAlternativeIcon: boolean;
  isSelected: boolean;
  onPress: (id: string) => void;
}

const Option: React.FC<OptionProps> = ({
  name,
  useAlternativeIcon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress(name);
      }}
    >
      <View
        style={
          isSelected
            ? { ...stylesOption.container, ...stylesOption.containerSelected }
            : stylesOption.container
        }
      >
        {isSelected ? (
          <FontAwesome name="check-circle" size={20} color="white" />
        ) : useAlternativeIcon ? (
          <FontAwesome name="question-circle" size={20} color="black" />
        ) : (
          <Ionicons name="person" size={20} color="black" />
        )}

        <Text
          style={
            isSelected
              ? { ...stylesOption.check, ...stylesOption.checkSelected }
              : stylesOption.check
          }
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const stylesOption = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 10,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "auto",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerSelected: {
    backgroundColor: "black",
  },
  check: {
    marginLeft: 10,
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  checkSelected: {
    color: "white",
  },
});
