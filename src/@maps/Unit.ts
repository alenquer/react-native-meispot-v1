export const Units = [
  {
    name: "Unidade",
    id: "unit",
  },
  {
    name: "Hora",
    id: "hour",
  },
  {
    name: "Metro",
    id: "meter",
  },
  {
    name: "Kilograma",
    id: "kg",
  },
  {
    name: "Centímetro",
    id: "cm",
  },
  {
    name: "Milímetro",
    id: "mm",
  },
  {
    name: "Litro",
    id: "l",
  },
  {
    name: "Dia",
    id: "day",
  },
  {
    name: "Semana",
    id: "week",
  },
];

export default (val: any) => {
  const result = Units.find((e) => e.id === val);

  return (
    result ?? {
      id: "",
      name: "",
    }
  );
};
