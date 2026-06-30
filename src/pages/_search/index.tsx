import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState, parseAsString, parseAsJson } from "nuqs";
import { useCallback, useEffect, useMemo, useState, type SetStateAction } from "react";

import { normaliseSearchDocumentsSortKey, SearchDocument } from "@/api/search";
import { createGroup, isFilterGroupEmpty, AdvancedFilters } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { DocumentDrawer } from "@/components/_experiment/documentDrawer/DocumentDrawer";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { Pagination } from "@/components/_experiment/pagination/Pagination";
import { SearchContainer } from "@/components/_experiment/searchResults/SearchResults";
import { SearchSortSelect } from "@/components/_experiment/searchSort/SearchSortSelect";
import { SelectPerPage } from "@/components/_experiment/selectPerPage/SelectPerPage";
import { Button } from "@/components/atoms/button/Button";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import Layout from "@/components/layouts/Main";
import { FiltersAndSort } from "@/components/organisms/filtersAndSort/FiltersAndSort";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { loadLabels } from "@/hooks/useLabelSearch";
import { FilterGroupSchema } from "@/schemas";
import { TSearchLabel, TSearchQueryGroup, TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { addLabelRule, extractLabels } from "@/utils/filters/advancedFilters";
import { readConfigFile } from "@/utils/readConfigFile";
import { joinTailwindClasses } from "@/utils/tailwind";

const columnLayoutCss = "col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2";

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
  const [availableFilters, setAvailableFilters] = useState<TSearchLabel[]>([]);

  // search query that is typed into the search box
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  // structured filters built in QueryBuilder
  const [filters, setFiltersInUrl] = useQueryState("filters", parseAsJson<TSearchQueryGroup>(FilterGroupSchema).withDefault(createGroup()));
  // pagination state
  const [currentPage, setCurrentPage] = useQueryState("page_token", parseAsString.withDefault("1"));
  const [pageSize, setPageSize] = useQueryState("page_size", parseAsString.withDefault("10"));
  const [sortParam, setSortParam] = useQueryState("sort", parseAsString.withDefault("relevance"));
  const sortKey = normaliseSearchDocumentsSortKey(sortParam);
  const [totalNoOfResults, setTotalNoOfResults] = useState<number | null>(null);

  /**
   * Drops aggregations only when the filter tree becomes empty so greyed options
   * from an old response are not kept with no filters. If at least one filter
   * stays active, previous aggregations are retained until the new search returns.
   * Skips no-op updates. Done here instead of an effect for set-state-in-effect.
   */
  const setFilters = useCallback(
    (updater: SetStateAction<TSearchQueryGroup>) => {
      void setFiltersInUrl((prev) => {
        const nextFilters = typeof updater === "function" ? (updater as (p: TSearchQueryGroup) => TSearchQueryGroup)(prev) : updater;
        return nextFilters;
      });
    },
    [setFiltersInUrl]
  );

  // Derive selectedLabels from the filter tree
  const selectedLabels = useMemo(() => extractLabels(filters), [filters]);

  // Control SearchFilters popover and active category tab (single source of truth)
  const [selectedDocument, setSelectedDocument] = useState<SearchDocument | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Control Advanced Filters view
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  useEffect(() => {
    loadLabels("").then(setAvailableFilters);
  }, []);

  return (
    <Layout theme={theme as TTheme} themeConfig={themeConfig} metadataKey="search">
      <FeaturesContext.Provider value={features}>
        <FiveColumns className="mt-4 gap-y-4 pb-12">
          <div className={joinTailwindClasses(columnLayoutCss, "sr-only")}>
            <h1 className="text-5xl font-bold text-inky-black">Search</h1>
          </div>
          <div className={columnLayoutCss}>
            {/* SEARCH INPUT */}
            <IntelliSearch
              query={query}
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
          <FiltersAndSort labels={availableFilters} />
          {/* SORT (// TODO move into FilterAndSort) */}
          <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex gap-2">
            <SearchSortSelect
              sortParam={sortKey}
              onChange={(next) => {
                setSortParam(next);
                setCurrentPage("1");
              }}
            />
            <Button onClick={() => setAdvancedFiltersOpen(true)} className="text-nowrap">
              Advanced filters
            </Button>
          </div>
          {/* SEARCH RESULTS */}
          <div className={columnLayoutCss}>
            <SearchContainer
              query={query}
              filters={filters}
              page_token={currentPage}
              page_size={pageSize}
              sort={sortKey}
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
              <div className="flex flex-wrap justify-between items-center gap-4">
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
        />
        {/* DRAWER */}
        <DocumentDrawer document={selectedDocument} open={drawerOpen} onOpenChange={setDrawerOpen} />
      </FeaturesContext.Provider>
    </Layout>
  );
};

export default ShadowSearch;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

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
