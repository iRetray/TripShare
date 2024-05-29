import { Payment } from "../types";

import AsyncStorage from "@react-native-async-storage/async-storage";

const myPeople = ["Felipe", "Julian", "Peña", "Yesid"];

const myDataBase: Payment[] = [
  /*  {
    payer: "Felipe",
    value: 25000,
    description: "arroz con huevo",
    isCustomPayment: true,
    customPayment: [
      {
        name: "Sebas",
        expense: 10000,
      },
      {
        name: "Julian",
        expense: 5000,
      },
    ],
  },
  {
    payer: "Julian",
    value: 50000,
    description: "Pescado de 100 barras",
    isCustomPayment: false,
    customPayment: [],
  },
  {
    payer: "Sebas",
    value: 25000,
    description: "Las drinks salvajes",
    isCustomPayment: true,
    customPayment: [
      {
        name: "Felipe",
        expense: 250000,
      },
      {
        name: "Julian",
        expense: 20500,
      },
    ],
  },
  {
    payer: "Sebas",
    value: 25000,
    description: "Las drinks salvajes",
    isCustomPayment: true,
    customPayment: [
      {
        name: "Felipe",
        expense: 250000,
      },
      {
        name: "Julian",
        expense: 20500,
      },
    ],
  },
  {
    payer: "Felipe",
    value: 50000,
    description: "Unas frias de 100 barras",
    isCustomPayment: false,
    customPayment: [],
  }, */
];

const APP_KEY = "TRIP_SHARE_DATABASE";

const StorageService = {
  save: (data: any) => {
    AsyncStorage.setItem(APP_KEY, JSON.stringify(data));
  },
  load: async () => {
    const jsonValue = await AsyncStorage.getItem(APP_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  },
};

const DatabaseService = {
  getPeople: (): Promise<string[]> =>
    new Promise((resolve) => {
      resolve(myPeople);
    }),

  getPayments: (): Promise<Payment[]> =>
    new Promise((resolve) => {
      StorageService.load().then((dataLoaded) => {
        resolve(dataLoaded);
      });
    }),

  savePayment: (newPayment: Payment): void => {
    myDataBase.push(newPayment);
    StorageService.save(myDataBase);
  },
};

export default DatabaseService;
