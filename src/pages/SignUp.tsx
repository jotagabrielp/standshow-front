import { useRef, FormEvent, useEffect } from "react";
import { object, string, InferType } from "yup";
import { validateCNPJ } from "validations-br";
import { getCnpjUrl } from "@/utils/url";
import { Input, Page, Form } from "@/components";
import { FormHandle } from "@/components/Form";
import useApi from "@/hooks/useApi";
import { Cnpj } from "@/types/cnpj";

export const SignUp = () => {
  const { loading, fetchData, response } = useApi<Cnpj>({
    method: "GET",
    autoRun: false,
  });

  const signUpSchema = object().shape({
    cnpj: string()
      .required("campo CNPJ não pode ser vazio!")
      .test("validacaoCNPJ", "CNPJ inválido!", (item) => validateCNPJ(item)),
    nome_fantasia: string().required(),
  });

  const getCnpjInfo = () => {
    const cnpj = formRef.current?.getFieldValue("cnpj");
    if (cnpj && validateCNPJ(cnpj as string)) {
      fetchData({
        url: getCnpjUrl(cnpj as string),
      });
    }
  };

  const formRef = useRef<FormHandle<InferType<typeof signUpSchema>>>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.validate(() => {});
  };

  useEffect(() => {
    formRef.current?.setFieldValue("nome_fantasia", response?.nome || "");
  }, [response]);

  return (
    <Page>
      <div className="flex flex-col items-center h-auto gap-4 p-8 bg-white shadow-2xl w-96">
        <h1 className="font-sans text-2xl font-medium">Cadastro</h1>
        <Form
          className="flex flex-col gap-2"
          ref={formRef}
          onSubmit={handleSubmit}
          validationSchema={signUpSchema}
        >
          <Input
            label="CNPJ"
            name="cnpj"
            type="text"
            mask={"cnpj"}
            maxLength={19}
            placeholder="Insira o CNPJ"
            loading={loading}
            onBlur={getCnpjInfo}
            tabIndex={1}
          />
          <Input
            label="Nome fantasia"
            name="nome_fantasia"
            type="text"
            tabIndex={2}
          />
          <button
            tabIndex={3}
            className="text-white bg-green-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </Form>
      </div>
    </Page>
  );
};
