import { useEffect, useRef, useState } from "react";

import { getPaginationPages } from "@/utils/pagination/getPaginationPages";
import { joinTailwindClasses } from "@/utils/tailwind";

const WIDE_BREAKPOINT_PX = 520;

type TProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: TProps) => {
  const ref = useRef(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const ulElement = ref.current;
    if (!ulElement) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsWide(entry.contentRect.width >= WIDE_BREAKPOINT_PX);
    });
    observer.observe(ulElement);

    return () => observer.disconnect();
  }, []);

  const pages = getPaginationPages(totalPages, currentPage, isWide);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <ul ref={ref} className="flex flex-1 min-w-0 items-start gap-2 text-base text-text-brand font-medium leading-5">
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
