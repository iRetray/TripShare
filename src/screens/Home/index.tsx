import { Button, Text, View } from "react-native";

export const Home = ({ navigation }: any) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("AddPayment")}
      />
    </View>
  );
};
