import { Stack } from "expo-router/stack";
import "react-native-reanimated";

import { View, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
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
                Ultima actualización: 10:15 PM
              </Text>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 15,
                  fontWeight: "light",
                }}
              >
                v.1.15.2
              </Text>
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="AddPayment"
        options={{
          title: "Añadir gasto",
        }}
      />
    </Stack>
  );
}
