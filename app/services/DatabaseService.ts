import { Payment } from "../types";

const myDataBase: Payment[] = [
  {
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
  },
];

const DatabaseService = {
  getPayments: (): Promise<Payment[]> =>
    new Promise((resolve) => {
      resolve(myDataBase);
    }),
};

export default DatabaseService;
