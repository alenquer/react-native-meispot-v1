export const CurrencyList = [
  {
    id: "BRL",
    name: "Brazilian Real (R$)",
  },
];

export default (val: any) => {
  const result = CurrencyList.find((e) => e.id === val);

  return (
    result ?? {
      id: "USD",
      name: "United States Dollar",
    }
  );
};
