import { View, Text, Button } from "react-native";
import { useRouter, useNavigation, Link } from "expo-router";

const Details = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const isPresented = router.canGoBack();

  console.log("HISTORY: ", navigation.getState());

  return (
    <View>
      <Text>Details</Text>
      <Link href="../">Dismiss</Link>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Button
        title="Render page"
        onPress={() => {
          console.log("puede ir atras?", navigation.canGoBack());
          navigation.getParent()?.goBack();
        }}
      />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.getState()}
      />
    </View>
  );
};

export default Details;
