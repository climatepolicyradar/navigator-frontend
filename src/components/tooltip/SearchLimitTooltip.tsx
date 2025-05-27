import { MAX_RESULTS } from "@/constants/paging";

import Tooltip from ".";

interface IProps {
  colour?: string;
  textOverride?: string;
}

export const SearchLimitTooltip = ({ colour, textOverride }: IProps) => {
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
