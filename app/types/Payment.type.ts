interface CustomPaymentElement {
  name: string;
  expense: number;
}

export interface Payment {
  ID: string;
  creationDate: number;
  payer: string;
  value: number;
  description: string;
  isCustomPayment: boolean;
  customPayment: CustomPaymentElement[];
  isDeleted: boolean;
}
