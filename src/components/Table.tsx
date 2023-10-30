import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { AiFillInfoCircle } from "react-icons/ai";
import { Stand } from "@/types/stand";
import { useAuth } from "@/context/auth/useAuth";

const status_dic = {
  AGUARDANDO_PROJETO: "Aguardando projeto",
};

interface TableProps {
  items: Stand[] | undefined;
  openModal: () => void;
}

export const Table = ({ items, openModal }: TableProps) => {
  const { eventos } = useEventosContext() || {};
  const { user } = useAuth() || {};
  const { clientes } = useClientesContext() || {};
  return (
    <div className="relative w-full h-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Evento
            </th>
            <th scope="col" className="px-6 py-3">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3">
              Tipo
            </th>
            <th scope="col" className="px-6 py-3">
              Forma
            </th>
            <th scope="col" className="px-6 py-3">
              Piso
            </th>
            <th scope="col" className="px-6 py-3">
              Parede
            </th>
            <th scope="col" className="px-6 py-3">
              Ambiente
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Info</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items
            ?.filter((item) =>
              user?.roleId === 3
                ? true
                : item.uuidCliente === clientes?.[0].uuid
            )
            .map((item) => (
              <tr key={item.uuid} className="bg-white border-b ">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {
                    eventos?.find((evento) => evento.uuid === item.uuidEvento)
                      ?.nome
                  }
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {
                    clientes?.find(
                      (cliente) => cliente.uuid === item.uuidCliente
                    )?.nomeEmpresarial
                  }
                </td>
                <td className="px-6 py-4">
                  {item.formaConstrutiva.tipoForma.descricao}
                </td>
                <td className="px-6 py-4">
                  {item.dimensao.tipoDimensao.descricao}
                </td>
                <td className="px-6 py-4">{item.piso?.tipoPiso.descricao}</td>
                <td className="px-6 py-4">
                  {item.parede.tipoParede.descricao}
                </td>
                <td className="px-6 py-4">
                  {item.ambientes[0].tipoAmbiente.descricao}
                </td>
                <td className="px-6 py-4">{status_dic[item.status]}</td>
                <td
                  className="px-6 py-4 text-right cursor-pointer"
                  onClick={openModal}
                >
                  <span className="font-medium text-blue-800 hover:underline">
                    <AiFillInfoCircle />
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
