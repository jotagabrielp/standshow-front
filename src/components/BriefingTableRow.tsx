import { Cliente } from "@/types/cliente";
import { Evento } from "@/types/evento";
import { Stand } from "@/types/stand";
import { Usuario } from "@/types/usuario";
import { Dispatch, SetStateAction } from "react";
import { FaEye, FaPlus } from "react-icons/fa";

const status_dic = {
  AGUARDANDO_PROJETO: "Aguardando projeto",
};

interface TableProps {
  item: Stand;
  eventos: Evento[] | undefined;
  clientes: Cliente[] | undefined;
  setAlteracoes: Dispatch<SetStateAction<Stand["historicoSugestoes"] | null>>;
  usuarios: Usuario[] | undefined;
  index: number;
  setCurrentBriefing: Dispatch<SetStateAction<Stand | null>>;
  setCurrentOrcamento: Dispatch<SetStateAction<Stand | null>>;
  reload: () => void;
}

const BriefingTableRow = ({
  clientes,
  eventos,
  usuarios,
  item,
  index,
  setAlteracoes,
  setCurrentBriefing,
  setCurrentOrcamento,
}: TableProps) => {
  const cliente = clientes?.find(
    (cliente) => cliente.uuid === item.uuidCliente
  );
  const evento = eventos?.find((evento) => evento.uuid === item.uuidEvento);
  const usuarioComercial = usuarios?.find(
    (usuario) => usuario.uuid === evento?.uuidUsuarioComercial
  );
  return (
    <tr key={item.uuid} className="bg-white border-b even:bg-neutral-04">
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
        {new Date(evento?.dataHoraFimFormatada as string).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
        {evento?.nome}
      </td>
      <td className="px-6 py-4 font-medium text-center text-gray-900 break-words">
        {usuarioComercial?.nome}
      </td>
      <td className="px-6 py-4 text-center">{status_dic[item.status]}</td>
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
      <td className="flex flex-row items-center gap-4 px-6 py-4 text-center">
        <div className="p-2 rounded-sm cursor-pointer bg-zinc-300">
          <FaEye />
        </div>
        <div
          className="p-2 bg-green-600 rounded-sm cursor-pointer"
          onClick={() => setCurrentOrcamento(item)}
        >
          <FaPlus />
        </div>
      </td>
    </tr>
  );
};

export default BriefingTableRow;
