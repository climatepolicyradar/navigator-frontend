import { calculatePageCount } from "@utils/paging";
import { PER_PAGE } from "@constants/paging";
const PER_CONTINUATION_TOKEN = 100;

interface PaginationProps {
  pageNumber: number;
  onChange(page: number): void;
  maxNeighbourDistance?: number;
  totalHits?: number;
  resultsPerPage?: number;
  continuationTokens?: string[];
}

const Pagination = ({
  pageNumber,
  onChange,
  maxNeighbourDistance = 2,
  totalHits = 0,
  resultsPerPage = PER_PAGE,
  continuationTokens = [],
}: PaginationProps) => {
  const renderPlaceholder = (page: number) => {
    return (
      <span key={page} className="md:mx-1">
        ...
      </span>
    );
  };

  const renderPageButton = (page: number) => {
    const baseCssClasses = "mx-1 rounded px-3 py-1 transition duration-300 text-sm md:text-base";
    const colorCssClasses = page === pageNumber ? "bg-blue-400 text-white pointer-events-none" : "hover:bg-gray-100";
    return (
      <button
        key={page}
        value={page}
        type="button"
        className={`${baseCssClasses} ${colorCssClasses}`}
        onClick={() => {
          onChange(page);
        }}
      >
        {page}
      </button>
    );
  };

  // generate page sets at results per page per 100 items, with batches of 100 items determined by number of continuation tokens
  const pageSets = (continuationTokens.length + 1) * (PER_CONTINUATION_TOKEN / resultsPerPage);
  const totalPagesForHits = Math.ceil(totalHits / resultsPerPage);
  const numberOfPages = calculatePageCount(pageSets);
  // console.log("pagination totalPagesForHits", totalPagesForHits);
  // console.log("pagination continuationTokens", continuationTokens);
  // console.log("pagination pageSets", pageSets);
  // console.log("pagination totalHits", totalHits);

  return (
    // <div className="pagination w-full flex justify-center mt-6">
    //   {new Array(pageCount).fill(0).map((_, itemIndex) => {
    //     const page = itemIndex + 1;
    //     if (page === 1 || page === pageCount || (page >= pageNumber - maxNeighbourDistance && page <= pageNumber + maxNeighbourDistance)) {
    //     }
    //     if (page === 2 || page === pageCount - 1) {
    //       return renderPlaceholder(page);
    //     }
    //   })}
    // </div>
    <div className="pagination w-full flex justify-center mt-6">
      <>
        {new Array(numberOfPages).fill(0).map((_, itemIndex) => renderPageButton(itemIndex + 1))}
        {totalPagesForHits > numberOfPages && renderPlaceholder(numberOfPages + 1)}
      </>
    </div>
  );
};

export default Pagination;
