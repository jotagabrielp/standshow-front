import Mock from "@/mock/Mock";
import api from "@/service/api";
import { getImagemUrl } from "@/utils/url";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useState } from "react";

function useImageApi() {
  const [response, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<Error>();

  if (import.meta.env.VITE_USE_MOCK === "1") {
    Mock(api);
  }

  const fetchData = ({
    id,
    config,
  }: {
    id: string;
    config?: AxiosRequestConfig;
  }) => {
    setError(undefined);
    setLoading(true);
    api({
      method: "GET",
      url: getImagemUrl("EVENTO", id),
      responseType: "arraybuffer",
      ...config,
    })
      .then((response) => {
        setError(undefined);
        setResponse((prevState) => [
          { image: response.data, id },
          ...prevState,
        ]);
      })
      .catch((error: AxiosError) => setError(error))
      .finally(() => setLoading(false));
  };

  return { response, loading, error, fetchData };
}

export default useImageApi;
