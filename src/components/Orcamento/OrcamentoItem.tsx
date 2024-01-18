import { Stand } from "@/types/stand";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const CLASSE_INPUT =
  "border-[#e4e4e4] border-2 py-2 rounded-lg w-24 bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300";
//setItem is a react setState
interface OrcamentoItemProps {
  disabled: boolean;
  estande: Stand;
  title: string;
  item: { [key: string]: string };
  setItem: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const OrcamentoItem = ({
  estande,
  title,
  disabled,
  setItem,
  item,
}: OrcamentoItemProps) => {
  const [altura, setAltura] = useState(item?.altura ?? "");
  const [revestimento, setRevestimento] = useState(item?.revestimento ?? "");
  const [corRodape, setCorRodape] = useState(item?.metragem ?? "");

  const handleAlturaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAltura(value);
    setItem((prevItem: { [key: string]: string }) => ({
      ...prevItem,
      altura: value,
    }));
  };

  const handleRevestimentoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setRevestimento(value);
    setItem((prevItem: { [key: string]: string }) => ({
      ...prevItem,
      revestimento: value,
    }));
  };

  const handleCorRodapeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCorRodape(value);
    setItem((prevItem: { [key: string]: string }) => ({
      ...prevItem,
      corRodape: value,
    }));
  };

  useEffect(() => {
    if (altura !== "" && revestimento !== "" && corRodape !== "") {
      setItem((prevItem: { [key: string]: string }) => ({
        ...prevItem,
        altura: altura,
        revestimento: revestimento,
        corRodape: corRodape,
      }));
    }
  }, [altura, revestimento, corRodape, setItem]);

  return (
    <div className="flex flex-col gap-2 p-3 m-4 border border-black border-dotted">
      <span>{title}: </span>
      <div className="flex flex-row items-center gap-2">
        <span>
          Tamanho: {estande?.dimensao.frente} x {estande?.dimensao.lateral}
        </span>
        <div>
          <span>Altura: </span>
          <input
            disabled={disabled}
            className={twMerge(CLASSE_INPUT, "w-12 h-8")}
            value={altura}
            onChange={handleAlturaChange}
          />
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <span>
          Revestimento em{" "}
          <input
            disabled={disabled}
            className={twMerge(CLASSE_INPUT, "h-8")}
            value={revestimento}
            onChange={handleRevestimentoChange}
          />
        </span>
        {title === "Piso" && (
          <>
            <span>
              na cor:{" "}
              <input
                disabled={disabled}
                className={twMerge(CLASSE_INPUT, "h-8")}
                value={corRodape}
                onChange={handleCorRodapeChange}
              />
            </span>
            {estande?.piso === null && (
              <span className="flex items-center">Aplicado em piso local</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
