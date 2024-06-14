import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Link } from "expo-router";

import * as Haptics from "expo-haptics";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Payment as PaymentComponent, TravelCard } from "./components";
import { useState, useEffect } from "react";
import { Payment, TripObject } from "./types";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [amountPersons, setAmountPersons] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  const [payments, setPayments] = useState<Payment[]>([]);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribeFirestore = onSnapshot(
      doc(db, "trips", "cartagena01"),
      (doc) => {
        if (doc.exists()) {
          const newData: any = doc.data();
          const currentData: TripObject = newData;
          setAmountPersons(currentData.people.length);
          setTotalExpenses(
            currentData.payments.reduce(
              (previous: any, current: any) => previous + current.value,
              0
            )
          );
          setPayments(currentData.payments);
        }
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribeFirestore();
    };
  }, []);

  return isLoading ? (
    <View style={{ margin: 30, display: "flex", alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        Cargando pagos...
      </Text>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      >
        {payments.length > 0 && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,

              elevation: 13,
              backgroundColor: "white",
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <MaterialIcons name="request-page" size={30} color="black" />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue",
                  marginLeft: 10,
                }}
              >
                Resumen de viaje
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TravelCard type="PEOPLE" value={amountPersons} />
              <TravelCard type="EXPENSES" value={totalExpenses} />
            </View>
            <Link href="DebtsToPay" asChild>
              <TouchableOpacity
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                }}
                style={{
                  marginTop: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.39,
                  shadowRadius: 8.3,
                  elevation: 13,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  backgroundColor: "#000000",
                  display: "flex",
                  flexDirection: "row",
                  height: 50,
                  width: "auto",
                  paddingHorizontal: 30,
                  borderRadius: 100,
                }}
              >
                <FontAwesome5
                  style={{ marginRight: 15 }}
                  name="calculator"
                  size={20}
                  color="white"
                />
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Resumen completo
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        {payments.map((payment: Payment, index: number) => (
          <View key={index}>
            <PaymentComponent payment={payment} />
            {index === payments.length - 1 && (
              <View style={{ height: 120 }}></View>
            )}
          </View>
        ))}
      </ScrollView>
      <Link href="AddPayment" asChild>
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,
            elevation: 13,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 30,
            right: 20,
            margin: "auto",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "row",
            height: 50,
            width: "auto",
            paddingHorizontal: 30,
            borderRadius: 100,
          }}
        >
          <FontAwesome
            name="plus"
            size={18}
            color="white"
            style={{ marginRight: 10, marginLeft: -10 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Nuevo pago
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Home;
