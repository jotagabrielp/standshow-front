import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import useApi from "@/hooks/useApi";
import { getLoginUrl, getRegisterUrl } from "@/utils/url";
import localforage from "localforage";

import { authContext } from "./authContext";

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
    token: string;
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
      setUser(responseLogin);
      localforage.setItem("token", responseLogin);
    }
    if (errorLogin) console.log(errorLogin);
  }, [responseLogin, errorLogin]);

  useEffect(() => {
    if (responseRegister) {
      setUser(responseRegister);
      localforage.setItem("token", responseRegister);
    }
  }, [responseRegister, errorRegister]);

  useEffect(() => {
    localforage
      .getItem<{
        token: string;
      }>("token")
      .then((token) => setUser(token));
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
