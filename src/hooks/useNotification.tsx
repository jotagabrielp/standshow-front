import { SolicitacaoArray } from "@/types/solicitacao";
import { useState, useEffect } from "react";
import useApi from "./useApi";
import { getSolicitacoesUrl } from "@/utils/url";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth/useAuth";
import { useNavigate } from "react-router-dom";

function useNotification() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const { loading, response, fetchData } = useApi<SolicitacaoArray>({
    url: getSolicitacoesUrl(),
    method: "GET",
  });
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoArray | null>(
    null
  );

  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | undefined;
  //   if (loading && intervalId) return clearInterval(intervalId);
  //   if (!loading) {
  //     intervalId = setInterval(() => {
  //       fetchData();
  //     }, 7000);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [fetchData, loading]);

  useEffect(() => {
    if (!response) return;
    if (!solicitacoes) {
      setSolicitacoes(response.reverse());
      return;
    }
    if (response.length > solicitacoes.length && user?.roleId === 3) {
      toast(() => (
        <span
          className="w-full h-full cursor-pointer"
          onClick={() =>
            navigate("/home/projetos/adicionar", {
              state: {
                evento: { uuid: solicitacoes[0].uuidEvento },
                cliente: { uuid: solicitacoes[0].uuidCliente },
              },
            })
          }
        >
          Um novo cliente está solicitando um projeto!
        </span>
      ));
      setSolicitacoes(response);
    }
  }, [response, solicitacoes, user, navigate]);
}

export default useNotification;
