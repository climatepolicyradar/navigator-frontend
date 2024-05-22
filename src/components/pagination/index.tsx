import { calculatePageCount } from "@utils/paging";
import { PER_PAGE } from "@constants/paging";
const PER_CONTINUATION_TOKEN = 100;

const SETS_PER_PAGE = PER_CONTINUATION_TOKEN / PER_PAGE;

interface PaginationProps {
  pageNumber: number;
  onChange(ct: string, offSet: number): void;
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
    if (page % SETS_PER_PAGE) {
      return parsedTokens[Math.floor(page / SETS_PER_PAGE)];
    }
    return parsedTokens[page / SETS_PER_PAGE - 1];
  };

  const getOffset = (page: number) => {
    const offSet = ((page - 1) % SETS_PER_PAGE) * PER_PAGE;
    return offSet;
  };

  const renderPageButton = (page: number, ct: string, offSet: number) => {
    const baseCssClasses = "mx-1 rounded px-3 py-1 transition duration-300 text-sm md:text-base";
    const colorCssClasses = page === pageNumber ? "bg-blue-400 text-white pointer-events-none" : "hover:bg-gray-100";
    return (
      <button
        key={page}
        value={page}
        type="button"
        className={`${baseCssClasses} ${colorCssClasses}`}
        onClick={() => {
          onChange(ct, offSet);
        }}
        data-ct={ct}
        data-offset={offSet}
      >
        {page}
      </button>
    );
  };

  // generate page sets at results per page per 100 items, with batches of 100 items determined by number of continuation tokens
  const pageSets = parsedTokens.length * (PER_CONTINUATION_TOKEN / resultsPerPage);
  const totalPagesForHits = Math.ceil(totalHits / resultsPerPage);
  const numberOfPages = calculatePageCount(pageSets, totalPagesForHits);

  return (
    <div className="pagination w-full flex justify-center mt-6">
      <>
        {new Array(numberOfPages).fill(0).map((_, itemIndex) => renderPageButton(itemIndex + 1, getToken(itemIndex + 1), getOffset(itemIndex + 1)))}
        {totalPagesForHits > numberOfPages && <span className="md:mx-1">...</span>}
      </>
    </div>
  );
};

export default Pagination;
