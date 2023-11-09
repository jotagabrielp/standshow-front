import { Toaster } from "react-hot-toast";
import { SideMenu } from "@/components";
import { useAuth } from "@/context/auth/useAuth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useNotification from "@/hooks/useNotification";
import { UsuariosProvider } from "@/context/users/UsuariosProvider";
import { EventosProvider } from "@/context/eventos/EventosProvider";
import { ClientesProvider } from "@/context/cliente/ClientesProvider";
import { StartPage } from "./StartPage";

export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth() || {};
  useNotification();
  if (getToken && !getToken()) {
    navigate("/", { state: { from: location.pathname } });
  }

  return (
    <UsuariosProvider>
      <EventosProvider>
        <ClientesProvider>
          {location.pathname === "/home" ? (
            <StartPage />
          ) : (
            <div className="flex flex-row w-full h-full overflow-x-hidden bg-neutral-04">
              <SideMenu />
              <Outlet />
            </div>
          )}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              duration: 15000,
            }}
          />
        </ClientesProvider>
      </EventosProvider>
    </UsuariosProvider>
  );
};
