import { Usuario } from "@/types/usuario";
import { createContext } from "react";

interface IusuarioContext {
  usuarios: Usuario[] | undefined;
  usuarioAtual: Usuario | undefined;
  loading: boolean | undefined;
  error: Error | undefined;
  fetchData: () => void;
}

export const usuariosContext = createContext<IusuarioContext>(
  {} as IusuarioContext
);
