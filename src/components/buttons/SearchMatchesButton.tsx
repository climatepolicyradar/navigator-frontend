import { DocumentMagnifyIcon } from "@components/svg/Icons";

type TProps = {
  dataAttribute: string;
  count: number;
  overideText?: string | JSX.Element;
  onClick?: () => void;
};

export const SearchMatchesButton = ({ count, dataAttribute, overideText, onClick }: TProps) => {
  return (
    <button
      data-analytics="search-result-matches-button"
      data-slug={dataAttribute}
      onClick={onClick}
      className="flex gap-1 items-center ml-2 rounded-full border border-gray-200 py-1 px-2 transition hover:bg-blue-100 hover:border-blue-200 active:bg-blue-600 active:text-white"
    >
      <DocumentMagnifyIcon width="16" height="16" />
      {overideText ? overideText : `${count} match${count > 1 ? "es" : ""} in documents`}
    </button>
  );
};
