interface CustomPaymentElement {
  name: string;
  expense: number;
}

export interface Payment {
  payer: string;
  value: number;
  description: string;
  isCustomPayment: boolean;
  customPayment: CustomPaymentElement[];
}
