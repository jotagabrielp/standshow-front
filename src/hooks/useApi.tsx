import api from "@/service/api";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useEffect, useState, useCallback } from "react";

interface useApiProps extends AxiosRequestConfig {
  autoRun?: boolean;
}

function useApi<T>({
  method,
  url,
  autoRun = true,
  data,
  responseType,
}: useApiProps) {
  const [response, setResponse] = useState<T>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<Error>();
  const [status, setStatus] = useState<number>();

  const fetchData = useCallback(
    (config?: AxiosRequestConfig) => {
      setError(undefined);
      setLoading(true);
      api({
        method,
        url,
        responseType,
        data,
        ...config,
      })
        .then((response) => {
          setError(undefined);
          setStatus(response.status);
          setResponse(response.data);
        })
        .catch((error: AxiosError) => setError(error))
        .finally(() => setLoading(false));
    },
    [data, method, url, responseType]
  );

  useEffect(() => {
    if (autoRun && !loading && !response && !error && !status) {
      fetchData();
    }
  }, [fetchData, autoRun, loading, response, error, status]);

  return { response, loading, error, fetchData, status };
}

export default useApi;
