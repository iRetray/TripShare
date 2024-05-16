import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Option } from "./Picker";
import { Payment as PaymentInterface } from "../types";

interface PaymentProps {
  payment: PaymentInterface;
}

export const Payment: React.FC<PaymentProps> = ({ payment }) => {
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

  return (
    <View style={styles.container}>
      <View
        style={{
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
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
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
            {payment.customPayment.map((customPayment) => (
              <View
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
      </View>
    </View>
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
