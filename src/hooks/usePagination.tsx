import { useState, useReducer } from "react";

function sliceIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export function usePagination<T>() {
  const [pages, setPages] = useState<T[][]>([]);
  const [page, dispatch] = useReducer(
    (state: number, action: { type: string; newPage?: number }) => {
      if (action?.type === "next_page") {
        return state + 1;
      }
      if (action?.type === "previous_page") {
        return state - 1;
      }
      if (action?.type === "change_page") {
        return action.newPage!;
      }
      throw Error("Unknown action.");
    },
    0
  );

  const setNewPages = (newPages: T[], pagesNumber = 6) => {
    setPages(sliceIntoChunks(newPages, pagesNumber));
  };

  const handlePreviousPage = () => {
    if (page === 0) return;
    dispatch({ type: "previous_page" });
  };

  const handleNextPage = () => {
    if (page === pages?.length) return;
    dispatch({ type: "next_page" });
  };

  const handleChangePage = (newPage: number) => {
    if (newPage > pages?.length) return;
    dispatch({ type: "change_page", newPage });
  };

  return {
    pages,
    page,
    setNewPages,
    handlePreviousPage,
    handleNextPage,
    handleChangePage,
  };
}
