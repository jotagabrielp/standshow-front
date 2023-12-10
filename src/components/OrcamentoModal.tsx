import { Stand } from "@/types/stand";
import Modal from "./Modal";
import { useMemo } from "react";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useEventosContext } from "@/context/eventos/useEventosContext";

interface OrcamentoModal {
  onClose: () => void;
  stand: Stand;
}

const OrcamentoModal = ({ stand, onClose }: OrcamentoModal) => {
  const { clientes } = useClientesContext();
  const { eventos } = useEventosContext();
  const data = useMemo(() => new Date(), []);
  const cliente = useMemo(
    () => clientes.find((cliente) => cliente.uuid === stand?.uuidCliente),
    [clientes, stand]
  );
  const evento = useMemo(
    () => eventos.find((evento) => evento.uuid === stand?.uuidEvento),
    [eventos, stand]
  );
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
        <div className="flex flex-row flex-wrap">
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
            <span>Cargo</span>
            <span className="w-[50%] text-sm border border-black">???</span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Responsável</span>
            <span className="w-[50%] text-sm border border-black">
              {evento?.organizador.nome}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Tamanho</span>
            <span className="w-[50%] text-sm border border-black">
              {stand?.dimensao.area}m²
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Stand</span>
            <span className="w-[50%] text-sm border border-black">????</span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Montagem</span>
            <span className="w-[50%] text-sm border border-black">
              {new Date(
                evento?.dataHoraInicioFormatada as string
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Período</span>
            <span className="w-[50%] text-sm border border-black">
              {new Date(
                evento?.dataHoraInicioFormatada as string
              ).toLocaleDateString()}{" "}
              a{" "}
              {new Date(
                evento?.dataHoraFimFormatada as string
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-row justify-between w-1/2 gap-3">
            <span>Desmontagem</span>
            <span className="w-[50%] text-sm border border-black">
              {new Date(
                evento?.dataHoraFimFormatada as string
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">Descritivo</span>
          <p>
            Contratação de empresa especializada na prestação de serviço de
            locação, montagem e desmontagem de estandes e cenografia para a
            realização do XXII Congresso Farmacêutico de São Paulo - XIV
            Seminário Internacional de Ciências Farmacêuticas - EXPOFAR 2023,
            promovidos pelo Conselho Regional de Farmácia do Estado de São Paulo
            – CRF-SP <br></br>Valor: R$ 173.500,00
          </p>
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">FATURAMENTO</span>
          <ol className="list-[upper-alpha]">
            <li>
              As notas fiscais poderão ser emitidas por qualquer empresa do
              Grupo (2LA EVENTOS LTDA - ME E IMPRESSIONE COMUNICAÇÃO VISUAL
              EIRELI-EPP), de acordo com os serviços prestados e/ou materiais
              fornecidos.
            </li>
          </ol>
        </div>
        <div className="flex flex-col border border-black">
          <span className="self-center font-bold">OBSERVAÇÕES</span>
          <ol className="list-[upper-alpha]">
            <li>
              IMAGENS A TITULO DE ILUSTRAÇÃO (A STAND SHOW NÃO FORNECE E NEM SE
              RESPONSABILIZA PELA CRIAÇÃO E FORNECIMENTO DAS ARTES). As imagens
              / logos serão fornecidas pelo cliente e enviadas através de link
              para STAND SHOW em tempo hábil e com boa resolução para confecção
              das mesmas;
              <br />
              <span className="text-red-500">
                Prazo para recebimento das logos/imagens (INSERIR A DATA
                CONFORME CADA EVENTO – 10 DIAS ANTES DO INÍCIO DA MONTAGEM OU 20
                DIAS ANTES DO CARREGO DO CAMINHÃO).
              </span>
            </li>
            <li>
              Todas as artes e/ou logos deverão obedecer rigorosamente aos
              prazos de recebimento solicitados pelo atendimento da STAND SHOW.
              Caso os prazos não sejam cumpridos, a STAND SHOW não se
              responsabilizará pelo serviço e não concederá desconto no valor da
              proposta.
            </li>
            <li>
              O locatário deverá devolver os objetos no mesmo estado de
              conservação em que os recebeu.
            </li>
            <li>
              O locatário é responsável pelas perdas e danos provocados nos
              objetos, inclusive aqueles causados por culpa ou dolo, imperícia,
              negligência e imprudência, quer seja pelo locatário, seus
              prepostos, empregados, convidados ou visitantes da Feira ou
              Evento.
            </li>
            <li>
              Caso sejam verificados danos, inutilização, ainda que parcial dos
              objetos, serão estes imediatamente indenizados pelo locatário com
              base no preço de mercado da data da ocorrência, ficando autorizada
              a locadora a emitir cobrança do valor da indenização.
            </li>
            <li>
              No ato do recebimento deverá estar presente um representante do
              locatário para vistoriar o bom estado dos móveis. Não serão
              aceitas reclamações posteriores de avaria caso não tenha sido
              constatado nada no recebimento da mercadoria.
            </li>
            <li>
              MANUTENÇÃO – Manteremos pessoal qualificado durante a realização
              do evento;
            </li>
            <li>
              EXPOSITOR – Será de responsabilidade da CONTRATANTE o pagamento
              das taxas de energia, taxas de limpeza cobrada pela organizadora e
              limpeza do stand durante o evento, além de outras taxas cobradas
              pela promotora do evento;
            </li>
            <li>
              ORGANIZADORA – Será de responsabilidade da CONTRATANTE o pagamento
              das taxas de Bombeiros; Geradores; Ponto de Energia; Vistoria do
              Pavilhão; Limpeza Geral do Evento além de outras taxas adicionais
              extras;
            </li>
            <li>Todo material fornecido será em regime de aluguel.</li>
            <li>
              Valores para condições e prazos apresentados nesta proposta.
            </li>
            <li>Qualquer alteração ficará sujeita a adicionais extras.</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};

export default OrcamentoModal;
