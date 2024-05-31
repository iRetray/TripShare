import { Stack } from "expo-router/stack";
import "react-native-reanimated";

import { View, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SafeAreaView } from "react-native-safe-area-context";

import { RootSiblingParent as ToastNotificationsProvider } from "react-native-root-siblings";

import AppJSON from "../app.json";

export default function Layout() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;

  return (
    <ToastNotificationsProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "TripShare",
            header: () => (
              <SafeAreaView style={{ paddingBottom: -10 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                >
                  <FontAwesome6 name="truck-plane" size={35} color="black" />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 35,
                      fontWeight: "bold",
                    }}
                  >
                    TripShare
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    marginLeft: 20,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Ultima actualización: {formattedTime}
                </Text>
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 15,
                    fontWeight: "light",
                  }}
                >
                  {AppJSON.expo.version}
                </Text>
              </SafeAreaView>
            ),
          }}
        />
        <Stack.Screen
          name="AddPayment"
          options={{
            presentation: "modal",
            title: "Añadir pago",
          }}
        />
        <Stack.Screen
          name="DebtsToPay"
          options={{
            presentation: "modal",
            title: "Resumen completo",
          }}
        />
      </Stack>
    </ToastNotificationsProvider>
  );
}
