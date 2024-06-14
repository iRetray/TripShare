import DatabaseService from "../services/DatabaseService";
import { TripContextType } from "./interfaces";
import React, { createContext, useEffect, useState } from "react";

export const TripContext = createContext<TripContextType | null>(null);

const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasTrip, setHasTrip] = useState<boolean>(false);
  const [tripCode, setTripCode] = useState<string>("");

  useEffect(() => {
    DatabaseService.getLocalTripCode().then((code) => {
      console.log("get from storage: ", code);
      if (code !== "") {
        setHasTrip(true);
        setTripCode(code);
      }
    });
  }, []);

  const updateTripCode = (newTripCode: string): void => {
    setHasTrip(true);
    setTripCode(newTripCode);
    DatabaseService.saveLocalTripCode(newTripCode);
  };

  return (
    <TripContext.Provider value={{ hasTrip, tripCode, updateTripCode }}>
      {children}
    </TripContext.Provider>
  );
};

export default TripProvider;
