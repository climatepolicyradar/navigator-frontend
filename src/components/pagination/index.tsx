import { Fragment } from "react";
import { PageButton } from "./pageButton";

import { MAX_PAGES, RESULTS_PER_PAGE, PAGES_PER_CONTINUATION_TOKEN } from "@constants/paging";

interface PaginationProps {
  currentPage: number;
  onChange(ct: string, offSet: number): void;
  maxNeighbourDistance?: number;
  totalHits?: number;
  continuationToken?: string;
  continuationTokens?: string;
}

// parsedTokens is 0 indexed, pages are 1 indexed
const calculateToken = (page: number, tokens: string[]) => {
  if (page % PAGES_PER_CONTINUATION_TOKEN) {
    return tokens[Math.floor(page / PAGES_PER_CONTINUATION_TOKEN)];
  }
  // for page 5 this is index 0, for page 10 this is index 1 and so on
  return tokens[page / PAGES_PER_CONTINUATION_TOKEN - 1];
};

const calculateOffset = (page: number) => {
  return ((page - 1) % PAGES_PER_CONTINUATION_TOKEN) * RESULTS_PER_PAGE;
};

const Pagination = ({ currentPage, onChange, totalHits = 0, continuationToken = null, continuationTokens = "[]" }: PaginationProps) => {
  const parsedTokens: string[] = JSON.parse(continuationTokens);
  // empty string to the beginning of the array accounts for the first set of pages that do not require a token
  parsedTokens.splice(0, 0, "");
  // ONLY if the continuation token is new
  // add the continuation token to the array for the next set of pages
  if (continuationToken && !parsedTokens.includes(continuationToken)) parsedTokens.push(continuationToken);

  const totalPagesForHits = Math.ceil(totalHits / RESULTS_PER_PAGE);
  // display the number of pages based on the number of continuation tokens, or the total number of pages - whichever is smaller
  const numberOfPagesToDisplay = Math.min(parsedTokens.length * PAGES_PER_CONTINUATION_TOKEN, totalPagesForHits, MAX_PAGES);
  const displayElipsis = totalPagesForHits > MAX_PAGES && numberOfPagesToDisplay < MAX_PAGES;

  return (
    <div className="pagination w-full flex flex-wrap justify-center mt-6">
      <>
        {new Array(numberOfPagesToDisplay).fill(0).map((_, itemIndex) => {
          const pageNumber = itemIndex + 1;
          return (
            <Fragment key={pageNumber}>
              <PageButton
                pageNumber={pageNumber}
                ct={calculateToken(pageNumber, parsedTokens)}
                offSet={calculateOffset(pageNumber)}
                clickHandler={onChange}
                isCurrentPage={pageNumber === currentPage}
              />
            </Fragment>
          );
        })}
        {displayElipsis && <span className="md:mx-1">...</span>}
      </>
    </div>
  );
};

export default Pagination;
