import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import ByTextInput from "../filters/ByTextInput";
import BySelect from "../filters/BySelect";
import MultiList from "../filters/MultiList";
import ExactMatch from "../filters/ExactMatch";
import ByDateRange from "../filters/ByDateRange";
import { currentYear, minYear } from "@constants/timedate";
import { TSearchCriteria } from "@types";
import { ExternalLink } from "@components/ExternalLink";
import { ThemeContext } from "@context/ThemeContext";
import { QUERY_PARAMS } from "@constants/queryParams";
import { LinkWithQuery } from "@components/LinkWithQuery";

interface SearchFiltersProps {
  handleFilterChange(type: string, value: string, action?: string): void;
  handleYearChange(values: number[]): void;
  handleRegionChange(type: any, regionName: any): void;
  handleClearSearch(): void;
  handleSearchChange(type: string, value: string): void;
  searchCriteria: TSearchCriteria;
  regions: object[];
  filteredCountries: object[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
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
      <div className="flex md:justify-between items-center mt-2 md:mt-0">
        <div className="text-indigo-400 font-medium mr-2 md:mr-0">{t("Filter by")}</div>
        {showClear && (
          <button className="underline text-sm text-blue-500 hover:text-indigo-600 transition duration-300" onClick={handleClearSearch}>
            Clear all filters
          </button>
        )}
      </div>

      <div className="my-4 text-sm text-indigo-500">
        <div data-cy="exact-match">
          <ExactMatch checked={searchCriteria.exact_match} id="exact-match" handleSearchChange={handleSearchChange} />
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
        <div className="relative mt-8 mb-12">
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
        <div className="my-8 pt-8 border-t border-lineBorder" data-cy="methodology-notice">
          <p className="text-center">
            For more info see
            <br />
            {theme === "cpr" ? (
              <ExternalLink url="https://github.com/climatepolicyradar/methodology" className="underline text-blue-600">
                our methodology page
              </ExternalLink>
            ) : (
              <LinkWithQuery href="/methodology" className="underline text-blue-600">
                our methodology page
              </LinkWithQuery>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
