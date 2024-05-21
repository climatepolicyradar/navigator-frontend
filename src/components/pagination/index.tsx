import { calculatePageCount } from "@utils/paging";
import { PER_PAGE } from "@constants/paging";
const PER_CONTINUATION_TOKEN = 100;

interface PaginationProps {
  pageNumber: number;
  onChange(page: number, ct: string): void;
  maxNeighbourDistance?: number;
  totalHits?: number;
  resultsPerPage?: number;
  continuationToken?: string;
  continuationTokens?: string;
}

const Pagination = ({
  pageNumber,
  onChange,
  totalHits = 0,
  resultsPerPage = PER_PAGE,
  continuationToken = null,
  continuationTokens = "[]",
}: PaginationProps) => {
  const parsedTokens: string[] = JSON.parse(continuationTokens);
  // add empty string to the beginning of the array to account for the first page
  parsedTokens.splice(0, 0, "");
  // ONLY if the continuation token is new
  // add the continuation token to the array for the next set of pages
  if (continuationToken && !parsedTokens.includes(continuationToken)) parsedTokens.push(continuationToken);

  const getToken = (page: number) => {
    // console.log("getToken", "| page: " + page, "| % 5: " + (page % 5), "| floor: " + Math.floor(page / 5)); TODO: remove
    if (page % 5) {
      return parsedTokens[Math.floor(page / 5)];
    }
    return parsedTokens[page / 5 - 1];
  };

  const renderPageButton = (page: number, ct: string) => {
    const baseCssClasses = "mx-1 rounded px-3 py-1 transition duration-300 text-sm md:text-base";
    const colorCssClasses = page === pageNumber ? "bg-blue-400 text-white pointer-events-none" : "hover:bg-gray-100";
    return (
      <button
        key={page}
        value={page}
        type="button"
        className={`${baseCssClasses} ${colorCssClasses}`}
        onClick={() => {
          onChange(page, ct);
        }}
        data-ct={ct}
      >
        {page}
      </button>
    );
  };

  // generate page sets at results per page per 100 items, with batches of 100 items determined by number of continuation tokens
  const pageSets = parsedTokens.length * (PER_CONTINUATION_TOKEN / resultsPerPage);
  const totalPagesForHits = Math.ceil(totalHits / resultsPerPage);
  const numberOfPages = calculatePageCount(pageSets);

  return (
    <div className="pagination w-full flex justify-center mt-6">
      <>
        {new Array(numberOfPages).fill(0).map((_, itemIndex) => renderPageButton(itemIndex + 1, getToken(itemIndex + 1)))}
        {totalPagesForHits > numberOfPages && <span className="md:mx-1">...</span>}
      </>
    </div>
  );
};

export default Pagination;
