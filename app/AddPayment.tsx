import {
  View,
  Button,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { PickerIOS } from "@react-native-picker/picker";

import { Input, InputMoney, Picker } from "./components";
import { useState } from "react";

import { Text } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";

import * as Haptics from "expo-haptics";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const AddPayment = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<any>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Picker
          title="¿Quién pagó la cuenta?"
          options={["Juliana <3", "Julian", "Pepito", "Otro pepito"]}
          onOptionSelected={(name) => {
            console.log("selected: ", name);
          }}
        />
        <InputMoney
          titleInput="Valor del pago"
          placeholder="$ 25.000"
          onChangeMoney={() => {}}
        />
        <Input
          titleInput="Descripción"
          placeholder="Salchipapa con butiffarra"
          onChangeText={() => {}}
        />
        <Picker
          useAlternativeIcon
          title="Forma de repartir la cuenta"
          options={["Partes iguales", "Personalizado"]}
          onOptionSelected={(name) => {
            console.log("selected: ", name);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={{
            marginTop: 50,
            margin: "auto",
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            height: 60,
            width: "auto",
            paddingHorizontal: 30,
            borderRadius: 5,
          }}
        >
          <FontAwesome
            name="plus"
            size={24}
            color="white"
            style={{ marginRight: 15 }}
          />
          <Text style={{ color: "white", fontSize: 25, fontWeight: "bold" }}>
            Añadir gasto
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    margin: 10,
    height: 60,
    borderWidth: 1,
    padding: 10,
    fontSize: 25,
  },
});

export default AddPayment;
