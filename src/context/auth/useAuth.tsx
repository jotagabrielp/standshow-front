import { authContext } from "@/context/auth/authContext";
import { useContext } from "react";

export const useAuth = () => useContext(authContext);
