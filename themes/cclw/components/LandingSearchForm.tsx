import { useState, useEffect, useRef, ChangeEvent } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import { SearchDropdown } from "@/components/forms/SearchDropdown";
import { Button } from "@/components/atoms/button/Button";

import { QUERY_PARAMS } from "@/constants/queryParams";

// See the method handleSearchInput in the index.tsx file for the processing of the example searches
const EXAMPLE_SEARCHES = [
  { id: 1, term: "Adaptation" },
  { id: 2, filterValue: "Brazil", filterType: QUERY_PARAMS.country },
  { id: 3, term: "Climate framework laws" },
  { id: 4, term: "Coastal zones" },
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
        {EXAMPLE_SEARCHES.map((example) => (
          <Button
            key={example.id}
            rounded
            className="!bg-cclw-light hover:!bg-gray-700 border !border-gray-500"
            onClick={() => handleSearchInput(example.term, example.filterType, example.filterValue)}
            data-cy={`example-search-${example.id}`}
          >
            {example.term ?? example.filterValue}
          </Button>
        ))}
      </div>
    </>
  );
};
export default LandingSearchForm;
