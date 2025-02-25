import { useEffect, useState, useMemo } from "react";
import { ParsedUrlQuery } from "querystring";

import useGetThemeConfig from "@hooks/useThemeConfig";

import { DateRange } from "../filters/DateRange";
import { Accordian } from "@components/accordian/Accordian";
import { InputListContainer } from "@components/filters/InputListContainer";
import { TypeAhead } from "../forms/TypeAhead";
import { InputCheck } from "@components/forms/Checkbox";
import { InputRadio } from "@components/forms/Radio";
import { AppliedFilters } from "@components/filters/AppliedFilters";
import Loader from "@components/Loader";
import { FilterOptions } from "./FilterOptions";

import { currentYear, minYear } from "@constants/timedate";
import { QUERY_PARAMS } from "@constants/queryParams";

import { getCountriesFromRegions } from "@helpers/getCountriesFromRegions";

import { canDisplayFilter } from "@utils/canDisplayFilter";
import { getFilterLabel } from "@utils/getFilterLabel";

import { TConcept, TCorpusTypeDictionary, TGeography, TSearchCriteria, TThemeConfigOption } from "@types";
import dynamic from "next/dynamic";

const MethodologyLink = dynamic(() => import(`/themes/${process.env.THEME}/components/MethodologyLink`));

const isCategoryChecked = (selectedCatgeory: string | undefined, themeConfigCategory: TThemeConfigOption) => {
  if (selectedCatgeory) {
    if (selectedCatgeory.toLowerCase() === themeConfigCategory.slug.toLowerCase()) {
      return true;
    }
  }

  if (!selectedCatgeory && themeConfigCategory.slug.toLowerCase() === "all") return true;

  return false;
};

const isConceptChecked = (selectedConceptLabel: string | undefined, concept: TConcept) => {
  if (selectedConceptLabel) {
    if (selectedConceptLabel.toLowerCase() === concept.preferred_label.toLowerCase()) {
      return true;
    }
  }
  return false;
};

type TSearchFiltersProps = {
  searchCriteria: TSearchCriteria;
  query: ParsedUrlQuery;
  regions: TGeography[];
  countries: TGeography[];
  corpus_types: TCorpusTypeDictionary;
  conceptsData?: TConcept[];
  handleFilterChange(type: string, value: string, clearOthersOfType?: boolean): void;
  handleYearChange(values: string[], reset?: boolean): void;
  handleRegionChange(region: string): void;
  handleConceptChange(concept: string): void;
  handleClearSearch(): void;
  handleDocumentCategoryClick(value: string): void;
};

const SearchFilters = ({
  searchCriteria,
  query,
  regions,
  countries,
  corpus_types,
  conceptsData,
  handleFilterChange,
  handleYearChange,
  handleRegionChange,
  handleConceptChange,
  handleClearSearch,
  handleDocumentCategoryClick,
}: TSearchFiltersProps) => {
  const { status: themeConfigStatus, themeConfig } = useGetThemeConfig();
  const [showClear, setShowClear] = useState(false);

  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [] },
    concept_filters: conceptFilters = [],
  } = searchCriteria;

  const thisYear = currentYear();

  // memoize the filtered countries
  const availableCountries = useMemo(() => {
    return getCountriesFromRegions({ regions, countries, selectedRegions: regionFilters });
  }, [regionFilters, regions, countries]);

  // Show clear button if there are filters applied
  useEffect(() => {
    if (query && Object.keys(query).length > 0) {
      if (Object.keys(query).length === 1 && query[QUERY_PARAMS.query_string]) {
        setShowClear(false);
      } else setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [query]);

  return (
    <div id="search_filters" data-cy="seach-filters" className="text-sm text-textNormal flex flex-col gap-5">
      {themeConfigStatus === "loading" && <Loader size="20px" />}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <p className="text-xs uppercase">Filters</p>
        </div>
        {showClear && (
          <button className="anchor underline text-sm" onClick={handleClearSearch}>
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
                name={`${themeConfig.categories.label}-${option.slug}`}
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
              <InputListContainer>
                <FilterOptions
                  filter={filter}
                  query={query}
                  handleFilterChange={handleFilterChange}
                  corpus_types={corpus_types}
                  themeConfig={themeConfig}
                />
              </InputListContainer>
            </Accordian>
          );
        })}

      {conceptsData && (
        <>
          <Accordian
            title={getFilterLabel("Concept", "concept", query[QUERY_PARAMS["concept_filters.name"]], themeConfig)}
            data-cy="concepts"
            key="Concepts"
            startOpen={!!query[QUERY_PARAMS["concept_filters.name"]]}
            overflowOverride
            className="relative z-11"
            isBeta={!!conceptsData}
          >
            <InputListContainer>
              <TypeAhead
                list={conceptsData}
                selectedList={conceptFilters}
                keyField="preferred_label"
                keyFieldDisplay="preferred_label"
                filterType={QUERY_PARAMS["concept_filters.name"]}
                handleFilterChange={(type, value) => {
                  handleConceptChange(value);
                }}
              />
            </InputListContainer>
            {showClear && (
              <div className="flex justify-end mt-2">
                <button className="anchor underline text-sm" onClick={handleClearSearch}>
                  Clear
                </button>
              </div>
            )}
          </Accordian>
        </>
      )}

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
              name={`region-${region.slug}`}
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

      <div className="my-5 pt-5 border-t border-gray-300" data-cy="methodology-notice">
        <p>
          Read <MethodologyLink /> for more information on how we collect and analyse our data.
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;
