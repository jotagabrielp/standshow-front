import { useEffect, useState } from "react";
import { Pagination, Title } from "@/components";
import { Evento } from "@/types/evento";
import { CardEvento } from "@/components/CardEvento";
import { ApiComponent } from "@/components/ApiComponent";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { EventosModal } from "./EventosModal";
import { MaisDetalhesModal } from "./MaisDetalhesModal";
import { BriefingModal } from "../Projetos/BriefingModal";
import { usePagination } from "@/hooks/usePagination";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";

export const Eventos = () => {
  const { usuarioAtual } = useUsuariosContext();
  const { eventos, loading, error } = useEventosContext();
  const [currentEvento, setCurrentEvento] = useState<Evento | null>(null);
  const [currentBriefingEvento, setCurrentBriefingEvento] =
    useState<Evento | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const onChangeEvento = (evento: Evento) => setCurrentEvento(evento);
  const {
    handleChangePage,
    handleNextPage,
    handlePreviousPage,
    page,
    pages,
    setNewPages,
  } = usePagination<Evento>();

  useEffect(() => {
    setNewPages(
      (eventos as Evento[])?.filter((evento) =>
        usuarioAtual?.roleDto.descricaoRole === "COMERCIAL"
          ? evento.uuidUsuarioComercial === usuarioAtual.uuid
          : true
      ),
      4
    );
  }, [eventos, setNewPages, usuarioAtual]);
  return (
    <>
      <div className="w-full p-10">
        <div className="flex flex-col items-start w-full h-full gap-10 p-10">
          <div className="flex flex-row justify-between w-full">
            <Title>Eventos</Title>
            <div
              onClick={() => setIsOpen(true)}
              className="px-3 py-2 text-sm text-white rounded-md cursor-pointer bg-primary-02"
            >
              + CRIAR NOVO EVENTO
            </div>
          </div>
          <ApiComponent error={error} loading={loading}>
            <div className="flex flex-col items-center justify-between w-full h-full">
              <div className="flex flex-row flex-wrap items-center w-full gap-8">
                {pages.length > 0
                  ? pages[page]?.map((evento, index) => (
                      <CardEvento
                        key={index}
                        evento={evento}
                        setBriefingEvento={() =>
                          setCurrentBriefingEvento(evento)
                        }
                        setEvento={() => onChangeEvento(evento)}
                      />
                    ))
                  : "Sem eventos para exibir!"}
              </div>
              {pages.length > 1 && (
                <Pagination
                  currentPage={page}
                  handleChangePage={handleChangePage}
                  handleNextPage={handleNextPage}
                  totalPages={pages.length}
                  handlePreviousPage={handlePreviousPage}
                />
              )}
            </div>
          </ApiComponent>
        </div>
      </div>
      <EventosModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <MaisDetalhesModal
        isOpen={!!currentEvento}
        onClose={() => setCurrentEvento(null)}
        evento={currentEvento}
      />
      <BriefingModal
        evento={currentBriefingEvento as Evento}
        isOpen={!!currentBriefingEvento}
        onClose={() => setCurrentBriefingEvento(null)}
      />
    </>
  );
};
