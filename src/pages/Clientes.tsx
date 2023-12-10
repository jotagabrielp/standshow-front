import { Title, ApiComponent } from "@/components";
import useApi from "@/hooks/useApi";
import { getProjetosUrl } from "@/utils/url";
import { Stand } from "@/types/stand";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { UserTable } from "@/components/UserTable";
import { CadastrarClienteModal } from "@/components/Cliente/CadastrarClienteModal";
import { useState } from "react";

export const Clientes = () => {
  const { loading: loadingEvento } = useEventosContext();
  const { loading: loadingClientes, clientes } = useClientesContext();
  const [isOpen, setIsOpen] = useState(false);

  const { loading, error } = useApi<Stand[]>({
    url: getProjetosUrl(),
    method: "GET",
  });

  return (
    <>
      <div className="w-full p-10">
        <div className="flex flex-col items-center h-full gap-10 p-10 bg-white rounded-lg">
          <div className="flex flex-row justify-between w-full">
            <Title>Clientes</Title>
            <div
              onClick={() => setIsOpen(true)}
              className="px-3 py-2 text-sm text-white rounded-md cursor-pointer bg-primary-02"
            >
              CADASTRAR CLIENTE
            </div>
          </div>
          <ApiComponent
            error={error}
            loading={loading || loadingEvento || loadingClientes}
          >
            <div className="flex flex-col items-center justify-center w-full h-full align-center">
              <UserTable items={clientes} reload={() => {}} />
            </div>
          </ApiComponent>
        </div>
      </div>
      <CadastrarClienteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
