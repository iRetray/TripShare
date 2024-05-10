import { View, Text, Button } from "react-native";

import { Link } from "expo-router";

const Home = () => {
  return (
    <View>
      <Link href="AddPayment" asChild>
        <Button title="Añadir un gasto del viaje" />
      </Link>
    </View>
  );
};

export default Home;
