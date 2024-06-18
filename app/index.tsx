import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
} from "react-native";

import { Link } from "expo-router";
import { router } from "expo-router";

import * as Haptics from "expo-haptics";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ButtonConfirm,
  Input,
  Payment as PaymentComponent,
  TravelCard,
} from "./components";
import { useState, useEffect, useContext, Fragment } from "react";
import { Payment, TripObject } from "./types";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";

import { TripContext } from "./context/TripContext";
import { TripContextType } from "./context/interfaces";

import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import * as Clipboard from "expo-clipboard";

import { Payment as PaymentInterface } from "./types";

const Home = () => {
  const { hasTrip, tripCode, updateTripCode, dropTrip } = useContext(
    TripContext
  ) as TripContextType;

  const [newTripName, setNewTripName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [amountPersons, setAmountPersons] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);

  const db = getFirestore(app);

  useEffect(() => {
    if (hasTrip && tripCode !== "") {
      const unsubscribeFirestore = onSnapshot(
        doc(db, "trips", tripCode),
        (doc) => {
          if (doc.exists()) {
            const newData: any = doc.data();
            console.log("snapshot! ", JSON.stringify(newData));
            const currentData: TripObject = newData;
            setAmountPersons(currentData.people.length);
            setTotalExpenses(
              currentData.payments.reduce(
                (previous: any, current: any) => previous + current.value,
                0
              )
            );
            setPayments(currentData.payments);
          }
          setIsLoading(false);
        }
      );

      return () => {
        unsubscribeFirestore();
      };
    }
  }, [hasTrip, tripCode]);

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
    const currentTripRef = doc(db, "trips", newTripName);
    getDoc(currentTripRef).then((doc) => {
      if (doc.exists()) {
        updateTripCode(newTripName);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Toast.show("No existe ningún viaje con ese código", {
          backgroundColor: "red",
          opacity: 1,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    });
  };

  const openModalDeletePayment = (payment: PaymentInterface): void => {
    router.setParams({ payment: JSON.stringify(payment) });
    router.navigate("OptionsPayment");
  };

  return !hasTrip ? (
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
          <TouchableOpacity
            onPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }}
            style={{
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 13,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              backgroundColor: "#000000",
              display: "flex",
              flexDirection: "row",
              height: 50,
              width: "auto",
              paddingHorizontal: 30,
              borderRadius: 100,
            }}
          >
            <Entypo
              name="new-message"
              size={25}
              style={{ marginRight: 15 }}
              color="white"
            />
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Crear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              joinToTrip();
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }}
            style={{
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,
              elevation: 13,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              backgroundColor: "#000000",
              display: "flex",
              flexDirection: "row",
              height: 50,
              width: "auto",
              paddingHorizontal: 30,
              borderRadius: 100,
            }}
          >
            <Ionicons
              style={{ marginRight: 15 }}
              name="enter-outline"
              size={25}
              color="white"
            />
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Unirse
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  ) : isLoading ? (
    <View style={{ margin: 30, display: "flex", alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        Cargando pagos...
      </Text>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      >
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,

            elevation: 13,
            backgroundColor: "white",
            borderRadius: 10,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="airplane-ticket" size={30} color="black" />
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue",
                    marginLeft: 10,
                  }}
                >
                  Código
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Helvetica Neue",
                  marginLeft: 40,
                }}
              >
                {tripCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Share.share({
                  message: tripCode,
                });
              }}
              style={{ marginLeft: "auto" }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Entypo name="share" size={30} color="#1677ff" />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue",
                    color: "#1677ff",
                    marginTop: 5,
                  }}
                >
                  Compartir
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setStringAsync(tripCode);
              }}
              style={{ marginLeft: 15 }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="content-copy" size={30} color="#1677ff" />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    fontFamily: "Helvetica Neue",
                    color: "#1677ff",
                    marginTop: 5,
                  }}
                >
                  Copiar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <ButtonConfirm
            text="Abandonar viaje"
            textConfirm="¿Seguro?"
            icon={
              <FontAwesome5
                name="heart-broken"
                size={18}
                color="white"
                style={{ marginRight: 10, marginLeft: -10 }}
              />
            }
            onPressConfirmed={() => {
              dropTrip();
            }}
          />
        </View>
        {payments.length > 0 && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.39,
              shadowRadius: 8.3,

              elevation: 13,
              backgroundColor: "white",
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <MaterialIcons name="request-page" size={30} color="black" />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  fontFamily: "Helvetica Neue",
                  marginLeft: 10,
                }}
              >
                Resumen de viaje
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <TravelCard type="PEOPLE" value={amountPersons} />
              <TravelCard type="EXPENSES" value={totalExpenses} />
            </View>
            <Link href="DebtsToPay" asChild>
              <TouchableOpacity
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                }}
                style={{
                  marginTop: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.39,
                  shadowRadius: 8.3,
                  elevation: 13,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  backgroundColor: "#000000",
                  display: "flex",
                  flexDirection: "row",
                  height: 50,
                  width: "auto",
                  paddingHorizontal: 30,
                  borderRadius: 100,
                }}
              >
                <FontAwesome5
                  style={{ marginRight: 15 }}
                  name="calculator"
                  size={20}
                  color="white"
                />
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Resumen completo
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        {payments.length > 0 && (
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Entypo name="info-with-circle" size={24} color="#8c8c8c" />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                fontFamily: "Helvetica Neue",
                marginLeft: 10,
                color: "#8c8c8c",
              }}
            >
              Manten presionado para editar o eliminar un pago
            </Text>
          </View>
        )}
        {payments.map((payment: Payment, index: number) => (
          <View key={index}>
            <PaymentComponent
              payment={payment}
              onLongPress={openModalDeletePayment}
            />
            {index === payments.length - 1 && (
              <View style={{ height: 120 }}></View>
            )}
          </View>
        ))}
      </ScrollView>
      <Link href="AddPayment" asChild>
        <TouchableOpacity
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.39,
            shadowRadius: 8.3,
            elevation: 13,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 30,
            right: 20,
            margin: "auto",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "row",
            height: 50,
            width: "auto",
            paddingHorizontal: 30,
            borderRadius: 100,
          }}
        >
          <FontAwesome
            name="plus"
            size={18}
            color="white"
            style={{ marginRight: 10, marginLeft: -10 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Nuevo pago
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Home;
