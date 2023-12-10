import { Stand } from "@/types/stand";
import { Evento } from "@/types/evento";
import { Cliente } from "@/types/cliente";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlteracoesModal } from "./Projeto/AlteracoesModal";
import useApi from "@/hooks/useApi";

const status_dic = {
  AGUARDANDO_PROJETO: "Aguardando projeto",
};

interface TableProps {
  items: Stand[] | undefined;
  eventos: Evento[] | undefined;
  clientes: Cliente[] | undefined;
  setCurrentBriefing: Dispatch<SetStateAction<Stand | null>>;
  setCurrentOrcamento: Dispatch<SetStateAction<Stand | null>>;
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
                  const cliente = clientes?.find(
                    (cliente) => cliente.uuid === item.uuidCliente
                  );
                  const evento = eventos?.find(
                    (evento) => evento.uuid === item.uuidEvento
                  );
                  const usuarioComercial = usuarios?.find(
                    (usuario) => usuario.uuid === evento?.uuidUsuarioComercial
                  );
                  return (
                    <tr
                      key={item.uuid}
                      className="bg-white border-b even:bg-neutral-04"
                    >
                      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 break-words">
                        {cliente?.nomeEmpresarial}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
                        {new Date(
                          evento?.dataHoraInicioFormatada as string
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
                        {new Date(
                          evento?.dataHoraFimFormatada as string
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
                        {evento?.nome}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
                        {usuarioComercial?.nome}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {status_dic[item.status]}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${
                          item.historicoSugestoes?.length
                            ? "text-gray-900 font-medium transition-transform cursor-pointer hover:scale-110 "
                            : ""
                        } `}
                        onClick={() => setAlteracoes(item.historicoSugestoes)}
                      >
                        {item.historicoSugestoes?.length
                          ? "Ver Alterações solicitadas"
                          : "Sem alterações"}
                      </td>
                      <td
                        className="px-6 py-4 text-center"
                        onClick={() => setCurrentBriefing(item)}
                      >
                        Editar
                      </td>
                      <td
                        className="px-6 py-4 text-center"
                        onClick={() => setCurrentOrcamento(item)}
                      >
                        Gerar
                      </td>
                    </tr>
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
