import { Constants } from "../constants";

export const Categories = [
  {
    name: "Produto",
    id: "product",
    icon: Constants.CATALOG_PRODUCT_ICON,
  },
  {
    name: "Material",
    id: "material",
    icon: Constants.CATALOG_MATERIAL_ICON,
  },
  {
    name: "Serviço",
    id: "service",
    icon: Constants.CATALOG_SERVICE_ICON,
  },
];

export default (val: any) => {
  const result = Categories.find((e) => e.id === val);

  return (
    result ?? {
      id: "",
      name: "",
      icon: Constants.CATALOGS_ICON,
    }
  );
};
