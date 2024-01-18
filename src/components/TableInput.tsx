import { FaPlus, FaTimes } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface TableRow {
  id: number;
  qtd: number;
  desc: string;
  customField: string;
  pos: string;
  value: number | null;
  uuid?: string;
}

const CLASSE_INPUT =
  "border-[#e4e4e4] border-2 h-8 w-24 py-2 rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300";

const TableInput = ({
  title,
  custom,
  rows,
  setRows,
  disabled,
}: {
  title: string;
  custom: string;
  disabled: boolean;
  rows: TableRow[];
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>;
}) => {
  const addRow = () => {
    const newRow: TableRow = {
      id: rows.length + 1,
      qtd: 1,
      desc: "",
      customField: "",
      pos: "",
      value: null,
    };
    setRows([...rows, newRow]);
  };
  console.log(rows);

  const deleteRow = (idToDelete: number) => {
    const updatedRows = rows.filter((row) => row.id !== idToDelete);
    setRows(
      updatedRows.map((row) => ({
        ...row,
        id: row.id > idToDelete ? row.id - 1 : row.id,
      }))
    );
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
    <div className="m-4">
      <div className="flex flex-row gap-3">
        <h2>{title}</h2>
        {!disabled && (
          <button onClick={addRow}>
            <FaPlus />
          </button>
        )}
      </div>
      {rows.length > 0 && (
        <div>
          <table className="w-full text-sm font-light text-center">
            <thead className="font-medium border-b dark:border-neutral-500">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">{custom}</th>
                {title !== "Iluminação" && (
                  <>
                    <th className="px-6 py-4">Posição</th>
                    <th className="px-6 py-4">Valor</th>
                  </>
                )}
                {!disabled && <th className="px-6 py-4">Excluir</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b dark:border-neutral-500">
                  <td>
                    <span className="font-bold">Item {row.id}</span>
                  </td>
                  <td className="px-6 py-1 whitespace-nowrap">
                    <input
                      disabled={disabled}
                      type="number"
                      className={twMerge(CLASSE_INPUT, "w-12 h-8")}
                      value={row.qtd}
                      onChange={(e) =>
                        handleFieldChange(row.id, "qtd", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type="text"
                      className={CLASSE_INPUT}
                      value={row.desc}
                      onChange={(e) =>
                        handleFieldChange(row.id, "desc", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      disabled={disabled}
                      type="text"
                      className={CLASSE_INPUT}
                      value={row.customField}
                      onChange={(e) =>
                        handleFieldChange(row.id, "customField", e.target.value)
                      }
                    />
                  </td>
                  {title !== "Iluminação" && (
                    <>
                      <td>
                        <input
                          disabled={disabled}
                          type="text"
                          className={CLASSE_INPUT}
                          value={row.pos}
                          onChange={(e) =>
                            handleFieldChange(row.id, "pos", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          disabled={disabled}
                          type="text"
                          className={CLASSE_INPUT}
                          value={row.value as number}
                          onChange={(e) =>
                            handleFieldChange(row.id, "value", e.target.value)
                          }
                        />
                      </td>
                    </>
                  )}
                  <td>
                    {!disabled && (
                      <button onClick={() => deleteRow(row.id)}>
                        <FaTimes />
                      </button>
                    )}
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
