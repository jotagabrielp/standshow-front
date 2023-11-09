import { ReactNode, useEffect, useMemo, useState } from "react";
import { usuariosContext } from "./usuariosContext";
import { getUsuariosUrl } from "@/utils/url";
import useApi from "@/hooks/useApi";
import { Usuario } from "@/types/usuario";
import { useAuth } from "../auth/useAuth";

export const UsuariosProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { user } = useAuth() || {};
  const { loading, error, response, fetchData } = useApi<Usuario[]>({
    url: getUsuariosUrl(),
    method: "GET",
  });

  useEffect(() => {
    if (response) {
      setUsuarios(response || []);
    }
  }, [response]);

  const contextValues = useMemo(
    () => ({
      loading,
      error,
      usuarios,
      usuarioAtual: usuarios.find((u) => u.email === user?.sub),
      fetchData,
    }),
    [usuarios, loading, error, fetchData, user]
  );

  return (
    <usuariosContext.Provider value={contextValues}>
      {children}
    </usuariosContext.Provider>
  );
};
