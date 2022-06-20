import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

export default function useAuth() {
  return useContext(AuthContext);
}
