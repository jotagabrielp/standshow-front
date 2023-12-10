import { Stand } from "@/types/stand";
import { useEffect, useState } from "react";
import { AlteracoesModal } from "./Projeto/AlteracoesModal";
import useApi from "@/hooks/useApi";
import { Cliente } from "@/types/cliente";

interface TableProps {
  items: Cliente[] | undefined;
  reload: () => void;
}

export const UserTable = ({ items, reload }: TableProps) => {
  const { status } = useApi({
    url: "/estande/atribuir-projetista",
    method: "POST",
    autoRun: false,
  });
  const [alteracoes, setAlteracoes] = useState<
    Stand["historicoSugestoes"] | null
  >(null);

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
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Endereço principal
              </th>
              <th scope="col" className="px-6 py-3">
                Endereço de cobrança
              </th>
              <th scope="col" className="px-6 py-3">
                Filial
              </th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items?.map((item) => {
                return (
                  <tr
                    key={item.uuid}
                    className="bg-white border-b even:bg-neutral-04"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 break-words">
                      {item?.nomeEmpresarial}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 break-words">
                      {item?.logradouro}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 break-words">
                      {item?.logradouro}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 break-words">
                      Não
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
