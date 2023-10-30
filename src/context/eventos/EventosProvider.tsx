import { ReactNode, useEffect, useMemo, useState } from "react";
import { eventosContext } from "./eventosContext";
import { Evento } from "@/types/evento";
import { getEventosUrl } from "@/utils/url";
import useApi from "@/hooks/useApi";

export const EventosProvider = ({ children }: { children: ReactNode }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const { loading, error, response, fetchData } = useApi<Evento[]>({
    url: getEventosUrl(),
    method: "GET",
  });

  useEffect(() => {
    if (response) {
      setEventos(response || []);
    }
  }, [response]);

  const contextValues = useMemo(
    () => ({
      loading,
      error,
      eventos,
      setEventos,
      fetchData,
    }),
    [eventos, setEventos, loading, error, fetchData]
  );

  return (
    <eventosContext.Provider value={contextValues}>
      {children}
    </eventosContext.Provider>
  );
};
