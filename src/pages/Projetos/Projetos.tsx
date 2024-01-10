import { useState } from "react";
import { Title, ApiComponent } from "@/components";
import useApi from "@/hooks/useApi";
import { getProjetosUrl } from "@/utils/url";
import { Stand } from "@/types/stand";
import { Table } from "@/components/Table";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { useClientesContext } from "@/context/cliente/useClientesContext";
import { ProjetoModal } from "./ProjetoModal";
import { BriefingModal } from "./BriefingModal";
import { Evento } from "@/types/evento";

export const Projetos = () => {
  const [currentBriefing, setCurrentBriefing] = useState<Stand | null>(null);
  const [currentProject, setCurrentProject] = useState<Stand | null>(null);
  const { loading: loadingEvento, eventos } = useEventosContext();
  const { loading: loadingClientes, clientes } = useClientesContext();

  const { loading, error, response, fetchData } = useApi<Stand[]>({
    url: getProjetosUrl(),
    method: "GET",
  });

  return (
    <>
      <div className="w-full p-10">
        <div className="flex flex-col items-center h-full gap-10 p-10 bg-white rounded-lg">
          <div className="flex flex-row justify-between w-full">
            <Title>Projetos</Title>
          </div>
          <ApiComponent
            error={error}
            loading={loading || loadingEvento || loadingClientes}
          >
            <div className="flex flex-col items-center justify-center w-full h-full align-center">
              <Table
                items={response}
                eventos={eventos}
                clientes={clientes}
                setCurrentBriefing={setCurrentBriefing}
                reload={fetchData}
              />
            </div>
          </ApiComponent>
        </div>
      </div>
      <ProjetoModal
        project={currentProject}
        onClose={() => setCurrentProject(null)}
      />
      <BriefingModal
        currentBriefing={currentBriefing as Stand}
        readMode={true}
        evento={
          eventos.find(
            (evento) => evento.uuid === currentBriefing?.uuidEvento
          ) as Evento
        }
        onClose={() => setCurrentBriefing(null)}
      />
    </>
  );
};
