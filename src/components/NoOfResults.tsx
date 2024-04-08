import Tooltip from "@components/tooltip";

type TProps = {
  hits: number;
  queryString: string | string[];
};

export const NoOfResults = ({ hits, queryString }: TProps) => {
  let resultsMsg = `Showing`;
  if (hits < 100) {
    resultsMsg += ` ${hits} results`;
  } else {
    resultsMsg += ` the top 100 results`;
  }
  return (
    <>
      {resultsMsg}{" "}
      {queryString && (
        <>
          for "<span className="font-bold">{queryString}</span>"
          {hits >= 100 && (
            <div className="ml-2 inline-block">
              <Tooltip
                id="search-results-number"
                tooltip={
                  <>
                    We limit the number of search results to 100 so that you get the best performance from our tool. We're working on a way to remove
                    this limit.
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
