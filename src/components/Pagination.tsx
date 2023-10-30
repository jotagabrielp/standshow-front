interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleChangePage: (page: number) => void;
}
export const Pagination = ({
  totalPages,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  handleChangePage,
}: PaginationProps) => {
  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex h-10 -space-x-px text-base">
        <li>
          <span
            onClick={handlePreviousPage}
            className="flex items-center justify-center h-10 px-4 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
          >
            {"<"}
          </span>
        </li>
        {Array.from(Array(totalPages).keys())?.map((item) => (
          <li key={item}>
            <span
              onClick={() => handleChangePage(item)}
              className={
                item === currentPage
                  ? "flex items-center justify-center h-10 px-4 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 "
                  : "flex items-center justify-center h-10 px-4 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
              }
            >
              {item + 1}
            </span>
          </li>
        ))}

        <li>
          <span
            onClick={handleNextPage}
            className="flex items-center justify-center h-10 px-4 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
          >
            {">"}
          </span>
        </li>
      </ul>
    </nav>
  );
};
