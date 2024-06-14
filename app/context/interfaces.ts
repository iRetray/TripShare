export type TripContextType = {
  hasTrip: boolean;
  tripCode: string;
  updateTripCode: (newTripCode: string) => void;
};
