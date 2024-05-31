import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CONFIG = {
  PEOPLE: {
    title: "Personas",
    background: "#f6ffed",
    dark: "#237804",
    soft: "#52c41a",
  },
  EXPENSES: {
    title: "Gastos grupales",
    background: "#fff2e8",
    dark: "#ad2102",
    soft: "#fa541c",
  },
};

interface TravelCardProps {
  type: "PEOPLE" | "EXPENSES";
  value: number;
}

export const TravelCard: React.FC<TravelCardProps> = ({ type, value }) => {
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
    <View
      style={{
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: CONFIG[type].soft,
        backgroundColor: CONFIG[type].background,
        display: "flex",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        marginLeft: type === "EXPENSES" ? 10 : 0,
        flex: type === "EXPENSES" ? 1 : undefined,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Helvetica Neue",
          color: CONFIG[type].soft,
        }}
      >
        {type === "PEOPLE" ? value : formatCurrency(value)}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          fontFamily: "Helvetica Neue",
          color: CONFIG[type].dark,
          marginBottom: 10,
        }}
      >
        {CONFIG[type].title}
      </Text>
      {type === "EXPENSES" ? (
        <FontAwesome5 name="piggy-bank" size={40} color={CONFIG[type].dark} />
      ) : (
        <FontAwesome6 name="people-group" size={40} color={CONFIG[type].dark} />
      )}
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
