import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";

import { Button, Input, InputMoney, Picker } from "./components";

import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";

import { Payment, TripObject } from "./types";

import { RootSiblingParent as ToastNotificationsProvider } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useFirebase } from "./hooks";

enum PaymentWay {
  equal = "Partes iguales",
  custom = "Personalizado",
}

const AddPayment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [people, setPeople] = useState<string[]>([]);
  const [form, setForm] = useState<Payment>({
    payer: "",
    value: 0,
    description: "",
    // @ts-ignore
    isCustomPayment: undefined,
    customPayment: [],
  });

  const handleGetData = (newData: TripObject) => {
    setPeople(newData.people);
    setForm({
      ...form,
      customPayment: [
        ...newData.people.map((personName) => ({
          name: personName,
          expense: 0,
        })),
      ],
    });
  };

  const { getCurrentTrip, updateCurrentTrip } = useFirebase({
    onGetData: handleGetData,
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
    setForm({ ...form, isCustomPayment: option === PaymentWay.custom });
  };

  const handleChangePersonExpense = (
    personName: string,
    amount: number
  ): void => {
    setForm({
      ...form,
      customPayment: form.customPayment.map((elementPayment) =>
        elementPayment.name === personName
          ? { name: personName, expense: amount }
          : elementPayment
      ),
    });
  };

  const formatCurrency = (amount: number): string => {
    if (amount === 0) {
      return "";
    }
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const onPressSave = (): void => {
    const customPaymentSum = form.customPayment.reduce(
      (previous, current) => previous + current.expense,
      0
    );
    const isCustomPaymentValid = form.isCustomPayment
      ? customPaymentSum === form.value
      : true;
    if (isCustomPaymentValid) {
      const isFormValid =
        form.payer !== "" &&
        form.value !== 0 &&
        form.description !== "" &&
        typeof form.isCustomPayment === "boolean";
      if (isFormValid) {
        savePaymentInFirebase(form);
      } else {
        Toast.show("¡Completa los datos para guardar!", {
          backgroundColor: "red",
          opacity: 1,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } else {
      const isLessMoney = customPaymentSum < form.value;
      const diference = Math.abs(form.value - customPaymentSum);
      Toast.show(
        `Las cuentas estan mal, ${
          isLessMoney ? "faltan" : "sobran"
        } ${formatCurrency(diference)}`,
        {
          backgroundColor: "red",
          opacity: 1,
        }
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const savePaymentInFirebase = (payment: Payment): void => {
    setIsLoading(true);
    getCurrentTrip().then((doc) => {
      if (doc.exists()) {
        const paymentWithID = {
          ...payment,
          ID: Crypto.randomUUID(),
          creationDate: Date.now(),
        };
        updateCurrentTrip({
          payments: [...doc.data().payments, paymentWithID],
        })
          .then(() => {
            setIsLoading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          })
          .catch((error) => {
            setIsLoading(false);
            Toast.show(
              `No se pudo añadir el nuevo pago ${JSON.stringify(error)}`,
              {
                backgroundColor: "red",
                opacity: 1,
              }
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          });
      }
    });
  };

  return (
    <ToastNotificationsProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Picker
            title="¿Quién pagó la cuenta?"
            options={people}
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
            options={[PaymentWay.equal, PaymentWay.custom]}
            onOptionSelected={handleOptionSelected}
          />
          {form.isCustomPayment && (
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
                  style={{
                    fontStyle: "italic",
                    fontSize: 15,
                    color: "#8c8c8c",
                  }}
                >
                  Ingresa el valor que le corresponde a cada persona
                </Text>
              </View>
              {people.map((person) => (
                <PersonExpense
                  key={person}
                  name={person}
                  handleChangeExpense={(expense) => {
                    handleChangePersonExpense(person, expense);
                  }}
                />
              ))}
            </View>
          )}
          <View style={{ marginTop: 20 }}>
            <Button
              isLoading={isLoading}
              loadingText="Guardando..."
              title="Añadir pago"
              disabled={isLoading}
              icon={<FontAwesome name="plus" size={24} color="white" />}
              onPress={onPressSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ToastNotificationsProvider>
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
