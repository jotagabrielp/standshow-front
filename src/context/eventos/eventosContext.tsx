import { Evento } from "@/types/evento";
import { createContext } from "react";

interface IeventosContext {
  eventos: Evento[];
  setEventos: React.Dispatch<React.SetStateAction<Evento[]>>;
  loading: boolean | undefined;
  error: Error | undefined;
  fetchData: () => void;
}

export const eventosContext = createContext<IeventosContext>(
  {} as IeventosContext
);
