import { useEventosContext } from "@/context/eventos/useEventosContext";
import ReactSelect from "react-select";
import Modal from "../Modal";
import { Button, Input } from "..";
import { useEffect, useMemo, useRef, useState } from "react";
import useApi from "@/hooks/useApi";
import { InputHandle } from "../Input";
import { MASKS } from "@/utils/mask";
import { Cnpj } from "@/types/cnpj";
import toast from "react-hot-toast";
import { useClientesContext } from "@/context/cliente/useClientesContext";

interface CadastrarClienteModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CadastrarClienteModal = ({
  onClose,
  isOpen,
}: CadastrarClienteModalProps) => {
  const { eventos } = useEventosContext();
  const { fetchData: reload } = useClientesContext();
  const [selectedEvent, setSelectedEvent] = useState<string>();

  const cnpjRef = useRef<InputHandle>(null);

  const { loading, fetchData, response } = useApi<Cnpj>({
    url: `/solicitacao-cliente`,
    method: "POST",
    autoRun: false,
  });

  const {
    loading: loadingVincular,
    fetchData: vincular,
    status: responseVincular,
  } = useApi<Cnpj>({
    method: "POST",
    autoRun: false,
  });

  const onSubmit = () => {
    if (cnpjRef.current?.getUnmaskedValue()) {
      fetchData({
        data: {
          cnpj: cnpjRef.current?.getUnmaskedValue(),
          detalhe: "teste",
          telefone: "85996447328",
        },
      });
    }
  };

  const eventosOptions = useMemo(() => {
    return eventos?.map((evento) => ({
      value: evento.uuid,
      label: evento.nome,
    }));
  }, [eventos]);

  const onVincular = () => {
    vincular({
      url: `/evento/${selectedEvent}/vincular-cliente/${response?.uuid}`,
    });
  };

  useEffect(() => {
    if (responseVincular) {
      toast("Cliente cadastrado com sucesso!");
      reload();
      onClose();
    }
  }, [responseVincular, onClose, reload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:w-fit">
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-neutral-01">
            Cadastrar cliente
          </h2>
          <span>Insira as informações do cliente</span>
        </div>
        {response ? (
          <>
            <div className="flex flex-col">
              <h3>Evento</h3>
              <ReactSelect
                options={eventosOptions}
                onChange={(props) => {
                  setSelectedEvent(props!.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <span>
                <b>CNPJ</b>: {MASKS.cnpj.mask(response.cnpj)}
              </span>
              <span>
                <b>Nome fantasia</b>: {response.nomeFantasia}
              </span>
              <span>
                <b>Nome empresarial</b>: {response.nomeEmpresarial}
              </span>
              <span>
                <b>CEP</b>: {MASKS.cep.mask(response.cep)}
              </span>
              <span>
                <b>Endereço</b>: {response.logradouro}, {response.numero}
              </span>
              <span>
                <b>Bairro</b>: {response.bairro}
              </span>
              <span>
                <b>Município</b>: {response.municipio}
              </span>
              <span>
                <b>UF</b>: {response.uf}
              </span>
              <span>
                <b>Telefone</b>:{" "}
                {MASKS.telefone.mask(response.telefoneComercial)}
              </span>
            </div>
          </>
        ) : (
          <Input
            name="cnpj"
            label="CNPJ"
            mask="cnpj"
            placeholder="Ex.: 00.000.000/0000-00"
            ref={cnpjRef}
          />
        )}
        <div className="flex items-center justify-center">
          <Button
            type="button"
            label={`${response ? "Vincular ao evento" : "Cadastrar cliente"} `}
            onClick={response ? onVincular : onSubmit}
            loading={loadingVincular || loading}
          />
        </div>
      </div>
    </Modal>
  );
};
