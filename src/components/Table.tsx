import { Stand } from "@/types/stand";
import { Evento } from "@/types/evento";
import { Cliente } from "@/types/cliente";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AlteracoesModal } from "./Projeto/AlteracoesModal";
import { useLocation } from "react-router-dom";
import ReactSelect from "react-select";
import useApi from "@/hooks/useApi";

const status_dic = {
  AGUARDANDO_PROJETO: "Aguardando projeto",
};

interface TableProps {
  items: Stand[] | undefined;
  eventos: Evento[] | undefined;
  clientes: Cliente[] | undefined;
  openModal: Dispatch<SetStateAction<Stand | null>>;
  reload: () => void;
}

export const Table = ({
  items,
  openModal,
  eventos,
  clientes,
  reload,
}: TableProps) => {
  const location = useLocation();
  const { fetchData, status } = useApi({
    url: "/estande/atribuir-projetista",
    method: "POST",
    autoRun: false,
  });
  const [alteracoes, setAlteracoes] = useState<
    Stand["historicoSugestoes"] | null
  >(null);
  const { usuarioAtual, usuarios } = useUsuariosContext();

  const projetistasOption = useMemo(() => {
    return usuarios
      ?.filter((usuario) => usuario.roleDto.descricaoRole === "PROJETISTA")
      ?.map((usuario) => ({
        value: usuario.uuid,
        label: usuario.nome,
      }));
  }, [usuarios]);

  useEffect(() => {
    if (status === 200) {
      reload();
    }
  }, [status, reload]);

  return (
    <>
      <div className="relative w-full h-full sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-center text-gray-700 uppercase bg-neutral-04">
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
                Projetista
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Alterações
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Info</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                1
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                CLIENTE
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                12/12/2023
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                12/12/2023
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                EVENTO
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                VENDEDOR
              </td>
              <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                PROJETISTA
              </td>
              <td className="px-6 py-4 text-center">Finalizado</td>
              <td className={`px-6 py-4 text-center`}>Sem alterações</td>
              <td
                className="px-6 py-4 text-center transition-transform cursor-pointer hover:scale-110"
                onClick={() => openModal({} as Stand)}
              >
                <span className="font-medium text-blue-800">
                  Visualizar projeto
                </span>
              </td>
            </tr>
            {items &&
              items
                ?.filter((item) =>
                  usuarioAtual?.roleDto.descricaoRole === "COMERCIAL"
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
                  const projetista = usuarios?.find(
                    (usuario) => usuario.uuid === item.uuidProjetista
                  );
                  return (
                    <tr key={item.uuid} className="bg-white border-b ">
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {index + 2}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {cliente?.nomeEmpresarial}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {new Date(
                          evento?.dataHoraInicioFormatada as string
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {new Date(
                          evento?.dataHoraFimFormatada as string
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {evento?.nome}
                      </td>
                      <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                        {usuarioComercial?.nome}
                      </td>
                      <td
                        className={`px-6 py-4 font-medium text-center  whitespace-nowrap ${
                          projetista ? "text-gray-900" : ""
                        }`}
                      >
                        {projetista ? (
                          projetista.nome
                        ) : location.pathname === "/projetos" ? (
                          <ReactSelect
                            options={projetistasOption}
                            onChange={(props) =>
                              fetchData({
                                data: {
                                  uuidEstande: item.uuid,
                                  uuidUsuarioProjetista: props?.value,
                                },
                              })
                            }
                          />
                        ) : (
                          "Sem projetista"
                        )}
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
