import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSearch from "@hooks/useSearch";
import { useDownloadCsv } from "@hooks/useDownloadCsv";
import useUpdateCountries from "@hooks/useUpdateCountries";
import useConfig from "@hooks/useConfig";
import useFilteredCountries from "@hooks/useFilteredCountries";
import Layout from "@components/layouts/Main";
import SearchForm from "@components/forms/SearchForm";
import SearchFilters from "@components/blocks/SearchFilters";
import TabbedNav from "@components/nav/TabbedNav";
import Loader from "@components/Loader";
import Sort from "@components/filters/Sort";
import Close from "@components/buttons/Close";
import FilterToggle from "@components/buttons/FilterToggle";
import Pagination from "@components/pagination";
import SearchResultList from "@components/blocks/SearchResultList";
import Tooltip from "@components/tooltip";
import { calculatePageCount } from "@utils/paging";
import { PER_PAGE } from "@constants/paging";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import { QUERY_PARAMS } from "@constants/queryParams";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { Loading } from "@components/svg/Icons";
import { ExternalLink } from "@components/ExternalLink";

const Search = () => {
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string];
  const isBrowsing = !qQueryString || qQueryString?.toString().trim() === "";
  const { t } = useTranslation(["searchStart", "searchResults"]);
  const [showFilters, setShowFilters] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const updateCountries = useUpdateCountries();

  const { status, families, hits, searchQuery } = useSearch(router.query);

  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const { data: filteredCountries } = useFilteredCountries(countries);

  const { status: downloadCSVStatus, download: downloadCSV } = useDownloadCsv();

  const placeholder = t("Search for something, e.g. 'carbon taxes'");

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePageChange = (page: number) => {
    const offSet = (page - 1) * PER_PAGE;
    router.query[QUERY_PARAMS.offset] = offSet.toString();
    router.push({ query: router.query });
  };

  const handleRegionChange = (type: string, regionName: string) => {
    delete router.query[QUERY_PARAMS.offset];

    updateCountries.mutate({
      regionName,
      regions,
      countries,
    });

    router.query[type] = regionName;
    router.push({ query: router.query });
  };

  const handleFilterChange = (type: string, value: string) => {
    // reset to page 1 when changing filters
    delete router.query[QUERY_PARAMS.offset];

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
    } else {
      queryCollection.push(value);
    }
    router.query[type] = queryCollection;
    router.push({ query: router.query });
  };

  const handleSuggestion = (term: string, filter?: string, filterValue?: string) => {
    router.query[QUERY_PARAMS.query_string] = term;
    if (filter && filterValue && filter.length && filterValue.length) {
      router.query[filter] = [filterValue.toLowerCase()];
    }

    router.push({ query: router.query });
  };

  const handleSearchChange = (type: string, value: any) => {
    if (type !== QUERY_PARAMS.offset) delete router.query[QUERY_PARAMS.offset];
    // Clear ordering on new query search
    if (type === QUERY_PARAMS.query_string) {
      delete router.query[QUERY_PARAMS.sort_field];
      delete router.query[QUERY_PARAMS.sort_order];
    }
    router.query[type] = value;
    if (!value) {
      delete router.query[type];
    }
    router.push({ query: router.query });
  };

  const handleSearchInput = (term: string) => {
    handleSearchChange(QUERY_PARAMS.query_string, term);
  };

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    delete router.query[QUERY_PARAMS.offset];
    const val = e.currentTarget.textContent;
    let category = val;
    router.query[QUERY_PARAMS.category] = category;
    // Default search is all categories
    if (val === "All") {
      delete router.query[QUERY_PARAMS.category];
    }
    router.push({ query: router.query });
  };

  const handleSortClick = (e: ChangeEvent<HTMLSelectElement>) => {
    delete router.query[QUERY_PARAMS.offset];
    const val = e.currentTarget.value;
    let field = null;
    let order = null;
    if (val !== "relevance") {
      const valArray = val.split(":");
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
    router.push({ query: router.query });
  };

  const handleYearChange = (values: number[]) => {
    const newVals = values.map((value: number) => Number(value).toFixed(0));
    handleSearchChange(QUERY_PARAMS.year_range, newVals);
  };

  const handleClearSearch = () => {
    const previousSearchQuery = router.query[QUERY_PARAMS.query_string] as string;
    if (previousSearchQuery && previousSearchQuery.length > 0) {
      return router.push({ query: { [QUERY_PARAMS.query_string]: previousSearchQuery } });
    }
    return router.push({ query: {} });
  };

  const getCurrentSortChoice = () => {
    const field = router.query[QUERY_PARAMS.sort_field];
    const order = router.query[QUERY_PARAMS.sort_order];
    if (field === undefined && order === undefined) {
      if (isBrowsing) return "date:desc";
      return "relevance";
    }
    return `${field}:${order}`;
  };

  const getCategoryIndex = () => {
    const categories = router.query[QUERY_PARAMS.category]?.toString();
    if (!categories) {
      return 0;
    }
    let index = DOCUMENT_CATEGORIES.indexOf(categories);
    return index === -1 ? 0 : index;
  };

  const getCurrentPage = () => {
    const offSet = isNaN(parseInt(router.query[QUERY_PARAMS.offset]?.toString())) ? 0 : parseInt(router.query[QUERY_PARAMS.offset]?.toString());
    return offSet / PER_PAGE + 1;
  };

  const handleDownloadCsvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (downloadCSVStatus === "loading") return;
    downloadCSV(router.query);
  };

  useEffect(() => {
    if (hits !== undefined) {
      setPageCount(calculatePageCount(hits));
    }
  }, [hits]);

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
        {qQueryString && (
          <>
            for "<i className="text-blue-600">{qQueryString}</i>"
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
    <Layout
      title={t("Law and Policy Search")}
      description="Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country."
    >
      <div>
        <section>
          <div className="px-4 container">
            <BreadCrumbs label={"Search results"} />
            <div className="md:pb-8 md:pt-4 md:w-3/4 md:mx-auto">
              <p className="md:hidden mt-4 mb-2">{placeholder}</p>
              <SearchForm
                placeholder={placeholder}
                handleSearchInput={handleSearchInput}
                input={qQueryString ? qQueryString.toString() : ""}
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
                    searchCriteria={searchQuery}
                    handleYearChange={handleYearChange}
                    handleRegionChange={handleRegionChange}
                    handleClearSearch={handleClearSearch}
                    handleSearchChange={handleSearchChange}
                    regions={regions}
                    filteredCountries={filteredCountries}
                  />
                )}
              </div>
            </div>
            <div className="md:w-3/4">
              <div className="md:pl-8">
                <div className="lg:flex justify-between">
                  <div className="text-sm my-4 md:mb-4 md:mt-0 lg:my-0" data-cy="number-of-results">
                    {status === "success" && renderNoOfResults()}
                  </div>
                  <span className="text-sm mt-4 md:mt-0 text-right flex flex-wrap gap-x-2 md:justify-end">
                    <span>Download data (.csv): </span>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline lg:flex gap-2 items-center justify-end"
                      data-cy="download-search-csv"
                      onClick={handleDownloadCsvClick}
                    >
                      {downloadCSVStatus === "loading" && <Loading />} this search
                    </a>
                    <span>|</span>
                    <ExternalLink
                      url="https://docs.google.com/forms/d/e/1FAIpQLSdFkgTNfzms7PCpfIY3d2xGDP5bYXx8T2-2rAk_BOmHMXvCoA/viewform"
                      className="text-blue-600 hover:underline"
                      cy="download-entire-search-csv"
                    >
                      whole database
                    </ExternalLink>
                  </span>
                </div>
                <div className="text-sm md:text-right">
                  {downloadCSVStatus === "error" && <span className="text-red-600">There was an error downloading the CSV. Please try again</span>}
                  {downloadCSVStatus === "success" && (
                    <span className="text-green-600">CSV downloaded successfully, please check your downloads folder</span>
                  )}
                </div>
              </div>
              <div className="mt-4 md:flex">
                <div className="flex-grow">
                  <TabbedNav activeIndex={getCategoryIndex()} items={DOCUMENT_CATEGORIES} handleTabClick={handleDocumentCategoryClick} />
                </div>
                <div className="mt-4 md:-mt-2 md:ml-2 lg:ml-8 md:mb-2 flex items-center" data-cy="sort">
                  <Sort defaultValue={getCurrentSortChoice()} updateSort={handleSortClick} isBrowsing={isBrowsing} />
                </div>
              </div>

              <div data-cy="search-results" className="md:pl-8 md:mt-12 relative">
                {status === "loading" ? (
                  <div className="w-full flex justify-center h-96">
                    <Loader />
                  </div>
                ) : (
                  <SearchResultList category={router.query[QUERY_PARAMS.category]?.toString()} families={families} />
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
  );
};

export default Search;
