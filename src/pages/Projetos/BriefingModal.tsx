import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import Modal from "@/components/Modal";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { useBriefing } from "@/hooks/useBriefing";
import { ApiComponent, Button, Input } from "@/components";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { Evento } from "@/types/evento";
import { InputHandle } from "@/components/Input";
import { deleteProjetosUrl, getProjetosUrl } from "@/utils/url";
import useApi from "@/hooks/useApi";

import vendedoraimg from "@/assets/vendedora.png";
import { Stand } from "@/types/stand";

interface BriefingModalProps {
  evento: Evento;
  isOpen?: boolean;
  currentBriefing?: Stand;
  readMode?: boolean;
  onClose: () => void;
}

const FORMAS = {
  BOX: "box",
  ILHA: "ilha",
  "PONTA DE ILHA": "ponta",
  ESQUINA: "esquina",
  TÚNEL: "tunel",
};

export const BriefingModal = ({
  currentBriefing,
  evento,
  isOpen,
  onClose,
  readMode,
}: BriefingModalProps) => {
  const [standInfo, setStandInfo] = useState<{ [key: string]: unknown }>({});
  const briefing = useBriefing();
  const { usuarioAtual, usuarios } = useUsuariosContext();
  const [currentStep, setCurrentStep] = useState(0);
  const { clientes } = useClientesContext();

  const {
    loading,
    error: errorPostProjeto,
    response: responsePostProjeto,
    fetchData: createProjeto,
  } = useApi({
    autoRun: false,
  });

  const lateralRef = useRef<InputHandle>(null);
  const frenteRef = useRef<InputHandle>(null);
  const peDireitoRef = useRef<InputHandle>(null);
  const areaRef = useRef<InputHandle>(null);

  const handleOnChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStandInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSelect = (props: {
    label?: string | undefined;
    value?: string | undefined;
    attribute: string;
  }) => {
    setStandInfo((prevState) => ({
      ...prevState,
      [props.attribute]: props.value,
    }));
  };

  const handleChangeLateralFrente = () => {
    const lateral = lateralRef.current?.getUnmaskedValue();
    const frente = frenteRef.current?.getUnmaskedValue();
    areaRef.current?.setValue((Number(lateral) * Number(frente)).toString());
  };

  const usuarioComercial = useMemo(() => {
    return usuarios?.find(
      (usuario) => usuario.uuid === evento?.uuidUsuarioComercial
    );
  }, [usuarios, evento]);

  const clientesOptions = useMemo(() => {
    return clientes?.map((cliente) => ({
      value: cliente.uuid,
      label: cliente.cnpj + " - " + cliente.nomeEmpresarial,
    }));
  }, [clientes]);

  const handleSubmit = () => {
    console.log(currentBriefing);
    createProjeto({
      method: currentBriefing ? "PUT" : "POST",
      url: currentBriefing
        ? deleteProjetosUrl(currentBriefing?.uuid)
        : "/estande",
      data: {
        dimensao: {
          tipoDimensao: {
            uuid: standInfo.tipoDimensao,
          },
          area: areaRef.current?.getUnmaskedValue(),
          frente: frenteRef.current?.getUnmaskedValue(),
          lateral: lateralRef.current?.getUnmaskedValue(),
          peDireito: peDireitoRef.current?.getUnmaskedValue(),
        },
        formaConstrutiva: {
          tipoForma: {
            uuid: standInfo.forma,
          },
        },
        piso:
          standInfo.tipoPiso !== "elevado"
            ? null
            : {
                tipoPiso: {
                  uuid: standInfo.piso,
                },
              },
        parede: {
          tipoParede: {
            uuid: standInfo.parede,
          },
        },
        ambientes: [
          {
            tipoAmbiente: {
              uuid: standInfo.ambiente,
            },
          },
        ],
        uuidCliente: standInfo.cliente,
        uuidEvento: standInfo.evento,
      },
    });
  };

  useEffect(() => {
    setStandInfo({
      ambiente:
        currentBriefing?.ambientes?.[0].uuid ?? briefing.ambiente?.[0]?.uuid,
      tipoDimensao:
        currentBriefing?.dimensao.tipoDimensao.uuid ??
        briefing.dimensao?.[0]?.uuid,
      forma:
        currentBriefing?.formaConstrutiva.tipoForma.uuid ??
        briefing.forma?.[0]?.uuid,
      parede:
        currentBriefing?.parede.tipoParede.uuid ?? briefing.parede?.[0]?.uuid,
      piso: currentBriefing?.piso?.tipoPiso?.uuid ?? briefing.piso?.[0]?.uuid,
      evento: currentBriefing?.uuidEvento ?? evento?.uuid,
      cliente: currentBriefing?.uuidCliente ?? clientes?.[0]?.uuid,
    });
  }, [briefing, evento, clientes, currentBriefing]);

  useEffect(() => {
    if (responsePostProjeto) {
      onClose();
      toast("Projeto criado com sucesso!");
    }
  }, [responsePostProjeto, onClose]);

  return (
    <Modal
      isOpen={isOpen || !!currentBriefing}
      onClose={onClose}
      className="sm:w-[700px]"
    >
      <ApiComponent loading={briefing.loading} error={briefing.error[0]}>
        <div className="flex flex-col w-full gap-8 px-2 py-8">
          <div className="flex flex-row w-full ">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-neutral-01">Briefing</h2>
              <span>Insira as informações de briefing</span>
            </div>
            {usuarioAtual?.roleDto.descricaoRole !== "COMERCIAL" && (
              <div className="flex flex-row items-center justify-end w-full gap-5">
                <div className="flex flex-col items-end justify-end w-full">
                  <span>
                    <b>Vendedor:</b> {usuarioComercial?.nome}
                  </span>
                  <span>
                    <b>Contato:</b> {usuarioComercial?.email}
                  </span>
                </div>
                <img src={vendedoraimg} className="w-44" />
              </div>
            )}
          </div>
          {/* STEP ONE */}
          <div
            className={`flex flex-col gap-2 ${
              currentStep === 0 ? "" : "hidden"
            }`}
          >
            {usuarioAtual?.roleDto.descricaoRole !== "CLIENTE" && (
              <div className="flex flex-col">
                <h3>Cliente</h3>
                <ReactSelect
                  options={clientesOptions}
                  defaultValue={
                    clientesOptions.find(
                      (cliente) =>
                        cliente.value === currentBriefing?.uuidCliente
                    ) ?? clientesOptions?.[0]
                  }
                  onChange={(props) =>
                    handleChangeSelect({ ...props, attribute: "cliente" })
                  }
                  isDisabled={readMode} // Disable if readMode is true
                />
              </div>
            )}
            <div className="flex flex-col">
              <h3>Tipo do stand</h3>
              <select
                name="forma"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleOnChange}
                disabled={readMode} // Disable if readMode is true
              >
                <option disabled selected>
                  Selecionar...
                </option>
                {briefing.forma?.map((forma) => {
                  return (
                    <option
                      key={forma.uuid}
                      value={forma.uuid}
                      selected={
                        currentBriefing?.formaConstrutiva.tipoForma.uuid ===
                        forma.uuid
                      }
                    >
                      {forma.descricao}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col w-full gap-2">
              <h2>Forma do stand</h2>
              <div className="flex flex-row flex-wrap items-start justify-center gap-2">
                {briefing.dimensao?.map((dimensao, index) => (
                  <div
                    key={dimensao.uuid}
                    className={`flex flex-col items-center w-24 gap-2 ${
                      index === 0 ? "order-5" : ""
                    } `}
                  >
                    <label htmlFor={dimensao.descricao} className="text-center">
                      <div
                        className={`stand-icon ${
                          //@ts-expect-error pq sim
                          FORMAS[dimensao.descricao]
                        } `}
                      />
                    </label>
                    <input
                      defaultChecked={
                        currentBriefing
                          ? currentBriefing.dimensao.tipoDimensao.uuid ===
                            dimensao.uuid
                          : index === 1
                      }
                      type="radio"
                      name="tipoDimensao"
                      value={dimensao.uuid}
                      id={dimensao.descricao}
                      onChange={handleOnChange}
                      className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                      disabled={readMode} // Disable if readMode is true
                    />
                    <label htmlFor={dimensao.descricao} className="text-center">
                      {dimensao.descricao}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* STEP TWO */}
          <div
            className={`flex flex-col gap-2 ${
              currentStep === 1 ? "" : "hidden"
            }`}
          >
            <div className="flex flex-row gap-6">
              <Input
                label="Lateral"
                valor={currentBriefing?.dimensao.lateral}
                ref={lateralRef}
                name="lateral"
                onChange={handleChangeLateralFrente}
                type="number"
                disabled={readMode} // Disable if readMode is true
              />
              <Input
                label="Frente"
                valor={currentBriefing?.dimensao.frente}
                ref={frenteRef}
                onChange={handleChangeLateralFrente}
                name="frente"
                type="number"
                disabled={readMode} // Disable if readMode is true
              />
            </div>
            <div className="flex flex-row gap-6">
              <Input
                label="Pé Direito"
                valor={currentBriefing?.dimensao.peDireito}
                ref={peDireitoRef}
                name="pedireito"
                type="number"
                disabled={readMode} // Disable if readMode is true
              />
              <Input
                label="Área"
                name="area"
                valor={currentBriefing?.dimensao.area}
                ref={areaRef}
                disabled
                type="number"
              />
            </div>
          </div>
          {/* STEP THREE */}
          <div
            className={`flex flex-col gap-4 ${
              currentStep === 2 ? "" : "hidden"
            }`}
          >
            <div className="flex flex-col gap-1">
              <h3>Tipo de piso</h3>
              <div className="flex flex-row gap-4">
                <span className="flex flex-row gap-1">
                  <input
                    type="radio"
                    onChange={handleOnChange}
                    id="local"
                    name="piso"
                    value="local"
                    disabled={readMode} // Disable if readMode is true
                  />{" "}
                  <label htmlFor="local">Piso Local</label>
                </span>
                <span className="flex flex-row gap-1">
                  <input
                    type="radio"
                    onChange={handleOnChange}
                    id="elevado"
                    name="piso"
                    value="elevado"
                    disabled={readMode} // Disable if readMode is true
                  />{" "}
                  <label htmlFor="elevado">Piso Elevado</label>
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-6">
              <div className="w-full">
                <h2>Piso</h2>
                <select
                  name="piso"
                  onChange={handleOnChange}
                  disabled={standInfo.piso !== "elevado" || readMode} // Disable if readMode is true or standInfo.piso is not "elevado"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {briefing?.piso?.map((piso) => (
                    <option
                      key={piso.uuid}
                      value={piso.uuid}
                      selected={
                        currentBriefing?.piso?.tipoPiso?.uuid === piso.uuid
                      }
                    >
                      {piso.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <h2>Parede</h2>
                <select
                  name="parede"
                  onChange={handleOnChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={readMode} // Disable if readMode is true
                >
                  {briefing.parede?.map((parede) => (
                    <option
                      key={parede.uuid}
                      value={parede.uuid}
                      selected={
                        currentBriefing?.parede.tipoParede.uuid === parede.uuid
                      }
                    >
                      {parede.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2>Ambiente</h2>
              <div className="flex flex-row gap-4 p-3 rounded-md bg-neutral-04">
                {briefing.ambiente?.map((ambiente) => (
                  <div
                    key={ambiente.uuid}
                    className="flex flex-row flex-wrap items-center justify-center gap-2"
                  >
                    <input
                      type="checkbox"
                      name="ambiente"
                      onChange={handleOnChange}
                      value={ambiente.uuid}
                      checked={currentBriefing?.ambientes?.some(
                        (amb) => amb.tipoAmbiente.uuid === ambiente.uuid
                      )}
                      className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                      disabled={readMode} // Disable if readMode is true
                    />
                    <label>{ambiente.descricao}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end w-full gap-3 ">
            {currentStep !== 0 && (
              <Button
                type="submit"
                label="Anterior"
                className="bg-neutral-03 text-neutral-02"
                onClick={() => setCurrentStep((prevState) => prevState - 1)}
              />
            )}
            <Button
              type="submit"
              label={currentStep !== 2 ? "Próximo" : "Criar"}
              loading={loading}
              onClick={
                currentStep === 2
                  ? handleSubmit
                  : () => setCurrentStep((prevState) => prevState + 1)
              }
            />
          </div>
          <span className="h-3 text-xs text-center text-error w-72">
            {errorPostProjeto &&
              "Erro ao criar evento, tente novamente mais tarde!"}
          </span>
          <div className="flex flex-row justify-center w-full gap-3">
            {Array.from(Array(3).keys()).map((_, index) => (
              <i
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index === currentStep ? "bg-primary-02" : "bg-neutral-03"
                }`}
              />
            ))}
          </div>
        </div>
      </ApiComponent>
    </Modal>
  );
};
