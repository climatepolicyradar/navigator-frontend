/* eslint-disable @typescript-eslint/no-unused-vars */

import isEqual from "lodash/isEqual";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState, parseAsString, parseAsJson } from "nuqs";
import { useCallback, useEffect, useMemo, useState, type SetStateAction } from "react";

import { ApiClient } from "@/api/http-common";
import { AppliedLabels } from "@/components/_experiment/appliedLabels/AppliedLabels";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { Pagination } from "@/components/_experiment/pagination/Pagination";
import { createGroup, isFilterGroupEmpty, QueryBuilder, TQueryGroup, TQueryRule } from "@/components/_experiment/queryBuilder/QueryBuilder";
import { SearchFilters, TFilterCategory } from "@/components/_experiment/searchFilters/SearchFilters";
import { SearchContainer, IAggregationLabel } from "@/components/_experiment/searchResults/SearchResults";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabelResult, loadLabels } from "@/hooks/useLabelSearch";
import { FilterGroupSchema } from "@/schemas";
import { getAvailableLabelIdsFromAggregations } from "@/utils/_experiment/labelAggregationAvailability";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { addLabelRule, extractLabels, removeLabelRule } from "@/utils/filters/advancedFilters";
import { readConfigFile } from "@/utils/readConfigFile";
import { joinTailwindClasses } from "@/utils/tailwind";

const columnLayoutCss = "col-start-1 -col-end-1 cols-5:col-start-3 cols-5:-col-end-3";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features }: TProps) => {
  const [availableFilters, setAvailableFilters] = useState<TLabelResult[]>([]);
  const [labelAggregations, setLabelAggregations] = useState<IAggregationLabel[] | undefined>(undefined);

  // search query that is typed into the search box
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  // structured filters built in QueryBuilder
  const [filters, setFiltersInUrl] = useQueryState("filters", parseAsJson<TQueryGroup>(FilterGroupSchema).withDefault(createGroup()));
  // pagination state
  const [currentPage, setCurrentPage] = useQueryState("page_token", parseAsString.withDefault("1"));

  /**
   * Drops aggregations only when the filter tree becomes empty so greyed options
   * from an old response are not kept with no filters. If at least one filter
   * stays active, previous aggregations are retained until the new search returns.
   * Skips no-op updates. Done here instead of an effect for set-state-in-effect.
   */
  const setFilters = useCallback(
    (updater: SetStateAction<TQueryGroup>) => {
      let shouldClearAggregations = false;
      void setFiltersInUrl((prev) => {
        const next = typeof updater === "function" ? (updater as (p: TQueryGroup) => TQueryGroup)(prev) : updater;
        if (!isEqual(prev, next) && isFilterGroupEmpty(next)) {
          shouldClearAggregations = true;
        }
        return next;
      });
      if (shouldClearAggregations) {
        setLabelAggregations(undefined);
      }
    },
    [setFiltersInUrl]
  );

  // Derive selectedLabels from the filter tree
  const selectedLabels = useMemo(() => extractLabels(filters), [filters]);

  // Control SearchFilters popover and active category tab (single source of truth)
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterSidebarCategory, setFilterSidebarCategory] = useState<TFilterCategory>("agent");

  // Control Advanced Filters view
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  const handleSelectLabel = (label: string, type: string) => {
    setFilterSidebarCategory((type as TFilterCategory) || "agent");
    setFiltersOpen(true);
  };

  useEffect(() => {
    loadLabels("").then(setAvailableFilters);
  }, []);

  /** Avoid re-renders when the search payload repeats the same aggregation list. */
  const applyAggregationsFromSearch = useCallback((labels: IAggregationLabel[] | undefined) => {
    setLabelAggregations((prev) => (isEqual(prev, labels) ? prev : labels));
  }, []);

  const availableLabelIds = useMemo(
    () => getAvailableLabelIdsFromAggregations(labelAggregations, query, filters),
    [labelAggregations, query, filters]
  );

  return (
    <FeaturesContext.Provider value={features}>
      <FiveColumns className="mt-4 gap-y-4 pb-12">
        <div className={columnLayoutCss}>
          <h1 className="text-5xl font-bold text-inky-black">Search</h1>
        </div>
        <div className={columnLayoutCss}>
          <IntelliSearch
            query={query}
            availableLabelIds={availableLabelIds}
            selectedLabels={selectedLabels}
            onSelectSuggestion={(suggestion) => {
              if (suggestion && !selectedLabels.includes(suggestion)) {
                setFilters((prev) => addLabelRule(prev, suggestion));
              }
            }}
            setQuery={setQuery}
            onAdvancedClick={() => setAdvancedFiltersOpen(true)}
          />
        </div>
        <div className={joinTailwindClasses(columnLayoutCss, "flex justify-between items-center")}>
          <SearchFilters
            availableFilters={availableFilters}
            filters={filters}
            activeCategory={filterSidebarCategory}
            onActiveCategoryChange={setFilterSidebarCategory}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            onChange={(checked, label) => {
              if (checked) {
                setFilters((prev) => addLabelRule(prev, label));
              } else {
                setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()));
              }
            }}
            aggregations={labelAggregations}
            query={query}
          />
          <QueryBuilder
            filters={filters}
            setFilters={setFilters}
            open={advancedFiltersOpen}
            onOpenChange={setAdvancedFiltersOpen}
            availableLabelIds={availableLabelIds}
          />
        </div>
        {!isFilterGroupEmpty(filters) && (
          <div className={columnLayoutCss}>
            <AppliedLabels
              filters={filters}
              availableFilters={availableFilters}
              labels={selectedLabels}
              onClear={() => {
                setFilters(createGroup());
                setQuery("");
                setLabelAggregations(undefined); // belt & braces
              }}
              onSelectLabel={handleSelectLabel}
              onRemoveLabel={(label) => setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()))}
              onAdvancedClick={() => setAdvancedFiltersOpen(true)}
            />
          </div>
        )}
        <div className={columnLayoutCss}>
          <SearchContainer
            query={query}
            onSelectLabel={(label) => {
              if (!selectedLabels.includes(label)) {
                setFilters((prev) => addLabelRule(prev, label));
              }
            }}
            filters={filters}
            page_token={currentPage}
            page_size={40}
            onAggregationsChange={applyAggregationsFromSearch}
          />
        </div>
        <div className={columnLayoutCss}>
          <Pagination
            currentPage={parseInt(currentPage)}
            totalPages={50}
            onPageChange={(page) => {
              window.scrollTo(0, 0);
              setCurrentPage(page.toString());
            }}
          />
        </div>
      </FiveColumns>
    </FeaturesContext.Provider>
  );
};

export default ShadowSearch;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const client = new ApiClient(process.env.CONCEPTS_API_URL);

  return {
    props: withEnvConfig({
      features,
      theme,
      themeConfig,
      posthogPageViewProps: {
        search_version: "v2",
      },
    }),
  };
}) satisfies GetServerSideProps;
