import { Stand } from "@/types/stand";
import Modal from "../Modal";

interface AlteracoesModalProps {
  alteracoes: Stand["historicoSugestoes"] | null;
  onClose: () => void;
}

export const AlteracoesModal = ({
  alteracoes,
  onClose,
}: AlteracoesModalProps) => {
  return (
    <Modal isOpen={!!alteracoes} onClose={onClose} className="sm:w-fit">
      <div className="flex items-center justify-center w-full">
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="px-5 text-center">Data</th>
              <th className="px-5 text-center">Alteração</th>
            </tr>
          </thead>
          <tbody>
            {alteracoes?.map((alteracao) => (
              <tr>
                <td className="px-5 text-center">
                  {new Date(alteracao.data).toLocaleString()}
                </td>
                <td className="px-5 text-center">{alteracao.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
