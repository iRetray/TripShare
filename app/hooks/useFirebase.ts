import { useContext, useEffect, useState } from "react";

import {
  DocumentData,
  DocumentSnapshot,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

import { TripContext } from "../context/TripContext";
import { TripContextType } from "../context/interfaces";
import { TripObject } from "../types";

interface FirebaseHookProps {
  onGetData: (newData: TripObject) => void;
}

type FirebaseHook = (props?: FirebaseHookProps) => {
  isLoading: boolean;
  getTripByName: (
    name: string
  ) => Promise<DocumentSnapshot<DocumentData, DocumentData>>;
};

export const useFirebase: FirebaseHook = (props) => {
  const db = getFirestore(app);
  const { hasTrip, tripCode } = useContext(TripContext) as TripContextType;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    if (hasTrip && tripCode !== "") {
      const unsubscribeFirestore = onSnapshot(
        doc(db, "trips", tripCode),
        (doc) => {
          if (doc.exists()) {
            const newData: any = doc.data();
            console.log("snapshot! ", JSON.stringify(newData));
            const currentData: TripObject = newData;
            props && props.onGetData && props.onGetData(currentData);
          }
          setIsLoading(false);
        }
      );

      return () => {
        unsubscribeFirestore();
      };
    } else {
      setIsLoading(false);
    }
  }, [hasTrip, tripCode]);

  const getTripByName = (name: string) => {
    const currentTripRef = doc(db, "trips", name);
    return getDoc(currentTripRef);
  };

  return {
    isLoading,
    getTripByName,
  };
};
