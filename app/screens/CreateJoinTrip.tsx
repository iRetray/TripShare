import React, { useContext, useState } from "react";
import { ScrollView, View, Text } from "react-native";

import * as Haptics from "expo-haptics";

import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Button, Input } from "../components";

import Toast from "react-native-root-toast";

import { TripContext } from "../context/TripContext";
import { TripContextType } from "../context/interfaces";

import { useFirebase } from "../hooks";

export const CreateJoinTrip = () => {
  const { updateTripCode } = useContext(TripContext) as TripContextType;

  const { getTripByName } = useFirebase();

  const [newTripName, setNewTripName] = useState<string>("");

  const handleChangeNewTrip = (newTrip: string): void => {
    const cleanInput = newTrip.replace(/[^\w\d]/g, "").toLowerCase();
    setNewTripName(cleanInput);
  };

  const joinToTrip = (): void => {
    if (newTripName === "") {
      Toast.show("Ingresa un código de viaje", {
        backgroundColor: "red",
        opacity: 1,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const startsWithNonNumber = /^[^\d]/;
    if (!startsWithNonNumber.test(newTripName)) {
      Toast.show("El código no puede empezar con un número", {
        backgroundColor: "red",
        opacity: 1,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const containsLetter = /[a-zA-Z]/;
    if (!containsLetter.test(newTripName)) {
      Toast.show("El código debe tener al menos una letra", {
        backgroundColor: "red",
        opacity: 1,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    getTripByName(newTripName).then((doc) => {
      if (doc.exists()) {
        updateTripCode(newTripName);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Toast.show("No existe ningún viaje con ese código", {
          backgroundColor: "red",
          opacity: 1,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    });
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ margin: 30, display: "flex", alignItems: "center" }}>
        <View
          style={{
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Entypo name="info-with-circle" size={24} color="black" />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              fontFamily: "Helvetica Neue",
              marginLeft: 10,
            }}
          >
            No hay ningun viaje en curso
          </Text>
        </View>
        <View
          style={{
            width: 300,
            marginTop: 50,
          }}
        >
          <Input
            value={newTripName}
            titleInput="Codigo de viaje"
            placeholder="cartagena01"
            onChangeText={handleChangeNewTrip}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <Button
            title="Crear"
            icon={<Entypo name="new-message" size={25} color="white" />}
            onPress={() => {}}
          />
          <Button
            title="Unirse"
            icon={<Ionicons name="enter-outline" size={25} color="white" />}
            onPress={() => {
              joinToTrip();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};
