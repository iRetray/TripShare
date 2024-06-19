import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import { Option } from "./components";
import { calculateDebts } from "./services/DatabaseService";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";

import { PaidByPerson } from "./types/PaidByPerson.type";
import { Debt } from "./types/Debt.type";
import { TripObject } from "./types";

import { useFirebase } from "./hooks";

/* Format currency to helper file */
const DebtsToPay = () => {
  const [paidByPerson, setPaidByPerson] = useState<PaidByPerson[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  const handleGetData = (newData: TripObject) => {
    const newPaidByPerson = [
      ...newData.people.map((person) => ({
        name: person,
        value: newData.payments
          .filter((payment) => payment.payer === person)
          .reduce((previous, current) => previous + current.value, 0),
      })),
    ];
    setPaidByPerson(newPaidByPerson);
    setDebts(calculateDebts(newData.payments));
  };

  useFirebase({ onGetData: handleGetData });

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
      >
        <View style={styles.internalContainer}>
          <View style={styles.titleContainer}>
            <Ionicons name="person" size={30} color="black" />
            <Text style={styles.title}>Pagos por persona</Text>
          </View>
          <View style={styles.paidByPersonContainer}>
            {paidByPerson.map((paidPerson) => (
              <View key={paidPerson.name} style={styles.personContainer}>
                <View style={styles.optionContainer}>
                  <Option
                    useAlternativeIcon={false}
                    name={paidPerson.name}
                    isSelected={false}
                    onPress={() => {}}
                  />
                </View>
                <Text style={styles.value}>
                  {formatCurrency(paidPerson.value)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.titleDebtsContainer}>
            <FontAwesome6 name="wallet" size={30} color="black" />
            <Text style={styles.titleDebts}>Deudas</Text>
          </View>
          <View style={styles.debtsContainer}>
            {debts.map((oneDebt) => (
              <View key={oneDebt.from} style={styles.debtContainer}>
                <View style={styles.debtOption}>
                  <View style={styles.debtOptionInternal}>
                    <Option
                      useAlternativeIcon={false}
                      name={oneDebt.from}
                      isSelected={true}
                      onPress={() => {}}
                    />
                  </View>
                  <Feather
                    style={{ marginRight: 10 }}
                    name="arrow-right-circle"
                    size={24}
                    color="black"
                  />
                  <View style={styles.debtOptionInternal}>
                    <Option
                      useAlternativeIcon={false}
                      name={oneDebt.to}
                      isSelected={false}
                      onPress={() => {}}
                    />
                  </View>
                </View>
                <Text style={styles.mainText}>
                  {`debe `}
                  <Text style={{ color: "black" }}>
                    {formatCurrency(oneDebt.amount)}
                  </Text>
                  {` a`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollview: { paddingTop: 20 },
  internalContainer: { marginHorizontal: 20, marginTop: 30 },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Helvetica Neue",
    marginLeft: 10,
  },
  paidByPersonContainer: {
    backgroundColor: "#d9d9d9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    borderRadius: 5,
  },
  personContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  optionContainer: { marginRight: "auto", marginBottom: -10 },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Helvetica Neue",
    color: "#8c8c8c",
  },
  titleDebtsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 30,
  },
  titleDebts: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Helvetica Neue",
    marginLeft: 10,
  },
  debtsContainer: {
    backgroundColor: "#d9d9d9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    borderRadius: 5,
    marginBottom: 70,
  },
  debtContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 30,
  },
  debtOption: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  debtOptionInternal: { marginRight: "auto", marginBottom: -10 },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Helvetica Neue",
    color: "#8c8c8c",
  },
});

export default DebtsToPay;
