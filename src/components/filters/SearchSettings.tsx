import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ParsedUrlQuery } from "querystring";

import { SearchSettingsList } from "./SearchSettingsList";
import { SearchSettingsItem } from "./SearchSettingsItem";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { sortOptions, sortOptionsBrowse } from "@/constants/sortOptions";

type TProps = {
  extraClasses?: string;
  handlePassagesClick?: (passagesOption: string) => void;
  handleSearchChange?: (key: string, value: string) => void;
  handleSortClick?: (sortOption: string) => void;
  queryParams: ParsedUrlQuery;
  setShowOptions?: (value: boolean) => void;
  settingsButtonRef?: MutableRefObject<any>;
};

const getCurrentSortChoice = (queryParams: ParsedUrlQuery, isBrowsing: boolean) => {
  const field = queryParams[QUERY_PARAMS.sort_field];
  const order = queryParams[QUERY_PARAMS.sort_order];
  if (field === undefined && order === undefined) {
    if (isBrowsing) return "date:desc";
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

const getCurrentPassagesOrderChoice = (queryParams: ParsedUrlQuery) => {
  return queryParams[QUERY_PARAMS.sort_within_page] === "true";
};

export const SearchSettings = ({
  extraClasses = "",
  handlePassagesClick,
  handleSearchChange,
  handleSortClick,
  queryParams,
  setShowOptions,
  settingsButtonRef,
}: TProps) => {
  const searchOptionsRef = useRef(null);
  const [options, setOptions] = useState(sortOptions);

  // no query string OR query string is empty
  const isBrowsing = !queryParams[QUERY_PARAMS.query_string] || queryParams[QUERY_PARAMS.query_string]?.toString().trim() === "";

  const handleSemanticSearchClick = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    setShowOptions(false);
    handleSearchChange?.(QUERY_PARAMS.exact_match, value);
  };

  const handleSortOptionClick = (e: React.MouseEvent<HTMLAnchorElement>, sortOption: string) => {
    e.preventDefault();
    setShowOptions(false);
    handleSortClick?.(sortOption);
  };

  const handlePassagesOrderClick = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    setShowOptions(false);
    handlePassagesClick?.(value);
  };

  useEffect(() => {
    setOptions(isBrowsing ? sortOptionsBrowse : sortOptions);
  }, [isBrowsing]);

  // Clicking outside the search options will close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchOptionsRef?.current &&
        !searchOptionsRef.current.contains(event.target) &&
        settingsButtonRef?.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setShowOptions && setShowOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [searchOptionsRef, settingsButtonRef, setShowOptions]);

  return (
    <div
      className={`absolute top-full right-0 bg-nearBlack rounded-lg p-4 mt-2 z-10 text-white text-sm w-[180px] ${extraClasses}`}
      ref={searchOptionsRef}
      data-cy="search-settings"
    >
      {queryParams[QUERY_PARAMS.category]?.toString().toLowerCase() === "litigation" && <p>No filters available</p>}
      {queryParams[QUERY_PARAMS.category]?.toString().toLowerCase() !== "litigation" && (
        <>
          {handleSearchChange && (
            <div className={`${handlePassagesClick || handleSortClick ? "border-b border-white/[0.24] pb-4 mb-4" : ""}`}>
              <SearchSettingsList data-cy="semantic-search" aria-label="Semantic search">
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
          )}
          {handlePassagesClick && (
            <div className={`${handleSortClick ? "border-b border-white/[0.24] pb-4 mb-4" : ""}`}>
              <SearchSettingsList data-cy="passages-sort" aria-label="Passages sort">
                <SearchSettingsItem
                  onClick={(e) => handlePassagesOrderClick(e, "false")}
                  isActive={getCurrentPassagesOrderChoice(queryParams) === false}
                >
                  Relevance
                </SearchSettingsItem>
                <SearchSettingsItem
                  onClick={(e) => handlePassagesOrderClick(e, "true")}
                  isActive={getCurrentPassagesOrderChoice(queryParams) === true}
                >
                  Position in document
                </SearchSettingsItem>
              </SearchSettingsList>
            </div>
          )}
          {handleSortClick && (
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
          )}
        </>
      )}
    </div>
  );
};
