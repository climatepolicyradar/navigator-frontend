import { ParsedUrlQuery } from "querystring";

import { ChevronRight } from "lucide-react";
import { useEffect, useState, useContext } from "react";

import Loader from "@/components/Loader";
import { Accordion } from "@/components/accordion/Accordion";
import { Heading } from "@/components/accordion/Heading";
import { Badge } from "@/components/atoms/badge/Badge";
import { AppliedFilters } from "@/components/filters/AppliedFilters";
import { DateRange } from "@/components/filters/DateRange";
import { FilterOptions } from "@/components/filters/FilterOptions";
import { InputListContainer } from "@/components/filters/InputListContainer";
import { InputRadio } from "@/components/forms/Radio";
import { Info } from "@/components/molecules/info/Info";
import { SLIDE_OUT_DATA_KEY } from "@/constants/dataAttributes";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { currentYear, minYear } from "@/constants/timedate";
import { FeaturesContext } from "@/context/FeaturesContext";
import { SlideOutContext } from "@/context/SlideOutContext";
import useGetThemeConfig from "@/hooks/useThemeConfig";
import { TConcept, TCorpusTypeDictionary, TFeatureFlags, TSearchCriteria, TThemeConfigOption } from "@/types";
import { canDisplayFilter } from "@/utils/canDisplayFilter";
import { isKnowledgeGraphEnabled } from "@/utils/features";
import { getFilterLabel } from "@/utils/getFilterLabel";

const isCategoryChecked = (selectedCategory: string | undefined, themeConfigCategory: TThemeConfigOption<any>) => {
  if (selectedCategory) {
    if (selectedCategory.toLowerCase() === themeConfigCategory.slug.toLowerCase()) {
      return true;
    }
  }

  if (!selectedCategory && themeConfigCategory.slug.toLowerCase() === "all") return true;

  return false;
};

interface IProps {
  searchCriteria: TSearchCriteria;
  query: ParsedUrlQuery;
  corpus_types: TCorpusTypeDictionary;
  conceptsData?: TConcept[];
  familyConceptsData?: TConcept[];
  handleFilterChange(type: string, value: string, clearOthersOfType?: boolean, otherValuesToClear?: string[]): void;
  handleYearChange(values: string[], reset?: boolean): void;
  handleClearSearch(): void;
  handleDocumentCategoryClick(value: string): void;
}

const SearchFilters = ({
  searchCriteria,
  query,
  corpus_types,
  conceptsData,
  familyConceptsData,
  handleFilterChange,
  handleYearChange,
  handleClearSearch,
  handleDocumentCategoryClick,
}: IProps) => {
  const { status: themeConfigStatus, themeConfig } = useGetThemeConfig();
  const [showClear, setShowClear] = useState(false);
  const { currentSlideOut, setCurrentSlideOut } = useContext(SlideOutContext);
  const features = useContext(FeaturesContext);

  const thisYear = currentYear();

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
    <div id="search_filters" data-cy="search-filters" className="text-sm text-text-secondary flex flex-col gap-5">
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

      <AppliedFilters filterChange={handleFilterChange} concepts={conceptsData} familyConcepts={familyConceptsData} />
      {themeConfigStatus === "success" && themeConfig.categories && (
        <Accordion title={themeConfig.categories.label} data-cy="categories" key={themeConfig.categories.label} startOpen>
          <InputListContainer>
            {themeConfig.categories?.options?.map((option) => {
              return (
                <InputRadio
                  key={option.slug}
                  label={option.label}
                  checked={query && isCategoryChecked(query[QUERY_PARAMS.category] as string, option)}
                  onChange={() => {
                    handleDocumentCategoryClick(option.slug);
                  }}
                  name={`${themeConfig.categories.label}-${option.slug}`}
                />
              );
            })}
          </InputListContainer>
        </Accordion>
      )}

      {conceptsData && (
        <>
          <button
            className="items-center justify-between cursor-pointer group flex"
            onClick={() => setCurrentSlideOut(currentSlideOut === "concepts" ? "" : "concepts")}
            data-cy="concepts-control"
            {...{ [SLIDE_OUT_DATA_KEY]: "concepts" }}
          >
            <Heading>
              Topics
              <Badge size="small" className="ml-2">
                Beta
              </Badge>
            </Heading>
            <span
              className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
                currentSlideOut === "concepts" ? "transform rotate-180" : ""
              }`}
            >
              <ChevronRight />
            </span>
          </button>
        </>
      )}

      {familyConceptsData && (
        <>
          <button
            className="items-center justify-between cursor-pointer group flex"
            onClick={() => setCurrentSlideOut(currentSlideOut === "categories" ? "" : "categories")}
            data-cy="categories-control"
            {...{ [SLIDE_OUT_DATA_KEY]: "categories" }}
          >
            <Heading>Case categories</Heading>
            <span
              className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
                currentSlideOut === "categories" ? "transform rotate-180" : ""
              }`}
            >
              <ChevronRight />
            </span>
          </button>
          <button
            className="items-center justify-between cursor-pointer group flex"
            onClick={() => setCurrentSlideOut(currentSlideOut === "principalLaws" ? "" : "principalLaws")}
            data-cy="principalLaws-control"
            {...{ [SLIDE_OUT_DATA_KEY]: "principalLaws" }}
          >
            <Heading>Principal laws</Heading>
            <span
              className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
                currentSlideOut === "principalLaws" ? "transform rotate-180" : ""
              }`}
            >
              <ChevronRight />
            </span>
          </button>
          <button
            className="items-center justify-between cursor-pointer group flex"
            onClick={() => setCurrentSlideOut(currentSlideOut === "jurisdictions" ? "" : "jurisdictions")}
            data-cy="jurisdictions-control"
            {...{ [SLIDE_OUT_DATA_KEY]: "jurisdictions" }}
          >
            <Heading>Jurisdictions</Heading>
            <span
              className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
                currentSlideOut === "jurisdictions" ? "transform rotate-180" : ""
              }`}
            >
              <ChevronRight />
            </span>
          </button>
        </>
      )}

      {themeConfigStatus === "success" &&
        themeConfig.filters.map((filter) => {
          // If the filter is not in the selected category, don't display it
          if (!canDisplayFilter(filter, query, themeConfig)) return null;

          return (
            <Accordion
              title={filter.label}
              data-cy={filter.label}
              key={filter.label}
              startOpen={filter.startOpen === "true" || !!query[QUERY_PARAMS[filter.taxonomyKey]]}
              showFade={filter.showFade}
            >
              <InputListContainer>
                {filter.showTopicsMessage && features.knowledgeGraph && (
                  <p className="opacity-80 mb-2">
                    Our new topic filter automatically identifies {filter.label.toLowerCase()} in the text of documents.{" "}
                    <a
                      className="underline"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentSlideOut(currentSlideOut === "" ? "concepts" : "");
                      }}
                    >
                      Try it now
                    </a>
                  </p>
                )}
                <FilterOptions
                  filter={filter}
                  query={query}
                  handleFilterChange={handleFilterChange}
                  corpus_types={corpus_types}
                  themeConfig={themeConfig}
                />
              </InputListContainer>
            </Accordion>
          );
        })}

      <>
        <button
          className="items-center justify-between cursor-pointer group flex"
          onClick={() => setCurrentSlideOut(currentSlideOut === "geographies" ? "" : "geographies")}
          {...{ [SLIDE_OUT_DATA_KEY]: "geographies" }}
        >
          <Heading>Geography</Heading>
          <span
            className={`text-textDark opacity-40 group-hover:opacity-100 transition-transform pointer-events-none ${
              currentSlideOut === "geographies" ? "transform rotate-180" : ""
            }`}
          >
            <ChevronRight />
          </span>
        </button>
      </>

      <Accordion
        title={getFilterLabel("Date", "date", query[QUERY_PARAMS.category], themeConfig)}
        data-cy="date-range"
        startOpen={!!query[QUERY_PARAMS.year_range]}
      >
        <DateRange type="year_range" handleChange={handleYearChange} defaultValues={searchCriteria.year_range} min={minYear} max={thisYear} />
      </Accordion>
    </div>
  );
};

export default SearchFilters;
