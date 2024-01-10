import {
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineShoppingCart,
  AiOutlineWallet,
  AiOutlineCalendar,
  AiOutlineProject,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { HiOutlineCube } from "react-icons/hi";
import { LuGavel, LuHardHat, LuSofa, LuCoins } from "react-icons/lu";
import { TbReceiptTax } from "react-icons/tb";
import { BsPalette } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiComponent } from "@/components";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
type Item = {
  title: string;
  icon: JSX.Element;
  to?: string;
  list?: Item[];
};

const comercialList = [
  {
    title: "Eventos",
    icon: <AiOutlineCalendar size={40} />,
    to: "/comercial/eventos",
  },
  {
    title: "Clientes",
    icon: <FiUsers size={40} />,
    to: "/comercial/clientes",
  },
  {
    title: "Briefing",
    icon: <AiOutlineProject size={40} />,
    to: "/comercial/briefing",
  },
  {
    title: "Projeto",
    icon: <HiOutlineCube size={40} />,
    to: "/comercial/projetos/",
  },
  {
    title: "Orçamento",
    icon: <LuCoins size={40} />,
    to: "/comercial/orcamento",
  },
  {
    title: "Pauta",
    icon: <AiOutlineProject size={40} />,
    to: "/comercial/pauta",
  },
  {
    title: "Despesa de Viagem",
    icon: <AiOutlineProject size={40} />,
    to: "/comercial/pauta",
  },
  {
    title: "O.S. Comunicação Visual",
    icon: <AiOutlineProject size={40} />,
    to: "/comercial/pauta",
  },
  {
    title: "Solicitar Hospedagem",
    icon: <AiOutlineProject size={40} />,
    to: "/comercial/pauta",
  },
];

const clientesList = [
  {
    title: "Eventos",
    icon: <AiOutlineCalendar size={40} />,
    to: "/cliente/eventos",
  },
  {
    title: "Briefing",
    icon: <AiOutlineProject size={40} />,
    to: "/cliente/eventos",
  },
  {
    title: "Projeto",
    icon: <AiOutlineProject size={40} />,
    to: "/cliente/projetos",
  },
  {
    title: "Orçamento",
    icon: <LuCoins size={40} />,
    to: "/cliente/orcamento",
  },
  {
    title: "NFS",
    icon: <LuCoins size={40} />,
    to: "/cliente/orcamento",
  },
];

const itemsList = [
  {
    title: "Cliente",
    icon: <AiOutlineUser size={40} />,
    list: clientesList,
  },
  {
    title: "Comercial",
    icon: <AiOutlinePhone size={40} />,
    list: comercialList,
  },
  {
    title: "Projetos",
    icon: <HiOutlineCube size={40} />,
    to: "/projetos",
  },
  {
    title: "Compras",
    icon: <AiOutlineShoppingCart size={40} />,
  },
  {
    title: "Contabilidade",
    icon: <AiOutlineWallet size={40} />,
  },
  {
    title: "Logística",
    icon: <LuGavel size={40} />,
  },
  {
    title: "Comunicação Visual",
    icon: <BsPalette size={40} />,
  },
  {
    title: "Produção",
    icon: <LuHardHat size={40} />,
  },
  {
    title: "RH",
    icon: <FiUsers size={40} />,
  },
  {
    title: "Mobiliário",
    icon: <LuSofa size={40} />,
  },
  {
    title: "Faturamento",
    icon: <LuCoins size={40} />,
  },
  {
    title: "Financeiro",
    icon: <TbReceiptTax size={40} />,
  },
];

const listDic: { [key: string]: Item[] } = {
  CLIENTE: clientesList,
  COMERCIAL: comercialList,
  ADMINISTRADOR: itemsList,
};

const style =
  "w-40 h-40 bg-white font-bold text-center rounded-md text-primary-02 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform cursor-pointer";
export const StartPage = () => {
  const { usuarioAtual, loading, error } = useUsuariosContext();
  const [currentList, setCurrentList] = useState<Item[]>(itemsList);
  const navigate = useNavigate();
  if (currentList.length === 0) setCurrentList(itemsList);

  useEffect(() => {
    if (usuarioAtual) {
      setCurrentList(listDic[usuarioAtual?.roleDto.descricaoRole] || []);
    }
    if (usuarioAtual?.roleDto.descricaoRole === "PROJETISTA") {
      navigate("/projetista");
    }
  }, [usuarioAtual, navigate]);

  useEffect(() => {
    if (
      usuarioAtual?.roleDto.descricaoRole === "ADMINISTRADOR" &&
      currentList[0].title !== "Cliente" &&
      currentList[currentList.length - 1].title !== "Voltar"
    ) {
      setCurrentList((prevState) => [
        ...prevState,
        {
          title: "Voltar",
          icon: <AiOutlineArrowLeft size={40} />,
          list: [],
        },
      ]);
    }
  }, [usuarioAtual, currentList]);

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="flex flex-col items-center justify-center w-full h-full bg-primary-03">
        <ApiComponent loading={loading} error={error}>
          <div className="flex flex-row flex-wrap items-center justify-center max-w-3xl gap-12">
            {currentList.map((item, index) => (
              <div
                key={item.title}
                className={twMerge(
                  style,
                  currentList[0].title === "Cliente" && index > 2
                    ? "bg-white/60 hover:scale-100 cursor-default"
                    : ""
                )}
                onClick={
                  item.list
                    ? () => setCurrentList(item.list as Item[])
                    : () => navigate(item?.to as string)
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </ApiComponent>
      </div>
    </div>
  );
};
