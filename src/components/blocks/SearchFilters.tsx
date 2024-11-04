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

import { TGeography, TOrganisationDictionary, TSearchCriteria, TThemeConfig, TThemeConfigFilter, TThemeConfigOption } from "@types";
import { ParsedUrlQuery } from "querystring";
import { canDisplayFilter } from "@utils/canDisplayFilter";
import { getFilterLabel } from "@utils/getFilterLabel";

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

const getTaxonomyAllowedValues = (corporaKey: string, taxonomyKey: string, organisations: TOrganisationDictionary) => {
  const allowedValues = organisations[corporaKey].corpora.find((corpus) => corpus.taxonomy.hasOwnProperty(taxonomyKey))?.taxonomy[taxonomyKey]
    ?.allowed_values;

  return allowedValues;
};

const renderFilterOptions = (
  filter: TThemeConfigFilter,
  query: ParsedUrlQuery,
  handleFilterChange: Function,
  organisations: TOrganisationDictionary,
  themeConfig: TThemeConfig
) => {
  // If the filter has its own options defined, display them
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
  // Check the dependancy filter key for which filters to load the taxonomy for
  let options = [];
  const dependantFilter = themeConfig.filters.find((f) => f.taxonomyKey === filter.dependantFilterKey);
  const queryDependantFilter = query[QUERY_PARAMS[dependantFilter?.taxonomyKey]] || [];

  // If no filter of a given dependancy is selected, load all dependancy taxonomy values
  if (queryDependantFilter.length === 0) {
    for (let index = 0; index < dependantFilter.options.length; index++) {
      const option = dependantFilter.options[index];
      const taxonomyAllowedValues = getTaxonomyAllowedValues(option.corporaKey, filter.taxonomyKey, organisations);
      options = options.concat(taxonomyAllowedValues);
    }
  } else {
    // Otherwise, load the taxonomy values for the selected dependancy filter(s)
    if (typeof queryDependantFilter === "string") {
      const filterCoporaKey = dependantFilter.options.find((option) => option.slug === queryDependantFilter)?.corporaKey;
      const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCoporaKey, filter.taxonomyKey, organisations);
      options = options.concat(taxonomyAllowedValues);
    } else {
      for (let index = 0; index < queryDependantFilter.length; index++) {
        const filterCoporaKey = dependantFilter.options.find((option) => option.slug === queryDependantFilter[index])?.corporaKey;
        const taxonomyAllowedValues = getTaxonomyAllowedValues(filterCoporaKey, filter.taxonomyKey, organisations);
        options = options.concat(taxonomyAllowedValues);
      }
    }
  }

  // De-duplicate and sort the options
  const optionsDeDuped: string[] = [...new Set(options.sort())];

  if (optionsDeDuped.length) {
    return optionsDeDuped.map((option: string) =>
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
        <Accordian title={themeConfig.categories.label} data-cy="categories" key={themeConfig.categories.label} startOpen>
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

      {themeConfigStatus === "success" &&
        themeConfig.filters.map((filter) => {
          // If the filter is not in the selected category, don't display it
          if (!canDisplayFilter(filter, query, themeConfig)) return;
          return (
            <Accordian
              title={filter.label}
              data-cy={filter.label}
              key={filter.label}
              startOpen={filter.startOpen === "true" || !!query[QUERY_PARAMS[filter.taxonomyKey]]}
              showFade={filter.showFade}
            >
              <InputListContainer>{renderFilterOptions(filter, query, handleFilterChange, organisations, themeConfig)}</InputListContainer>
            </Accordian>
          );
        })}

      <Accordian
        title={getFilterLabel("Region", "region", query[QUERY_PARAMS.category], themeConfig)}
        data-cy="regions"
        startOpen={!!query[QUERY_PARAMS.region]}
      >
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

      <Accordian
        title={getFilterLabel("Published jurisdiction", "country", query[QUERY_PARAMS.category], themeConfig)}
        data-cy="countries"
        overflowOverride
        className="relative z-10"
      >
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

      <Accordian
        title={getFilterLabel("Date", "date", query[QUERY_PARAMS.category], themeConfig)}
        data-cy="date-range"
        startOpen={!!query[QUERY_PARAMS.year_range]}
      >
        <DateRange type="year_range" handleChange={handleYearChange} defaultValues={searchCriteria.year_range} min={minYear} max={thisYear} />
      </Accordian>

      <div className="my-5 pt-5 border-t" data-cy="methodology-notice">
        <p>
          Read <MethodologyLink /> for more information on how we collect and analyse our data.
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;
