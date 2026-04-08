import { LucideArrowLeft, LucideArrowRight } from "lucide-react";

import { getPaginationPages } from "@/utils/_experiment/getPaginationPages";
import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const sharedPaginationButtonClasses = "min-h-8 min-w-8 border border-transparent-regular rounded-md transition hover:bg-inky-black hover:text-white";
const prevNextButtonClasses =
  "px-2.5 flex items-center disabled:cursor-not-allowed! disabled:text-neutral-400 disabled:hover:bg-transparent disabled:hover:text-neutral-400";

export function Pagination({ currentPage, totalPages, onPageChange }: TProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pageItems = getPaginationPages(currentPage, totalPages);

  return (
    <div className="flex flex-nowrap gap-6 font-medium text-inky-black">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={joinTailwindClasses(sharedPaginationButtonClasses, prevNextButtonClasses)}
      >
        <LucideArrowLeft width={16} height={16} className="mr-2" />
        Back
      </button>
      <ul className="text-sm flex items-center gap-1">
        {pageItems.map((item) =>
          item.type === "ellipsis" ? (
            <li key={item.key} className="min-h-8 min-w-8 flex items-center justify-center">
              &hellip;
            </li>
          ) : (
            <li key={item.page}>
              <button
                className={joinTailwindClasses(sharedPaginationButtonClasses, item.page === currentPage ? "bg-inky-black text-white" : "")}
                onClick={() => handlePageChange(item.page)}
                disabled={item.page === currentPage}
              >
                {item.page}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={joinTailwindClasses(sharedPaginationButtonClasses, prevNextButtonClasses)}
      >
        Next
        <LucideArrowRight width={16} height={16} className="ml-2" />
      </button>
    </div>
  );
}
