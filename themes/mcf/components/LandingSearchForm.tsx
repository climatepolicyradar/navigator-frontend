import router from "next/router";
import { useState, useEffect, useRef, ChangeEvent } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { SearchDropdown } from "@/components/forms/SearchDropdown";
import { QUERY_PARAMS } from "@/constants/queryParams";

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
    label: "Extreme Weather",
    params: {
      [QUERY_PARAMS.query_string]: "Extreme Weather",
    },
  },
  {
    id: 3,
    label: "Philippines",
    params: {
      [QUERY_PARAMS.country]: "philippines",
    },
  },
];

interface IProps {
  placeholder?: string;
  handleSearchInput: (term: string) => void;
  input?: string;
}

const LandingSearchForm = ({ placeholder, input, handleSearchInput }: IProps) => {
  const [term, setTerm] = useState("");
  const [formFocus, setFormFocus] = useState(false);
  const formRef = useRef(null);

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
      query: {
        ...params,
      },
    });
  };

  return (
    <>
      <form data-cy="search-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className="max-w-screen-lg mx-auto flex items-stretch relative text-indigo-400 custom-gradient-background">
          <input
            id="landingPage-searchInput-mcf"
            data-analytics="landingPage-searchInput"
            data-cy="search-input"
            type="search"
            className="text-lg leading-5 py-3 h-[50px] px-6 w-full text-gray-700 focus:ring-0 rounded-full border-white border-2"
            value={term}
            onChange={onChange}
            placeholder={displayPlaceholder}
            aria-label="Search term"
          />
          <button className="custom-search-button" onClick={() => handleSearchInput(term)} aria-label="Search">
            <span className="block">
              <Icon name="search2" height="24" width="24" />
            </span>
          </button>
          <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
        </div>
      </form>
      <div className="hidden mt-4 md:flex flex-wrap items-center gap-2 justify-center">
        <span className="text-mcf-blue">Suggestions:</span>
        {EXAMPLE_SEARCHES.map((example) => (
          <Button
            key={example.id}
            rounded
            size="small"
            variant="ghost"
            className="hover:!bg-gray-100 !text-gray-500 underline"
            onClick={() => handleQuickSearch(example.params)}
            data-cy={`example-search-${example.id}`}
          >
            {example.label}
          </Button>
        ))}
      </div>
    </>
  );
};
export default LandingSearchForm;
