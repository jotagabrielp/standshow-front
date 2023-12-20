import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import useApi from "@/hooks/useApi";
import { getLoginUrl, getRegisterUrl } from "@/utils/url";
import localforage from "localforage";

import { authContext } from "./authContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    response: responseLogin,
    loading: loadingLogin,
    fetchData: login,
    error: errorLogin,
  } = useApi<{
    token: string;
  }>({
    method: "POST",
    url: getLoginUrl(),
    autoRun: false,
  });

  const {
    response: responseRegister,
    fetchData: register,
    error: errorRegister,
  } = useApi<{
    token: string;
  }>({
    method: "POST",
    url: getRegisterUrl(),
    autoRun: false,
  });
  const [user, setUser] = useState<{
    sub: string;
  } | null>();

  const signIn = useCallback(
    (form: { [key: string]: string | number | null } | undefined) => {
      login({
        data: form,
      });
    },
    [login]
  );

  const signUp = useCallback(
    (form: { [key: string]: string | number | null } | undefined) => {
      register({
        data: form,
      });
    },
    [register]
  );

  const signOut = () => {
    localforage.removeItem("token");
    window.location.href = "/";
  };

  const getToken = async () => await localforage.getItem("token");

  useEffect(() => {
    if (responseLogin) {
      const decoded = jwtDecode<{ sub: string }>(responseLogin.token);
      setUser(decoded);
      localforage.setItem("token", responseLogin);
    }
    if (errorLogin) console.log(errorLogin.message);
  }, [responseLogin, errorLogin]);

  useEffect(() => {
    if (responseRegister) {
      const decoded = jwtDecode<{ sub: string }>(responseRegister.token);
      setUser(decoded);
      localforage.setItem("token", responseRegister);
    }
  }, [responseRegister, errorRegister]);

  useEffect(() => {
    localforage
      .getItem<{
        token: string;
      }>("token")
      .then((token) => {
        const decoded = jwtDecode<{ sub: string }>(token?.token as string);
        setUser(decoded);
      });
  }, []);

  const contextValues = useMemo(
    () => ({
      user,
      loadingLogin,
      errorLogin,
      getToken,
      signIn,
      signUp,
      signOut,
    }),
    [errorLogin, loadingLogin, user, signIn, signUp]
  );

  return (
    <authContext.Provider value={contextValues}>
      {children}
    </authContext.Provider>
  );
};
