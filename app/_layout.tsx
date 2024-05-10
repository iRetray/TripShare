import { Stack } from "expo-router/stack";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="details"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
