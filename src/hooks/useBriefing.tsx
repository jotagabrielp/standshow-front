import { getTipoItemUrl } from "@/utils/url";
import useApi from "./useApi";
import { useMemo } from "react";

interface TipoItem {
  uuid: string;
  descricao: string;
  tipoBase: string;
}

export const useBriefing = () => {
  const {
    response: responsePiso,
    loading: loadingPiso,
    error: errorPiso,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("PISO"),
    method: "GET",
  });
  const {
    response: responseAmbiente,
    loading: loadingAmbiente,
    error: errorAmbiente,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("AMBIENTE"),
    method: "GET",
  });
  const {
    response: responseParede,
    loading: loadingParede,
    error: errorParede,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("PAREDE"),
    method: "GET",
  });

  const {
    response: responseDimensao,
    loading: loadingDimensao,
    error: errorDimensao,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("DIMENSAO"),
    method: "GET",
  });
  const {
    response: responseItens,
    loading: loadingItens,
    error: errorItens,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("ITEM_EXPOSICAO"),
    method: "GET",
  });

  const {
    response: responseForma,
    loading: loadingForma,
    error: errorForma,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("FORMA_CONSTRUTIVA"),
    method: "GET",
  });

  const values = useMemo(() => {
    return {
      piso: responsePiso,
      ambiente: responseAmbiente,
      parede: responseParede,
      dimensao: responseDimensao,
      itens: responseItens,
      forma: responseForma,
      loading:
        loadingPiso ||
        loadingAmbiente ||
        loadingParede ||
        loadingDimensao ||
        loadingItens ||
        loadingForma,
      error: [
        errorPiso,
        errorAmbiente,
        errorParede,
        errorDimensao,
        errorItens,
        errorForma,
      ],
    };
  }, [
    responsePiso,
    responseAmbiente,
    responseParede,
    responseDimensao,
    responseItens,
    responseForma,
    loadingPiso,
    loadingAmbiente,
    loadingParede,
    loadingDimensao,
    loadingItens,
    loadingForma,
    errorPiso,
    errorAmbiente,
    errorParede,
    errorDimensao,
    errorItens,
    errorForma,
  ]);
  return values;
};
