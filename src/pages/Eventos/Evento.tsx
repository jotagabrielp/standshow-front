import { useRef, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { validateCep } from "validations-br";
import { ISchema, InferType, date, object, string } from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { cep } from "@/types/cep";

import { FormHandle } from "@/components/Form";
import { Button, Form, Input, Title } from "@/components";
import { useEventosContext } from "@/context/eventos/useEventosContext";

import useApi from "@/hooks/useApi";
import { useCEP } from "@/hooks/useCEP";

import { getEventosUrl, getEventoUrl } from "@/utils/url";
import { formatApiFriendlyDate } from "@/utils/date";

type customForm<T extends ISchema<unknown>> = FormHandle<InferType<T>>;

const eventoFormSchema = object().shape({
  nome: string()
    .required("Insira o nome do evento")
    .min(5, "Nome de evento inválido"),
  dataInicio: date().required("Insira uma data"),
  dataFim: date().required("Insira uma data"),
});

const cepSchema = object().shape({
  cep: string()
    .required("Insira o cep do evento")
    .test("cep", "Cep inválido", (cep) => validateCep(cep)),
  local: string().required("Insira o nome do local"),
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
export const Evento = () => {
  const { id } = useParams();
  const { eventos, fetchData } = useEventosContext() || {};
  const evento = eventos?.find((evento) => evento.uuid === id);
  const navigate = useNavigate();
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const { loadingCEP, getCEP, CEP } = useCEP<cep>();
  const {
    loading: loadingPostEvento,
    error: errorPostEvento,
    fetchData: postEvento,
    response: responsePostEvento,
  } = useApi({
    url: getEventosUrl(),
    autoRun: false,
    method: "POST",
  });
  const {
    error: errorEditEvento,
    loading: loadingEditEvento,
    fetchData: putEvento,
    response: responsePutEvento,
  } = useApi({
    url: getEventoUrl(evento?.uuid as string),
    autoRun: false,
    method: "PUT",
  });
  const { error: errorDeleteEvento } = useApi({
    url: getEventoUrl(evento?.uuid as string),
    autoRun: false,
    method: "DELETE",
  });

  const cepInputOnBlur = () => {
    const cep = cepFormRef.current?.getFieldValue("cep");
    if (validateCep(cep as string)) {
      getCEP(cep as string);
    }
  };

  const eventoFormRef = useRef<customForm<typeof eventoFormSchema>>(null);
  const cepFormRef = useRef<customForm<typeof cepSchema>>(null);
  const organizadorFormRef = useRef<customForm<typeof organizadorSchema>>(null);

  const handleSubmit = () => {
    eventoFormRef.current?.validate((formEvento) => {
      cepFormRef.current?.validate((formCep) => {
        organizadorFormRef.current?.validate((formOrganizador) => {
          const data = {
            nome: formEvento.nome,
            dataHoraFormatada: formatApiFriendlyDate(formEvento.dataInicio),
            outro: formCep.local,
            cep: formCep.cep,
            municipio: CEP?.localidade ?? evento?.municipio,
            uf: CEP?.uf ?? evento?.uf,
            endereco: CEP?.logradouro ?? evento?.endereco,
            organizador: {
              nome: formOrganizador.organizador,
              responsavel: formOrganizador.responsavel,
              telefone: formOrganizador.telefone,
              email: formOrganizador.email,
            },
          };
          if (!evento) {
            postEvento({
              data,
            });
          } else {
            putEvento({
              data,
            });
          }
        });
      });
    });
  };
  useEffect(() => {
    if (responsePostEvento || responsePutEvento) {
      fetchData && fetchData();
      navigate("..", { relative: "path" });
      toast("Evento criado com sucesso!");
    }
  }, [navigate, responsePostEvento, fetchData, responsePutEvento]);

  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <div className="p-10 w-full">
      <div className="flex flex-col h-full gap-6 p-10 bg-white rounded-lg">
        <Title>{evento ? "Evento" : "Cadastrar evento"}</Title>
        <img src={preview} className="object-cover h-auto w-44" />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files?.[0]);
          }}
        />
        <Form
          ref={eventoFormRef}
          validationSchema={eventoFormSchema}
          className="flex flex-row gap-12"
        >
          <Input
            name="nome"
            label="Evento"
            placeholder="Nome do evento"
            valor={evento?.nome}
          />
          <Input
            type="date"
            name="dataInicio"
            className="px-4"
            valor={evento?.dataHoraFormatada.substring(0, 10)}
            label="Data início"
          />
          <Input
            type="date"
            name="dataFim"
            className="px-4"
            valor={evento?.dataHoraFormatada.substring(0, 10)}
            label="Data fim"
          />
        </Form>
        <Form
          validationSchema={cepSchema}
          ref={cepFormRef}
          className="flex flex-row gap-12"
        >
          <Input
            name="local"
            valor={evento?.outro}
            label="Local do evento"
            placeholder="Local"
          />
          <Input
            name="cep"
            label="CEP"
            valor={evento?.cep}
            placeholder="CEP do evento"
            loading={loadingCEP}
            onBlur={cepInputOnBlur}
          />
        </Form>
        <div className="flex flex-row gap-12">
          <Input
            name="endereco"
            label="Endereço"
            valor={evento?.endereco ?? CEP?.logradouro}
            disabled
          />
          <Input
            name="municipio"
            label="Cidade"
            valor={evento?.municipio ?? CEP?.localidade}
            disabled
          />
          <Input
            name="uf"
            label="Estado"
            valor={evento?.uf ?? CEP?.uf}
            disabled
          />
        </div>
        <Form
          validationSchema={organizadorSchema}
          ref={organizadorFormRef}
          className="flex flex-row gap-12"
        >
          <Input
            label="Organizador"
            name="organizador"
            valor={evento?.organizador.nome}
            placeholder="Empresa organizadora"
          />
          <Input
            label="Responsável"
            name="responsavel"
            valor={evento?.organizador.responsavel}
            placeholder="Nome do responsável"
          />
          <Input
            label="Telefone"
            name="telefone"
            valor={evento?.organizador.telefone}
            placeholder="Telefone de contato"
          />
          <Input
            label="E-mail"
            valor={evento?.organizador.email}
            name="email"
            placeholder="E-mail de contato"
          />
        </Form>
        <Button
          onClick={handleSubmit}
          label={evento ? "Editar" : "Cadastrar"}
          loading={loadingPostEvento || loadingEditEvento}
          type="button"
          className="self-center w-[300px]"
        />
        <span className="h-3 text-xs text-center text-error w-72">
          {(errorPostEvento || errorEditEvento || errorDeleteEvento) &&
            "Erro ao criar evento, tente novamente mais tarde!"}
        </span>
      </div>
    </div>
  );
};
