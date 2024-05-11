import React, { useState } from "react";
import { Input, InputText } from "./InputText";

interface TextInputPropsMoney extends InputText {
  onChangeMoney: (amount: number) => void;
}

export const InputMoney: React.FC<TextInputPropsMoney> = ({
  onChangeMoney,
  ...props
}) => {
  const [value, setValue] = useState<string>("0");

  const formatCurrency = (amount: number): string => {
    if (amount === 0) {
      return "";
    }
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (text: string): void => {
    const cleanedValue = text.replace(/[^0-9]/g, "");
    const isEmptyValue = cleanedValue.length === 0;
    const newValue = isEmptyValue ? "0" : cleanedValue;
    setValue(newValue);
    onChangeMoney(parseInt(newValue));
  };

  return (
    <Input
      {...props}
      keyboardType="number-pad"
      value={formatCurrency(parseFloat(value))}
      onChangeText={handleInputChange}
    />
  );
};
