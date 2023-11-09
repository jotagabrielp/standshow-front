import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import toast from "react-hot-toast";
import { getProjetosUrl, getTipoItemUrl } from "@/utils/url";
import { ApiComponent, Button, Form, Input, Title } from "@/components";
import { InferType, object, string } from "yup";
import { FormHandle } from "@/components/Form";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import ReactSelect from "react-select";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";

interface TipoItem {
  uuid: string;
  descricao: string;
  tipoBase: string;
}

const FORMAS = {
  BOX: "box",
  ILHA: "ilha",
  "PONTA DE ILHA": "ponta",
  ESQUINA: "esquina",
  TÚNEL: "tunel",
};

const dimensionValidationSchema = object().shape({
  area: string().required("Campo obrigatório"),
  lateral: string().required("Campo obrigatório"),
  frente: string().required("Campo obrigatório"),
  peDireito: string().required("Campo obrigatório"),
});

export const Projeto = () => {
  const [standInfo, setStandInfo] = useState<{ [key: string]: unknown }>({});
  const location = useLocation();
  const { eventos } = useEventosContext() || {};
  const { clientes } = useClientesContext() || {};
  const { usuarioAtual } = useUsuariosContext() || {};

  const eventosOptions = useMemo(() => {
    return eventos?.map((evento) => ({
      value: evento.uuid,
      label: evento.nome,
    }));
  }, [eventos]);

  const clientesOptions = useMemo(() => {
    return clientes?.map((cliente) => ({
      value: cliente.uuid,
      label: cliente.cnpj + " - " + cliente.nomeEmpresarial,
    }));
  }, [clientes]);

  const dimensionFormRef =
    useRef<FormHandle<InferType<typeof dimensionValidationSchema>>>(null);
  const navigate = useNavigate();
  const {
    loading,
    error: errorPostProjeto,
    response: responsePostProjeto,
    fetchData: createProjeto,
  } = useApi({
    url: getProjetosUrl(),
    autoRun: false,
    method: "POST",
  });

  const {
    response: responsePiso,
    loading: loadingPiso,
    error: errorPiso,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("PISO"),
    method: "GET",
  });
  const {
    response: responseAmbiente,
    loading: loadingAmbiente,
    error: errorAmbiente,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("AMBIENTE"),
    method: "GET",
  });
  const {
    response: responseParede,
    loading: loadingParede,
    error: errorParede,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("PAREDE"),
    method: "GET",
  });

  const {
    response: responseDimensao,
    loading: loadingDimensao,
    error: errorDimensao,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("DIMENSAO"),
    method: "GET",
  });
  const {
    response: responseItens,
    loading: loadingItens,
    error: errorItens,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("ITEM_EXPOSICAO"),
    method: "GET",
  });

  const {
    response: responseForma,
    loading: loadingForma,
    error: errorForma,
  } = useApi<TipoItem[]>({
    url: getTipoItemUrl("FORMA_CONSTRUTIVA"),
    method: "GET",
  });

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

  const handleSubmit = () => {
    const { current } = dimensionFormRef;
    if (current) {
      current.validate(() => {
        createProjeto({
          data: {
            dimensao: {
              tipoDimensao: {
                uuid: standInfo.tipoDimensao,
              },
              area: current.getFieldValue("area"),
              frente: current.getFieldValue("frente"),
              lateral: current.getFieldValue("lateral"),
              peDireito: current.getFieldValue("peDireito"),
            },
            formaConstrutiva: {
              tipoForma: {
                uuid: standInfo.forma,
              },
            },
            piso:
              standInfo.tipoPiso !== "sim"
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
      });
    }
  };

  const handleChangeLateralFrente = () => {
    const lateral = dimensionFormRef.current?.getFieldValue("lateral");
    const frente = dimensionFormRef.current?.getFieldValue("frente");
    dimensionFormRef.current?.setFieldValue(
      "area",
      (Number(lateral) * Number(frente)).toString()
    );
  };

  const getError = () => {
    const errors = [];
    if (errorAmbiente) errors.push(errorAmbiente);
    if (errorParede) errors.push(errorParede);
    if (errorPiso) errors.push(errorPiso);
    if (errorForma) errors.push(errorPiso);
    if (errorDimensao) errors.push(errorPiso);
    if (errorItens) errors.push(errorPiso);

    return errors[0];
  };

  useEffect(() => {
    if (responsePostProjeto) {
      navigate("/home", { relative: "path" });
      toast("Projeto criado com sucesso!");
    }
  }, [navigate, responsePostProjeto]);

  useEffect(() => {
    setStandInfo({
      ambiente: responseAmbiente?.[0]?.uuid,
      tipoDimensao: responseDimensao?.[0]?.uuid,
      forma: responseForma?.[0]?.uuid,
      parede: responseParede?.[0]?.uuid,
      piso: responsePiso?.[0]?.uuid,
      evento: location?.state?.evento?.uuid ?? eventos?.[0]?.uuid,
      cliente: location?.state?.cliente?.uuid ?? clientes?.[0]?.uuid,
    });
  }, [
    responseAmbiente,
    responseParede,
    responsePiso,
    eventos,
    responseForma,
    clientes,
    responseDimensao,
    location,
  ]);

  return (
    <div className="p-10 w-full">
      <div className="flex flex-col h-full gap-6 p-10 bg-white rounded-lg">
        <ApiComponent
          loading={
            loadingAmbiente ||
            loadingParede ||
            loadingPiso ||
            loadingForma ||
            loadingDimensao ||
            loadingItens
          }
          error={getError()}
        >
          <Title>Briefing</Title>
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-full gap-4 pr-10 border-r border-black">
              <div className="w-full">
                <h2>Evento</h2>
                <ReactSelect
                  placeholder="Selecione um evento"
                  isDisabled={location?.state?.evento?.uuid}
                  defaultValue={eventosOptions?.find(
                    (option) => option.value === location?.state?.evento?.uuid
                  )}
                  onChange={(props) =>
                    handleChangeSelect({ ...props, attribute: "evento" })
                  }
                  options={eventosOptions}
                />
              </div>
              {usuarioAtual?.roleDto.descricaoRole === "COMERCIAL" && (
                <div className="w-full">
                  <h2>Cliente</h2>
                  <ReactSelect
                    isDisabled={location?.state?.cliente?.uuid}
                    placeholder="Selecione um cliente"
                    defaultValue={clientesOptions?.find(
                      (option) =>
                        option.value === location?.state?.cliente?.uuid
                    )}
                    onChange={(props) =>
                      handleChangeSelect({ ...props, attribute: "cliente" })
                    }
                    options={clientesOptions}
                  />
                </div>
              )}
              <div>
                <h2>Tipo de stand</h2>
                <select
                  name="forma"
                  onChange={handleOnChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {responseForma?.map((forma) => {
                    return (
                      <option key={forma.uuid} value={forma.uuid}>
                        {forma.descricao}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col w-full gap-2">
                <h2>Forma do stand</h2>
                <div className="flex flex-row flex-wrap items-start gap-2">
                  {responseDimensao?.map((dimensao, index) => (
                    <div
                      key={dimensao.uuid}
                      className={`flex flex-col items-center w-24 gap-2 ${
                        index === 0 ? "order-5" : ""
                      } `}
                    >
                      <div
                        //@ts-expect-error pq sim
                        className={`stand-icon ${FORMAS[dimensao.descricao]} `}
                      />
                      <input
                        defaultChecked={index === 1}
                        type="radio"
                        name="tipoDimensao"
                        value={dimensao.uuid}
                        id={dimensao.descricao}
                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                        onChange={handleOnChange}
                      />
                      <label
                        htmlFor={dimensao.descricao}
                        className="text-center"
                      >
                        {dimensao.descricao}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-fit">
                <h2>Dimensões (em metros)</h2>
                <Form
                  ref={dimensionFormRef}
                  validationSchema={dimensionValidationSchema}
                  className="flex flex-row flex-wrap gap-3 w-fit"
                >
                  <Input
                    name="lateral"
                    label="Lateral"
                    type="number"
                    onChange={handleChangeLateralFrente}
                    placeholder="Lateral"
                    className="h-12 px-4"
                  />
                  <Input
                    name="frente"
                    label="Frente"
                    type="number"
                    placeholder="Frente"
                    onChange={handleChangeLateralFrente}
                    className="h-12 px-4"
                  />
                  <Input
                    name="peDireito"
                    label="Pé direito"
                    type="number"
                    placeholder="Pé direito"
                    className="h-12 px-4"
                  />
                  <Input
                    name="area"
                    label="Área"
                    type="number"
                    placeholder="Área"
                    disabled
                    className="h-12 px-4"
                  />
                </Form>
              </div>
              <h2 className="font-medium">Tipo de piso</h2>
              <div className="flex flex-row gap-2">
                <div className="flex items-center gap-2 row">
                  <input
                    type="radio"
                    name="tipoPiso"
                    value={"sim"}
                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                    onChange={handleOnChange}
                  />
                  <label>Piso elevado</label>
                </div>
                <div className="flex items-center gap-2 row">
                  <input
                    type="radio"
                    name="tipoPiso"
                    value={"nao"}
                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                    onChange={handleOnChange}
                  />
                  <label>Piso local</label>
                </div>
              </div>
              <div className="w-full">
                <h2>Piso</h2>
                <select
                  name="piso"
                  disabled={standInfo.tipoPiso !== "sim"}
                  onChange={handleOnChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  {responsePiso?.map((piso) => (
                    <option key={piso.uuid} value={piso.uuid}>
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
                >
                  {responseParede?.map((parede) => (
                    <option key={parede.uuid} value={parede.uuid}>
                      {parede.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h2>Ambiente</h2>
                <div className="flex flex-row gap-4">
                  {responseAmbiente?.map((ambiente) => (
                    <div
                      key={ambiente.uuid}
                      className="flex items-center gap-2 row"
                    >
                      <input
                        type="checkbox"
                        name="ambiente"
                        value={ambiente.uuid}
                        className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                        onChange={handleOnChange}
                      />
                      <label>{ambiente.descricao}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full">
              <table className="w-1/2table-auto max-h-32">
                <thead>
                  <tr>
                    <th></th>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {responseItens?.map((item) => {
                    return (
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500 w"
                          />
                        </td>
                        <td>{item.descricao}</td>
                        <td className="flex justify-center">
                          <input
                            type="number"
                            className="w-12 h-12 text-blue-600 bg-gray-300 border-gray-600 rounded selfe-center focus:ring-blue-500"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="h-12 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <span className="h-3 text-xs text-center text-error w-72">
            {errorPostProjeto &&
              "Erro ao criar evento, tente novamente mais tarde!"}
          </span>
          <Button
            label="Criar"
            type="button"
            loading={loading}
            onClick={handleSubmit}
          />
        </ApiComponent>
      </div>
    </div>
  );
};
