import Tooltip from "@components/tooltip";

import { MAX_RESULTS } from "@constants/paging";

type TProps = {
  hits: number;
  queryString: string | string[];
};

export const NoOfResults = ({ hits, queryString }: TProps) => {
  let resultsMsg = `Showing`;
  if (hits < MAX_RESULTS) {
    resultsMsg += ` ${hits} results`;
  } else {
    resultsMsg += ` the top ${MAX_RESULTS} results`;
  }
  return (
    <>
      {resultsMsg}{" "}
      {queryString && (
        <>
          for "<span className="font-bold">{queryString}</span>"
          {hits >= MAX_RESULTS && (
            <div className="ml-2 inline-block">
              <Tooltip
                id="search-results-number"
                tooltip={
                  <>
                    We limit the number of search results to {MAX_RESULTS} so that you get the best performance from our tool. We're working on a way
                    to remove this limit.
                  </>
                }
                icon="i"
                place="bottom"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
