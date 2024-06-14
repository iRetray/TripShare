import { Payment } from "./Payment.type";

export interface TripObject {
  payments: Payment[];
  people: string[];
}
