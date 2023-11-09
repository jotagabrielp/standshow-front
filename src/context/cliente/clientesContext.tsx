import { Cliente } from "@/types/cliente";
import { createContext } from "react";

interface IClientesContext {
  clientes: Cliente[];
  loading: boolean | undefined;
  error: Error | undefined;
  fetchData: () => void;
}

export const clientesContext = createContext<IClientesContext>(
  {} as IClientesContext
);
