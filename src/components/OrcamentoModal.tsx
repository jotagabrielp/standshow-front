import { Stand } from "@/types/stand";
import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { useBriefing } from "@/hooks/useBriefing";
import { Button } from ".";
import useApi from "@/hooks/useApi";
import TableInput from "./TableInput";

const CLASSE_INPUT =
  "border-[#e4e4e4] border-2 py-2 rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300";

interface Orcamento {
  uuid: string;
  estande: Stand;
  valorEstimadoPeloSistema: number;
  valorLocacaoEstrutura: number;
  valorComunicacaoVisual: number;
  valorTotalMobiliario: number;
  formaPagamento: string;
  condicaoPagamento: string;
  periodo: {
    dataInicial: string;
    dataFinal: string;
  };
  periodoMontagem: {
    dataInicial: string;
    dataFinal: string;
  };
  periodoDesmontagem: {
    dataInicial: string;
    dataFinal: string;
  };
}

interface OrcamentoModal {
  onClose: () => void;
  orcamentoObject: Stand | Orcamento;
}

const OrcamentoModal = ({ orcamentoObject, onClose }: OrcamentoModal) => {
  const { clientes } = useClientesContext();
  const { eventos } = useEventosContext();
  const briefing = useBriefing();

  const estande = (orcamentoObject as Orcamento)?.estande ?? orcamentoObject;
  const data = useMemo(() => new Date(), []);
  const { loading, response, fetchData } = useApi({
    autoRun: false,
  });

  useEffect(() => {
    if (response) {
      onClose();
      (orcamentoObject as Stand)?.reload?.();
    }
  }, [response, onClose, orcamentoObject]);

  const cliente = useMemo(
    () => clientes.find((cliente) => cliente.uuid === estande?.uuidCliente),
    [clientes, estande]
  );
  const evento = useMemo(
    () => eventos.find((evento) => evento.uuid === estande?.uuidEvento),
    [eventos, estande]
  );

  const parede = useMemo(
    () =>
      briefing?.parede?.find(
        (parede) => parede.uuid === estande?.parede.tipoParede.uuid
      ),
    [briefing, estande]
  );

  const piso = useMemo(
    () =>
      briefing?.piso?.find(
        (piso) => piso.uuid === estande?.piso?.tipoPiso.uuid
      ),
    [briefing, estande]
  );

  const [valorTotal, setValorTotal] = useState("");
  const [valorLocacaoEstrutura, setValorLocacaoEstrutura] = useState("");
  const [valorTotalImobiliario, setValorTotalImobiliario] = useState("");
  const [valorComunicacaoVisual, setValorComunicacaoVisual] = useState("");
  const [montagemInicio, setMontagemInicio] = useState("");
  const [montagemFim, setMontagemFim] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [desmontagemInicio, setDesmontagemInicio] = useState("");
  const [desmontagemFim, setDesmontagemFim] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [condicaoPagamento, setCondicaoPagamento] = useState("");

  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorTotal(e.target.value);
  };

  const handleValorLocacaoEstruturaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValorLocacaoEstrutura(e.target.value);
  };

  const handleValorTotalImobiliarioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValorTotalImobiliario(e.target.value);
  };

  const handleValorComunicacaoVisualChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValorComunicacaoVisual(e.target.value);
  };

  const handleFormaPagamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormaPagamento(e.target.value);
  };

  const handleCondicaoPagamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCondicaoPagamento(e.target.value);
  };

  const onSubmit = () => {
    const formObject = {
      uuidEstande: estande.uuid,
      valorEstimadoPeloSistema: 5000,
      valorLocacaoEstrutura: Number(valorLocacaoEstrutura),
      valorComunicacaoVisual: Number(valorComunicacaoVisual),
      valorTotalMobiliario: Number(valorTotalImobiliario),
      formaPagamento,
      condicaoPagamento,
      periodo: {
        dataInicial: new Date(periodoInicio).toISOString(),
        dataFinal: new Date(periodoFim).toISOString(),
      },
      periodoMontagem: {
        dataInicial: new Date(montagemInicio).toISOString(),
        dataFinal: new Date(montagemFim).toISOString(),
      },
      periodoDesmontagem: {
        dataInicial: new Date(desmontagemInicio).toISOString(),
        dataFinal: new Date(desmontagemFim).toISOString(),
      },
    };
    fetchData({
      url: "/orcamento",
      method: "POST",
      data: formObject,
    });
  };

  return (
    <Modal
      isOpen={!!orcamentoObject}
      onClose={onClose}
      className="max-w-[800px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <span>Fortaleza, {data.toLocaleDateString()}</span>
          <span>O R Ç A M E N T O 009507</span>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <span>Empresa: {cliente?.nomeEmpresarial}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Fone: {cliente?.telefone}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Evento: {evento?.nome}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>E-mail: {cliente?.nomeEmpresarial}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Local: {evento?.outro}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Tamanho: {estande?.dimensao.area}m²</span>
          </div>
        </div>
        <div className="flex flex-row">
          Atendendo sua solicitação, segue abaixo, orçamento para Locação de
          Material e Montagem de seu estande, conforme descriminado:
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">Descritivo</span>
          <span>Estrutura</span>
          <div className="flex flex-row gap-3">
            <div>
              <span>Piso: </span>
              <span>
                {estande?.dimensao.frente} x {estande?.dimensao.lateral}
              </span>
            </div>
            <div>
              <span>Altura: </span>
              <span>{estande?.dimensao.peDireito} cm</span>
            </div>
          </div>
          <span>
            Revestimento: <input className={CLASSE_INPUT} />
          </span>
          <span>
            Cor do rodapé: <input className={CLASSE_INPUT} />
          </span>
          <div>
            <span>Parede:</span>
            <span>{parede?.descricao}</span>
          </div>
          <TableInput title={"Comunicação visual"} />
          <TableInput title={"Mobiliário"} />
          {(orcamentoObject as Orcamento)?.estande ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between w-full gap-3">
                <span>Valor Locação Estrutura</span>
                <span>
                  {(orcamentoObject as Orcamento)?.valorLocacaoEstrutura}
                </span>
              </div>
              <div className="flex flex-row justify-between w-full gap-3">
                <span>Valor Total Imobiliário</span>
                <span>
                  {(orcamentoObject as Orcamento)?.valorTotalMobiliario}
                </span>
              </div>
              <div className="flex flex-row justify-between w-full gap-3">
                <span>Valor Comunicação visual</span>
                <span>
                  {(orcamentoObject as Orcamento)?.valorComunicacaoVisual}
                </span>
              </div>
              <div className="flex flex-row justify-between w-full gap-3">
                <span>Valor total:</span>
                <span>12345</span>
              </div>
              <div className="flex flex-row justify-between w-full gap-3">
                <span>Forma pagamento</span>
                <span>{(orcamentoObject as Orcamento)?.formaPagamento}</span>
              </div>
              <div className="flex flex-row justify-between w-1/2 gap-3">
                <span>Condição Pagamento</span>
                <span>{(orcamentoObject as Orcamento)?.condicaoPagamento}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between gap-3">
                <span>Valor Locação Estrutura</span>
                <input
                  type="text"
                  className={CLASSE_INPUT}
                  value={valorLocacaoEstrutura}
                  onChange={handleValorLocacaoEstruturaChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-3">
                <span>Valor Total Imobiliário</span>
                <input
                  type="text"
                  className="border-[#e4e4e4] border-2 py-2  rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                  value={valorTotalImobiliario}
                  onChange={handleValorTotalImobiliarioChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-3">
                <span>Valor Comunicação visual</span>
                <input
                  type="text"
                  className="border-[#e4e4e4] border-2 py-2  rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                  value={valorComunicacaoVisual}
                  onChange={handleValorComunicacaoVisualChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-3">
                <span>Valor total:</span>
                <input
                  type="text"
                  className="border-[#e4e4e4] border-2 py-2  rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                  value={valorTotal}
                  onChange={handleValorTotalChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-3">
                <span>Forma pagamento</span>
                <select
                  className="border-[#e4e4e4] border-2 py-2  rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                  value={formaPagamento}
                  onChange={handleFormaPagamentoChange}
                >
                  <option value="BOLETO">Boleto</option>
                </select>
              </div>
              <div className="flex flex-row justify-between gap-3">
                <span>Condição Pagamento</span>
                <select
                  className={CLASSE_INPUT}
                  value={condicaoPagamento}
                  onChange={handleCondicaoPagamentoChange}
                >
                  <option value="BOLETO_PARCELADO">Boleto parcelado</option>
                </select>
              </div>
            </div>
          )}
          {!(orcamentoObject as Orcamento)?.estande && (
            <Button
              type="button"
              label="gerar"
              className="mt-3"
              onClick={onSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrcamentoModal;
