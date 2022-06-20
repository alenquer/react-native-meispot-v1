import { useContext } from "react";
import { ManagerContext } from "../contexts/manager";

export default function useManager() {
  return useContext(ManagerContext);
}
