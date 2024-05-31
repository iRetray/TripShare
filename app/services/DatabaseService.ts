import { Payment } from "../types";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaidByPerson } from "../types/PaidByPerson.type";
import { Debt } from "../types/Debt.type";

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

const DATABASE_KEY = "TRIP_SHARE_DATABASE";
const VERSION_LOCAL_KEY = "TRIP_SHARE_VERSION";

const StorageService = {
  save: (key: string, data: any) => {
    AsyncStorage.setItem(key, JSON.stringify(data));
  },
  load: async (key: string) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : undefined;
  },
};

const DatabaseService = {
  getAppLocalVersion: (): Promise<string> =>
    new Promise((resolve) => {
      StorageService.load(VERSION_LOCAL_KEY).then((versionLoaded) => {
        resolve(versionLoaded ? versionLoaded : "");
      });
    }),

  saveAppLocalVersion: (version: string): void => {
    StorageService.save(VERSION_LOCAL_KEY, version);
  },

  deleteLocalDatabase: (): void => {
    myDataBase.length = 0;
    StorageService.save(DATABASE_KEY, []);
  },

  getPeople: (): Promise<string[]> =>
    new Promise((resolve) => {
      resolve(myPeople);
    }),

  getPayments: (): Promise<Payment[]> =>
    new Promise((resolve) => {
      StorageService.load(DATABASE_KEY).then((dataLoaded) => {
        resolve(dataLoaded ? dataLoaded : []);
      });
    }),

  savePayment: (newPayment: Payment): void => {
    myDataBase.push(newPayment);
    StorageService.save(DATABASE_KEY, myDataBase);
  },

  getTotalExpenses: (): Promise<number> =>
    new Promise((resolve) => {
      DatabaseService.getPayments().then((payments) => {
        resolve(
          payments.reduce((previous, current) => previous + current.value, 0)
        );
      });
    }),

  getPaidByPerson: (): Promise<PaidByPerson[]> =>
    new Promise((resolve) => {
      DatabaseService.getPayments().then((payments) => {
        resolve([
          ...myPeople.map((person) => ({
            name: person,
            value: payments
              .filter((payment) => payment.payer === person)
              .reduce((previous, current) => previous + current.value, 0),
          })),
        ]);
      });
    }),

  getDebts: (): Promise<Debt[]> =>
    new Promise((resolve) => {
      DatabaseService.getPayments().then((payments) => {
        resolve(calculateDebts(payments));
      });
    }),
};

function calculateDebts(database: any): any {
  try {
    console.log("calculando deudas: ", JSON.stringify(database));
    const balances = {};
    const debts = [];

    // Initialize balances
    database.forEach((payment) => {
      if (!balances[payment.payer]) {
        balances[payment.payer] = 0;
      }

      if (payment.isCustomPayment) {
        payment.customPayment.forEach((custom) => {
          if (!balances[custom.name]) {
            balances[custom.name] = 0;
          }
          balances[payment.payer] += custom.expense;
          balances[custom.name] -= custom.expense;

          debts.push({
            from: custom.name,
            to: payment.payer,
            amount: custom.expense,
          });
        });
      } else {
        // Add all involved people (including payer) to the people involved set
        const peopleInvolvedSet = new Set();
        peopleInvolvedSet.add(payment.payer);
        payment.customPayment.forEach((custom) =>
          peopleInvolvedSet.add(custom.name)
        );

        const peopleInvolved = Array.from(peopleInvolvedSet);
        const totalPeople = peopleInvolved.length;
        const splitAmount = payment.value / totalPeople;

        for (const person of peopleInvolved) {
          if (!balances[person]) {
            balances[person] = 0;
          }
          balances[person] -= splitAmount;
          if (person !== payment.payer) {
            debts.push({
              from: person,
              to: payment.payer,
              amount: splitAmount,
            });
          }
        }
        balances[payment.payer] += payment.value;
      }
    });

    console.log("balances: ", balances);
    console.log("debts: ", debts);

    // Simplify the debts
    const simplifiedDebts = {};

    debts.forEach((debt) => {
      if (!simplifiedDebts[debt.from]) {
        simplifiedDebts[debt.from] = {};
      }
      if (!simplifiedDebts[debt.from][debt.to]) {
        simplifiedDebts[debt.from][debt.to] = 0;
      }
      simplifiedDebts[debt.from][debt.to] += debt.amount;
    });

    // Combine debts to minimize transactions
    const transactions = [];
    const balanceArray = Object.entries(balances).map(([person, balance]) => ({
      person,
      balance,
    }));

    balanceArray.sort((a, b) => b.balance - a.balance);

    let i = 0;
    let j = balanceArray.length - 1;

    while (i < j) {
      const credit = balanceArray[i];
      const debit = balanceArray[j];

      const amount = Math.min(credit.balance, -debit.balance);
      if (amount > 0) {
        transactions.push({
          from: debit.person,
          to: credit.person,
          amount: amount,
        });
        credit.balance -= amount;
        debit.balance += amount;
      }

      if (credit.balance === 0) {
        i++;
      }
      if (debit.balance === 0) {
        j--;
      }
    }

    return transactions;
  } catch (error) {
    console.error("error al calcular:", error);
  }
}

export default DatabaseService;
