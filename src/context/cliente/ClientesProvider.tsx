import { ReactNode, useEffect, useMemo, useState } from "react";
import { clientesContext } from "./clientesContext";
import { getClienteUrl } from "@/utils/url";
import useApi from "@/hooks/useApi";
import { Cliente } from "@/types/cliente";

export const ClientesProvider = ({ children }: { children: ReactNode }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const { loading, error, response, fetchData } = useApi<Cliente[]>({
    url: getClienteUrl(),
    method: "GET",
  });

  useEffect(() => {
    if (response) {
      setClientes(response || []);
    }
  }, [response]);

  const contextValues = useMemo(
    () => ({
      loading,
      error,
      clientes,
      fetchData,
    }),
    [clientes, loading, error, fetchData]
  );

  return (
    <clientesContext.Provider value={contextValues}>
      {children}
    </clientesContext.Provider>
  );
};
