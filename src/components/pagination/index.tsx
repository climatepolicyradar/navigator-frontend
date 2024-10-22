import { Fragment } from "react";
import { PageButton } from "./pageButton";

import { MAX_PAGES, RESULTS_PER_PAGE, PAGES_PER_CONTINUATION_TOKEN } from "@constants/paging";

import { getCurrentPage } from "@utils/getCurrentPage";

interface PaginationProps {
  onChange(ct: string, offSet: number): void;
  offset?: string | number;
  maxNeighbourDistance?: number;
  totalHits?: number;
  activeContinuationToken?: string;
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

const calcCurrentPage = (offset: string | number = 0, continuationTokens: string = "[]", activeContinuationToken: string) => {
  const offSet = parseInt(offset.toString());
  const cts: string[] = JSON.parse(continuationTokens);
  // empty string represents the first 'set' of pages (as these do not require a continuation token)
  cts.splice(0, 0, "");
  return getCurrentPage(offSet, RESULTS_PER_PAGE, PAGES_PER_CONTINUATION_TOKEN, cts, activeContinuationToken);
};

const Pagination = ({
  onChange,
  offset,
  totalHits = 0,
  continuationToken = null,
  continuationTokens = "[]",
  activeContinuationToken,
}: PaginationProps) => {
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
    <div id="pagination" className="pagination m-auto flex flex-wrap mt-5 gap-1" data-cy="pagination">
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
                isCurrentPage={pageNumber === calcCurrentPage(offset, continuationTokens, activeContinuationToken)}
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
