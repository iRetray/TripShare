import { View, Text, ScrollView } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Option } from "./components";
import { useEffect, useState } from "react";
import DatabaseService from "./services/DatabaseService";
import { PaidByPerson } from "./types/PaidByPerson.type";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Debt } from "./types/Debt.type";

import Feather from "@expo/vector-icons/Feather";

const DebtsToPay = () => {
  const [paidByPerson, setPaidByPerson] = useState<PaidByPerson[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    getPaids();
    getDebts();
  }, []);

  const getPaids = (): void => {
    DatabaseService.getPaidByPerson().then((newPaidsByPerson) => {
      setPaidByPerson(newPaidsByPerson);
    });
  };

  const getDebts = (): void => {
    DatabaseService.getDebts().then((newDebts) => {
      setDebts(newDebts);
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      >
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Ionicons name="person" size={30} color="black" />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                fontFamily: "Helvetica Neue",
                marginLeft: 10,
              }}
            >
              Pagos por persona
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#d9d9d9",
              paddingHorizontal: 20,
              paddingVertical: 10,
              paddingBottom: 20,
              borderRadius: 5,
            }}
          >
            {paidByPerson.map((paidPerson, index) => (
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
                    name={paidPerson.name}
                    isSelected={false}
                    onPress={() => {}}
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
                  {formatCurrency(paidPerson.value)}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
              marginTop: 30,
            }}
          >
            <FontAwesome6 name="wallet" size={30} color="black" />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                fontFamily: "Helvetica Neue",
                marginLeft: 10,
              }}
            >
              Deudas
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#d9d9d9",
              paddingHorizontal: 20,
              paddingVertical: 10,
              paddingBottom: 20,
              borderRadius: 5,
              marginBottom: 70,
            }}
          >
            {debts.map((oneDebt, index) => (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 30,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ marginRight: "auto", marginBottom: -10 }}>
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
                  <View style={{ marginRight: "auto", marginBottom: -10 }}>
                    <Option
                      useAlternativeIcon={false}
                      name={oneDebt.to}
                      isSelected={false}
                      onPress={() => {}}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue",
                    color: "#8c8c8c",
                  }}
                >
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

export default DebtsToPay;
