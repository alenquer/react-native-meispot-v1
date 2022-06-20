import { Colors } from "../constants/colors";

export const StatusList = [
  {
    id: "done",
    name: "Concluído",
    color: Colors.green,
    payments: "Vendas concluídas",
  },
  {
    id: "pending",
    name: "Pendente",
    color: "orange",
    payments: "Vendas pendentes",
  },
  {
    id: "canceled",
    name: "Cancelado",
    color: Colors.red,
    payments: "Vendas canceladas",
  },
];

export default (val: any) => {
  const result = StatusList.find((e) => e.id === val);

  return (
    result ?? {
      id: "",
      name: "N/A",
      color: Colors.green,
      payments: "Todas as vendas",
    }
  );
};
