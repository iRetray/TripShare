import DatabaseService from "../services/DatabaseService";
import { TripContextType } from "./interfaces";
import React, { createContext, useEffect, useState } from "react";

export const TripContext = createContext<TripContextType | null>(null);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasTrip, setHasTrip] = useState<boolean>(false);
  const [tripCode, setTripCode] = useState<string>("");

  useEffect(() => {
    DatabaseService.getLocalTripCode().then((code) => {
      if (code !== "") {
        setHasTrip(true);
        setTripCode(code);
      }
    });
  }, []);

  const updateTripCode = (newTripCode: string): void => {
    setTripCode(newTripCode);
    setHasTrip(true);
    DatabaseService.saveLocalTripCode(newTripCode);
  };

  const dropTrip = (): void => {
    setTripCode("");
    setHasTrip(false);
    DatabaseService.saveLocalTripCode("");
  };

  return (
    <TripContext.Provider
      value={{ hasTrip, tripCode, updateTripCode, dropTrip }}
    >
      {children}
    </TripContext.Provider>
  );
};
