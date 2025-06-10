import { useRouter } from "next/router";
import { useState, useEffect, useRef, ChangeEvent, useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { SearchDropdown } from "@/components/forms/SearchDropdown";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { isKnowledgeGraphEnabled } from "@/utils/features";

// See the method handleSearchInput in the index.tsx file for the processing of the example searches
const EXAMPLE_SEARCHES = [
  {
    id: 1,
    label: "Adaptation",
    params: {
      [QUERY_PARAMS.query_string]: "Adaptation",
    },
  },
  {
    id: 2,
    label: "Brazil",
    params: {
      [QUERY_PARAMS.country]: "brazil",
    },
  },
  {
    id: 3,
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.query_string]: "Climate framework laws",
    },
  },
  {
    id: 4,
    label: "Coastal zones",
    params: {
      [QUERY_PARAMS.query_string]: "Coastal zones",
    },
  },
];

const KNOWLEDGE_GRAPH_QUICK_SEARCHES = [
  {
    id: 1,
    label: "Latest NDCs",
    params: {
      [QUERY_PARAMS.category]: "UNFCCC",
      [QUERY_PARAMS["_document.type"]]: "Nationally Determined Contribution",
      [QUERY_PARAMS.author_type]: "Party",
    },
  },
  {
    id: 2,
    label: "Indigenous people + Brazil + Laws",
    params: {
      [QUERY_PARAMS.country]: "brazil",
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.concept_name]: "indigenous people",
    },
  },
  {
    id: 3,
    label: "Zoning and spatial planning + marine",
    params: {
      [QUERY_PARAMS.concept_name]: "Zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
  },
  {
    id: 4,
    label: "Emissions reductions targets + Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
      [QUERY_PARAMS.concept_name]: "Emissions reduction target",
    },
  },
];

interface IProps {
  placeholder?: string;
  handleSearchInput(term: string, filter?: string, filterValue?: string): void;
  input?: string;
}

const LandingSearchForm = ({ placeholder, input, handleSearchInput }: IProps) => {
  const [term, setTerm] = useState("");
  const [formFocus, setFormFocus] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);
  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.currentTarget.value);
  };

  useEffect(() => {
    if (input) setTerm(input);
  }, [input]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        return setFormFocus(false);
      }
      setFormFocus(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  const displayPlaceholder = placeholder ?? "Search the full text of any document";

  const handleQuickSearch = (params: Record<string, string>) => {
    // Push directly to search page with all parameters
    router.push({
      pathname: "/search",
      query: params,
    });
  };

  return (
    <>
      <form data-cy="search-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-screen-lg mx-auto flex items-stretch relative text-indigo-400">
          <input
            id="landingPage-searchInput-cclw"
            data-analytics="landingPage-searchInput"
            data-cy="search-input"
            type="search"
            className="text-xl py-3 h-[48px] pl-6 pr-3 mr-[72px] w-full text-cpr-dark rounded-l-4xl border-0 rounded-r-none"
            value={term}
            onChange={onChange}
            placeholder={displayPlaceholder}
            aria-label="Search term"
          />
          <button
            className="absolute right-0 h-full px-6 text-white bg-blue-400 rounded-r-4xl hover:bg-blue-300 active:bg-blue-700"
            onClick={() => handleSearchInput(term)}
            aria-label="Search"
          >
            <span className="block">
              <Icon name="search2" height="24" width="24" />
            </span>
          </button>
          <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
        </div>
      </form>
      <div className="hidden mt-4 md:flex flex-wrap items-center gap-2">
        <span className="text-gray-200">Search by:</span>
        {knowledgeGraphEnabled
          ? KNOWLEDGE_GRAPH_QUICK_SEARCHES.map((quickSearch) => (
              <Button
                key={quickSearch.id}
                rounded
                className="!bg-cclw-light hover:!bg-gray-700 border !border-gray-500"
                onClick={() => handleQuickSearch(quickSearch.params)}
                data-cy={`quick-search-${quickSearch.id}`}
              >
                {quickSearch.label}
              </Button>
            ))
          : EXAMPLE_SEARCHES.map((quickSearch) => (
              <Button
                key={quickSearch.id}
                rounded
                className="!bg-cclw-light hover:!bg-gray-700 border !border-gray-500"
                onClick={() => handleQuickSearch(quickSearch.params)}
                data-cy={`quick-search-${quickSearch.id}`}
              >
                {quickSearch.label}
              </Button>
            ))}
      </div>
    </>
  );
};

export default LandingSearchForm;
