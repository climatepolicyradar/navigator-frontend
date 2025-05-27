import { ParsedUrlQuery } from "querystring";

import { useEffect, useState, useMemo, useContext } from "react";
import { LuChevronRight } from "react-icons/lu";

import Loader from "@/components/Loader";
import { Accordian } from "@/components/accordian/Accordian";
import { Heading } from "@/components/accordian/Heading";
import { FilterOptions } from "@/components/blocks/FilterOptions";
import { AppliedFilters } from "@/components/filters/AppliedFilters";
import { DateRange } from "@/components/filters/DateRange";
import { InputListContainer } from "@/components/filters/InputListContainer";
import { InputCheck } from "@/components/forms/Checkbox";
import { InputRadio } from "@/components/forms/Radio";
import { TypeAhead } from "@/components/forms/TypeAhead";
import { Label } from "@/components/labels/Label";
import { SLIDE_OUT_DATA_KEY } from "@/constants/dataAttributes";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { currentYear, minYear } from "@/constants/timedate";
import { SlideOutContext } from "@/context/SlideOutContext";
import { getCountriesFromRegions } from "@/helpers/getCountriesFromRegions";
import useGetThemeConfig from "@/hooks/useThemeConfig";
import { TConcept, TCorpusTypeDictionary, TGeography, TSearchCriteria, TThemeConfigOption } from "@/types";
import { canDisplayFilter } from "@/utils/canDisplayFilter";
import { getFilterLabel } from "@/utils/getFilterLabel";

import { Info } from "../molecules/info/Info";

const isCategoryChecked = (selectedCatgeory: string | undefined, themeConfigCategory: TThemeConfigOption<any>) => {
  if (selectedCatgeory) {
    if (selectedCatgeory.toLowerCase() === themeConfigCategory.slug.toLowerCase()) {
      return true;
    }
  }

  if (!selectedCatgeory && themeConfigCategory.slug.toLowerCase() === "all") return true;

  return false;
};

interface IProps {
  searchCriteria: TSearchCriteria;
  query: ParsedUrlQuery;
  regions: TGeography[];
  countries: TGeography[];
  corpus_types: TCorpusTypeDictionary;
  conceptsData?: TConcept[];
  handleFilterChange(type: string, value: string, clearOthersOfType?: boolean): void;
  handleYearChange(values: string[], reset?: boolean): void;
  handleRegionChange(region: string): void;
  handleClearSearch(): void;
  handleDocumentCategoryClick(value: string): void;
  featureFlags: Record<string, string | boolean>;
}

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
  handleClearSearch,
  handleDocumentCategoryClick,
  featureFlags,
}: IProps) => {
  const { status: themeConfigStatus, themeConfig } = useGetThemeConfig();
  const [showClear, setShowClear] = useState(false);
  const { currentSlideOut, setCurrentSlideOut } = useContext(SlideOutContext);

  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [] },
  } = searchCriteria;

  const thisYear = currentYear();

  // memoize the filtered countries
  const availableCountries = useMemo(() => {
    return getCountriesFromRegions({
      regions,
      countries,
      selectedRegions: regionFilters,
    });
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
    <div id="search_filters" data-cy="seach-filters" className="text-sm text-text-secondary flex flex-col gap-5">
      {themeConfigStatus === "loading" && <Loader size="20px" />}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[15px] text-text-primary font-normal">Filters</p>
          <Info
            title="About"
            description="Narrow down your results using the filters below. You can also combine these with a search term."
            link={{ href: "/faq", text: "Learn more" }}
          />
        </div>
        {showClear && (
          <button className="anchor underline text-sm" onClick={handleClearSearch}>
            Clear all
          </button>
        )}
      </div>

      <AppliedFilters filterChange={handleFilterChange} concepts={conceptsData} />
      {themeConfigStatus === "success" && themeConfig.categories && (
        <Accordian title={themeConfig.categories.label} data-cy="categories" key={themeConfig.categories.label} startOpen>
          <InputListContainer>
            {themeConfig.categories?.options?.map(
              (option) =>
                ((option.slug === "climate_policy_radar_reports" && featureFlags["corporate-reports"]) ||
                  option.slug !== "climate_policy_radar_reports") && (
                  <InputRadio
                    key={option.slug}
                    label={option.label}
                    checked={query && isCategoryChecked(query[QUERY_PARAMS.category] as string, option)}
                    onChange={() => {
                      handleDocumentCategoryClick(option.slug);
                    }}
                    name={`${themeConfig.categories.label}-${option.slug}`}
                  />
                )
            )}
          </InputListContainer>
        </Accordian>
      )}

      {themeConfigStatus === "success" &&
        themeConfig.filters.map((filter) => {
          // TODO: remove FF and logic for UNFCCC filters
          if (
            ["_document.type", "author_type"].includes(filter.taxonomyKey) &&
            filter.corporaKey === "Intl. agreements" &&
            !featureFlags["unfccc-filters"]
          )
            return;
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
          <button
            className="items-center justify-between cursor-pointer group flex"
            onClick={() => setCurrentSlideOut(currentSlideOut === "" ? "concepts" : "")}
            data-cy="concepts-control"
            {...{ [SLIDE_OUT_DATA_KEY]: "concepts" }}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <Heading>Concepts</Heading>
              <Label>Beta</Label>
            </div>
            <span
              className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
                currentSlideOut === "concepts" ? "transform rotate-180" : ""
              }`}
            >
              <LuChevronRight />
            </span>
          </button>
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
    </div>
  );
};

export default SearchFilters;
