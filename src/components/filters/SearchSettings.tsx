import { ParsedUrlQuery } from "querystring";

import { MutableRefObject, useEffect, useRef, useState } from "react";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { SEARCH_PASSAGE_ORDER } from "@/constants/searchPassagesOrder";
import { SEARCH_SETTINGS } from "@/constants/searchSettings";
import { sortOptions, sortOptionsBrowse } from "@/constants/sortOptions";
import { getCurrentSearchChoice } from "@/utils/getCurrentSearchChoice";
import { getCurrentSortChoice } from "@/utils/getCurrentSortChoice";
import { getCurrentPassagesOrderChoice } from "@/utils/getPassagesSortOrder";

import { SearchSettingsItem } from "./SearchSettingsItem";
import { SearchSettingsList } from "./SearchSettingsList";

interface IProps {
  extraClasses?: string;
  handlePassagesOrderChange?: (passagesOption: string) => void;
  handleSearchChange?: (key: string, value: string) => void;
  handleSortClick?: (sortOption: string) => void;
  queryParams: ParsedUrlQuery;
  setShowOptions?: (value: boolean) => void;
  settingsButtonRef?: MutableRefObject<any>;
}

export const SearchSettings = ({
  extraClasses = "",
  handlePassagesOrderChange,
  handleSearchChange,
  handleSortClick,
  queryParams,
  setShowOptions,
  settingsButtonRef,
}: IProps) => {
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
    handlePassagesOrderChange?.(value);
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
      className={`absolute top-full mt-1 right-0 p-3 w-[180px] max-w-[350px] bg-surface-light border border-border-light rounded-md shadow-md text-sm leading-normal select-none focus-visible:outline-0 ${extraClasses}`}
      ref={searchOptionsRef}
      data-cy="search-settings"
    >
      {queryParams[QUERY_PARAMS.category]?.toString().toLowerCase() === "litigation" && <p>No filters available</p>}
      {queryParams[QUERY_PARAMS.category]?.toString().toLowerCase() !== "litigation" && (
        <>
          {handleSearchChange && (
            <div className={`${handlePassagesOrderChange || handleSortClick ? "border-b border-white/[0.24] pb-4 mb-4" : ""}`}>
              <SearchSettingsList data-cy="semantic-search" aria-label="Semantic search">
                <SearchSettingsItem onClick={(e) => handleSemanticSearchClick(e, "true")} isActive={getCurrentSearchChoice(queryParams) === "true"}>
                  {SEARCH_SETTINGS.exact}
                </SearchSettingsItem>
                <SearchSettingsItem onClick={(e) => handleSemanticSearchClick(e, "false")} isActive={getCurrentSearchChoice(queryParams) === "false"}>
                  <span className="">
                    <span>{SEARCH_SETTINGS.semantic}</span>
                    <span className="block text-text-secondary">
                      This may surface results that are not relevant to your search. We are working on improving this.
                    </span>
                  </span>
                </SearchSettingsItem>
              </SearchSettingsList>
            </div>
          )}
          {handlePassagesOrderChange && (
            <div className={`${handleSortClick ? "border-b border-white/[0.24] pb-4 mb-4" : ""}`}>
              <SearchSettingsList data-cy="passages-sort" aria-label="Passages sort">
                <SearchSettingsItem
                  onClick={(e) => handlePassagesOrderClick(e, "false")}
                  isActive={getCurrentPassagesOrderChoice(queryParams) === false}
                >
                  {SEARCH_PASSAGE_ORDER.relevance}
                </SearchSettingsItem>
                <SearchSettingsItem
                  onClick={(e) => handlePassagesOrderClick(e, "true")}
                  isActive={getCurrentPassagesOrderChoice(queryParams) === true}
                >
                  {SEARCH_PASSAGE_ORDER.page}
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
