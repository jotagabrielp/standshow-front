import { getCepUrl } from "@/utils/url";
import useApi from "./useApi";

export function useCEP<T>() {
  const {
    error: errorCEP,
    loading: loadingCEP,
    fetchData,
    response: CEP,
  } = useApi<T>({
    method: "GET",
    autoRun: false,
  });

  const getCEP = (cep: string) => {
    fetchData({
      url: getCepUrl(cep),
    });
  };
  return {
    errorCEP,
    loadingCEP,
    getCEP,
    CEP,
  };
}
