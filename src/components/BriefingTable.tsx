import { Stand } from "@/types/stand";
import { Evento } from "@/types/evento";
import { Cliente } from "@/types/cliente";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlteracoesModal } from "./Projeto/AlteracoesModal";
import useApi from "@/hooks/useApi";

import BriefingTableRow from "./BriefingTableRow";

interface Orcamento {
  uuid: string;
  estande: Stand;
  valorEstimadoPeloSistema: number;
  valorLocacaoEstrutura: number;
  valorComunicacaoVisual: number;
  valorTotalMobiliario: number;
  formaPagamento: string;
  condicaoPagamento: string;
  periodo: {
    dataInicial: string;
    dataFinal: string;
  };
  periodoMontagem: {
    dataInicial: string;
    dataFinal: string;
  };
  periodoDesmontagem: {
    dataInicial: string;
    dataFinal: string;
  };
}

interface TableProps {
  items: Stand[] | undefined;
  eventos: Evento[] | undefined;
  clientes: Cliente[] | undefined;
  setCurrentBriefing: Dispatch<SetStateAction<Stand | null>>;
  setCurrentOrcamento: Dispatch<SetStateAction<Stand | Orcamento | null>>;
  reload: () => void;
}

export const BriefingTable = ({
  items,
  eventos,
  clientes,
  setCurrentBriefing,
  setCurrentOrcamento,
  reload,
}: TableProps) => {
  const { status } = useApi({
    url: "/estande/atribuir-projetista",
    method: "POST",
    autoRun: false,
  });
  const [alteracoes, setAlteracoes] = useState<
    Stand["historicoSugestoes"] | null
  >(null);
  const { usuarioAtual, usuarios } = useUsuariosContext();

  useEffect(() => {
    if (status === 200) {
      reload();
    }
  }, [status, reload]);

  return (
    <>
      <div className="relative w-full h-full sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-center text-gray-700 uppercase bg-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                OS
              </th>
              <th scope="col" className="px-6 py-3">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                Data de início
              </th>
              <th scope="col" className="px-6 py-3">
                Data de encerrameto
              </th>
              <th scope="col" className="px-6 py-3">
                Evento
              </th>
              <th scope="col" className="px-6 py-3">
                Vendedor
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Alterações
              </th>
              <th scope="col" className="px-6 py-3">
                Editar Briefing
              </th>
              <th scope="col" className="px-6 py-3">
                Gerar orcamento
              </th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items
                ?.filter((item) =>
                  usuarioAtual?.roleDto.descricaoRole === "ADMINISTRADOR"
                    ? true
                    : usuarioAtual?.roleDto.descricaoRole === "COMERCIAL"
                    ? eventos?.find((evento) => evento.uuid === item.uuidEvento)
                        ?.uuidUsuarioComercial === usuarioAtual?.uuid
                    : item.uuidCliente === clientes?.[0].uuid
                )
                ?.sort((a, b) => {
                  if (a.uuidProjetista && !b.uuidProjetista) {
                    return -1;
                  }
                  if (!a.uuidProjetista && b.uuidProjetista) {
                    return 1;
                  }
                  return 0;
                })
                ?.map((item, index) => {
                  return (
                    <BriefingTableRow
                      clientes={clientes}
                      eventos={eventos}
                      index={index}
                      item={item}
                      setAlteracoes={setAlteracoes}
                      reload={reload}
                      setCurrentBriefing={setCurrentBriefing}
                      setCurrentOrcamento={setCurrentOrcamento}
                      usuarios={usuarios}
                    />
                  );
                })}
          </tbody>
        </table>
      </div>
      <AlteracoesModal
        alteracoes={alteracoes}
        onClose={() => setAlteracoes(null)}
      />
    </>
  );
};
