export const PayMethods = [
  {
    name: "Dinheiro",
    id: "money",
  },
  {
    name: "Pix",
    id: "pix",
  },
  {
    name: "Boleto",
    id: "billet",
  },
  {
    name: "Débito",
    id: "debit",
  },
  {
    name: "Crédito",
    id: "credit",
  },
  {
    name: "Transferência",
    id: "transfer",
  },
  {
    name: "Outros",
    id: "other",
  },
];

export default (val: any) => {
  const result = PayMethods.find((e) => e.id === val);

  return (
    result ?? {
      id: "",
      name: "",
    }
  );
};
