import { useEffect, useState, ChangeEvent } from "react";
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
import Drawer from "@components/drawer/Drawer";
import SearchResultList from "@components/blocks/SearchResultList";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { Loading } from "@components/svg/Icons";
import { ExternalLink } from "@components/ExternalLink";
import { NoOfResults } from "@components/NoOfResults";
import { FamilyMatchesDrawer } from "@components/drawer/FamilyMatchesDrawer";
import { DownloadCsvPopup } from "@components/modals/DownloadCsv";
import { calculatePageCount } from "@utils/paging";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import { QUERY_PARAMS } from "@constants/queryParams";
import { PER_PAGE } from "@constants/paging";

const Search = () => {
  const router = useRouter();
  const qQueryString = router.query[QUERY_PARAMS.query_string];
  const isBrowsing = !qQueryString || qQueryString?.toString().trim() === "";
  const { t } = useTranslation(["searchStart", "searchResults"]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCSVDownloadPopup, setShowCSVDownloadPopup] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [drawerFamily, setDrawerFamily] = useState<boolean | number>(false);

  const updateCountries = useUpdateCountries();

  const { status, families, hits, searchQuery } = useSearch(router.query);

  const configQuery = useConfig();
  const { data: { regions = [], countries = [] } = {} } = configQuery;

  const { data: filteredCountries } = useFilteredCountries(countries);

  const { status: downloadCSVStatus, download: downloadCSV, resetStatus: resetCSVStatus } = useDownloadCsv();

  const placeholder = t("Search for something, e.g. 'carbon taxes'");

  const documentCategories = DOCUMENT_CATEGORIES.map((category) => {
    return {
      title: category,
    };
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePageChange = (page: number) => {
    const offSet = (page - 1) * PER_PAGE;
    router.query[QUERY_PARAMS.offset] = offSet.toString();
    router.push({ query: router.query });
    resetCSVStatus();
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
    resetCSVStatus();
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
    resetCSVStatus();
  };

  const handleSuggestion = (term: string, filter?: string, filterValue?: string) => {
    router.query[QUERY_PARAMS.query_string] = term;
    if (filter && filterValue && filter.length && filterValue.length) {
      router.query[filter] = [filterValue.toLowerCase()];
    }
    router.push({ query: router.query });
    resetCSVStatus();
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
    resetCSVStatus();
  };

  const handleSearchInput = (term: string) => {
    handleSearchChange(QUERY_PARAMS.query_string, term);
  };

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement>, _?: number, value?: string) => {
    delete router.query[QUERY_PARAMS.offset];
    const val = value ?? e.currentTarget.textContent;
    let category = val;
    router.query[QUERY_PARAMS.category] = category;
    // Default search is all categories
    if (val === "All") {
      delete router.query[QUERY_PARAMS.category];
    }
    router.push({ query: router.query });
    resetCSVStatus();
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
    resetCSVStatus();
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

  useEffect(() => {
    if (hits !== undefined) {
      setPageCount(calculatePageCount(hits));
    }
  }, [hits]);

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

  return (
    <Layout
      title={t("Law and Policy Search")}
      description="Quickly and easily search through the complete text of thousands of climate change law and policy documents from every country."
    >
      <div>
        <section>
          <div className="px-4 mb-4 container">
            <BreadCrumbs label={"Search results"} />
            <div className="pt-4 md:hidden">
              <SearchForm
                placeholder={placeholder}
                handleSearchInput={handleSearchInput}
                input={qQueryString ? qQueryString.toString() : ""}
                handleSuggestion={handleSuggestion}
              />
            </div>
          </div>
          <div className="px-4 md:flex container border-b">
            <div className="md:w-1/4 lg:w-[30%] xl:w-1/4 md:border-r md:pr-8 flex-shrink-0">
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
              <div className="md:pl-3">
                <div className="hidden md:block mb-4 xl:w-3/4">
                  <SearchForm
                    placeholder={placeholder}
                    handleSearchInput={handleSearchInput}
                    input={qQueryString ? qQueryString.toString() : ""}
                    handleSuggestion={handleSuggestion}
                  />
                </div>
                <div className="lg:flex justify-between">
                  <div className="text-xs my-4 md:mb-4 md:mt-0 lg:my-0" data-cy="number-of-results">
                    {status === "success" && <NoOfResults hits={hits} queryString={qQueryString} />}
                  </div>
                  <span className="text-sm mt-4 md:mt-0 text-right flex flex-wrap gap-x-2 md:justify-end">
                    <span>Download data (.csv): </span>
                    <a
                      href="#"
                      className="flex gap-2 items-center justify-end"
                      data-cy="download-search-csv"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCSVDownloadPopup(true);
                      }}
                    >
                      {downloadCSVStatus === "loading" ? <Loading /> : "this search"}
                    </a>
                    <span>|</span>
                    <ExternalLink url="https://form.jotform.com/233131638610347" cy="download-entire-search-csv">
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
              <div className="mt-4">
                <TabbedNav activeIndex={getCategoryIndex()} items={documentCategories} handleTabClick={handleDocumentCategoryClick} />
              </div>

              <div className="mt-4 md:pl-8 relative">
                {status === "loading" ? (
                  <div className="w-full flex justify-center h-96">
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end">
                      {router.query[QUERY_PARAMS.category]?.toString() !== "Litigation" && (
                        <div>
                          <Sort defaultValue={getCurrentSortChoice()} updateSort={handleSortClick} isBrowsing={isBrowsing} />
                        </div>
                      )}
                    </div>
                    <div data-cy="search-results">
                      <SearchResultList
                        category={router.query[QUERY_PARAMS.category]?.toString()}
                        families={families}
                        onClick={handleMatchesButtonClick}
                        activeFamilyIndex={drawerFamily}
                      />
                    </div>
                  </>
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
      <Drawer show={drawerFamily !== false} setShow={setDrawerFamily}>
        <FamilyMatchesDrawer family={drawerFamily !== false && families[drawerFamily as number]} />
      </Drawer>
      <DownloadCsvPopup
        active={showCSVDownloadPopup}
        onCancelClick={() => setShowCSVDownloadPopup(false)}
        onConfirmClick={() => handleDownloadCsvClick()}
      />
    </Layout>
  );
};

export default Search;
