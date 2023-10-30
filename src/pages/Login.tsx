import { useRef } from "react";
import { RiMailLine, RiKeyLine } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";
import { InferType, object, string } from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import { FormHandle } from "@/components/Form";
import { Form, Input, Page } from "@/components";
import LoginBanner from "@/assets/login-banner.png";

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, signIn, loadingLogin, errorLogin } = useAuth() || {};

  const loginValidation = object().shape({
    email: string().required("Insira um e-mail!").email("E-mail inválido!"),
    password: string().required("Insira uma senha!"),
  });
  const loginForm = useRef<FormHandle<InferType<typeof loginValidation>>>(null);

  if (user) {
    const whereToGo = location.state?.from ? location.state.from : "/home";
    navigate(whereToGo);
  }

  return (
    <Page>
      <div className="flex justify-end w-1/2">
        <div className="relative rounded-md w-fit bg-primary-02">
          <img src={LoginBanner} className="h-auto rounded-md resize-none " />
          <p className="absolute text-white bottom-[150px] font-medium tracking-wide lg:text-4xl left-14 invisible lg:visible">
            Desde 1998 criando e executando projetos e montagens de estandes com
            tecnologia, criatividade e profissionalismo.
          </p>
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center lg:items-start gap-7 w-screen h-screen lg:w-1/2 lg:h-full lg:min-w-fit lg:max-w-[800px] px-6 py-12 lg:px-24 lg:py-24 lg:rounded-2xl">
        <div className="flex flex-col w-fit">
          <span className="font-sans text-2xl font-semibold lg:text-3xl">
            Entrar
          </span>
          <i className="w-full h-1 bg-gradient-to-b from-primary-04 to-primary-05 " />
        </div>
        <Form
          ref={loginForm}
          className="flex flex-col lg:gap-4"
          validationSchema={loginValidation}
          onSubmit={(e) => {
            e.preventDefault();
            loginForm.current?.validate((form) => signIn && signIn(form));
          }}
        >
          <Input
            name="email"
            type="email"
            tabIndex={1}
            label="E-mail"
            placeholder="Seu email"
            Icon={RiMailLine}
          />
          <Input
            name="password"
            type="password"
            tabIndex={2}
            label="Senha"
            placeholder="Senha"
            Icon={RiKeyLine}
          />
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              <input
                type="checkbox"
                className="w-6 h-6 bg-white border-2 rounded-sm border-zinc-600"
              />
              <span className="font-sans text-xl font-normal text-zinc-600">
                Lembrar-me
              </span>
            </div>
            <span className="underline cursor-pointer text-primary-03 decoration-primary-03 underline-offset-4">
              Esqueceu a senha?
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="submit"
              className="flex items-center justify-center py-3 text-xl font-bold text-white uppercase rounded-md bg-primary-02"
              disabled={loadingLogin}
            >
              {loadingLogin ? (
                <TailSpin color="white" width={24} height={24} />
              ) : (
                "Entrar"
              )}
            </button>
            <span className="h-3 text-xs text-center text-error w-72">
              {errorLogin && "Erro ao fazer login, tente novamente mais tarde!"}
            </span>
          </div>
        </Form>
      </div>
    </Page>
  );
};
