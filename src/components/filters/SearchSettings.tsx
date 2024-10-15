import { useEffect, useRef, useState } from "react";
import { ParsedUrlQuery } from "querystring";

import { SearchSettingsList } from "./SearchSettingsList";
import { SearchSettingsItem } from "./SearchSettingsItem";

import { QUERY_PARAMS } from "@constants/queryParams";
import { sortOptions, sortOptionsBrowse } from "@constants/sortOptions";

type TProps = {
  queryParams: ParsedUrlQuery;
  handleSortClick: (sortOption: string) => void;
  handleSearchChange: (key: string, value: string) => void;
  setShowOptions?: (value: boolean) => void;
};

const getCurrentSortChoice = (queryParams: ParsedUrlQuery, isBrowsing: boolean) => {
  const field = queryParams[QUERY_PARAMS.sort_field];
  const order = queryParams[QUERY_PARAMS.sort_order];
  if (field === undefined && order === undefined) {
    if (isBrowsing) return "null";
    return "relevance";
  }
  return `${field}:${order}`;
};

const getCurrentSemanticSearchChoice = (queryParams: ParsedUrlQuery) => {
  const exactMatch = queryParams[QUERY_PARAMS.exact_match];
  if (exactMatch === undefined) {
    return "false";
  }
  return exactMatch as string;
};

export const SearchSettings = ({ queryParams, handleSortClick, handleSearchChange, setShowOptions }: TProps) => {
  const searchOptionsRef = useRef(null);
  const [options, setOptions] = useState(sortOptions);

  const isBrowsing = !queryParams[QUERY_PARAMS.query_string] || queryParams[QUERY_PARAMS.query_string]?.toString().trim() === "";

  const handleSemanticSearchClick = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    handleSearchChange(QUERY_PARAMS.exact_match, value);
  };

  const handleSortOptionClick = (e: React.MouseEvent<HTMLAnchorElement>, sortOption: string) => {
    e.preventDefault();
    handleSortClick(sortOption);
  };

  useEffect(() => {
    setOptions(isBrowsing ? sortOptionsBrowse : sortOptions);
  }, [isBrowsing]);

  // Clicking outside the search options will close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOptionsRef.current && !searchOptionsRef.current.contains(event.target)) {
        setShowOptions && setShowOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [searchOptionsRef, setShowOptions]);

  return (
    <div className="absolute top-full right-0 bg-nearBlack rounded-lg p-4 z-10 text-white text-sm w-[180px]" ref={searchOptionsRef}>
      {queryParams[QUERY_PARAMS.category]?.toString() !== "Litigation" && (
        <>
          <div className="border-b border-white/[0.24] pb-4 mb-4">
            <SearchSettingsList data-cy="Semantic search" aria-label="Semantic search">
              <SearchSettingsItem
                onClick={(e) => handleSemanticSearchClick(e, "false")}
                isActive={getCurrentSemanticSearchChoice(queryParams) === "false"}
              >
                Related phrases
              </SearchSettingsItem>
              <SearchSettingsItem
                onClick={(e) => handleSemanticSearchClick(e, "true")}
                isActive={getCurrentSemanticSearchChoice(queryParams) === "true"}
              >
                Exact phrases only
              </SearchSettingsItem>
            </SearchSettingsList>
          </div>
          <SearchSettingsList data-cy="sort" aria-label="Sort">
            {options.map((item) => (
              <SearchSettingsItem
                key={item.value}
                onClick={(e) => handleSortOptionClick(e, item.value)}
                isActive={item.value === getCurrentSortChoice(queryParams, isBrowsing)}
              >
                {item.label}
              </SearchSettingsItem>
            ))}
          </SearchSettingsList>
        </>
      )}
    </div>
  );
};
