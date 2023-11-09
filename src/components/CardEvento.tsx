import { Evento } from "@/types/evento";
import { useMemo } from "react";
import { Button } from ".";
import { Buffer } from "buffer";
import { TailSpin } from "react-loader-spinner";

interface CardEventoProps {
  evento: Evento;
  setBriefingEvento?: () => void;
  setEvento?: () => void;
}

export const CardEvento = ({
  evento,
  setEvento,
  setBriefingEvento,
}: CardEventoProps) => {
  const dataInicio = useMemo(() => {
    const data = new Date(evento.dataHoraInicioFormatada);
    return data.toLocaleDateString("pt-BR");
  }, [evento]);
  const dataFim = useMemo(() => {
    const data = new Date(evento?.dataHoraFimFormatada);
    return data.toLocaleDateString("pt-BR");
  }, [evento]);
  const imagem = useMemo(() => {
    if (evento.imagem) {
      const base64ImageString = Buffer.from(evento.imagem, "binary").toString(
        "base64"
      );
      return "data:image/png;base64," + base64ImageString;
    }
    return "loading";
  }, [evento]);

  return (
    <div className="flex flex-col w-fit lg:max-w-[300px] transition-all">
      {imagem === "loading" ? (
        <div className="flex items-center justify-center w-full h-full p-5 bg-zinc-50">
          <TailSpin />
        </div>
      ) : (
        <img
          alt={`Imagem do evento: ${evento.nome}`}
          src={imagem}
          className="object-fill h-[160px] rounded-t-md"
        />
      )}
      <div className="flex flex-col gap-4 px-3 py-4 text-black bg-white rounded-b-md">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col">
            <h3 className="text-[#919191] text-xs">Evento</h3>
            <span className="text-sm font-medium">{evento.nome}</span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h3 className="text-[#919191] text-xs">Local</h3>
          <span className="text-sm font-medium">{evento.outro}</span>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col">
            <h3 className="text-[#919191] text-xs">Data de início</h3>
            <span className="text-sm font-medium">{dataInicio}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-[#919191] text-xs">Data de encerramento</h3>
            <span className="text-sm font-medium">{dataFim}</span>
          </div>
        </div>
        <div className="flex flex-row w-full gap-3">
          <Button
            type="button"
            className="w-full text-xs font-normal transition-all hover:scale-105"
            label="Criar briefing"
            onClick={setBriefingEvento}
          />
          <Button
            type="button"
            className="w-full text-xs font-normal transition-all hover:scale-105"
            label="Mais detalhes"
            onClick={setEvento}
          />
        </div>
      </div>
    </div>
  );
};
