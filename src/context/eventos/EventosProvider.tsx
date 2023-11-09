import { ReactNode, useEffect, useMemo, useState } from "react";
import { eventosContext } from "./eventosContext";
import { Evento } from "@/types/evento";
import { getEventosUrl } from "@/utils/url";
import useApi from "@/hooks/useApi";
import useImageApi from "@/hooks/useImageApi";

export const EventosProvider = ({ children }: { children: ReactNode }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const { loading, error, response, fetchData } = useApi<Evento[]>({
    url: getEventosUrl(),
    method: "GET",
  });

  const {
    response: responseImagens,
    loading: loadingImages,
    fetchData: fetchImagens,
  } = useImageApi();

  useEffect(() => {
    if (
      response &&
      !loadingImages &&
      (responseImagens.length === 0 || eventos.length !== response.length)
    ) {
      response.forEach((evento) => {
        fetchImagens({
          id: evento.uuid,
        });
      });
      setEventos(response);
    }
  }, [response, fetchImagens, responseImagens, loadingImages, eventos]);

  useEffect(() => {
    if (responseImagens) {
      setEventos((prevState) =>
        prevState.map((evento) => {
          const imagem = responseImagens.find((img) => img.id === evento.uuid);
          return {
            ...evento,
            imagem: imagem?.image,
          };
        })
      );
    }
  }, [responseImagens]);

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
