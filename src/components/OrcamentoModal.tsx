import { Stand } from "@/types/stand";
import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { useBriefing } from "@/hooks/useBriefing";
import { Button } from ".";
import { formatApiFriendlyDate } from "@/utils/date";
import useApi from "@/hooks/useApi";

interface OrcamentoModal {
  onClose: () => void;
  stand: Stand;
}

const OrcamentoModal = ({ stand, onClose }: OrcamentoModal) => {
  const { clientes } = useClientesContext();
  const { eventos } = useEventosContext();
  const briefing = useBriefing();
  const data = useMemo(() => new Date(), []);
  const { loading, error, response, fetchData } = useApi({
    autoRun: false,
  });

  useEffect(() => {
    if (response) {
      onClose();
    }
  }, [response, onClose]);

  const cliente = useMemo(
    () => clientes.find((cliente) => cliente.uuid === stand?.uuidCliente),
    [clientes, stand]
  );
  const evento = useMemo(
    () => eventos.find((evento) => evento.uuid === stand?.uuidEvento),
    [eventos, stand]
  );

  const parede = useMemo(
    () =>
      briefing?.parede?.find(
        (parede) => parede.uuid === stand?.parede.tipoParede.uuid
      ),
    [briefing, stand]
  );

  const piso = useMemo(
    () =>
      briefing?.piso?.find((piso) => piso.uuid === stand?.piso?.tipoPiso.uuid),
    [briefing, stand]
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

  const handleMontagemInicioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMontagemInicio(e.target.value);
  };

  const handleMontagemFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontagemFim(e.target.value);
  };

  const handlePeriodoInicioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPeriodoInicio(e.target.value);
  };

  const handlePeriodoFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodoFim(e.target.value);
  };

  const handleDesmontagemInicioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDesmontagemInicio(e.target.value);
  };

  const handleDesmontagemFimChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDesmontagemFim(e.target.value);
  };

  const handleFormaPagamentoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormaPagamento(e.target.value);
  };

  const handleCondicaoPagamentoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCondicaoPagamento(e.target.value);
  };

  const onSubmit = () => {
    const formObject = {
      uuidEstande: stand.uuid,
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
    <Modal isOpen={!!stand} onClose={onClose} className="max-w-[1000px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <span>Fortaleza, {data.toLocaleDateString()}</span>
          <span>O R Ç A M E N T O 009507</span>
        </div>
        <div className="flex flex-row">
          Atendendo sua solicitação, segue abaixo, orçamento para Locação de
          Material e Montagem de seu estande, conforme descriminado:
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Empresa</span>
            <span className="w-[50%] text-sm border border-black">
              {cliente?.nomeEmpresarial}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Evento</span>
            <span className="w-[50%] text-sm border border-black">
              {evento?.nome}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Fone</span>
            <span className="w-[50%] text-sm border border-black">
              {cliente?.telefone}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>E-mail</span>
            <span className="w-[50%] text-sm border border-black">
              {cliente?.nomeEmpresarial}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Local</span>
            <span className="w-[50%] text-sm border border-black">
              {evento?.outro}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Tamanho</span>
            <span className="w-[50%] text-sm border border-black">
              {stand?.dimensao.area}m²
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Montagem</span>
            <span className="w-[50%] text-sm">
              de
              <input
                type="date"
                className="border border-black"
                value={montagemInicio}
                onChange={handleMontagemInicioChange}
              />
              <br /> a
              <input
                type="date"
                className="border border-black"
                value={montagemFim}
                onChange={handleMontagemFimChange}
              />
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Período</span>
            <span className="w-[50%] text-sm">
              de
              <input
                type="date"
                className="border border-black"
                value={periodoInicio}
                onChange={handlePeriodoInicioChange}
              />
              <br /> a
              <input
                type="date"
                className="border border-black"
                value={periodoFim}
                onChange={handlePeriodoFimChange}
              />
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Desmontagem</span>
            <span className="w-[50%] text-sm">
              de
              <input
                type="date"
                className="border border-black"
                value={desmontagemInicio}
                onChange={handleDesmontagemInicioChange}
              />
              <br /> a
              <input
                type="date"
                className="border border-black"
                value={desmontagemFim}
                onChange={handleDesmontagemFimChange}
              />
            </span>
          </div>
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">Descritivo</span>
          <span>Estrutura</span>
          <div className="flex flex-row justify-between w-52">
            {piso && (
              <>
                <span>Piso:</span>
                <span>{piso?.descricao}</span>
              </>
            )}
          </div>
          <div>
            <span>Parede:</span>
            <span>{parede?.descricao}</span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Valor Locação Estrutura</span>
            <input
              type="text"
              className="border border-black"
              value={valorLocacaoEstrutura}
              onChange={handleValorLocacaoEstruturaChange}
            />
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Valor Total Imobiliário</span>
            <input
              type="text"
              className="border border-black"
              value={valorTotalImobiliario}
              onChange={handleValorTotalImobiliarioChange}
            />
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Valor Comunicação visual</span>
            <input
              type="text"
              className="border border-black"
              value={valorComunicacaoVisual}
              onChange={handleValorComunicacaoVisualChange}
            />
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Valor total:</span>
            <input
              type="text"
              className="border border-black"
              value={valorTotal}
              onChange={handleValorTotalChange}
            />
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Forma pagamento</span>
            <input
              type="text"
              className="border border-black"
              value={formaPagamento}
              onChange={handleFormaPagamentoChange}
            />
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Condição Pagamento</span>
            <input
              type="text"
              className="border border-black"
              value={condicaoPagamento}
              onChange={handleCondicaoPagamentoChange}
            />
          </div>
          <Button
            type="button"
            label="gerar"
            onClick={onSubmit}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrcamentoModal;
