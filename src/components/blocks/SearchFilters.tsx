import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import ByTextInput from "../filters/ByTextInput";
import BySelect from "../filters/BySelect";
import MultiList from "../filters/MultiList";
import ByDateRange from "../filters/ByDateRange";
import { currentYear, minYear } from "@constants/timedate";
import { TSearchCriteria } from "@types";
import { ExternalLink } from "@components/ExternalLink";
import { ThemeContext } from "@context/ThemeContext";
import { QUERY_PARAMS } from "@constants/queryParams";
import { LinkWithQuery } from "@components/LinkWithQuery";
import BySemanticSearch from "@components/filters/BySemanticSearch";
import Tooltip from "@components/tooltip";
import { sortGeos } from "@utils/sorting";

type TSearchFiltersProps = {
  handleFilterChange(type: string, value: string): void;
  handleYearChange(values: number[]): void;
  handleRegionChange(type: any, regionName: any): void;
  handleClearSearch(): void;
  handleSearchChange(type: string, value: string): void;
  searchCriteria: TSearchCriteria;
  regions: object[];
  filteredCountries: object[];
};

const SearchFilters: React.FC<TSearchFiltersProps> = ({
  handleFilterChange,
  handleYearChange,
  searchCriteria,
  handleRegionChange,
  handleClearSearch,
  handleSearchChange,
  regions,
  filteredCountries,
}) => {
  const [showClear, setShowClear] = useState(false);
  const { t } = useTranslation("searchResults");
  const theme = useContext(ThemeContext);

  const {
    keyword_filters: { countries: countryFilters = [] },
  } = searchCriteria;

  const thisYear = currentYear();

  useEffect(() => {
    if (searchCriteria.year_range[0] !== minYear || searchCriteria.year_range[1] !== thisYear) {
      setShowClear(true);
    } else if (Object.keys(searchCriteria.keyword_filters).length > 0) {
      setShowClear(true);
    } else if (searchCriteria.exact_match) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [thisYear, searchCriteria]);

  return (
    <>
      <div className="mt-2 md:mt-0">
        <div className="mr-2 md:mr-0">
          Find documents containing
          <div className="ml-2 inline-block">
            <Tooltip
              id="filter-by"
              tooltip={
                <>
                  Selecting exact phrases only will narrow down your search to only show documents that contain the precise words you typed in the
                  search bar. Our enhanced search will look for similar and related terms, so you’ll get more results, with the most relevant ones
                  automatically appearing at the top. See our FAQs for more information.
                </>
              }
              icon="i"
              place="right"
            />
          </div>
        </div>
      </div>

      <div className="my-4 text-sm">
        <div data-cy="exact-match">
          <BySemanticSearch checked={searchCriteria.exact_match} handleSearchChange={handleSearchChange} />
        </div>
        <div className="relative mt-6" data-cy="regions">
          <BySelect
            list={regions}
            defaultValue={searchCriteria.keyword_filters?.regions ? searchCriteria.keyword_filters.regions[0] : ""}
            onChange={handleRegionChange}
            title={t("By region")}
            keyField="slug"
            keyFieldDisplay="display_value"
            filterType={QUERY_PARAMS.region}
            sortFunc={sortGeos}
          />
        </div>
        <div className="relative mt-6" data-cy="countries">
          <ByTextInput
            title={t("By country")}
            list={filteredCountries}
            selectedList={countryFilters}
            keyField="slug"
            keyFieldDisplay="display_value"
            filterType={QUERY_PARAMS.country}
            handleFilterChange={handleFilterChange}
          />
          <MultiList list={countryFilters} removeFilter={handleFilterChange} type={QUERY_PARAMS.country} dataCy="selected-countries" />
        </div>
        <div className="relative mt-8 mb-8">
          <div data-cy="date-range">
            <ByDateRange
              title={t("By date range")}
              type="year_range"
              handleChange={handleYearChange}
              defaultValues={searchCriteria.year_range}
              min={minYear}
              max={thisYear}
              clear={showClear}
            />
          </div>
        </div>
        <div>
          {showClear && (
            <button className="anchor text-sm" onClick={handleClearSearch}>
              Clear all filters
            </button>
          )}
        </div>
        <div className="my-8 pt-8 border-t" data-cy="methodology-notice">
          <p className="text-center">
            For more info see
            <br />
            {theme === "cpr" ? (
              <ExternalLink url="https://github.com/climatepolicyradar/methodology">our methodology page</ExternalLink>
            ) : (
              <LinkWithQuery href="/methodology">our methodology page</LinkWithQuery>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
