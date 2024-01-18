import { Stand } from "@/types/stand";
import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { Button } from ".";
import useApi from "@/hooks/useApi";
import TableInput from "./TableInput";
import { OrcamentoItem } from "./Orcamento/OrcamentoItem";
import { twMerge } from "tailwind-merge";

import { MASKS } from "@/utils/mask";

import logo from "@/assets/standLogo.png";

const CLASSE_INPUT =
  "border-[#e4e4e4] h-8 border-2 py-2 rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300";

interface TableRow {
  id: number;
  qtd: number;
  desc: string;
  customField: string;
  pos: string;
  uuid?: string;
  value: number | null;
}

interface Orcamento {
  uuid: string;
  estande: Stand;
  valorEstimadoPeloSistema: number;
  valorLocacaoEstrutura: number;
  valorComunicacaoVisual: number;
  valorTotalMobiliario: number;
  formaPagamento: string;
  condicaoPagamento: string;
  periodo: string;
  periodoMontagem: string;
  periodoDesmontagem: string;
  observacao: string;
  comunicacaoVisual: {
    uuid: string;
    descricao: string;
    quantidade: number;
    posicao: string;
    tamanho: number;
    valor: number;
    etiqueta: string;
  }[];
  mobiliario: {
    uuid: string;
    descricao: string;
    quantidade: number;
    codigo: string;
    posicao: string;
    valor: number;
    etiqueta: string;
  }[];
  iluminacao: {
    uuid: string;
    descricao: string;
    quantidade: number;
    tamanho: number;
    etiqueta: string;
  }[];
}

interface OrcamentoModal {
  onClose: () => void;
  orcamentoObject: Stand | Orcamento;
}

const OrcamentoModal = ({ orcamentoObject, onClose }: OrcamentoModal) => {
  const { clientes } = useClientesContext();
  const { eventos } = useEventosContext();
  const [disabled, setDisabled] = useState(
    !!(orcamentoObject as Orcamento).estande
  );

  const estande = (orcamentoObject as Orcamento)?.estande ?? orcamentoObject;
  const data = useMemo(() => new Date(), []);
  const {
    loading: loadingEditOrcamento,
    response: responseEditOrcamento,
    fetchData: editOrcamento,
  } = useApi({
    url: `/orcamento/${orcamentoObject?.uuid}`,
    method: "PUT",
    autoRun: false,
  });

  const {
    loading: loadingSaveOrcamento,
    response: responseSaveOrcamento,
    fetchData: saveOrcamento,
  } = useApi({
    autoRun: false,
  });

  useEffect(() => {
    if (responseSaveOrcamento || responseEditOrcamento) {
      onClose();
      (orcamentoObject as Stand)?.reload?.();
    }
  }, [responseSaveOrcamento, onClose, orcamentoObject, responseEditOrcamento]);

  const cliente = useMemo(
    () => clientes.find((cliente) => cliente.uuid === estande?.uuidCliente),
    [clientes, estande]
  );
  const evento = useMemo(
    () => eventos.find((evento) => evento.uuid === estande?.uuidEvento),
    [eventos, estande]
  );

  const [piso, setPiso] = useState<{ [key: string]: string }>({});
  const [parede, setParede] = useState<{ [key: string]: string }>({});
  const [deposito, setDeposito] = useState<{ [key: string]: string }>({});

  const [iluminacao, setIluminacao] = useState<TableRow[]>([]);
  const [comunicacaoVisual, setComunicacaoVisual] = useState<TableRow[]>([]);
  const [mobiliario, setMobiliario] = useState<TableRow[]>([]);

  const [valorLocacaoEstrutura, setValorLocacaoEstrutura] = useState<number>(
    (orcamentoObject as Orcamento)?.valorLocacaoEstrutura ?? 0
  );
  const [formaPagamento, setFormaPagamento] = useState(
    (orcamentoObject as Orcamento).formaPagamento ?? "BOLETO"
  );

  const [observacao, setObservacao] = useState(
    (orcamentoObject as Orcamento)?.observacao ?? ""
  );

  const handleValorLocacaoEstruturaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValorLocacaoEstrutura(Number(e.target.value));
  };

  const handleFormaPagamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormaPagamento(e.target.value);
  };
  const onSubmit = () => {
    console.log(mobiliario);
    const formObject = {
      uuidEstande: estande?.uuid,
      valorEstimadoPeloSistema:
        valorComunicacaoVisual + valorTotalImobiliario + valorLocacaoEstrutura,
      formaPagamento: formaPagamento,
      condicaoPagamento: "BOLETO_PARCELADO",
      comunicacaoVisual: comunicacaoVisual.map((item) => ({
        uuid: item?.uuid ?? null,
        etiqueta: item.id,
        descricao: item.desc,
        quantidade: Number(item.qtd),
        posicao: item.pos,
        tamanho: Number(item.customField),
        valor: item.value,
      })),
      mobiliario: mobiliario.map((item) => ({
        uuid: item?.uuid ?? null,
        etiqueta: item.id,
        descricao: item.desc,
        quantidade: Number(item.qtd),
        posicao: item.pos,
        codigo: item.customField,
        valor: item.value,
      })),
      iluminacao: iluminacao.map((item) => ({
        uuid: item?.uuid ?? null,
        etiqueta: item.id,
        descricao: item.desc,
        quantidade: Number(item.qtd),
        tamanho: Number(item.customField),
      })),
      parede: {
        revestimento: parede.revestimento,
        metragem: "teste metragem parede",
        tipoItemOrcamento: "PAREDE",
        descricao: "teste",
        altura: Number(parede.altura),
      },
      deposito: {
        revestimento: deposito.revestimento,
        metragem: "teste metragem deposito",
        tipoItemOrcamento: "DEPOSITO",
        descricao: "teste",
        altura: Number(deposito.altura),
      },
      piso: {
        revestimento: piso.revestimento,
        descricao: piso.corRodape,
        altura: Number(piso.altura),
        tipoItemOrcamento: "PISO",
        metragem: "teste metragem piso",
      },
      desconto: 0,
      observacao,
    };
    if ((orcamentoObject as Orcamento)?.estande) {
      editOrcamento({
        url: `/orcamento/${(orcamentoObject as Orcamento)?.uuid}`,
        method: "PUT",
        data: formObject,
      });
    } else {
      saveOrcamento({
        url: "/orcamento",
        method: "POST",
        data: formObject,
      });
    }
  };

  const valorComunicacaoVisual = useMemo(() => {
    return comunicacaoVisual.reduce((acc, curr) => {
      return acc + Number(curr.value);
    }, 0);
  }, [comunicacaoVisual]);

  const valorTotalImobiliario = useMemo(() => {
    return mobiliario.reduce((acc, curr) => {
      return acc + Number(curr.value);
    }, 0);
  }, [mobiliario]);
  console.log(orcamentoObject);
  useEffect(() => {
    if (disabled) {
      setIluminacao(
        (orcamentoObject as Orcamento).iluminacao.map((item) => ({
          uuid: item.uuid ?? null,
          id: Number(item.etiqueta),
          qtd: item.quantidade,
          desc: item.descricao,
          customField: String(item.quantidade),
          pos: "teste",
          value: 0,
        }))
      );
      setComunicacaoVisual(
        (orcamentoObject as Orcamento).comunicacaoVisual.map((item) => ({
          uuid: item.uuid ?? null,
          id: Number(item.etiqueta),
          qtd: item.quantidade,
          desc: item.descricao,
          customField: String(item.tamanho),
          pos: item.posicao,
          value: item.valor,
        }))
      );
      setMobiliario(
        (orcamentoObject as Orcamento).mobiliario.map((item) => ({
          uuid: item.uuid ?? null,
          id: Number(item.etiqueta),
          qtd: item.quantidade,
          desc: item.descricao,
          customField: item.codigo,
          pos: item.posicao,
          value: item.valor,
        }))
      );
    }
  }, [orcamentoObject, disabled]);

  return (
    <Modal
      isOpen={!!orcamentoObject}
      onClose={onClose}
      className="max-w-[800px]"
    >
      <div className="mb-10">
        <img src={logo} alt="logo" className="w-1/4" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <span>Fortaleza, {data.toLocaleDateString()}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <span>Empresa: {cliente?.nomeEmpresarial}</span>
          </div>
          <div className="flex flex-row gap-3">
            <span>
              Fone: {MASKS.telefone.mask(cliente?.telefone as string)}
            </span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Evento: {evento?.nome}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Local: {evento?.outro}</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Tamanho: {estande?.dimensao.area}m²</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Periodo evento: 12/12/2024 à 13/12/2024</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Periodo montagem: 12/12/2024 à 13/12/2024</span>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <span>Periodo desmontagem: 12/12/2024 à 13/12/2024</span>
          </div>
        </div>
        <div className="flex flex-row">
          Atendendo sua solicitação, segue abaixo, orçamento para Locação de
          Material e Montagem de seu estande, conforme descriminado:
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">Descritivo</span>
          <div className="flex flex-col">
            <span className="mx-4">Estrutura</span>
            <OrcamentoItem
              disabled={disabled}
              estande={estande}
              item={orcamentoObject?.piso}
              setItem={setPiso}
              title="Piso"
            />
            <OrcamentoItem
              disabled={disabled}
              estande={estande}
              setItem={setParede}
              item={orcamentoObject?.parede}
              title="Parede"
            />
            <OrcamentoItem
              disabled={disabled}
              estande={estande}
              item={orcamentoObject?.deposito}
              setItem={setDeposito}
              title="Depósito"
            />
          </div>
          <TableInput
            disabled={disabled}
            title={"Iluminação"}
            custom="Tamanho"
            rows={iluminacao}
            setRows={setIluminacao}
          />
          <TableInput
            disabled={disabled}
            title={"Comunicação visual"}
            custom="Tamanho"
            rows={comunicacaoVisual}
            setRows={setComunicacaoVisual}
          />
          <TableInput
            disabled={disabled}
            title={"Mobiliário"}
            custom="Código"
            rows={mobiliario}
            setRows={setMobiliario}
          />
          <div className="flex flex-col w-3/4 px-4">
            <span>Observações</span>
            <textarea
              disabled={disabled}
              className={twMerge(CLASSE_INPUT, "h-36")}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col gap-3 mx-4">
            <div className="flex flex-row justify-between gap-3 py-4 mx-2 border-b border-black">
              <span>Serviço</span>
              {/* <span>Valor Sugerido</span> */}
              <span>Valor definitivo</span>
            </div>
            <div className="flex flex-row justify-between gap-3 mx-2">
              <span>Locação Estrutura</span>
              <div className="flex flex-row items-center gap-4 text-sm text-zinc-600">
                <span>R$ 500.000,00</span>
                <input
                  disabled={disabled}
                  placeholder="R$ 000.000,00"
                  type="text"
                  className={twMerge(CLASSE_INPUT, "w-32")}
                  value={valorLocacaoEstrutura}
                  onChange={handleValorLocacaoEstruturaChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between gap-3 mx-2">
              <span>Imobiliário</span>
              <div className="flex flex-row items-center gap-4 text-sm text-zinc-600">
                R$ {valorTotalImobiliario}
              </div>
            </div>
            <div className="flex flex-row justify-between gap-3 mx-2 border-b border-black">
              <span>Comunicação visual</span>

              <div className="flex flex-row items-center gap-4 text-sm text-zinc-600">
                <span>R$ {valorComunicacaoVisual}</span>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-3 mx-2 ">
              <span>Total:</span>
              <div className="flex flex-row items-center gap-4 text-sm text-zinc-600">
                <span>
                  R${" "}
                  {valorComunicacaoVisual +
                    valorTotalImobiliario +
                    valorLocacaoEstrutura}
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <span>Forma pagamento</span>
              <select
                disabled={disabled}
                className="border-[#e4e4e4] border-2 py-2  rounded-lg bg-neutral-04 placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-md disabled:bg-zinc-300"
                value={formaPagamento}
                onChange={handleFormaPagamentoChange}
              >
                <option value="BOLETO">Boleto</option>
                <option value="PIX">Pix</option>
              </select>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <span>Condição Pagamento</span>
              <span>50% a vista e 50% na entrega do estande</span>
            </div>
          </div>
          {!(orcamentoObject as Orcamento)?.estande ? (
            <Button
              type="button"
              label="gerar"
              className="mx-4 my-4"
              onClick={onSubmit}
              loading={loadingSaveOrcamento}
              disabled={
                valorComunicacaoVisual === 0 ||
                valorLocacaoEstrutura === 0 ||
                valorTotalImobiliario === 0 ||
                !formaPagamento ||
                !piso ||
                !parede ||
                !deposito ||
                !iluminacao ||
                !comunicacaoVisual
              }
            />
          ) : (
            <Button
              loading={loadingEditOrcamento}
              label={disabled ? "Editar" : "Salvar"}
              type="button"
              onClick={disabled ? () => setDisabled(false) : onSubmit}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrcamentoModal;
