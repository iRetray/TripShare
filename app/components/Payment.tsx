import React, { Fragment } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Option } from "./Picker";
import { Payment as PaymentInterface } from "../types";

import * as Haptics from "expo-haptics";

import Entypo from "@expo/vector-icons/Entypo";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PaymentProps {
  payment: PaymentInterface;
  onLongPress: (payment: PaymentInterface) => void;
}

export const Payment: React.FC<PaymentProps> = ({ payment, onLongPress }) => {
  const handleSelect = () => {};

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

  const handleLongPress = (): void => {
    if (!payment.isDeleted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onLongPress(payment);
    }
  };

  return (
    <Pressable onLongPress={handleLongPress} style={styles.container}>
      <Fragment>
        <View
          style={{
            opacity: payment.isDeleted ? 0.25 : 1,
            backgroundColor: "black",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            display: "flex",
            flexDirection: "row",
            marginRight: "auto",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "Helvetica Neue",
              color: "#bfbfbf",
            }}
          >
            {payment.isCustomPayment ? "Pago " : "Pago en "}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              fontFamily: "Helvetica Neue",
              color: "white",
            }}
          >
            {payment.isCustomPayment ? "personalizado" : "partes iguales"}
          </Text>
        </View>
        <View
          style={{
            opacity: payment.isDeleted ? 0.25 : 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,

            elevation: 13,
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            borderTopLeftRadius: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {format(
              new Date(payment.creationDate),
              "EEEE dd 'de' MMMM 'a las' h:mm aaa",
              { locale: es }
            )}
          </Text>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue",
                }}
              >
                {formatCurrency(payment.value)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue",
                  color: "#8c8c8c",
                }}
              >
                {payment.description}
              </Text>
            </View>
            <View style={{ marginLeft: "auto", marginBottom: -10 }}>
              <Option
                useAlternativeIcon={false}
                name={payment.payer}
                isSelected={false}
                onPress={handleSelect}
              />
            </View>
          </View>
          {payment.isCustomPayment && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#d9d9d9",
                paddingHorizontal: 20,
                paddingVertical: 10,
                paddingBottom: 20,
                borderRadius: 5,
              }}
            >
              {payment.customPayment.map((customPayment, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View style={{ marginRight: "auto", marginBottom: -10 }}>
                    <Option
                      useAlternativeIcon={false}
                      name={customPayment.name}
                      isSelected={false}
                      onPress={handleSelect}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      fontFamily: "Helvetica Neue",
                      color: "#8c8c8c",
                    }}
                  >
                    {formatCurrency(customPayment.expense)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {payment.isDeleted && (
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: "#f5222d",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: "auto",
              }}
            >
              <Entypo name="info-with-circle" size={18} color="white" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue",
                  marginLeft: 10,
                  color: "white",
                }}
              >
                Este pago fue eliminado
              </Text>
            </View>
          )}
        </View>
      </Fragment>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
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
