import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_TRIP_CODE = "LOCAL_TRIP_CODE";

const StorageService = {
  save: async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  },
  load: async (key: string) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : undefined;
  },
  clearAll: async () => {
    await AsyncStorage.clear();
  },
};

const DatabaseService = {
  getLocalTripCode: (): Promise<string> =>
    new Promise(async (resolve) => {
      StorageService.load(LOCAL_TRIP_CODE).then((versionLoaded) => {
        resolve(versionLoaded ? versionLoaded : "");
      });
    }),

  saveLocalTripCode: async (tripCode: string): Promise<void> => {
    await StorageService.save(LOCAL_TRIP_CODE, tripCode);
  },

  calculateDebts: () => {},
};

export function calculateDebts(database: any): any {
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
