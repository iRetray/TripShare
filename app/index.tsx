import { View, Text, Button } from "react-native";

import { useRouter, Link } from "expo-router";

const Home = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Home</Text>
      <Link href="details">Details</Link>
    </View>
  );
};

export default Home;
