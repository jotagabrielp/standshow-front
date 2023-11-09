import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";
import { AuthProvider } from "./context/auth/authProvider";
import { Eventos, Evento } from "./pages/Eventos";
import { Projetos } from "./pages/Projetos/Projetos";
import { Projeto } from "./pages/Projetos/Projeto";
import { Pauta } from "./pages/Pauta/Pauta";
import { Orcamento } from "./pages/Orcamento/Orcamento";

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
  },
  {
    path: "comercial",
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
        path: "projetos",
      },
      {
        Component: Projeto,
        path: "projetos/adicionar",
      },
      {
        Component: Pauta,
        path: "pauta",
      },
      {
        Component: Orcamento,
        path: "orcamento",
      },
    ],
  },
  {
    path: "cliente",
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
        path: "projetos",
      },
      {
        Component: Projeto,
        path: "projetos/adicionar",
      },
      {
        Component: Orcamento,
        path: "orcamento",
      },
    ],
  },
  {
    path: "projetos",
    Component: Home,
    children: [{ Component: Projetos, path: "" }],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
