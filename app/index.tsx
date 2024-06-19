import React, { useState, useContext } from "react";
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
import * as Clipboard from "expo-clipboard";

import {
  Button,
  ButtonConfirm,
  Payment as PaymentComponent,
  TravelCard,
} from "./components";

import { Payment, TripObject } from "./types";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

import { TripContext } from "./context/TripContext";
import { TripContextType } from "./context/interfaces";

import { useFirebase } from "./hooks";
import { CreateJoinTrip } from "./screens";

const Home = () => {
  const { hasTrip, tripCode, dropTrip } = useContext(
    TripContext
  ) as TripContextType;

  /* crear card con shadow */
  /* crear micro componente boton azul  */

  const [amountPersons, setAmountPersons] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleGetDataFirebase = (newData: TripObject): void => {
    setAmountPersons(newData.people.length);
    setTotalExpenses(
      newData.payments.reduce(
        (previous: any, current: any) => previous + current.value,
        0
      )
    );
    setPayments(newData.payments);
  };

  const { isLoading } = useFirebase({ onGetData: handleGetDataFirebase });

  const openModalDeletePayment = (payment: Payment): void => {
    router.setParams({ payment: JSON.stringify(payment) });
    router.navigate("OptionsPayment");
  };

  return !hasTrip ? (
    <CreateJoinTrip />
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
              marginBottom: 15,
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
            icon={<FontAwesome5 name="heart-broken" size={18} color="white" />}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 20,
              }}
            >
              <TravelCard type="PEOPLE" value={amountPersons} />
              <TravelCard type="EXPENSES" value={totalExpenses} />
            </View>
            <Link href="DebtsToPay" asChild>
              <Button
                title="Resumen completo"
                icon={
                  <FontAwesome5
                    style={{ marginRight: 15 }}
                    name="calculator"
                    size={20}
                    color="white"
                  />
                }
                onPress={() => {}}
              />
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
        <Button
          title="Nuevo pago"
          icon={
            <FontAwesome
              name="plus"
              size={18}
              color="white"
              style={{ marginRight: 10, marginLeft: -10 }}
            />
          }
          onPress={() => {}}
          pressableAditionalStyles={{
            position: "absolute",
            bottom: 30,
            right: 20,
          }}
        />
      </Link>
    </View>
  );
};

export default Home;
