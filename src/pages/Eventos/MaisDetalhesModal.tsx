import Modal from "@/components/Modal";
import { Evento } from "@/types/evento";
import { useMemo } from "react";
import { Buffer } from "buffer";
import {
  LuStore,
  LuCalendar,
  LuMap,
  LuMapPin,
  LuBuilding2,
  LuPersonStanding,
  LuPhone,
  LuMail,
} from "react-icons/lu";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import vendedoraimg from "@/assets/vendedora.png";

interface MaisDetalhesModalProps {
  evento: Evento | null;
  isOpen: boolean;
  onClose: () => void;
}

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-sm font-light text-[#919191]">{children}</h1>
);

const Content = ({ children }: { children: React.ReactNode }) => (
  <span className="flex flex-row items-center gap-1">{children}</span>
);

export const MaisDetalhesModal = ({
  evento,
  isOpen,
  onClose,
}: MaisDetalhesModalProps) => {
  const { usuarios } = useUsuariosContext() || {};

  const imagem = useMemo(() => {
    if (evento?.imagem) {
      const base64ImageString = Buffer.from(evento.imagem, "binary").toString(
        "base64"
      );
      return "data:image/png;base64," + base64ImageString;
    }
    return "https://placehold.co/350x150";
  }, [evento]);

  const usuarioComercial = useMemo(() => {
    return usuarios?.find(
      (usuario) => usuario.uuid === evento?.uuidUsuarioComercial
    );
  }, [usuarios, evento]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:w-fit">
      <div className="flex flex-row w-full"></div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row w-full">
          <h2 className="text-lg font-bold text-neutral-01">
            Mais informações do evento
          </h2>
        </div>
        <img src={imagem} className="max-h-[300px]" />

        <div className="flex flex-row gap-3">
          <div>
            <div className="flex flex-col">
              <Title>Evento</Title>
              <Content>
                <LuStore />
                {evento?.nome}
              </Content>
            </div>
            <div className="flex flex-row gap-12">
              <div className="flex flex-col">
                <Title>Data Inicial</Title>
                <Content>
                  <LuCalendar />
                  {new Date(
                    evento?.dataHoraInicioFormatada as string
                  ).toLocaleDateString()}
                </Content>
              </div>
              <div className="flex flex-col">
                <Title>Data de encerramento</Title>
                <Content>
                  <LuCalendar />
                  {new Date(
                    evento?.dataHoraFimFormatada as string
                  ).toLocaleDateString()}
                </Content>
              </div>
            </div>
            <div className="flex flex-col">
              <Title>Local</Title>
              <Content>
                <LuMap />
                {evento?.outro}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>Bairro</Title>
              <Content>
                <LuMapPin />
                {evento?.bairro}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>Endereco</Title>
              <Content>
                <LuMapPin />
                {evento?.endereco}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>Organizador</Title>
              <Content>
                <LuBuilding2 />
                {evento?.organizador.nome}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>Responsável</Title>
              <Content>
                <LuPersonStanding />
                {evento?.organizador.responsavel}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>E-mail</Title>
              <Content>
                <LuMail />
                {evento?.organizador.email}
              </Content>
            </div>
            <div className="flex flex-col">
              <Title>Telefone</Title>
              <Content>
                <LuPhone />
                {evento?.organizador.telefone}
              </Content>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 py-12">
            <img src={vendedoraimg} className="w-48" />
            <div className="flex flex-col items-center">
              <span>
                <b>Vendedor:</b> {usuarioComercial?.nome}
              </span>
              <span>
                <b>Contato:</b> {usuarioComercial?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
