import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { LuSettings2 } from "react-icons/lu";

import { ApiClient } from "@/api/http-common";

import useConfig from "@/hooks/useConfig";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import useSearch from "@/hooks/useSearch";

import { MultiCol } from "@/components/panels/MultiCol";
import { SideCol } from "@/components/panels/SideCol";
import { SingleCol } from "@/components/panels/SingleCol";

import { ExternalLink } from "@/components/ExternalLink";
import Loader from "@/components/Loader";
import { NoOfResults } from "@/components/NoOfResults";
import SearchFilters from "@/components/blocks/SearchFilters";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Drawer from "@/components/drawer/Drawer";
import { FamilyMatchesDrawer } from "@/components/drawer/FamilyMatchesDrawer";
import { SearchSettings } from "@/components/filters/SearchSettings";
import Layout from "@/components/layouts/Main";
import { DownloadCsvPopup } from "@/components/modals/DownloadCsv";
import { SubNav } from "@/components/nav/SubNav";
import Pagination from "@/components/pagination";
import SearchResultList from "@/components/search/SearchResultList";
import { Icon } from "@/components/atoms/icon/Icon";
import { Button } from "@/components/atoms/button/Button";
import { ConceptPicker } from "@/components/organisms/ConceptPicker";
import { SlideOut } from "@/components/atoms/SlideOut/SlideOut";
import { Label } from "@/components/labels/Label";

import { getThemeConfigLink } from "@/utils/getThemeConfigLink";
import { readConfigFile } from "@/utils/readConfigFile";
import { getFeatureFlags } from "@/utils/featureFlags";

import { QUERY_PARAMS } from "@/constants/queryParams";

import { SlideOutContext, TSlideOutContent } from "@/context/SlideOutContext";

import { TConcept, TTheme, TThemeConfig } from "@/types";
import { withEnvConfig } from "@/context/EnvConfig";

type TProps = {
  theme: TTheme;
  themeConfig: TThemeConfig;
  featureFlags: Record<string, string | boolean>;
  conceptsData?: TConcept[];
};

const SETTINGS_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const Search: InferGetServerSidePropsType<typeof getServerSideProps> = ({ theme, themeConfig, featureFlags, conceptsData }: TProps) => {
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string];
  const [showFilters, setShowFilters] = useState(false);
  const [showCSVDownloadPopup, setShowCSVDownloadPopup] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [drawerFamily, setDrawerFamily] = useState<boolean | number>(false);
  const [searchDirty, setSearchDirty] = useState(false);
  const settingsButtonRef = useRef(null);

  const [currentSlideOut, setCurrentSlideOut] = useState<TSlideOutContent>("");

  const { status, families, hits, continuationToken, searchQuery } = useSearch(router.query);

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
    delete router.query[QUERY_PARAMS.concept_id];
    delete router.query[QUERY_PARAMS.concept_name];
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
    if (typeof drawerFamily === "number" || showCSVDownloadPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Allow page to scroll on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [drawerFamily, showCSVDownloadPopup]);

  // We want to track changes to search, but only within the context of an open filter panel
  useEffect(() => {
    setSearchDirty(true);
  }, [searchQuery]);
  // If we are opening or closing the filters, we want to assume there are no changes yet
  useEffect(() => {
    setSearchDirty(false);
  }, [showFilters]);

  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="search">
      <SlideOutContext.Provider value={{ currentSlideOut, setCurrentSlideOut }}>
        <section>
          <SubNav>
            <BreadCrumbs label={"Search results"} />
            <div>
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
          </SubNav>
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
                  <div className="sticky md:top-[72px] h-screen md:h-[calc(100vh-72px)] px-5 bg-white border-r border-gray-300 pt-5 pb-[70px] overflow-y-auto scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pb-0">
                    <SearchFilters
                      searchCriteria={searchQuery}
                      query={router.query}
                      regions={regions}
                      countries={countries}
                      corpus_types={corpus_types}
                      conceptsData={conceptsData}
                      handleFilterChange={handleFilterChange}
                      handleYearChange={handleYearChange}
                      handleRegionChange={handleRegionChange}
                      handleClearSearch={handleClearSearch}
                      handleDocumentCategoryClick={handleDocumentCategoryClick}
                      featureFlags={featureFlags}
                    />
                  </div>
                  <SlideOut showCloseButton={false}>
                    {currentSlideOut === "concepts" && (
                      <ConceptPicker
                        concepts={conceptsData}
                        title={
                          <div className="flex items-center gap-2">
                            <div className="text-[15px] font-medium text-text-primary">Concepts</div>
                            <Label>Beta</Label>
                          </div>
                        }
                      />
                    )}
                  </SlideOut>
                  <div className="absolute z-50 bottom-0 left-0 w-full flex bg-white md:hidden">
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
              className={`flex-1 bg-white transition-[filter] duration-150 ${
                currentSlideOut ? "md:brightness-50 md:pointer-events-none md:select-none" : ""
              }`}
            >
              <SingleCol extraClasses="px-5 pt-5 relative">
                <div>
                  <div className="">
                    <div className="flex justify-between flex-wrap gap-2 items-center">
                      <div className="md:hidden">
                        <Button content="both" className="flex-nowrap" onClick={toggleFilters}>
                          <span>{showFilters ? "Hide" : "Show"} filters</span>
                        </Button>
                      </div>
                      <div className="relative z-10 md:order-1">
                        <button
                          className={`p-4 text-textDark text-xl ${showOptions ? "bg-nearBlack text-white rounded-full" : ""}`}
                          onClick={() => setShowOptions(!showOptions)}
                          data-cy="search-options"
                          ref={settingsButtonRef}
                        >
                          <LuSettings2 />
                        </button>
                        <AnimatePresence initial={false}>
                          {showOptions && (
                            <motion.div key="content" initial="hidden" animate="visible" exit="hidden" variants={SETTINGS_ANIMATION_VARIANTS}>
                              <SearchSettings
                                queryParams={router.query}
                                handleSortClick={handleSortClick}
                                handleSearchChange={handleSearchChange}
                                setShowOptions={setShowOptions}
                                settingsButtonRef={settingsButtonRef}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="text-xs basis-full md:basis-auto md:order-0" data-cy="number-of-results">
                        {status === "success" && <NoOfResults hits={hits} queryString={qQueryString} />}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm md:text-right">
                    {downloadCSVStatus === "error" && <span className="text-red-600">There was an error downloading the CSV. Please try again</span>}
                    {downloadCSVStatus === "success" && (
                      <span className="text-green-600">CSV downloaded successfully, please check your downloads folder</span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  {status === "loading" ? (
                    <div className="w-full flex justify-center h-96">
                      <Loader />
                    </div>
                  ) : (
                    <section data-cy="search-results" className="min-h-screen">
                      <h2 className="sr-only">Search results</h2>
                      <SearchResultList
                        category={router.query[QUERY_PARAMS.category]?.toString()}
                        families={families}
                        onClick={handleMatchesButtonClick}
                        activeFamilyIndex={drawerFamily}
                      />
                    </section>
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
        <DownloadCsvPopup
          active={showCSVDownloadPopup}
          onCancelClick={() => setShowCSVDownloadPopup(false)}
          onConfirmClick={() => handleDownloadCsvClick()}
        />
        <script id="feature-flags" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureFlags) }} />
      </SlideOutContext.Provider>
    </Layout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = await getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  let themeConfig = {};
  try {
    themeConfig = await readConfigFile(theme);
  } catch (error) {}

  let conceptsData: TConcept[];
  try {
    const client = new ApiClient(process.env.CONCEPTS_API_URL);
    const conceptsV1 = featureFlags["concepts-v1"];
    if (conceptsV1) {
      const { data: returnedData } = await client.get(`/concepts/search?limit=10000&has_classifier=true`);
      conceptsData = returnedData;
    }
  } catch (error) {
    // TODO: handle error more elegantly
  }

  return {
    props: withEnvConfig({ theme, themeConfig, featureFlags, conceptsData: conceptsData ?? null }),
  };
};
