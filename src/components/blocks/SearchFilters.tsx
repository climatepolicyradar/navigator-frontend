import { useEffect, useState, useMemo } from "react";

import useGetThemeConfig from "@hooks/useThemeConfig";

import Tooltip from "@components/tooltip";
import { ExternalLink } from "@components/ExternalLink";
import { DateRange } from "../filters/DateRange";
import { Accordian } from "@components/accordian/Accordian";
import { InputListContainer } from "@components/filters/InputListContainer";
import { TypeAhead } from "../forms/TypeAhead";
import { InputCheck } from "@components/forms/Checkbox";
import { InputRadio } from "@components/forms/Radio";
import { AppliedFilters } from "@components/filters/AppliedFilters";
import Loader from "@components/Loader";

import { currentYear, minYear } from "@constants/timedate";
import { QUERY_PARAMS } from "@constants/queryParams";

import { getCountriesFromRegions } from "@helpers/getCountriesFromRegions";

import { TGeography, TOrganisationDictionary, TSearchCriteria, TThemeConfigFilter, TThemeConfigOption } from "@types";
import { ParsedUrlQuery } from "querystring";
import { canDisplayFilter } from "@utils/canDisplayFilter";

const { default: MethodologyLink } = await import(`/themes/${process.env.THEME}/components/MethodologyLink`);

const isCategoryChecked = (selectedCatgeory: string | undefined, themeConfigCategory: TThemeConfigOption) => {
  if (selectedCatgeory) {
    if (selectedCatgeory === themeConfigCategory.slug) {
      return true;
    }
  }

  if (!selectedCatgeory && themeConfigCategory.slug.toLowerCase() === "all") return true;

  return false;
};

const renderFilterOptions = (
  filter: TThemeConfigFilter,
  query: ParsedUrlQuery,
  handleFilterChange: Function,
  organisations: TOrganisationDictionary
) => {
  if (filter.options && filter.options.length > 0) {
    return filter.options.map((option) =>
      filter.type === "radio" ? (
        <InputRadio
          key={option.slug}
          label={option.label}
          checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option.slug)}
          onChange={() => null} // supress normal radio behaviour to allow to deselection
          onClick={() => {
            handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug, true);
          }}
        />
      ) : (
        <InputCheck
          key={option.slug}
          label={option.label}
          checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option.slug)}
          onChange={() => {
            handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option.slug);
          }}
        />
      )
    );
  }
  if (filter.corporaTypeKey && organisations && organisations[filter.corporaTypeKey]) {
    // check our organisation contains the filter in its list of taxonomies
    // we  do not want to attempt to render if our config is unaligned or our taxonomy does not exist
    const corpus = organisations[filter.corporaTypeKey].corpora.find((corpus) => corpus.taxonomy.hasOwnProperty(filter.taxonomyKey));
    if (corpus) {
      return corpus.taxonomy[filter.taxonomyKey]?.allowed_values.map((option: string) =>
        filter.type === "radio" ? (
          <InputRadio
            key={option}
            label={option}
            checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option)}
            onChange={() => null} // supress normal radio behaviour to allow to deselection
            onClick={() => {
              handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option, true);
            }}
          />
        ) : (
          <InputCheck
            key={option}
            label={option}
            checked={query && query[QUERY_PARAMS[filter.taxonomyKey]] && query[QUERY_PARAMS[filter.taxonomyKey]].includes(option)}
            onChange={() => {
              handleFilterChange(QUERY_PARAMS[filter.taxonomyKey], option);
            }}
          />
        )
      );
    }
  }
  return null;
};

type TSearchFiltersProps = {
  searchCriteria: TSearchCriteria;
  query: ParsedUrlQuery;
  regions: TGeography[];
  countries: TGeography[];
  organisations: TOrganisationDictionary;
  handleFilterChange(type: string, value: string, clearOthersOfType?: boolean): void;
  handleYearChange(values: number[], reset?: boolean): void;
  handleRegionChange(region: string): void;
  handleClearSearch(): void;
  handleDocumentCategoryClick(value: string): void;
};

const SearchFilters = ({
  searchCriteria,
  query,
  regions,
  countries,
  organisations,
  handleFilterChange,
  handleYearChange,
  handleRegionChange,
  handleClearSearch,
  handleDocumentCategoryClick,
}: TSearchFiltersProps) => {
  const { status: themeConfigStatus, themeConfig } = useGetThemeConfig();
  const [showClear, setShowClear] = useState(false);

  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [] },
  } = searchCriteria;

  const thisYear = currentYear();

  // memoize the filtered countries
  const availableCountries = useMemo(() => {
    return getCountriesFromRegions({ regions, countries, selectedRegions: regionFilters });
  }, [regionFilters, regions, countries]);

  // Show clear button if there are filters applied
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
    <div id="search_filters" data-cy="seach-filters" className="text-sm text-textNormal flex flex-col gap-5">
      {themeConfigStatus === "loading" && <Loader size="20px" />}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <p className="text-xs uppercase">Filters</p>
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
        {showClear && (
          <button className="anchor underline text-[13px]" onClick={handleClearSearch}>
            Clear all
          </button>
        )}
      </div>

      <AppliedFilters filterChange={handleFilterChange} />

      {themeConfigStatus === "success" && themeConfig.categories && (
        <Accordian title={themeConfig.categories.label} data-cy={themeConfig.categories.label} key={themeConfig.categories.label} startOpen>
          <InputListContainer>
            {themeConfig.categories?.options?.map((option) => (
              <InputRadio
                key={option.slug}
                label={option.label}
                checked={query && isCategoryChecked(query[QUERY_PARAMS.category] as string, option)}
                onChange={() => {
                  handleDocumentCategoryClick(option.slug);
                }}
              />
            ))}
          </InputListContainer>
        </Accordian>
      )}

      {/* TODO: loop over array of filters from the config and display based on whether their "category" is in the selected category's list of corpusIds */}
      {themeConfigStatus === "success" &&
        themeConfig.filters.map((filter) => {
          if (!canDisplayFilter(filter, query, themeConfig)) return null;
          return (
            <Accordian title={filter.label} data-cy={filter.label} key={filter.label}>
              <InputListContainer>{renderFilterOptions(filter, query, handleFilterChange, organisations)}</InputListContainer>
            </Accordian>
          );
        })}

      <Accordian title="Region" data-cy="regions">
        <InputListContainer>
          {regions.map((region) => (
            <InputCheck
              key={region.slug}
              label={region.display_value}
              checked={regionFilters && regionFilters.includes(region.slug)}
              onChange={() => {
                handleRegionChange(region.slug);
              }}
            />
          ))}
        </InputListContainer>
      </Accordian>

      <Accordian title="Published jurisdiction" data-cy="countries" overflowOverride>
        <InputListContainer>
          <TypeAhead
            list={availableCountries}
            selectedList={countryFilters}
            keyField="slug"
            keyFieldDisplay="display_value"
            filterType={QUERY_PARAMS.country}
            handleFilterChange={handleFilterChange}
          />
        </InputListContainer>
      </Accordian>

      <Accordian title="Date" data-cy="date-range">
        <DateRange type="year_range" handleChange={handleYearChange} defaultValues={searchCriteria.year_range} min={minYear} max={thisYear} />
      </Accordian>

      <div className="my-5 pt-5 border-t" data-cy="methodology-notice">
        <p className="text-center mb-6">
          <ExternalLink url="https://form.jotform.com/233132076355350">Get notified when we add new filters</ExternalLink>
        </p>
        <p className="text-center">
          For more info see
          <br />
          <MethodologyLink />
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;
