import { useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { validateCep } from "validations-br";
import { date, object, string } from "yup";
import FormData from "form-data";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button, Input } from "@/components";
import { InputHandle } from "@/components/Input";
import Modal from "@/components/Modal";
import useApi from "@/hooks/useApi";
import { useCEP } from "@/hooks/useCEP";
import { cep } from "@/types/cep";
import { Evento } from "@/types/evento";
import { getEventosUrl, getImagemUrl } from "@/utils/url";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { formatApiFriendlyDate } from "@/utils/date";
import { useEventosContext } from "@/context/eventos/useEventosContext";

const eventoFormSchema = object().shape({
  nome: string()
    .required("Insira o nome do evento")
    .min(3, "Nome de evento inválido"),
  dataInicio: date().required("Insira uma data"),
  dataFim: date().required("Insira uma data"),
  local: string().required("Insira o nome do local"),
});

const cepSchema = object().shape({
  cep: string()
    .required("Insira o cep do evento")
    .test("cep", "Cep inválido", (cep) => validateCep(cep)),
});

const organizadorSchema = object().shape({
  organizador: string()
    .required("Insira o nome do organizador do evento")
    .min(5, "Nome de organizador inválido"),
  responsavel: string()
    .required("Insira o nome de um responsável")
    .min(5, "Nome de responsável inválido"),
  telefone: string()
    .required("Insira um telefone de contato")
    .min(5, "Telefone inválido"),
  email: string()
    .required("Insira um e-mail de contato")
    .min(5, "E-mail inválido"),
});

export const EventosModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const { usuarioAtual } = useUsuariosContext() || {};

  const { fetchData: getEventos } = useEventosContext() || {};

  const { loading, fetchData, response } = useApi({
    method: "POST",
    autoRun: false,
  });

  const {
    fetchData: postEvento,
    response: responsePostEvento,
    loading: loadingPostEvento,
  } = useApi<Evento>({
    url: getEventosUrl(),
    autoRun: false,
    method: "POST",
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [image, setImage] = useState<Blob>();
  const [preview, setPreview] = useState<string>();

  const nomeRef = useRef<InputHandle>(null);
  const localRef = useRef<InputHandle>(null);
  const dataInicioRef = useRef<InputHandle>(null);
  const dataFimRef = useRef<InputHandle>(null);

  const cepRef = useRef<InputHandle>(null);
  const enderecoRef = useRef<InputHandle>(null);
  const bairroRef = useRef<InputHandle>(null);
  const estadoRef = useRef<InputHandle>(null);
  const cidadeRef = useRef<InputHandle>(null);

  const organizadorRef = useRef<InputHandle>(null);
  const responsavelRef = useRef<InputHandle>(null);
  const telefoneRef = useRef<InputHandle>(null);
  const emailRef = useRef<InputHandle>(null);

  const { getCEP, CEP } = useCEP<cep>();

  const cepInputOnBlur = () => {
    const cep = cepRef.current?.getUnmaskedValue();
    if (validateCep(cep as string)) {
      getCEP(cep as string);
    }
  };

  const getUserid = () => usuarioAtual?.uuid;
  const handleSubmit = () => {
    const eventoForm = {
      nome: nomeRef.current?.getUnmaskedValue(),
      local: localRef.current?.getUnmaskedValue(),
      dataInicio: dataInicioRef.current?.getUnmaskedValue(),
      dataFim: dataFimRef.current?.getUnmaskedValue(),
    };
    const cepForm = {
      cep: cepRef.current?.getUnmaskedValue(),
      endereco: enderecoRef.current?.getUnmaskedValue(),
      bairro: bairroRef.current?.getUnmaskedValue(),
      estado: estadoRef.current?.getUnmaskedValue(),
      cidade: cidadeRef.current?.getUnmaskedValue(),
    };
    const organizadorForm = {
      organizador: organizadorRef.current?.getUnmaskedValue(),
      responsavel: responsavelRef.current?.getUnmaskedValue(),
      telefone: telefoneRef.current?.getUnmaskedValue(),
      email: emailRef.current?.getUnmaskedValue(),
    };
    eventoFormSchema.validate(eventoForm).then(() => {
      cepSchema.validate(cepForm).then(() => {
        organizadorSchema.validate(organizadorForm).then(() => {
          if (image) {
            const form = {
              nome: eventoForm.nome,
              dataHoraInicioFormatada: formatApiFriendlyDate(
                new Date(eventoForm.dataInicio as string)
              ),
              dataHoraFimFormatada: formatApiFriendlyDate(
                new Date(eventoForm.dataFim as string)
              ),
              outro: eventoForm.local,
              cep: cepForm.cep,
              municipio: cepForm.cidade,
              uf: cepForm.estado,
              endereco: cepForm.endereco,
              uuidUsuarioComercial: getUserid(),
              organizador: {
                nome: organizadorForm.organizador,
                responsavel: organizadorForm.responsavel,
                telefone: organizadorForm.telefone,
                email: organizadorForm.email,
              },
            };
            postEvento({
              data: form,
            });
          }
        });
      });
    });
  };

  useEffect(() => {
    if (image) {
      setPreview(image ? URL.createObjectURL(image) : undefined);
    }
  }, [image]);

  useEffect(() => {
    if (responsePostEvento?.uuid && image) {
      const formData = new FormData();
      formData.append("imagem", image as Blob);
      fetchData({
        data: formData,
        url: getImagemUrl("EVENTO", responsePostEvento?.uuid as string),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  }, [responsePostEvento, image, fetchData]);

  useEffect(() => {
    const timeout = () =>
      setTimeout(() => {
        if (response && isOpen) {
          toast("Evento criado com sucesso!");
          getEventos?.();
          onClose();
        }
      }, 1000);
    timeout();
  }, [response, navigate, onClose, getEventos, isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px]">
      <div className="flex flex-col gap-6 mt-3">
        <div className="flex flex-col items-center justify-between w-full gap-8 sm:gap-0 sm:flex-row">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Adicionar um novo evento</h2>
            <h4 className="text-md text-neutral-02">
              Insira informações do evento
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="imagem"
              className="flex items-center justify-center w-full h-full cursor-pointer"
            >
              {preview ? (
                <img src={preview} className="object-cover h-auto w-44" />
              ) : (
                <div className="flex items-center justify-center w-24 h-24 text-white rounded-md cursor-pointer bg-primary-01">
                  <AiOutlineCamera size={25} />
                </div>
              )}
            </label>
            <input
              onChange={(e) => {
                setImage(e.target.files?.[0]);
              }}
              type="file"
              id="imagem"
            />
            <label
              htmlFor="imagem"
              className="text-xs font-medium text-center whitespace-pre-wrap"
            >
              Insira uma imagem
            </label>
          </div>
        </div>
        {/* STEP ONE */}
        <div className={`flex flex-col ${currentStep === 0 ? "" : "hidden"}`}>
          <Input
            label="Nome do evento"
            placeholder="Nome do evento"
            name="nome"
            ref={nomeRef}
          />
          <Input
            placeholder="Ex: buffet, centro de convenções"
            label="Local do evento"
            name="local"
            ref={localRef}
          />
          <div className="flex flex-col gap-2 sm:gap-8 sm:flex-row">
            <Input
              type="date"
              label="Data de início"
              name="dataInicio"
              ref={dataInicioRef}
            />
            <Input
              type="date"
              label="Data do encerramento"
              name="dataFim"
              ref={dataFimRef}
            />
          </div>
        </div>
        {/* STEP TWO */}
        <div className={`flex flex-col ${currentStep === 1 ? "" : "hidden"}`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-8">
            <Input
              label="CEP"
              placeholder="Ex.: 00000-000"
              mask="cep"
              name="cep"
              ref={cepRef}
              onBlur={cepInputOnBlur}
            />
            <Input
              label="Cidade"
              name="cidade"
              valor={CEP?.localidade}
              ref={cidadeRef}
            />
            <Input
              label="Estado"
              name="Estado"
              valor={CEP?.uf}
              ref={estadoRef}
            />
          </div>
          <Input
            label="Bairro"
            name="bairro"
            placeholder="Bairro do local do evento"
            ref={bairroRef}
            valor={CEP?.bairro}
          />
          <Input
            label="Endereço"
            name="endereco"
            placeholder="Endereço do local do evento"
            ref={enderecoRef}
            valor={CEP?.logradouro}
          />
        </div>
        {/* STEP THREE */}
        <div className={`flex flex-col ${currentStep === 2 ? "" : "hidden"}`}>
          <Input
            label="Organizador"
            placeholder="Nome da empresa organizador do evento"
            name="organizador"
            ref={organizadorRef}
          />
          <Input
            label="Responsável"
            placeholder="Nome do responsável pelo evento"
            name="responsavel"
            ref={responsavelRef}
          />
          <div className="flex flex-col w-full gap-1 sm:flex-row sm:gap-8">
            <Input
              label="Telefone do responsável"
              placeholder="Ex.: (00) 00000-0000"
              name="telefone"
              ref={telefoneRef}
            />
            <Input
              label="E-mail do responsável"
              placeholder="email@email.com"
              name="email"
              ref={emailRef}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end w-full gap-3 ">
          {currentStep !== 0 && (
            <Button
              type="submit"
              label="Anterior"
              className="w-32 bg-neutral-03 text-neutral-02"
              onClick={() => setCurrentStep((prevState) => prevState - 1)}
            />
          )}
          <Button
            type="submit"
            label={currentStep === 2 ? "Criar" : "Próximo"}
            loading={loading || loadingPostEvento}
            className="w-32"
            onClick={
              currentStep === 2
                ? () => {
                    handleSubmit();
                  }
                : () => setCurrentStep((prevState) => prevState + 1)
            }
          />
        </div>
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
    </Modal>
  );
};
