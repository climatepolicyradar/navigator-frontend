import { DocumentMagnifyIcon } from "@components/svg/Icons";

import { MAX_RESULTS } from "@constants/paging";

type TProps = {
  dataAttribute: string;
  count: number;
  overideText?: string | JSX.Element;
  active: boolean;
  onClick?: () => void;
};

const formatCount = (count: number) => {
  return count >= MAX_RESULTS ? `More than ${MAX_RESULTS}` : count;
};

export const SearchMatchesButton = ({ count, dataAttribute, overideText, active, onClick }: TProps) => {
  return (
    <button
      data-analytics="search-result-matches-button"
      data-slug={dataAttribute}
      onClick={onClick}
      className={`flex gap-1 items-center rounded-full border border-gray-200 py-1 px-2 transition hover:bg-blue-100 hover:border-blue-200 active:bg-blue-600 active:text-white ${
        active && "bg-blue-600 text-white"
      }`}
      aria-label={`View ${formatCount(count)} match${count > 1 ? "es" : ""} in documents`}
    >
      <DocumentMagnifyIcon width="16" height="16" />
      {overideText ? overideText : `${formatCount(count)} match${count > 1 ? "es" : ""} in documents`}
    </button>
  );
};
