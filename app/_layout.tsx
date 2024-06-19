import "react-native-reanimated";
import React, { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { Stack } from "expo-router/stack";

import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent as ToastNotificationsProvider } from "react-native-root-siblings";
import { TripProvider } from "./context/TripContext";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import AppJSON from "../app.json";

export default function Layout() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsConnected(state.isInternetReachable);
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  return (
    <TripProvider>
      <ToastNotificationsProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "TripShare",
              header: () => (
                <SafeAreaView style={styles.safeArea}>
                  <View style={styles.titleView}>
                    <FontAwesome6 name="truck-plane" size={35} color="black" />
                    <Text style={styles.title}>TripShare</Text>
                  </View>
                  <View style={styles.conectionView}>
                    <Text>
                      {isConnected === null ? (
                        <View style={styles.viewLoading}>
                          <View style={styles.icon}>
                            <AntDesign
                              name="questioncircle"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text style={styles.textStatus}>
                            Verificando conexión...
                          </Text>
                        </View>
                      ) : isConnected ? (
                        <View style={styles.viewConected}>
                          <View style={styles.icon}>
                            <MaterialCommunityIcons
                              name="lightning-bolt-circle"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text style={styles.textStatus}>Online</Text>
                        </View>
                      ) : (
                        <View style={styles.viewOffline}>
                          <View style={styles.icon}>
                            <Ionicons
                              name="cloud-offline"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text style={styles.textStatus}>Offline</Text>
                        </View>
                      )}
                    </Text>
                  </View>
                  <Text style={styles.textVersion}>
                    v{AppJSON.expo.version}
                  </Text>
                </SafeAreaView>
              ),
            }}
          />
          <Stack.Screen
            name="AddPayment"
            options={{
              presentation: "modal",
              title: "Añadir pago",
            }}
          />
          <Stack.Screen
            name="DebtsToPay"
            options={{
              presentation: "modal",
              title: "Resumen completo",
            }}
          />
          <Stack.Screen
            name="OptionsPayment"
            options={{
              presentation: "modal",
              title: "Modificar pago",
            }}
          />
        </Stack>
      </ToastNotificationsProvider>
    </TripProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { paddingBottom: -10 },
  titleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  title: {
    marginLeft: 20,
    fontSize: 35,
    fontWeight: "bold",
  },
  conectionView: { marginLeft: 15, marginTop: 10 },
  viewLoading: {
    backgroundColor: "#faad14",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  icon: { marginRight: 5 },
  textStatus: {
    color: "white",
    fontWeight: "bold",
  },
  viewConected: {
    backgroundColor: "#52c41a",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  viewOffline: {
    backgroundColor: "#f5222d",
    display: "flex",
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textVersion: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
});
