import { useContext } from "react";
import { LoadingContext } from "../contexts/loading";

export default function useAnimation() {
  return useContext(LoadingContext);
}
