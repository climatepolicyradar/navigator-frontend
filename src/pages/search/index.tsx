import { ParsedUrlQuery } from "querystring";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import Loader from "@/components/Loader";
import { SlideOut } from "@/components/atoms/SlideOut/SlideOut";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { FamilyMatchesDrawer } from "@/components/drawer/FamilyMatchesDrawer";
import Slideout from "@/components/drawer/Slideout";
import SearchFilters from "@/components/filters/SearchFilters";
import { SearchSettings } from "@/components/filters/SearchSettings";
import Layout from "@/components/layouts/Main";
import { DownloadCsvPopup } from "@/components/modals/DownloadCsv";
import { Info } from "@/components/molecules/info/Info";
import { Warning } from "@/components/molecules/warning/Warning";
import { ConceptPicker } from "@/components/organisms/ConceptPicker";
import { FamilyConceptPicker } from "@/components/organisms/FamilyConceptPicker";
import { GeographyPicker } from "@/components/organisms/GeographyPicker";
import Pagination from "@/components/pagination";
import { MultiCol } from "@/components/panels/MultiCol";
import { SideCol } from "@/components/panels/SideCol";
import { SingleCol } from "@/components/panels/SingleCol";
import SearchResultList from "@/components/search/SearchResultList";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { SEARCH_SETTINGS } from "@/constants/searchSettings";
import { sortOptions } from "@/constants/sortOptions";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { SlideOutContext } from "@/context/SlideOutContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useHashNavigation } from "@/hooks/useHashNavigation";
import useSearch from "@/hooks/useSearch";
import { useText } from "@/hooks/useText";
import { TTopic, TTheme, TTopics, TApiTopic } from "@/types";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { getCurrentSearchChoice } from "@/utils/getCurrentSearchChoice";
import { getCurrentSortChoice } from "@/utils/getCurrentSortChoice";
import { getFilterLabel } from "@/utils/getFilterLabel";
import { ResultsTopicsContext } from "@/utils/getPassageResultsContext";
import { pluralise } from "@/utils/pluralise";
import { readConfigFile } from "@/utils/readConfigFile";

const SETTINGS_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const getSelectedSortOptionText = (sortOption: string) => {
  const selectedOptionValue = sortOptions.find(({ value }) => value === sortOption);
  return selectedOptionValue.label;
};

// We want to show information when using specific litigation filters
const showLitigationInformation = (query: ParsedUrlQuery) => {
  if (Array.isArray(query[QUERY_PARAMS.concept_preferred_label]) && query[QUERY_PARAMS.concept_preferred_label].length >= 2) return true;
  return false;
};

// We want to show the KG information under certain rules
const showKnowledgeGraphInformation = (query: ParsedUrlQuery) => {
  const show = false;
  // If we have multiple topics/concepts selected
  if (query[QUERY_PARAMS.concept_name]) return true;
  // If we have a query AND a concept selected
  if (query[QUERY_PARAMS.query_string] && (query[QUERY_PARAMS.concept_name] || query[QUERY_PARAMS.concept_id])) return true;
  return show;
};

// Show Corporate Disclosure information we have the corporate disclosures category selected
const showCorporateDisclosuresInformation = (query: ParsedUrlQuery) => {
  if (query[QUERY_PARAMS.category] && query[QUERY_PARAMS.category].toString().toLowerCase() === "corporate-disclosures") return true;

  return false;
};

// Show search onboarding if no search or filters are applied
const showSearchOnboarding = (query: ParsedUrlQuery) => {
  // Some query params are for sorting, ordering or pagination, do not count them as applied filters
  const appliedQueryKeys = Object.keys(query).filter(
    (key) =>
      ![
        QUERY_PARAMS.sort_field,
        QUERY_PARAMS.sort_order,
        QUERY_PARAMS.continuation_tokens,
        QUERY_PARAMS.active_continuation_token,
        QUERY_PARAMS.offset,
        QUERY_PARAMS.passages_by_position,
      ].includes(key)
  );
  if (appliedQueryKeys.length === 0) return true;
  return false;
};

const getSelectedConcepts = (selectedConcepts: string | string[], allConcepts: TTopic[] = []): TTopic[] => {
  const selectedConceptsAsArray = Array.isArray(selectedConcepts) ? selectedConcepts : [selectedConcepts];
  return allConcepts?.filter((concept) => selectedConceptsAsArray.includes(concept.preferred_label.toLowerCase())) || [];
};

const getSelectedFamilyConcepts = (selectedConcepts: string | string[], allConcepts: TTopic[] = []): TTopic[] => {
  const selectedConceptsAsArray = Array.isArray(selectedConcepts) ? selectedConcepts : [selectedConcepts];
  return (
    allConcepts?.filter(
      (concept) =>
        selectedConceptsAsArray.includes(concept.wikibase_id) &&
        (concept.recursive_subconcept_of.length === 0 || concept.recursive_subconcept_of.some((sub) => selectedConceptsAsArray.includes(sub)))
    ) || []
  );
};

export type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Search = ({ familyConceptsData, features, theme, themeConfig, topicsData }: TProps) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [showCSVDownloadPopup, setShowCSVDownloadPopup] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [drawerFamily, setDrawerFamily] = useState<boolean | number>(false);
  const [searchDirty, setSearchDirty] = useState(false);
  const sortSettingsButtonRef = useRef(null);
  const searchSettingsButtonRef = useRef(null);

  const { currentSlideOut, setCurrentSlideOut } = useHashNavigation();
  const { status, families, hits, continuationToken, searchQuery } = useSearch(router.query);
  const { getAppText } = useText();

  const configQuery = useConfig();
  const { data: { regions = [], countries = [], corpus_types = {} } = {} } = configQuery;

  const { status: downloadCSVStatus, download: downloadCSV, resetStatus: resetCSVStatus } = useDownloadCsv();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const { topics } = topicsData;

  // page changes involve 2 things:
  // 1. managing the collection of continuation tokens
  // 2. triggering a new search
  const handlePageChange = (ct: string, offSet: number) => {
    const query = { ...router.query };
    const continuationTokens: string[] = JSON.parse((query[QUERY_PARAMS.continuation_tokens] as string) || "[]");

    if (ct && ct !== "") {
      query[QUERY_PARAMS.active_continuation_token] = ct;
      // if ct is new token, it is added to the continuation tokens array
      // if ct is in the array = we are navigating 'back' to a previous token's page so we don't need to alter array
      if (!continuationTokens.includes(ct)) {
        continuationTokens.push(ct);
      }
      query[QUERY_PARAMS.continuation_tokens] = JSON.stringify(continuationTokens);
    } else {
      // if ct is empty string (or not provided), we can assume we are navigating to the first 5 pages
      delete query[QUERY_PARAMS.active_continuation_token];
    }

    query[QUERY_PARAMS.offset] = offSet.toString();

    router.push({ query: query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  const handleRegionChange = (regionName: string) => {
    delete router.query[QUERY_PARAMS.offset];
    delete router.query[QUERY_PARAMS.active_continuation_token];
    delete router.query[QUERY_PARAMS.continuation_tokens];
    delete router.query[QUERY_PARAMS.country];
    delete router.query[QUERY_PARAMS.subdivision];
    const query = { ...router.query };
    const regions = (query[QUERY_PARAMS.region] as string[]) || [];

    // query string is a string if only one region is selected, else it is an array of strings
    if (regions.includes(regionName)) {
      if (typeof regions === "string") {
        delete query[QUERY_PARAMS.region];
      } else {
        query[QUERY_PARAMS.region] = regions.filter((region) => region !== regionName);
      }
    } else {
      if (typeof regions === "string") {
        query[QUERY_PARAMS.region] = [regions, regionName];
      } else {
        query[QUERY_PARAMS.region] = [...regions, regionName];
      }
    }

    router.push({ query: query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  const handleFilterChange = (type: string, value: string, clearOthersOfType: boolean = false, otherValuesToClear: string[] = []) => {
    // Clear pagination controls and continuation tokens
    delete router.query[QUERY_PARAMS.offset];
    delete router.query[QUERY_PARAMS.active_continuation_token];
    delete router.query[QUERY_PARAMS.continuation_tokens];

    let queryCollection: string[] = [];

    if (router.query[type]) {
      if (Array.isArray(router.query[type])) {
        queryCollection = router.query[type] as string[];
      } else {
        queryCollection = [router.query[type].toString()];
      }
    }

    if (queryCollection.includes(value)) {
      queryCollection = queryCollection.filter((item) => item !== value);
      // If we are removing a sort field, we should also remove the sort order
      // and visa versa
      if (type === QUERY_PARAMS.sort_field) {
        delete router.query[QUERY_PARAMS.sort_order];
      }
      if (type === QUERY_PARAMS.sort_order) {
        delete router.query[QUERY_PARAMS.sort_field];
      }
      // If we are removing a year range, we should also remove the other year range
      if (type === QUERY_PARAMS.year_range) {
        queryCollection = [];
      }

      // In some scenarios we want to clear other values of the same type
      if (otherValuesToClear.length > 0) {
        queryCollection = queryCollection.filter((item) => !otherValuesToClear.includes(item));
      }
    } else {
      // If we want the filter to be exclusive, we clear all other filters of the same type
      if (clearOthersOfType) {
        queryCollection = [value];
      } else {
        queryCollection.push(value);
      }
    }
    // If we are removing a country, clear non-applicable subdivisions
    if (type === QUERY_PARAMS.country) {
      delete router.query[QUERY_PARAMS.subdivision];
    }

    // If we are changing the fund or func document type for MCFs, clear non-applicable filters
    if (type === QUERY_PARAMS.fund) {
      delete router.query[QUERY_PARAMS.implementing_agency];
    }
    if (type === QUERY_PARAMS.fund_doc_type) {
      delete router.query[QUERY_PARAMS.implementing_agency];
      delete router.query[QUERY_PARAMS.status];
    }

    if (type === QUERY_PARAMS.concept_name) {
      queryCollection = Array.from(new Set(queryCollection)); // Remove duplicates
    }

    router.query[type] = queryCollection;
    router.push({ query: router.query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  const handleSearchChange = (type: string, value: any, reset = false) => {
    if (type !== QUERY_PARAMS.offset) {
      delete router.query[QUERY_PARAMS.offset];
    }
    // Clear sorting when a new search query is made
    if (type === QUERY_PARAMS.query_string) {
      delete router.query[QUERY_PARAMS.sort_field];
      delete router.query[QUERY_PARAMS.sort_order];
    }
    // Clear any continuation tokens when a new search query is made
    delete router.query[QUERY_PARAMS.active_continuation_token];
    delete router.query[QUERY_PARAMS.continuation_tokens];
    router.query[type] = value;
    if (!value || reset) {
      delete router.query[type];
    }
    router.push({ query: router.query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  // When we change category we don't want to keep the previous filters which are not applicable
  const handleDocumentCategoryClick = (category: string) => {
    // Reset pagination and continuation tokens
    delete router.query[QUERY_PARAMS.offset];
    delete router.query[QUERY_PARAMS.active_continuation_token];
    delete router.query[QUERY_PARAMS.continuation_tokens];
    // Reset any other filters
    // MCF filters
    delete router.query[QUERY_PARAMS.fund];
    delete router.query[QUERY_PARAMS.status];
    delete router.query[QUERY_PARAMS.implementing_agency];
    delete router.query[QUERY_PARAMS.fund_doc_type];
    // Law and policy filters
    delete router.query[QUERY_PARAMS.framework_laws];
    // Reports filters
    delete router.query[QUERY_PARAMS.author_type];
    // UNFCCC filters
    delete router.query[QUERY_PARAMS["_document.type"]];
    delete router.query[QUERY_PARAMS.convention];
    router.query[QUERY_PARAMS.category] = category;
    // Default search is all categories, so we do not need to provide any category if we want all
    if (category === "All") {
      delete router.query[QUERY_PARAMS.category];
    }
    /*
     **** Specific category selections have specific other filters to add
     */
    // Only reset the topic and sector filters if we are not moving between laws or policies categories
    if (category !== "policies" && category !== "laws") {
      delete router.query[QUERY_PARAMS.topic];
      delete router.query[QUERY_PARAMS.sector];
    }
    if (category === "UN-submissions" || category === "UNFCCC") {
      router.query[QUERY_PARAMS.author_type] = "Party";
    }
    router.push({ query: router.query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  const handleSortClick = (sortOption: string) => {
    // Reset pagination and continuation tokens
    delete router.query[QUERY_PARAMS.offset];
    delete router.query[QUERY_PARAMS.active_continuation_token];
    delete router.query[QUERY_PARAMS.continuation_tokens];

    // No sort selected
    if (sortOption === "null") {
      delete router.query[QUERY_PARAMS.sort_field];
      delete router.query[QUERY_PARAMS.sort_order];
      router.push({ query: router.query }, undefined, { shallow: true });
      scrollTo(0, 0);
      resetCSVStatus();
      return;
    }

    let field = null;
    let order = null;
    if (sortOption !== "relevance") {
      const valArray = sortOption.split(":");
      field = valArray[0];
      order = valArray[1];
    }

    router.query[QUERY_PARAMS.sort_field] = field;
    router.query[QUERY_PARAMS.sort_order] = order;

    // Delete the query params if they are null
    if (!field) {
      delete router.query[QUERY_PARAMS.sort_field];
    }
    if (!order) {
      delete router.query[QUERY_PARAMS.sort_order];
    }
    router.push({ query: router.query }, undefined, { shallow: true });
    scrollTo(0, 0);
    resetCSVStatus();
  };

  const handleYearChange = (values: string[], reset = false) => {
    const newVals = values.map((value) => Number(value).toFixed(0));
    handleSearchChange(QUERY_PARAMS.year_range, newVals, reset);
  };

  const handleClearSearch = () => {
    const previousSearchQuery = router.query[QUERY_PARAMS.query_string] as string;
    if (previousSearchQuery && previousSearchQuery.length > 0) {
      router.push({ query: { [QUERY_PARAMS.query_string]: previousSearchQuery } }, undefined, { shallow: true });
      return scrollTo(0, 0);
    }
    router.push({ query: {} }, undefined, { shallow: true });
    return scrollTo(0, 0);
  };

  const handleDownloadCsvClick = () => {
    if (downloadCSVStatus === "loading") return;
    setShowCSVDownloadPopup(false);
    downloadCSV(router.query);
  };

  const handleMatchesButtonClick = (index: number) => {
    if (drawerFamily === false) return setDrawerFamily(index);
    if (drawerFamily === index) return;

    setDrawerFamily(false);

    setTimeout(() => {
      setDrawerFamily(index);
    }, 150);
  };

  // Concerned only with preventing scrolling when either the drawer or the CSV download popup is open
  useEffect(() => {
    if (typeof drawerFamily === "number" || showCSVDownloadPopup || showFilters) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Allow page to scroll on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [drawerFamily, showCSVDownloadPopup, showFilters]);

  // We want to track changes to search, but only within the context of an open filter panel
  useEffect(() => {
    setSearchDirty(true);
  }, [searchQuery]);
  // If we are opening or closing the filters, we want to assume there are no changes yet
  useEffect(() => {
    setSearchDirty(false);
  }, [showFilters]);

  const groupedFamilyConcepts = familyConceptsData ? Object.groupBy(familyConceptsData, (familyConcept) => familyConcept.type) : undefined;

  const displayHits = hits || 0;
  const searchResultItemName = pluralise(displayHits, [getAppText("searchResultItemSingular"), getAppText("searchResultItemPlural")]);

  let offset = Number.parseInt(router.query[QUERY_PARAMS.offset] as string);
  if (isNaN(offset)) offset = 0;

  return (
    <Layout theme={theme as TTheme} themeConfig={themeConfig} metadataKey="search">
      <FeaturesContext.Provider value={features}>
        <TopicsContext.Provider value={topicsData}>
          <SlideOutContext.Provider value={{ currentSlideOut, setCurrentSlideOut }}>
            <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
              <section>
                <div className="md:flex justify-between items-center border-b border-gray-300">
                  <BreadCrumbs label={"Search results"} />
                  <div className="px-2 cols-2:px-4 cols-3:px-6 cols-4:px-8">
                    <span className="text-sm mb-4 md:mb-0 text-right flex flex-wrap gap-x-2 md:justify-end">
                      {themeConfig.links.emailAlerts && (
                        <>
                          <ExternalLink
                            url={themeConfig.links.emailAlerts}
                            className="mr-2 text-blue-600 hover:underline hover:text-blue-800"
                            cy="download-entire-search-csv"
                          >
                            Email alerts
                          </ExternalLink>
                        </>
                      )}
                      <span>Download data (.csv): </span>
                      <button
                        className="flex gap-2 items-center justify-end text-blue-600 hover:underline hover:text-blue-800"
                        data-cy="download-search-csv"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowCSVDownloadPopup(true);
                        }}
                        data-ph-capture-attribute-link-purpose="download-search"
                        aria-label="Download search results as CSV"
                      >
                        {downloadCSVStatus === "loading" ? <Icon name="loading" /> : "this search"}
                      </button>
                      {themeConfig.links.downloadDatabase && (
                        <>
                          <span>|</span>
                          <ExternalLink
                            url={themeConfig.links.downloadDatabase}
                            className="text-blue-600 hover:underline hover:text-blue-800"
                            cy="download-entire-search-csv"
                            data-ph-capture-attribute-link-purpose="download-database"
                          >
                            whole database
                          </ExternalLink>
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <MultiCol id="search">
                  <SideCol
                    extraClasses={`absolute z-99 top-0 w-screen duration-250 ease-[cubic-bezier(0.04, 0.62, 0.23, 0.98)] ${
                      showFilters ? "translate-y-[0%]" : "fixed translate-y-[100vh]"
                    } cols-4:translate-y-[0%] cols-4:h-full cols-4:sticky cols-4:top-[72px] cols-4:z-50 bg-white`}
                  >
                    {configQuery.isFetching ? (
                      <Loader size="20px" />
                    ) : (
                      <>
                        <div className="sticky cols-4:top-[72px] h-screen cols-4:h-[calc(100vh-72px)] px-5 cols-4:border-r border-gray-300 pt-5 pb-[180px] overflow-y-auto scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 cols-4:pb-4">
                          <SearchFilters
                            searchCriteria={searchQuery}
                            query={router.query}
                            corpus_types={corpus_types}
                            conceptsData={topics}
                            familyConceptsData={familyConceptsData}
                            handleFilterChange={handleFilterChange}
                            handleYearChange={handleYearChange}
                            handleClearSearch={handleClearSearch}
                            handleDocumentCategoryClick={handleDocumentCategoryClick}
                          />
                        </div>

                        {(topics || familyConceptsData || (regions && countries)) && (
                          <SlideOut showCloseButton={false}>
                            {topics && currentSlideOut === "concepts" && <ConceptPicker title="Find mentions of topics" />}
                            {familyConceptsData && currentSlideOut === "categories" && (
                              <FamilyConceptPicker concepts={groupedFamilyConcepts.category} title="Case categories" isRootConceptExclusive={false} />
                            )}
                            {familyConceptsData && currentSlideOut === "principalLaws" && (
                              <FamilyConceptPicker concepts={groupedFamilyConcepts.principal_law} title="Principal laws" />
                            )}
                            {familyConceptsData && currentSlideOut === "jurisdictions" && (
                              <FamilyConceptPicker concepts={groupedFamilyConcepts.jurisdiction} title="Jurisdictions" />
                            )}
                            {regions && countries && currentSlideOut === "geographies" && (
                              <GeographyPicker
                                regions={regions}
                                handleRegionChange={handleRegionChange}
                                handleFilterChange={handleFilterChange}
                                searchQuery={searchQuery}
                                countries={countries}
                                regionFilterLabel={getFilterLabel("Region", "region", router.query[QUERY_PARAMS.category], themeConfig)}
                                countryFilterLabel={getFilterLabel(
                                  "Published jurisdiction",
                                  "country",
                                  router.query[QUERY_PARAMS.category],
                                  themeConfig
                                )}
                              />
                            )}
                          </SlideOut>
                        )}

                        <div className="absolute z-50 bottom-0 left-0 w-full flex pb-[100px] md:hidden">
                          <Button
                            variant={searchDirty ? "solid" : "outlined"}
                            className="m-4 w-full"
                            onClick={() => {
                              setCurrentSlideOut("");
                              setShowFilters(false);
                              setSearchDirty(false);
                            }}
                          >
                            {searchDirty ? "Apply" : "Close"}
                          </Button>
                        </div>
                      </>
                    )}
                  </SideCol>
                  <div
                    className={`flex-1 transition-all duration-150 ${
                      currentSlideOut
                        ? "md:pointer-events-none md:select-none md:opacity-50 xl:pointer-events-auto xl:select-auto xl:opacity-100 xl:ml-[460px]"
                        : ""
                    }`}
                  >
                    <SingleCol extraClasses="px-5 relative">
                      {["error", "success"].includes(downloadCSVStatus) && (
                        <div className="text-sm mt-2">
                          {downloadCSVStatus === "error" && (
                            <span className="text-red-600">There was an error downloading the CSV. Please try again</span>
                          )}
                          {downloadCSVStatus === "success" && (
                            <span className="text-green-600">CSV downloaded successfully, please check your downloads folder</span>
                          )}
                        </div>
                      )}

                      <div className="mt-5">
                        {status === "loading" ? (
                          <div className="w-full flex justify-center h-96">
                            <Loader />
                          </div>
                        ) : (
                          <>
                            <div className="md:mb-5">
                              <div className="md:hidden mb-4">
                                <Button content="both" className="flex-nowrap" onClick={toggleFilters}>
                                  <span>{showFilters ? "Hide" : "Show"} filters</span>
                                </Button>
                              </div>
                              <div className="flex gap-4 justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <Info
                                    title="Showing the top 500 results"
                                    description={
                                      <>
                                        <span>We limit the number of matches you can see so you get the quickest, most accurate results.</span>
                                        {theme === "ccc" && (
                                          <span className="block mt-2">
                                            This number may not accurately reflect the number of cases; please contact{" "}
                                            <PageLink
                                              external
                                              href="mailto:manager@climatecasechart.com"
                                              className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                                            >
                                              manager@climatecasechart.com
                                            </PageLink>{" "}
                                            for information about case numbers.
                                          </span>
                                        )}
                                      </>
                                    }
                                    link={{ href: "/faq", text: "Learn more" }}
                                  />
                                  <p className="text-sm text-text-primary font-normal">
                                    Results:{" "}
                                    <span className="text-text-secondary">
                                      {displayHits}
                                      {searchResultItemName && " " + searchResultItemName}
                                    </span>
                                  </p>
                                </div>
                                <div className="shrink-0 flex flex-col lg:flex-row gap-1 lg:gap-4">
                                  <div className="relative z-10 -top-0.5 flex justify-end">
                                    <button
                                      className={`flex items-center gap-1 px-2 py-1 -mt-1 rounded-md text-sm text-text-primary font-normal ${showSearchOptions ? "bg-surface-ui" : ""}`}
                                      onClick={() => setShowSearchOptions(!showSearchOptions)}
                                      data-cy="search-options"
                                      ref={searchSettingsButtonRef}
                                      aria-label="Search options"
                                    >
                                      <span className="font-bold">Search:</span>{" "}
                                      <span>
                                        {getCurrentSearchChoice(router.query) === "true" ? SEARCH_SETTINGS.exact : SEARCH_SETTINGS.semantic}
                                      </span>
                                      <ChevronDown />
                                    </button>
                                    <AnimatePresence initial={false}>
                                      {showSearchOptions && (
                                        <motion.div
                                          key="content"
                                          initial="hidden"
                                          animate="visible"
                                          exit="hidden"
                                          variants={SETTINGS_ANIMATION_VARIANTS}
                                        >
                                          <SearchSettings
                                            queryParams={router.query}
                                            handleSearchChange={handleSearchChange}
                                            setShowOptions={setShowSearchOptions}
                                            settingsButtonRef={searchSettingsButtonRef}
                                            extraClasses="w-[280px]"
                                          />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <div className="relative z-8 -top-0.5 flex justify-end">
                                    <button
                                      className={`flex items-center gap-1 px-2 py-1 -mt-1 rounded-md text-sm text-text-primary font-normal ${showSortOptions ? "bg-surface-ui" : ""}`}
                                      onClick={() => setShowSortOptions(!showSortOptions)}
                                      data-cy="search-options"
                                      ref={sortSettingsButtonRef}
                                      aria-label="Sort options"
                                    >
                                      <span className="font-bold">Order:</span>{" "}
                                      <span>
                                        {getSelectedSortOptionText(
                                          getCurrentSortChoice(
                                            router.query,
                                            !router.query[QUERY_PARAMS.query_string] ||
                                              router.query[QUERY_PARAMS.query_string]?.toString().trim() === ""
                                          )
                                        )}
                                      </span>{" "}
                                      <ChevronDown />
                                    </button>
                                    <AnimatePresence initial={false}>
                                      {showSortOptions && (
                                        <motion.div
                                          key="content"
                                          initial="hidden"
                                          animate="visible"
                                          exit="hidden"
                                          variants={SETTINGS_ANIMATION_VARIANTS}
                                        >
                                          <SearchSettings
                                            queryParams={router.query}
                                            handleSortClick={handleSortClick}
                                            setShowOptions={setShowSortOptions}
                                            settingsButtonRef={sortSettingsButtonRef}
                                          />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <section data-cy="search-results">
                              <h2 className="sr-only">Search results</h2>
                              {showLitigationInformation(router.query) && (
                                <Warning variant="info">
                                  <p>
                                    You are viewing a list of litigation cases filtered by{" "}
                                    {getSelectedFamilyConcepts(router.query[QUERY_PARAMS.concept_preferred_label], familyConceptsData)
                                      .map((c) => c.preferred_label)
                                      .join(" AND ")}
                                  </p>
                                </Warning>
                              )}
                              {showCorporateDisclosuresInformation(router.query) && (
                                <Warning variant="info">
                                  <p className="font-semibold">New data</p>
                                  <p>
                                    A snapshot of 900+ corporate reports from H1/2025, including climate transition plans and regulatory filings
                                    published by 460 publicly listed high emitting companies. Note, some of the{" "}
                                    <button
                                      className="underline hover:text-blue-800"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentSlideOut("concepts");
                                      }}
                                      aria-label="Open Topics filter"
                                    >
                                      automatic topic filters
                                    </button>{" "}
                                    such as "Climate finance" currently do not perform as well on this dataset.
                                  </p>
                                </Warning>
                              )}
                              {showKnowledgeGraphInformation(router.query) && (
                                <Warning variant="info">
                                  <p>
                                    You are viewing a list of documents containing precise text passage matches related to{" "}
                                    <ResultsTopicsContext
                                      phrase={router.query[QUERY_PARAMS.query_string] as string}
                                      selectedTopics={getSelectedConcepts(router.query[QUERY_PARAMS.concept_name], topics)}
                                    />
                                    . There is currently a short delay in topics appearing on new documents.{" "}
                                    <LinkWithQuery href="/faq" target="_blank" hash="topics-faqs" className="underline hover:text-blue-800">
                                      Learn more
                                    </LinkWithQuery>
                                  </p>
                                </Warning>
                              )}
                              {showSearchOnboarding(router.query) && (
                                <Warning variant="info" hideableId="search-onboarding-info">
                                  <p className="font-semibold text-text-brand">Get better results</p>
                                  <p>
                                    {getAppText("searchOnboarding")}
                                    {features.knowledgeGraph && (
                                      <>
                                        {" "}
                                        You can also use the AI-supported{" "}
                                        <button
                                          className="underline hover:text-blue-800"
                                          aria-label="Open Topics filter"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentSlideOut("concepts");
                                          }}
                                        >
                                          Topics filter
                                        </button>{" "}
                                        to help refine your search.
                                      </>
                                    )}
                                  </p>
                                </Warning>
                              )}
                              <SearchResultList
                                category={router.query[QUERY_PARAMS.category]?.toString()}
                                families={families}
                                offset={offset}
                                onClick={handleMatchesButtonClick}
                                activeFamilyIndex={drawerFamily}
                              />
                            </section>
                          </>
                        )}
                      </div>
                      {status !== "loading" && hits > 1 && (
                        <div className="mb-12">
                          <Pagination
                            onChange={handlePageChange}
                            totalHits={hits}
                            activeContinuationToken={router.query[QUERY_PARAMS.active_continuation_token] as string}
                            continuationToken={continuationToken}
                            continuationTokens={router.query[QUERY_PARAMS.continuation_tokens] as string}
                            offset={router.query[QUERY_PARAMS.offset] as string}
                          />
                        </div>
                      )}
                    </SingleCol>
                  </div>
                </MultiCol>
              </section>
              <Slideout show={drawerFamily !== false} setShow={setDrawerFamily}>
                <FamilyMatchesDrawer family={drawerFamily !== false && families[drawerFamily as number]} />
              </Slideout>
              <DownloadCsvPopup isOpen={showCSVDownloadPopup} onClose={() => setShowCSVDownloadPopup(false)} onDownload={handleDownloadCsvClick} />
            </WikiBaseConceptsContext.Provider>
          </SlideOutContext.Provider>
        </TopicsContext.Provider>
      </FeaturesContext.Provider>
    </Layout>
  );
};

export default Search;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const client = new ApiClient(process.env.CONCEPTS_API_URL);

  let topicsData: TTopics = { rootTopics: [], topics: [] };
  let familyConceptsData: TApiTopic[] | undefined;

  try {
    const { data: topicsResponse } = await client.get<TApiTopic[]>(`/concepts/search?limit=10000&has_classifier=true`);
    topicsData = await fetchAndProcessTopics(topicsResponse.map((topic) => topic.wikibase_id));

    if (features.familyConceptsSearch) {
      const familyConceptsResponse = await fetch(`${process.env.CONCEPTS_API_URL}/families/concepts`);
      const familyConceptsJson: { data: FamilyConcept[] } = await familyConceptsResponse.json();
      familyConceptsData = mapFamilyConceptsToConcepts(familyConceptsJson.data);
    }
  } catch (error) {
    // TODO handle error more elegantly
  }

  return {
    props: withEnvConfig({
      familyConceptsData: (familyConceptsData as TTopic[]) ?? null,
      features,
      theme,
      themeConfig,
      topicsData,
      posthogPageViewProps: {
        search_version: "v1",
      },
    }),
  };
}) satisfies GetServerSideProps;
