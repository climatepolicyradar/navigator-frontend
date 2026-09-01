import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryState, parseAsString, parseAsJson } from "nuqs";
import { useCallback, useEffect, useState, type SetStateAction } from "react";

import { normaliseSearchDocumentsSortKey, SearchDocument } from "@/api/search";
import { createGroup, isFilterGroupEmpty, AdvancedFilters } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { SEARCH_RESULTS_PAGE_SIZE, SearchContainer } from "@/components/_experiment/searchResults/SearchResults";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PrincipalDrawer, TPrincipalDrawerTab } from "@/components/drawers/principalDrawer/PrincipalDrawer";
import Layout from "@/components/layouts/Main";
import { Pagination } from "@/components/molecules/pagination/Pagination";
import { SearchControls } from "@/components/organisms/searchControls/SearchControls";
import { SEARCH_FILTER_GROUPS } from "@/constants/filters";
import { SEARCH_SORT_OPTIONS } from "@/constants/sort";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { loadFilteredLabels, loadLabelTaxonomy } from "@/hooks/useLabelSearch";
import { useNestedSearchLevel } from "@/hooks/useSearchLevel";
import { FilterGroupSchema } from "@/schemas";
import { TSearchLabel, TSearchQueryGroup, TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { pluralise } from "@/utils/pluralise";
import { readConfigFile } from "@/utils/readConfigFile";
import { conceptFiltersOnly, seedPassageLevel } from "@/utils/search/searchLevels";
import { joinTailwindClasses } from "@/utils/tailwind";

const columnLayoutCss = "col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features }: TProps) => {
  const [availableFilters, setAvailableFilters] = useState<TSearchLabel[]>([]);

  // search query that is typed into the search box
  const [query] = useQueryState("q", parseAsString.withDefault(""));
  // structured filters built in QueryBuilder
  const [filters, setFiltersInUrl] = useQueryState("filters", parseAsJson<TSearchQueryGroup>(FilterGroupSchema).withDefault(createGroup()));
  // pagination state
  const [currentPage, setCurrentPage] = useQueryState("page_token", parseAsString.withDefault("1"));
  const [sortParam] = useQueryState("sort", parseAsString.withDefault("relevance"));
  const sortKey = normaliseSearchDocumentsSortKey(sortParam);
  const [totalNoOfResults, setTotalNoOfResults] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Drops aggregations only when the filter tree becomes empty so greyed options
   * from an old response are not kept with no filters. If at least one filter
   * stays active, previous aggregations are retained until the new search returns.
   * Skips no-op updates. Done here instead of an effect for set-state-in-effect.
   */
  const setFilters = useCallback(
    (updater: SetStateAction<TSearchQueryGroup>) => {
      setFiltersInUrl((prev) => {
        const nextFilters = typeof updater === "function" ? (updater as (p: TSearchQueryGroup) => TSearchQueryGroup)(prev) : updater;
        return nextFilters;
      });
    },
    [setFiltersInUrl]
  );

  // Manage the nested search levels: SERP -> Principal Drawer -> Document Drawer
  const principalLevel = useNestedSearchLevel("principal");
  const documentLevel = useNestedSearchLevel("document");

  // The clicked result names the drawer without waiting on a fetch. It is kept while the drawer
  // animates closed, and is absent when the level arrives from a shared link.
  const [selectedDocument, setSelectedDocument] = useState<SearchDocument | null>(null);
  const principalImportId = principalLevel.id ?? selectedDocument?.id ?? null;
  const principalHasSearch = !!principalLevel.search.query || !!conceptFiltersOnly(principalLevel.search.filters);
  const documentHasSearch = !!documentLevel.search.query || !!conceptFiltersOnly(documentLevel.search.filters);

  // If we have a document search also active, start on "about" as that is where the document drawer lives
  const [drawerTab, setDrawerTab] = useState<TPrincipalDrawerTab>(principalHasSearch && !documentHasSearch ? "search" : "about");
  const [openedPrincipalId, setOpenedPrincipalId] = useState(principalLevel.id);

  // Land on the passages tab whenever a drawer opens onto a search, whether from a click or a link.
  if (principalLevel.id !== openedPrincipalId) {
    setOpenedPrincipalId(principalLevel.id);
    if (principalLevel.id) setDrawerTab(principalHasSearch ? "search" : "about");
  }

  // Closing a level closes the levels nested inside it.
  const closePrincipalDrawer = () => {
    principalLevel.close();
    documentLevel.close();
  };

  // Control Advanced Filters view
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  useEffect(() => {
    const loadedFilteredLabels = loadFilteredLabels({
      // These are the explicit labels to needed to power the search page
      op: "or",
      filters: [
        {
          field: "type",
          op: "contains",
          value: "concept",
        },
        {
          field: "type",
          op: "contains",
          value: "region",
        },
        {
          field: "type",
          op: "contains",
          value: "country",
        },
      ],
    });

    // We have to append this data until the categories taxonomy data source data is fixed
    // @see: https://linear.app/climate-policy-radar/issue/APP-2266/fusion-enrichment-fleshing-out-the-publishedcanonicallabels
    const loadedLabelTaxonomy = loadLabelTaxonomy();
    const allFilterLabels = Promise.all([loadedFilteredLabels, loadedLabelTaxonomy]);

    allFilterLabels.then(([filteredLabels, labelTaxonomy]) => setAvailableFilters([...filteredLabels, ...labelTaxonomy]));
  }, []);

  // The count is cleared while a search runs, so say what is happening in its place.
  const resultsSummary = isSearching
    ? "Searching…"
    : totalNoOfResults
      ? `${totalNoOfResults} ${pluralise(totalNoOfResults, ["result", "results"])}`
      : null;

  return (
    <FeaturesContext.Provider value={features}>
      <Layout theme={theme as TTheme} themeConfig={themeConfig} metadataKey="search">
        <FiveColumns className="mt-4 gap-y-4 pb-12">
          <div className={joinTailwindClasses(columnLayoutCss, "sr-only")}>
            <h1 className="text-5xl font-bold text-inky-black">Search</h1>
          </div>
          {/* CONTROLS - FILTERS, SORT, etc */}
          {/* TODO add most recent date from search results */}
          <SearchControls
            filterGroups={SEARCH_FILTER_GROUPS}
            filterParamKey="filters"
            labels={availableFilters}
            queryParamKey="q"
            resultsNode={resultsSummary ? <div aria-live="polite">{resultsSummary}</div> : null}
            sortOptions={SEARCH_SORT_OPTIONS}
            sortParamKey="sort"
          />
          {/* SEARCH RESULTS */}
          <div className={columnLayoutCss}>
            <SearchContainer
              query={query}
              filters={filters}
              page_token={currentPage}
              sort={sortKey}
              onTotalResultsChange={setTotalNoOfResults}
              onSearchingChange={setIsSearching}
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
                // otherwise open document in drawer, carrying over what a passage search can use
                setSelectedDocument(document);
                principalLevel.open(document.id, seedPassageLevel({ query, filters }));
              }}
            />
          </div>
          {/* PAGINATION */}
          {totalNoOfResults !== null && totalNoOfResults > 0 && (query || !isFilterGroupEmpty(filters)) && (
            <div className={columnLayoutCss}>
              <Pagination
                currentPage={parseInt(currentPage)}
                totalPages={totalNoOfResults !== null ? Math.ceil(totalNoOfResults / SEARCH_RESULTS_PAGE_SIZE) : 0}
                onPageChange={(page) => {
                  window.scrollTo(0, 0);
                  setCurrentPage(page.toString());
                }}
              />
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
        <PrincipalDrawer
          document={selectedDocument?.id === principalImportId ? selectedDocument : null}
          importId={principalImportId}
          open={!!principalLevel.id}
          onOpenChange={(open) => {
            if (!open) closePrincipalDrawer();
          }}
          tab={drawerTab}
          onTabChange={setDrawerTab}
        />
      </Layout>
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
