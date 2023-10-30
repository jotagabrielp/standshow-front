import { eventosContext } from "./eventosContext";
import { useContext } from "react";

export const useEventosContext = () => useContext(eventosContext);
