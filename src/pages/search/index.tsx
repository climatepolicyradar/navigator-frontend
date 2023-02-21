import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { TDocument } from "@types";
import { useDidUpdateEffect } from "@hooks/useDidUpdateEffect";
import useSearch from "@hooks/useSearch";
import useSearchCriteria from "@hooks/useSearchCriteria";
import useDocument from "@hooks/useDocument";
import useUpdateDocument from "@hooks/useUpdateDocument";
import useUpdateSearchCriteria from "@hooks/useUpdateSearchCriteria";
import useUpdateSearchFilters from "@hooks/useUpdateSearchFilters";
import useUpdateCountries from "@hooks/useUpdateCountries";
import useConfig from "@hooks/useConfig";
import useFilteredCountries from "@hooks/useFilteredCountries";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import Layout from "@components/layouts/Main";
import LoaderOverlay from "@components/LoaderOverlay";
import SearchForm from "@components/forms/SearchForm";
import SearchFilters from "@components/blocks/SearchFilters";
import TabbedNav from "@components/nav/TabbedNav";
import Loader from "@components/Loader";
import Sort from "@components/filters/Sort";
import Close from "@components/buttons/Close";
import FilterToggle from "@components/buttons/FilterToggle";
import Slideout from "@components/slideout";
import PassageMatches from "@components/PassageMatches";
import EmbeddedPDF from "@components/EmbeddedPDF";
import DocumentSlideout from "@components/headers/DocumentSlideout";
import Pagination from "@components/pagination";
import SearchResultList from "@components/blocks/SearchResultList";
import { initialSearchCriteria } from "@constants/searchCriteria";
import { ExternalLink } from "@components/ExternalLink";
import Tooltip from "@components/tooltip";
import { calculatePageCount } from "@utils/paging";
import { PER_PAGE } from "@constants/paging";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import buildSearchQuery from "@utils/buildSearchQuery";

const Search = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSlideout, setShowSlideout] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [passageIndex, setPassageIndex] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [offset, setOffset] = useState(null);

  const updateSearchCriteria = useUpdateSearchCriteria();
  const updateSearchFilters = useUpdateSearchFilters();
  const updateDocument = useUpdateDocument();
  const updateCountries = useUpdateCountries();
  const slideoutRef = useRef(null);
  const { t, ready } = useTranslation(["searchStart", "searchResults"]);
  const router = useRouter();

  // close slideout panel when clicking outside of it
  useOutsideAlerter(slideoutRef, (e) => {
    if (e.target.nodeName === "BUTTON") {
      return;
    }
    setShowSlideout(false);
  });

  // get lookups/filters
  const configQuery = useConfig("config");
  const { data: { document_types = [], sectors = [], regions = [], countries = [] } = {} } = configQuery;

  const { data: filteredCountries } = useFilteredCountries(countries);

  // search criteria and filters
  const { isFetching: isFetchingSearchCriteria, data: searchCriteria } = useSearchCriteria();

  const isBrowsing = router?.query?.query_string.toString().trim() === "";
  // const isBrowsing = searchCriteria?.query_string.trim() === "";

  // search results
  // FIXME: change searchCriteria to take in buildSearchQuery()
  // FIXME: strongly type the result here
  const resultsQuery: any = useSearch("searches", buildSearchQuery({ ...router.query }));
  const { data: { data: { documents = [] } = [] } = [], data: { data: { hits } = 0 } = 0 } = resultsQuery;

  const { data: document }: { data: TDocument } = ({} = useDocument());

  const placeholder = t("Search for something, e.g. 'carbon taxes'");

  const resetPaging = () => {
    setOffset(0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetSlideOut = (slideOut?: boolean) => {
    setShowPDF(false);
    setPassageIndex(null);
    setShowSlideout(slideOut ?? !showSlideout);
  };

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * PER_PAGE);
    setShowSlideout(false);
  };

  const handleRegionChange = (type: string, regionName: string) => {
    router.query[type] = regionName;
    router.push({ query: router.query });
    // handleFilterChange(type, regionName);
    // updateCountries.mutate({
    //   regionName,
    //   regions,
    //   countries,
    // });
  };

  const handleFilterChange = (type: string, value: string, action: string = "update") => {
    // default to page 1
    delete router.query["offset"];

    let queryCollection: string[] = [];

    if (router.query[type]) {
      if (Array.isArray(router.query[type])) {
        queryCollection = router.query[type] as string[];
      } else {
        queryCollection = [router.query[type].toString()];
      }
    }

    queryCollection.push(value);
    router.query[type] = queryCollection;
    router.push({ query: router.query });

    // resetPaging();
    // updateSearchFilters.mutate({ [type]: value, action });
  };

  const handleSuggestion = (term: string, filter?: string, filterValue?: string) => {
    router.query["query_string"] = term;
    if (filter && filterValue && filter.length && filterValue.length) {
      router.query[filter] = [filterValue.toLowerCase()];
    }

    console.log(router.query);
    router.push({ query: router.query });

    // const newSearchCritera = {
    //   ["query_string"]: term,
    // };
    // let additionalCritera = {};
    // if (filter && filterValue && filter.length && filterValue.length) {
    //   additionalCritera = { ...additionalCritera, ["keyword_filters"]: { [filter]: [filterValue] } };
    // }
    // updateSearchCriteria.mutate({ ...newSearchCritera, ...additionalCritera });
  };

  const handleSearchChange = (type: string, value: any) => {
    if (type !== "offset") delete router.query["offset"];
    router.query[type] = value;
    if (!value) {
      delete router.query[type];
    }
    router.push({ query: router.query });
    // updateSearchCriteria.mutate({ [type]: value });
  };

  const handleSearchInput = (term: string) => {
    handleSearchChange("query_string", term);
  };

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const val = e.currentTarget.textContent;
    let category = val;
    router.query["category"] = category;
    // Default search is all categories
    if (val === "All") {
      delete router.query["category"];
    }
    router.push({ query: router.query });
    // const action = val === "All" ? "delete" : "update";
    // handleFilterChange("categories", category, action);
  };

  const handleSortClick = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    let field = null;
    let order = null;
    if (val !== "relevance") {
      const valArray = val.split(":");
      field = valArray[0];
      order = valArray[1];
    }

    router.query["sort_field"] = field;
    router.query["sort_order"] = order;
    // Delete the query params if they are null
    if (!field) {
      delete router.query["sort_field"];
    }
    if (!order) {
      delete router.query["sort_order"];
    }
    router.push({ query: router.query });
  };

  const handleYearChange = (values: number[]) => {
    const newVals = values.map((value: number) => Number(value).toFixed(0));
    handleSearchChange("year_range", newVals);
  };

  const handleClearSearch = () => {
    const { query_string, exact_match, sort_field, sort_order, ...initial } = initialSearchCriteria;
    updateSearchCriteria.mutate(initial);
    // reset filtered countries
    updateCountries.mutate({
      regionName: "",
      regions,
      countries,
    });
  };

  const handleDocumentClick = (e: any) => {
    // Check if we are clicking on the document matches button
    const slug = e.target.dataset.slug;
    if (!slug) return;

    // keep panel open if clicking a different document
    if (document?.document_slug != slug) {
      resetSlideOut(true);
    } else {
      resetSlideOut();
    }
    updateDocument.mutate(slug);
  };

  const getCurrentSortChoice = () => {
    const field = router.query["sort_field"];
    const order = router.query["sort_order"];
    if (field === null && order === "desc") {
      if (isBrowsing) return "date:desc";
      return "relevance";
    }
    return `${field}:${order}`;
  };

  const getCategoryIndex = () => {
    const categories = router.query["category"]?.toString();
    // const categories = searchCriteria?.keyword_filters?.categories;
    if (!categories) {
      return 0;
    }
    let index = DOCUMENT_CATEGORIES.indexOf(categories);
    return index === -1 ? 0 : index;
  };

  const getCurrentPage = () => {
    const offSet = isNaN(parseInt(router.query?.offset?.toString())) ? 0 : parseInt(router.query?.offset?.toString());
    return offSet / PER_PAGE + 1;
    // return searchCriteria?.offset / PER_PAGE + 1;
  };

  useEffect(() => {
    if (offset === null) return;
    router.query["offset"] = offset;
    router.push({ query: router.query });
    // handleSearchChange("offset", offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    if (hits !== undefined) {
      setPageCount(calculatePageCount(hits));
    }
  }, [hits]);

  // FIXME: replace resultsQuery.refetch() on router.change
  // useDidUpdateEffect(() => {
  //   window.scrollTo(0, 0);
  //   resultsQuery.refetch();
  // }, [searchCriteria]);

  useEffect(() => {
    // console.log("on search page :: ROUTER QUERY changed: ", router.query);
    // console.log("resultsQuery.refetch()");
    resultsQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const renderNoOfResults = () => {
    let resultsMsg = `Showing`;
    if (hits < 100) {
      resultsMsg += ` ${hits} results`;
    } else {
      resultsMsg += ` the top 100 results`;
    }
    return (
      <>
        {resultsMsg}{" "}
        {router.query?.query_string && (
          <>
            <>
              for "<i className="text-blue-600">{router.query?.query_string}</i>"
            </>
            {hits > 100 && (
              <div className="ml-2 inline-block">
                <Tooltip
                  id="search-results-number"
                  tooltip={
                    <>
                      We limit the number of search results to 100 so that you get the best performance from our tool. We’re working on a way to
                      remove this limit.
                    </>
                  }
                  icon="i"
                  place="bottom"
                />
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      {isFetchingSearchCriteria || !ready ? (
        <LoaderOverlay />
      ) : (
        <Layout title={t("Law and Policy Search")} heading={t("Law and Policy Search")}>
          <div onClick={handleDocumentClick}>
            <Slideout ref={slideoutRef} show={showSlideout} setShowSlideout={resetSlideOut}>
              <div className="flex flex-col h-full relative">
                <DocumentSlideout document={document} searchTerm={router.query?.query_string?.toString()} showPDF={showPDF} setShowPDF={setShowPDF} />
                <div className="flex flex-col md:flex-row flex-1 h-0">
                  <div className={`${showPDF ? "hidden" : "block"} md:block md:w-1/3 overflow-y-scroll pl-3`}>
                    <PassageMatches document={document} setPassageIndex={setPassageIndex} activeIndex={passageIndex} />
                  </div>
                  <div className={`${showPDF ? "block" : "hidden"} md:block md:w-2/3 mt-4 px-6 flex-1`}>
                    <EmbeddedPDF document={document} passageIndex={passageIndex} />
                  </div>
                </div>
              </div>
            </Slideout>
            {showSlideout && <div className="w-full h-full bg-overlayWhite fixed top-0 z-30" />}
            <section>
              <div className="px-4 container">
                <div className="md:py-8 md:w-3/4 md:mx-auto">
                  <p className="md:hidden mt-4 mb-2">{placeholder}</p>
                  <SearchForm
                    placeholder={placeholder}
                    handleSearchInput={handleSearchInput}
                    input={router.query.query_string?.toString()}
                    handleSuggestion={handleSuggestion}
                  />
                </div>
              </div>
              <div className="px-4 md:flex container border-b border-lineBorder">
                <div className="md:w-1/4 lg:w-[30%] xl:w-1/4 md:border-r border-lineBorder md:pr-8 flex-shrink-0">
                  <div className="flex md:hidden items-center justify-center w-full mt-4">
                    <FilterToggle toggle={toggleFilters} isOpen={showFilters} />
                  </div>

                  <div className={`${showFilters ? "" : "hidden"} relative md:block mb-12 md:mb-0`}>
                    <div className="md:hidden absolute right-0 top-0">
                      <Close onClick={() => setShowFilters(false)} size="16" />
                    </div>
                    {configQuery.isFetching ? (
                      <p>Loading filters...</p>
                    ) : (
                      <SearchFilters
                        handleFilterChange={handleFilterChange}
                        searchCriteria={searchCriteria}
                        handleYearChange={handleYearChange}
                        handleRegionChange={handleRegionChange}
                        handleClearSearch={handleClearSearch}
                        handleSearchChange={handleSearchChange}
                        regions={regions}
                        filteredCountries={filteredCountries}
                        sectors={sectors}
                        documentTypes={document_types}
                      />
                    )}
                  </div>
                </div>
                <div className="md:w-3/4">
                  <div className="md:pl-8">
                    <div className="lg:flex justify-between">
                      <div className="text-sm my-4 md:my-0 md:flex">{!resultsQuery.isFetching && renderNoOfResults()}</div>
                      <ExternalLink
                        url="https://docs.google.com/forms/d/e/1FAIpQLSdFkgTNfzms7PCpfIY3d2xGDP5bYXx8T2-2rAk_BOmHMXvCoA/viewform"
                        className="text-sm text-blue-600 mt-4 md:mt-0 hover:underline"
                      >
                        Request to download all data (.csv)
                      </ExternalLink>
                    </div>
                  </div>
                  <div className="mt-4 md:flex">
                    <div className="flex-grow">
                      <TabbedNav activeIndex={getCategoryIndex()} items={DOCUMENT_CATEGORIES} handleTabClick={handleDocumentCategoryClick} />
                    </div>
                    <div className="mt-4 md:-mt-2 md:ml-2 lg:ml-8 md:mb-2 flex items-center">
                      <Sort defaultValue={getCurrentSortChoice()} updateSort={handleSortClick} isBrowsing={isBrowsing} />
                    </div>
                  </div>

                  <div className="search-results md:pl-8 md:mt-12 relative">
                    {resultsQuery.isFetching ? (
                      <div className="w-full flex justify-center h-96">
                        <Loader />
                      </div>
                    ) : (
                      <SearchResultList category={router.query?.category?.toString()} documents={documents} />
                    )}
                  </div>
                </div>
              </div>
            </section>
            {pageCount > 1 && (
              <section>
                <div className="mb-12">
                  <Pagination pageNumber={getCurrentPage()} pageCount={pageCount} onChange={handlePageChange} />
                </div>
              </section>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};
export default Search;
