import { createContext } from "react";

interface IauthContext {
  user: { [key: string]: string | number } | null | undefined;
  errorLogin: Error | undefined;
  loadingLogin: boolean | undefined;
  signIn: (form: { [key: string]: string | number | null } | undefined) => void;
  signUp: (form: { [key: string]: string | number | null } | undefined) => void;
  signOut: () => void;
  getToken: () => unknown;
}

export const authContext = createContext<IauthContext>({} as IauthContext);
