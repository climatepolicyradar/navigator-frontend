/* eslint-disable @typescript-eslint/no-unused-vars */

import { Switch } from "@base-ui/react/switch";
import isEqual from "lodash/isEqual";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState, parseAsBoolean, parseAsString, parseAsJson } from "nuqs";
import { useCallback, useEffect, useMemo, useState, type SetStateAction } from "react";

import { ApiClient } from "@/api/http-common";
import { IAggregationLabel, normaliseSearchDocumentsSortKey, SearchDocument } from "@/api/search";
import { createGroup, isFilterGroupEmpty, AdvancedFilters, TQueryGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { AppliedLabels } from "@/components/_experiment/appliedLabels/AppliedLabels";
import { DocumentDrawer } from "@/components/_experiment/documentDrawer/DocumentDrawer";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { Pagination } from "@/components/_experiment/pagination/Pagination";
import { SearchFilters, TLabelType } from "@/components/_experiment/searchFilters/SearchFilters";
import { SearchContainer } from "@/components/_experiment/searchResults/SearchResults";
import { SearchSortSelect } from "@/components/_experiment/searchSort/SearchSortSelect";
import { SelectPerPage } from "@/components/_experiment/selectPerPage/SelectPerPage";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TLabelResult, loadLabels } from "@/hooks/useLabelSearch";
import { FilterGroupSchema } from "@/schemas";
import { findPublishedDateRangeValue, removePublishedDateRules, upsertPublishedDateRangeRules } from "@/utils/_experiment/dateRangeFilters";
import { getAvailableLabelIdsFromAggregations } from "@/utils/_experiment/labelAggregationAvailability";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { addLabelRule, extractLabels, removeLabelRule } from "@/utils/filters/advancedFilters";
import { readConfigFile } from "@/utils/readConfigFile";
import { joinTailwindClasses } from "@/utils/tailwind";

const columnLayoutCss = "col-start-1 -col-end-1 cols-5:col-start-3 cols-5:-col-end-3";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

/*
 * SHADOW SEARCH is currently made up of 6 Core surfaces, each surface is commented in code below
 * NB: this is not necessarily the order they appear within this component
 * - Search input (and suggestions)
 * - Filters
 * - Applied filters
 * - Advanced filters
 * - Search results
 * - Result drawer
 */
const ShadowSearch = ({ theme, themeConfig, features }: TProps) => {
  const [availableFilters, setAvailableFilters] = useState<TLabelResult[]>([]);
  const [labelAggregations, setLabelAggregations] = useState<IAggregationLabel[] | undefined>(undefined);

  // search query that is typed into the search box
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  // structured filters built in QueryBuilder
  const [filters, setFiltersInUrl] = useQueryState("filters", parseAsJson<TQueryGroup>(FilterGroupSchema).withDefault(createGroup()));
  // pagination state
  const [currentPage, setCurrentPage] = useQueryState("page_token", parseAsString.withDefault("1"));
  const [pageSize, setPageSize] = useQueryState("page_size", parseAsString.withDefault("10"));
  const [sortParam, setSortParam] = useQueryState("sort", parseAsString.withDefault("relevance"));
  const sortKey = normaliseSearchDocumentsSortKey(sortParam);
  const [totalNoOfResults, setTotalNoOfResults] = useState<number | null>(null);
  // principal or documents
  const [includeDocumentsInSearch, setIncludeDocumentsInSearch] = useQueryState("include_documents", parseAsBoolean.withDefault(true));
  const [excludeMergedDocuments, setExcludeMergedDocuments] = useQueryState("exclude_merged_documents", parseAsBoolean.withDefault(true));

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
        const nextFilters = typeof updater === "function" ? (updater as (p: TQueryGroup) => TQueryGroup)(prev) : updater;
        if (!isEqual(prev, nextFilters) && isFilterGroupEmpty(nextFilters)) {
          shouldClearAggregations = true;
        }
        return nextFilters;
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
  const [selectedDocument, setSelectedDocument] = useState<SearchDocument | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterSidebarCategory, setFilterSidebarCategory] = useState<TLabelType>("category");

  // Control Advanced Filters view
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  const handleSelectLabel = (label: string, type: string) => {
    setFilterSidebarCategory((type as TLabelType) || "agent");
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
  const selectedPublishedDateRange = useMemo(() => findPublishedDateRangeValue(filters), [filters]);

  return (
    <FeaturesContext.Provider value={features}>
      <FiveColumns className="mt-4 gap-y-4 pb-12">
        <div className={columnLayoutCss}>
          <h1 className="text-5xl font-bold text-inky-black">Search</h1>
        </div>
        <div className={columnLayoutCss}>
          {/* SEARCH INPUT */}
          <IntelliSearch
            query={query}
            availableLabelIds={availableLabelIds}
            selectedLabels={selectedLabels}
            onSelectSuggestion={(suggestion) => {
              if (suggestion && !selectedLabels.includes(suggestion)) {
                setFilters((prev) => addLabelRule(prev, suggestion));
                setCurrentPage("1");
              }
            }}
            setQuery={(query) => {
              setQuery(query);
              setCurrentPage("1");
            }}
            onAdvancedClick={() => setAdvancedFiltersOpen(true)}
          />
        </div>
        {/* CONTROLS - FILTERS, SORT, etc */}
        <div className={joinTailwindClasses(columnLayoutCss, "flex justify-between items-center")}>
          {/* FILTERS */}
          <SearchFilters
            availableFilters={availableFilters}
            filters={filters}
            activeLabelType={filterSidebarCategory}
            onActiveLabelTypeChange={setFilterSidebarCategory}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            onChange={(checked, label) => {
              if (checked) {
                setFilters((prev) => addLabelRule(prev, label));
                setCurrentPage("1");
              } else {
                setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()));
                setCurrentPage("1");
              }
            }}
            aggregations={labelAggregations}
            query={query}
            onAdvancedClick={() => {
              setFiltersOpen(false);
              setAdvancedFiltersOpen(true);
            }}
            dateRangeValue={selectedPublishedDateRange}
            onDateRangeChange={(nextValue) => {
              if (nextValue === null) {
                setFilters((prev) => removePublishedDateRules(prev));
                setCurrentPage("1");
                return;
              }
              setFilters((prev) => upsertPublishedDateRangeRules(prev, nextValue));
              setCurrentPage("1");
            }}
          />
          <div className="flex items-center gap-6 flex-wrap">
            {/* EXPERIMENT CONTROLS */}
            <div>
              <button className="text-gray-300" onClick={() => setExcludeMergedDocuments(!excludeMergedDocuments)}>
                {excludeMergedDocuments && "."}
                {!excludeMergedDocuments && ":"}
              </button>
            </div>
            <div>
              <label className="flex items-center gap-2 text-neutral-600 text-sm font-medium cursor-pointer">
                Show individual documents
                <Switch.Root
                  checked={includeDocumentsInSearch}
                  onCheckedChange={(checked) => setIncludeDocumentsInSearch(checked)}
                  className="relative flex h-4 w-7 p-0.5 rounded-full bg-neutral-200 transition data-checked:bg-inky-blue"
                >
                  <Switch.Thumb className="aspect-square h-full rounded-full bg-white transition-transform duration-150 data-checked:translate-x-3" />
                </Switch.Root>
              </label>
            </div>
            {/* SORT */}
            <SearchSortSelect
              sortParam={sortKey}
              onChange={(next) => {
                setSortParam(next);
                setCurrentPage("1");
              }}
            />
          </div>
        </div>
        {/* APPLIED FILTERS */}
        {!isFilterGroupEmpty(filters) && (
          <div className={columnLayoutCss}>
            <AppliedLabels
              filters={filters}
              availableFilters={availableFilters}
              labels={selectedLabels}
              dateRangeValue={selectedPublishedDateRange}
              onClear={() => {
                setFilters(createGroup());
                setQuery("");
                setTotalNoOfResults(null);
                setCurrentPage("1");
                setLabelAggregations(undefined); // belt & braces
              }}
              onSelectLabel={handleSelectLabel}
              onRemoveLabel={(label) => {
                setFilters((prev) => (prev ? removeLabelRule(prev, label) : createGroup()));
                setCurrentPage("1");
              }}
              onSelectDateRange={() => {
                setFilterSidebarCategory("published_date");
                setFiltersOpen(true);
              }}
              onRemoveDateRange={() => {
                setFilters((prev) => removePublishedDateRules(prev));
                setCurrentPage("1");
              }}
              onAdvancedClick={() => setAdvancedFiltersOpen(true)}
            />
          </div>
        )}
        {/* SEARCH RESULTS */}
        <div className={columnLayoutCss}>
          <SearchContainer
            query={query}
            filters={filters}
            page_token={currentPage}
            page_size={pageSize}
            includeDocumentsInSearch={includeDocumentsInSearch}
            sort={sortKey}
            excludeMergedDocuments={excludeMergedDocuments}
            onAggregationsChange={applyAggregationsFromSearch}
            onTotalResultsChange={setTotalNoOfResults}
            onResultClicked={(document, event) => {
              // If command or ctrl is clicked open document new tab
              if (event.metaKey || event.ctrlKey) {
                const slug = document.attributes.deprecated_slug;
                if (slug) {
                  const isPrincipal = document.labels.some((label) => label.value.value === "Principal");
                  window.open(isPrincipal ? `/document/${slug}` : `/documents/${slug}`, "_blank", "noopener,noreferrer");
                }
                return;
              }
              // otherwise open document in drawer
              setSelectedDocument(document);
              setDrawerOpen(true);
            }}
          />
        </div>
        {/* PAGINATION */}
        {totalNoOfResults !== null && totalNoOfResults > 0 && (query || !isFilterGroupEmpty(filters)) && (
          <div className={columnLayoutCss}>
            <div className="flex justify-between items-center">
              <Pagination
                currentPage={parseInt(currentPage)}
                totalPages={totalNoOfResults !== null ? Math.ceil(totalNoOfResults / parseInt(pageSize)) : 0}
                onPageChange={(page) => {
                  window.scrollTo(0, 0);
                  setCurrentPage(page.toString());
                }}
              />
              <SelectPerPage
                value={pageSize}
                onChange={(size) => {
                  setPageSize(size);
                  setCurrentPage("1");
                }}
              />
            </div>
          </div>
        )}
      </FiveColumns>
      {/* ADVANCED FILTERS */}
      <AdvancedFilters
        filters={filters}
        setFilters={(filters) => {
          setFilters(filters);
          setCurrentPage("1");
        }}
        open={advancedFiltersOpen}
        onOpenChange={setAdvancedFiltersOpen}
        availableLabelIds={availableLabelIds}
      />
      {/* DRAWER */}
      <DocumentDrawer document={selectedDocument} open={drawerOpen} onOpenChange={setDrawerOpen} />
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
