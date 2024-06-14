import { Stack } from "expo-router/stack";
import "react-native-reanimated";

import { View, Text } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SafeAreaView } from "react-native-safe-area-context";

import { RootSiblingParent as ToastNotificationsProvider } from "react-native-root-siblings";

import AppJSON from "../app.json";

import { useEffect, useState } from "react";

import NetInfo from "@react-native-community/netinfo";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TripProvider from "./context/TripContext";

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
                <SafeAreaView style={{ paddingBottom: -10 }}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 15,
                    }}
                  >
                    <FontAwesome6 name="truck-plane" size={35} color="black" />
                    <Text
                      style={{
                        marginLeft: 20,
                        fontSize: 35,
                        fontWeight: "bold",
                      }}
                    >
                      TripShare
                    </Text>
                  </View>
                  <View style={{ marginLeft: 15, marginTop: 10 }}>
                    <Text>
                      {isConnected === null ? (
                        <View
                          style={{
                            backgroundColor: "#faad14",
                            display: "flex",
                            flexDirection: "row",
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              marginRight: 5,
                            }}
                          >
                            <AntDesign
                              name="questioncircle"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Verificando conexión...
                          </Text>
                        </View>
                      ) : isConnected ? (
                        <View
                          style={{
                            backgroundColor: "#52c41a",
                            display: "flex",
                            flexDirection: "row",
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              marginRight: 5,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="lightning-bolt-circle"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Online
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "#f5222d",
                            display: "flex",
                            flexDirection: "row",
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              marginRight: 5,
                            }}
                          >
                            <Ionicons
                              name="cloud-offline"
                              size={15}
                              color="white"
                            />
                          </View>
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            Offline
                          </Text>
                        </View>
                      )}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
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
        </Stack>
      </ToastNotificationsProvider>
    </TripProvider>
  );
}
