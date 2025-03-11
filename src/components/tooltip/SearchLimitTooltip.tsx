import Tooltip from ".";

import { MAX_RESULTS } from "@/constants/paging";

type TProps = {
  colour?: string;
  textOverride?: string;
};

export const SearchLimitTooltip = ({ colour, textOverride }: TProps) => {
  return (
    <Tooltip
      id="search-results-number"
      tooltip={
        <>
          {textOverride ??
            `We limit the number of search results to ${MAX_RESULTS} so that you get the best performance from our tool. We're working on a way to remove
          this limit.`}
        </>
      }
      icon="i"
      place="bottom"
      colour={colour}
    />
  );
};
