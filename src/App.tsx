import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";
import { AuthProvider } from "./context/auth/authProvider";
import { Eventos, Evento } from "./pages/Eventos";
import { EventosProvider } from "./context/eventos/EventosProvider";
import { Projetos } from "./pages/Projetos/Projetos";
import { Projeto } from "./pages/Projetos/Projeto";
import { ClientesProvider } from "./context/cliente/ClientesProvider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "home",
    Component: Home,
    children: [
      { Component: Eventos, path: "eventos" },
      {
        Component: Evento,
        path: "eventos/adicionar",
      },
      {
        Component: Evento,
        path: "eventos/:id",
      },
      {
        Component: Projetos,
        path: "",
      },
      {
        Component: Projeto,
        path: "projetos/adicionar",
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <EventosProvider>
        <ClientesProvider>
          <RouterProvider router={router} />
        </ClientesProvider>
      </EventosProvider>
    </AuthProvider>
  );
};

export default App;
