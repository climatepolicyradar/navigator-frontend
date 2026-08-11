import { getPaginationPages } from "@/utils/pagination/getPaginationPages";
import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: TProps) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pages = getPaginationPages(totalPages, currentPage);

  return (
    <ul className="flex items-start gap-2 text-base text-text-brand font-medium leading-5">
      {pages.map(({ type, page }, pageIndex) =>
        type === "ellipsis" ? (
          <li key={pageIndex} className="w-10 h-10 flex items-center justify-center select-none">
            <span className="text-text-tertiary">&hellip;</span>
          </li>
        ) : (
          <li key={pageIndex}>
            <button
              type="button"
              className={joinTailwindClasses("w-10 h-10 rounded-lg", page === currentPage && "bg-bg-brand text-white")}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          </li>
        )
      )}
    </ul>
  );
};
