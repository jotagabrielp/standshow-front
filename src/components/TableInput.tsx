import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

interface TableRow {
  id: number;
  qtd: number;
  desc: string;
  pos: string;
}

const TableInput = ({ title }: { title: string }) => {
  const [rows, setRows] = useState<TableRow[]>([]);

  const addRow = () => {
    const newRow: TableRow = {
      id: rows.length + 1,
      qtd: 1,
      desc: "",
      pos: "",
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (id: number) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleFieldChange = (id: number, field: string, value: string) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <div className="my-4 ">
      <div className="flex flex-row gap-3">
        <h2>{title}</h2>
        <button onClick={addRow}>
          <FaPlus />
        </button>
      </div>
      {rows.length > 0 && (
        <div>
          <table className="w-full text-sm font-light text-center">
            <thead className="font-medium border-b dark:border-neutral-500">
              <tr>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Posição</th>
                <th className="px-6 py-4">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b dark:border-neutral-500">
                  <td className="px-6 py-1 whitespace-nowrap">
                    <input
                      type="number"
                      className="border-[#e4e4e4] border-2 py-2 rounded-lg w-12 pl-4 bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                      value={row.qtd}
                      onChange={(e) =>
                        handleFieldChange(row.id, "qtd", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-[#e4e4e4] border-2 py-2 rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                      value={row.desc}
                      onChange={(e) =>
                        handleFieldChange(row.id, "desc", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="border-[#e4e4e4] border-2 py-2 rounded-lg  bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                      value={row.pos}
                      onChange={(e) =>
                        handleFieldChange(row.id, "pos", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteRow(row.id)}>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableInput;
