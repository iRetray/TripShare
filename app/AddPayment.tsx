import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { Input, InputMoney, Picker } from "./components";
import { useState } from "react";

import { Text } from "react-native";

import * as Haptics from "expo-haptics";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const AddPayment = () => {
  const [form, setForm] = useState({
    payer: "",
    value: 0,
    description: "",
    paymentType: "",
    customPayment: [
      {
        name: "pepito",
        expense: 10000,
      },
    ],
  });

  const handleSelectOptionPayer = (newPayer: string): void => {
    setForm({ ...form, payer: newPayer });
  };

  const handleChangeMoney = (amount: number): void => {
    setForm({ ...form, value: amount });
  };

  const handleChangeDescription = (newDescription: string): void => {
    setForm({ ...form, description: newDescription });
  };

  const handleOptionSelected = (option: string) => {
    setForm({ ...form, paymentType: option });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Picker
          title="¿Quién pagó la cuenta?"
          options={["Juliana <3", "Julian", "Pepito", "Otro pepito"]}
          onOptionSelected={handleSelectOptionPayer}
        />
        <InputMoney
          titleInput="Valor del pago"
          placeholder="$ 25.000"
          onChangeMoney={handleChangeMoney}
        />
        <Input
          titleInput="Descripción"
          placeholder="Salchipapa con butiffarra"
          onChangeText={handleChangeDescription}
        />
        <Picker
          useAlternativeIcon
          title="Forma de repartir la cuenta"
          options={["Partes iguales", "Personalizado"]}
          onOptionSelected={handleOptionSelected}
        />
        {form.paymentType === "Personalizado" && (
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 20,
              backgroundColor: "#d9d9d9",
              padding: 20,
              paddingBottom: 30,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginRight: 10,
              }}
            >
              <FontAwesome5 name="info-circle" size={24} color="#8c8c8c" />
              <Text
                style={{ fontStyle: "italic", fontSize: 15, color: "#8c8c8c" }}
              >
                Ingresa el valor que le corresponde a cada persona
              </Text>
            </View>
            <PersonExpense
              name="Felipe"
              handleChangeExpense={handleChangeMoney}
            />
            <PersonExpense
              name="Felipe"
              handleChangeExpense={handleChangeMoney}
            />
            <PersonExpense
              name="Felipe"
              handleChangeExpense={handleChangeMoney}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={{
            marginTop: 50,
            marginBottom: 40,
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
            Añadir pago
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

interface PersonExpenseProps {
  name: string;
  handleChangeExpense: (expense: number) => void;
}

const PersonExpense: React.FC<PersonExpenseProps> = ({
  name,
  handleChangeExpense,
}) => (
  <View style={{ marginHorizontal: -20, marginTop: -10 }}>
    <InputMoney
      titleInput={name}
      placeholder="$ 5.000"
      onChangeMoney={handleChangeExpense}
    />
  </View>
);

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
