import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { router, useNavigation } from "expo-router";

import { Payment as PaymentInterface } from "./types";
import { Button, ButtonConfirm, Payment } from "./components";

import * as Haptics from "expo-haptics";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext, useState } from "react";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { TripContext } from "./context/TripContext";
import { TripContextType } from "./context/interfaces";
import Toast from "react-native-root-toast";

import { RootSiblingParent as ToastNotificationsProvider } from "react-native-root-siblings";

const OptionsPayment = () => {
  const navigation: any = useNavigation();
  const payment: PaymentInterface = JSON.parse(
    navigation.getState().routes[0].params.payment
  );

  const { tripCode } = useContext(TripContext) as TripContextType;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const db = getFirestore(app);

  const handleDeletePayment = (): void => {
    setIsLoading(true);
    const currentTripRef = doc(db, "trips", tripCode);
    getDoc(currentTripRef).then((doc) => {
      if (doc.exists()) {
        updateDoc(currentTripRef, {
          payments: [
            ...doc
              .data()
              .payments.map((currentPayment: PaymentInterface) =>
                JSON.stringify(currentPayment) === JSON.stringify(payment)
                  ? { ...currentPayment, isDeleted: true }
                  : currentPayment
              ),
          ],
        })
          .then(() => {
            setIsLoading(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          })
          .catch((error) => {
            setIsLoading(false);
            Toast.show(`No se pudo eliminar el pago ${JSON.stringify(error)}`, {
              backgroundColor: "red",
              opacity: 1,
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          });
      }
    });
  };

  return (
    <ToastNotificationsProvider>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 20 }}
        >
          <View style={{ marginHorizontal: 20, marginTop: 30 }}>
            <Payment payment={payment} onLongPress={() => {}} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 20,
                marginTop: 20,
              }}
            >
              <Button
                title="Editar"
                icon={
                  <Entypo
                    name="new-message"
                    size={25}
                    style={{ marginRight: 15 }}
                    color="white"
                  />
                }
                onPress={() => {}}
              />
              <ButtonConfirm
                isLoading={isLoading}
                textLoading="...Cargando"
                text="Eliminar"
                textConfirm="¿Seguro?"
                icon={
                  <MaterialIcons
                    name="delete-forever"
                    size={24}
                    color="white"
                  />
                }
                onPressConfirmed={handleDeletePayment}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ToastNotificationsProvider>
  );
};

export default OptionsPayment;
