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
import { Payment as PaymentComponent } from "./components";
import { useState, useCallback } from "react";
import DatabaseService from "./services/DatabaseService";
import { Payment } from "./types";

import { useFocusEffect } from "expo-router";

const Home = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        DatabaseService.getPayments().then((newPayments) => {
          setPayments(newPayments);
          console.log("new payments amount: ", newPayments.length);
          setIsUpdating(false);
        });
      }, 200);

      return () => {
        setIsUpdating(true);
      };
    }, [])
  );

  return isUpdating ? (
    <View style={{ margin: 30, display: "flex", alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        Actualizando pagos
      </Text>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      >
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
