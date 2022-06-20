export const Languages = [
  {
    id: "pt-br",
    name: "Português (BR)",
  },
];

export default (val: any) => {
  const result = Languages.find((e) => e.id === val);

  return (
    result ?? {
      id: "en",
      name: "English",
    }
  );
};
