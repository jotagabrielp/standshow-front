import { useAuth } from "@/context/auth/useAuth";
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineProject,
} from "react-icons/ai";
import { LuCoins } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { GoSignOut } from "react-icons/go";
import logoStandShow from "@/assets/standLogoSmall.png";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { CadastrarClienteModal } from "./Cliente/CadastrarClienteModal";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface Links {
  icon: React.FC<{ size: number }>;
  name: string;
  to?: string;
  function?: () => void;
}
const ITEM_CLASSNAME = "flex flex-col items-center pl-3 pr-4 py-2 text-md";
export const SideMenu = () => {
  const LINKS_COMERCIAL: Links[] = useMemo(
    () => [
      {
        icon: AiOutlineHome,
        name: "Inicio",
        to: "/home",
      },
      {
        icon: AiOutlineCalendar,
        name: "Eventos",
        to: "eventos",
      },
      {
        icon: AiOutlineProject,
        name: "Projetos",
        to: "projetos",
      },
      {
        name: "Orçamento",
        icon: LuCoins,
        to: "/comercial/orcamento",
      },
      {
        name: "Pauta",
        icon: AiOutlineProject,
        to: "/comercial/pauta",
      },
      {
        icon: FiUsers,
        name: "Cadastrar clientes",
        function: () => setIsOpen(true),
      },
    ],
    []
  );

  const LINKS_CLIENTE: Links[] = useMemo(
    () => [
      {
        icon: AiOutlineHome,
        name: "Inicio",
        to: "/home",
      },
      {
        icon: AiOutlineCalendar,
        name: "Eventos",
        to: "eventos",
      },
      {
        icon: AiOutlineProject,
        name: "Projetos",
        to: "projetos",
      },
      {
        name: "Orçamento",
        icon: LuCoins,
        to: "/comercial/orcamento",
      },
      {
        name: "NFS",
        icon: AiOutlineProject,
        to: "/comercial/pauta",
      },
    ],
    []
  );

  const LINKS_PROJETO: Links[] = useMemo(
    () => [
      {
        icon: AiOutlineHome,
        name: "Inicio",
        to: "/home",
      },
      {
        icon: AiOutlineProject,
        name: "Projetos",
        to: "/projetos",
      },
    ],
    []
  );

  const listDict = useMemo(
    () => ({
      comercial: LINKS_COMERCIAL,
      cliente: LINKS_CLIENTE,
      projetos: LINKS_PROJETO,
    }),
    [LINKS_CLIENTE, LINKS_COMERCIAL, LINKS_PROJETO]
  );

  const location = useLocation();
  const [currentList, setCurrentList] = useState<Links[]>(LINKS_CLIENTE);
  const [isOpen, setIsOpen] = useState(
    location.search === "?cadastrarCliente=true"
  );
  const { usuarioAtual } = useUsuariosContext();
  const { signOut } = useAuth();

  useEffect(() => {
    setCurrentList(listDict[location.pathname.split("/")[1]]);
  }, []);
  return (
    <>
      <div className="flex flex-col h-[90%] justify-between my-auto py-8 rounded-xl ml-4 bg-primary-01">
        <div className="p-2 mx-auto bg-white rounded-full w-fit">
          <img src={logoStandShow} />
          {usuarioAtual?.nome}
        </div>
        <div className="flex flex-col gap-6">
          {currentList?.map((link, index) =>
            link.to ? (
              <Link to={link?.to} key={index}>
                <span
                  className={`${ITEM_CLASSNAME} ml-1 hover:scale-105 transition-all text-white`}
                >
                  <link.icon size={20} />
                  {link.name}
                </span>
              </Link>
            ) : (
              <span
                className={`${ITEM_CLASSNAME} ml-1 hover:scale-105 transition-all text-white text-center cursor-pointer`}
                onClick={link.function}
                key={index}
              >
                <link.icon size={20} />
                {link.name}
              </span>
            )
          )}
        </div>
        <span
          onClick={signOut}
          className={`${ITEM_CLASSNAME} cursor-pointer text-white hover:scale-105 transition-all`}
        >
          <GoSignOut size={30} />
          Sair
        </span>
      </div>
      <CadastrarClienteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
