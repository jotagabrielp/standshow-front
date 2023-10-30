import { Pagination, Title } from "@/components";
import { ApiComponent } from "@/components/ApiComponent";
import { CardEvento } from "@/components/CardEvento";
import { useEventosContext } from "@/context/eventos/useEventosContext";
import { usePagination } from "@/hooks/usePagination";
import { Evento } from "@/types/evento";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const Eventos = () => {
  const { eventos, loading, error } = useEventosContext() || {};

  const {
    pages,
    page,
    handleChangePage,
    handleNextPage,
    handlePreviousPage,
    setNewPages,
  } = usePagination();

  useEffect(() => {
    if (eventos && pages.length === 0 && eventos.length > 0) {
      setNewPages(eventos);
    }
  }, [eventos, setNewPages, pages]);

  return (
    <div className="p-10 bg-neutral-03">
      <div className="flex flex-col items-center h-full gap-10 p-10 bg-white rounded-lg">
        <div className="flex flex-row justify-between w-full">
          <Title>Eventos</Title>
          <Link
            to="adicionar"
            className="px-3 py-2 text-white rounded-md bg-primary-02"
          >
            + Evento
          </Link>
        </div>
        <ApiComponent error={error} loading={loading}>
          <div className="flex flex-col items-center justify-between h-full">
            <div className="grid grid-flow-row grid-cols-3 gap-24 w-fit place-self-center auto-cols-max">
              {pages &&
                pages[page]?.map((evento, index) => (
                  <Link
                    to="/home/projetos/adicionar"
                    state={{ evento }}
                    key={index}
                  >
                    <CardEvento title={(evento as Evento).nome} />
                  </Link>
                ))}
            </div>
            <Pagination
              currentPage={page}
              handleChangePage={handleChangePage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              totalPages={pages?.length}
            />
          </div>
        </ApiComponent>
      </div>
    </div>
  );
};
