import { SearchLimitTooltip } from "@components/tooltip/SearchLimitTooltip";

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
          for "<span className="font-medium">{queryString}</span>"
          {hits >= MAX_RESULTS && (
            <div className="ml-2 inline-block">
              <SearchLimitTooltip />
            </div>
          )}
        </>
      )}
    </>
  );
};
