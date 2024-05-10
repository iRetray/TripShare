import { Stack } from "expo-router/stack";
import "react-native-reanimated";

import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "TripShare",
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
