import { Toaster } from "react-hot-toast";
import { Header, SideMenu } from "@/components";
import { useAuth } from "@/context/auth/useAuth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useNotification from "@/hooks/useNotification";

export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth() || {};
  useNotification();
  if (getToken && !getToken()) {
    navigate("/", { state: { from: location.pathname } });
  }

  return (
    <>
      <div className="w-full h-full overflow-x-hidden dashboard">
        <Header className="col-span-2" />
        <SideMenu />
        <Outlet />
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 15000,
        }}
      />
    </>
  );
};
