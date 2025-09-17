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
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Drawer from "@/components/drawer/Drawer";
import { FamilyMatchesDrawer } from "@/components/drawer/FamilyMatchesDrawer";
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
import { SiteWidth } from "@/components/panels/SiteWidth";
import SearchResultList from "@/components/search/SearchResultList";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { SEARCH_SETTINGS } from "@/constants/searchSettings";
import { sortOptions } from "@/constants/sortOptions";
import { withEnvConfig } from "@/context/EnvConfig";
import { SlideOutContext } from "@/context/SlideOutContext";
import useConfig from "@/hooks/useConfig";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useHashNavigation } from "@/hooks/useHashNavigation";
import useSearch from "@/hooks/useSearch";
import { TConcept, TFeatureFlags, TTheme, TThemeConfig } from "@/types";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isFamilyConceptsEnabled, isKnowledgeGraphEnabled, isLitigationEnabled } from "@/utils/features";
import { getCurrentSearchChoice } from "@/utils/getCurrentSearchChoice";
import { getCurrentSortChoice } from "@/utils/getCurrentSortChoice";
import { getFilterLabel } from "@/utils/getFilterLabel";
import { ResultsTopicsContext } from "@/utils/getPassageResultsContext";
import { getThemeConfigLink } from "@/utils/getThemeConfigLink";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  theme: TTheme;
  themeConfig: TThemeConfig;
  featureFlags: TFeatureFlags;
  conceptsData?: TConcept[] | null;
  familyConceptsData?: TConcept[] | null;
}

const SETTINGS_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const getSelectedSortOptionText = (sortOption: string) => {
  const selectedOptionValue = sortOptions.find(({ value }) => value === sortOption);
  return selectedOptionValue.label;
};

const showResultInformation = (query: ParsedUrlQuery) => {
  return showKnowledgeGraphInformation(query) || showCorporateDisclosuresInformation(query);
};

// We want to show information when using specific litigation filters
const showLitigationInformation = (query: ParsedUrlQuery) => {
  if (Array.isArray(query[QUERY_PARAMS.concept_preferred_label]) && query[QUERY_PARAMS.concept_preferred_label].length >= 2) return true;
  return false;
};

// We want to show the KG information under certain rules
const showKnowledgeGraphInformation = (query: ParsedUrlQuery) => {
  let show = false;
  // If we have multiple topics/concepts selected
  if (Array.isArray(query[QUERY_PARAMS.concept_name]) && query[QUERY_PARAMS.concept_name].length > 1) return true;
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

const getSelectedConcepts = (selectedConcepts: string | string[], allConcepts: TConcept[] = []): TConcept[] => {
  const selectedConceptsAsArray = Array.isArray(selectedConcepts) ? selectedConcepts : [selectedConcepts];
  return allConcepts?.filter((concept) => selectedConceptsAsArray.includes(concept.preferred_label.toLowerCase())) || [];
};

const getSelectedFamilyConcepts = (selectedConcepts: string | string[], allConcepts: TConcept[] = []): TConcept[] => {
  const selectedConceptsAsArray = Array.isArray(selectedConcepts) ? selectedConcepts : [selectedConcepts];
  return (
    allConcepts?.filter(
      (concept) =>
        selectedConceptsAsArray.includes(concept.wikibase_id) &&
        (concept.recursive_subconcept_of.length === 0 || concept.recursive_subconcept_of.some((sub) => selectedConceptsAsArray.includes(sub)))
    ) || []
  );
};

const Search: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  theme,
  themeConfig,
  featureFlags,
  conceptsData,
  familyConceptsData,
}: IProps) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [showCSVDownloadPopup, setShowCSVDownloadPopup] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [drawerFamily, setDrawerFamily] = useState<boolean | number>(false);
  const [searchDirty, setSearchDirty] = useState(false);
  const sortSettingsButtonRef = useRef(null);
  const searchSettingsButtonRef = useRef(null);

  const { status, families, hits, continuationToken, searchQuery } = useSearch(router.query);

  const { currentSlideOut, setCurrentSlideOut } = useHashNavigation();

  const configQuery = useConfig();
  const { data: { regions = [], countries = [], corpus_types = {} } = {} } = configQuery;

  const { status: downloadCSVStatus, download: downloadCSV, resetStatus: resetCSVStatus } = useDownloadCsv();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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

  const handleFilterChange = (type: string, value: string, clearOthersOfType: boolean = false) => {
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
    // Only reset the topic and sector filters if we are not moving between laws or policies categories
    if (category !== "policies" && category !== "laws") {
      delete router.query[QUERY_PARAMS.topic];
      delete router.query[QUERY_PARAMS.sector];
    }
    router.query[QUERY_PARAMS.category] = category;
    // Default search is all categories, so we do not need to provide any category if we want all
    if (category === "All") {
      delete router.query[QUERY_PARAMS.category];
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

  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="search">
      <SlideOutContext.Provider value={{ currentSlideOut, setCurrentSlideOut }}>
        <section>
          <div className="md:flex justify-between items-center border-b border-gray-200">
            <BreadCrumbs label={"Search results"} />
            <div className="px-3 cols-2:px-6 cols-3:px-8">
              <span className="text-sm mt-4 md:mt-0 text-right flex flex-wrap gap-x-2 md:justify-end">
                <span>Download data (.csv): </span>
                <a
                  href="#"
                  className="flex gap-2 items-center justify-end text-blue-600 hover:underline hover:text-blue-800"
                  data-cy="download-search-csv"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCSVDownloadPopup(true);
                  }}
                >
                  {downloadCSVStatus === "loading" ? <Icon name="loading" /> : "this search"}
                </a>
                {getThemeConfigLink(themeConfig, "download-database") && (
                  <>
                    <span>|</span>
                    <ExternalLink
                      url={getThemeConfigLink(themeConfig, "download-database").url}
                      className="text-blue-600 hover:underline hover:text-blue-800"
                      cy="download-entire-search-csv"
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
              extraClasses={`absolute z-99 top-0 w-screen bg-white duration-250 ease-[cubic-bezier(0.04, 0.62, 0.23, 0.98)] ${
                showFilters ? "translate-y-[0%]" : "fixed translate-y-[100vh]"
              } md:translate-y-[0%] md:h-full md:sticky md:top-[72px] md:z-50`}
            >
              {configQuery.isFetching ? (
                <Loader size="20px" />
              ) : (
                <>
                  <div className="sticky md:top-[72px] h-screen md:h-[calc(100vh-72px)] px-5 bg-white md:border-r border-gray-300 pt-5 pb-[180px] overflow-y-auto scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pb-4">
                    <SearchFilters
                      searchCriteria={searchQuery}
                      query={router.query}
                      corpus_types={corpus_types}
                      conceptsData={conceptsData}
                      familyConceptsData={familyConceptsData}
                      handleFilterChange={handleFilterChange}
                      handleYearChange={handleYearChange}
                      handleClearSearch={handleClearSearch}
                      handleDocumentCategoryClick={handleDocumentCategoryClick}
                      featureFlags={featureFlags}
                    />
                  </div>

                  {(conceptsData || familyConceptsData || (regions && countries)) && (
                    <SlideOut showCloseButton={false}>
                      {conceptsData && currentSlideOut === "concepts" && <ConceptPicker concepts={conceptsData} title="Find mentions of topics" />}
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
                          countryFilterLabel={getFilterLabel("Published jurisdiction", "country", router.query[QUERY_PARAMS.category], themeConfig)}
                          litigationEnabled={isLitigationEnabled(featureFlags, themeConfig)}
                        />
                      )}
                    </SlideOut>
                  )}

                  <div className="absolute z-50 bottom-0 left-0 w-full flex pb-[100px] bg-white md:hidden">
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
              className={`flex-1 bg-white transition-all duration-150 ${
                currentSlideOut
                  ? "md:pointer-events-none md:select-none md:opacity-50 xl:pointer-events-auto xl:select-auto xl:opacity-100 xl:ml-[460px]"
                  : ""
              }`}
            >
              <SingleCol extraClasses="px-5 relative">
                {["error", "success"].includes(downloadCSVStatus) && (
                  <div className="text-sm mt-2">
                    {downloadCSVStatus === "error" && <span className="text-red-600">There was an error downloading the CSV. Please try again</span>}
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
                        <div className="flex flex-wrap gap-4 justify-between items-start">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-text-primary font-normal">
                              Results <span className="text-text-secondary">{hits || 0}</span>
                            </p>
                            <Info
                              title="Showing the top 500 results"
                              description="We limit the number of matches you can see so you get the quickest, most accurate results."
                              link={{ href: "/faq", text: "Learn more" }}
                            />
                          </div>
                          <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
                            <div className="relative z-10 -top-0.5 flex justify-end">
                              <button
                                className={`flex items-center gap-1 px-2 py-1 -mt-1 rounded-md text-sm text-text-primary font-normal ${showSearchOptions ? "bg-surface-ui" : ""}`}
                                onClick={() => setShowSearchOptions(!showSearchOptions)}
                                data-cy="search-options"
                                ref={searchSettingsButtonRef}
                              >
                                <span className="font-bold">Search:</span>{" "}
                                <span>{getCurrentSearchChoice(router.query) === "true" ? SEARCH_SETTINGS.exact : SEARCH_SETTINGS.semantic}</span>
                                <ChevronDown />
                              </button>
                              <AnimatePresence initial={false}>
                                {showSearchOptions && (
                                  <motion.div key="content" initial="hidden" animate="visible" exit="hidden" variants={SETTINGS_ANIMATION_VARIANTS}>
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
                              >
                                <span className="font-bold">Order:</span>{" "}
                                <span>
                                  {getSelectedSortOptionText(
                                    getCurrentSortChoice(
                                      router.query,
                                      !router.query[QUERY_PARAMS.query_string] || router.query[QUERY_PARAMS.query_string]?.toString().trim() === ""
                                    )
                                  )}
                                </span>{" "}
                                <ChevronDown />
                              </button>
                              <AnimatePresence initial={false}>
                                {showSortOptions && (
                                  <motion.div key="content" initial="hidden" animate="visible" exit="hidden" variants={SETTINGS_ANIMATION_VARIANTS}>
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
                              A snapshot of 900+ corporate reports from H1/2025, including climate transition plans and regulatory filings published
                              by 460 publicly listed high emitting companies. Note, some of the{" "}
                              <a
                                className="underline hover:text-blue-800"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentSlideOut("concepts");
                                }}
                              >
                                automatic topic filters
                              </a>{" "}
                              such as "Climate finance" currently do not perform as well on this dataset.
                            </p>
                          </Warning>
                        )}
                        {showKnowledgeGraphInformation(router.query) && (
                          <Warning variant="info">
                            <p>
                              You are viewing a list of documents containing precise text passages matches related to{" "}
                              <ResultsTopicsContext
                                phrase={router.query[QUERY_PARAMS.query_string] as string}
                                selectedTopics={getSelectedConcepts(router.query[QUERY_PARAMS.concept_name], conceptsData)}
                              />
                              .{" "}
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
                              You are currently viewing all of the documents in our database. Narrow your search by document type, geography, date,
                              and more.
                              {isKnowledgeGraphEnabled(featureFlags, themeConfig) && (
                                <>
                                  {" "}
                                  You can also use the AI-supported{" "}
                                  <a
                                    className="underline hover:text-blue-800"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentSlideOut("concepts");
                                    }}
                                  >
                                    Topics filter
                                  </a>{" "}
                                  to help refine your search.
                                </>
                              )}
                            </p>
                          </Warning>
                        )}
                        <SearchResultList
                          category={router.query[QUERY_PARAMS.category]?.toString()}
                          families={families}
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
        <Drawer show={drawerFamily !== false} setShow={setDrawerFamily}>
          <FamilyMatchesDrawer family={drawerFamily !== false && families[drawerFamily as number]} />
        </Drawer>
        <DownloadCsvPopup isOpen={showCSVDownloadPopup} onClose={() => setShowCSVDownloadPopup(false)} onDownload={handleDownloadCsvClick} />
      </SlideOutContext.Provider>
    </Layout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  let conceptsData: TConcept[];
  if (knowledgeGraphEnabled) {
    try {
      const client = new ApiClient(process.env.CONCEPTS_API_URL);
      const { data: returnedData } = await client.get(`/concepts/search?limit=10000&has_classifier=true`);
      conceptsData = returnedData;
    } catch (error) {
      // TODO: handle error more elegantly
    }
  }

  // TODO: Next - start rendering this data
  let familyConceptsData: TConcept[] | undefined;
  if (isFamilyConceptsEnabled(featureFlags, themeConfig)) {
    try {
      const familyConceptsResponse = await fetch(`${process.env.CONCEPTS_API_URL}/families/concepts`);
      const familyConceptsJson: { data: FamilyConcept[] } = await familyConceptsResponse.json();
      familyConceptsData = mapFamilyConceptsToConcepts(familyConceptsJson.data);
    } catch (e) {
      // TODO: handle error more elegantly
    }
  }

  return {
    props: withEnvConfig({
      theme,
      themeConfig,
      featureFlags,
      conceptsData: conceptsData ?? null,
      familyConceptsData: familyConceptsData ?? null,
    }),
  };
};
