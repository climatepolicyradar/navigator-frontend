import { useState, useEffect, useRef, ChangeEvent } from "react";

import { Search2Icon } from "@components/svg/Icons";
import { SearchDropdown } from "@components/forms/SearchDropdown";
import Button from "@components/buttons/Button";

import { QUERY_PARAMS } from "@constants/queryParams";

// See the method handleSearchInput in the index.tsx file for the processing of the example searches
const EXAMPLE_SEARCHES = [
  { id: 1, term: "Adaptation" },
  { id: 2, term: "Extreme Weather" },
  { id: 3, filterValue: "Philippines", filterType: QUERY_PARAMS.country },
];

interface SearchFormProps {
  placeholder?: string;
  handleSearchInput(term: string, filter?: string, filterValue?: string): void;
  input?: string;
}

const LandingSearchForm = ({ placeholder, input, handleSearchInput }: SearchFormProps) => {
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
        <div className="max-w-screen-lg mx-auto flex items-stretch relative text-indigo-400 custom-gradient-background">
          <input
            id="landingPage-searchInput-mcf"
            data-analytics="landingPage-searchInput"
            data-cy="search-input"
            type="search"
            className="text-base leading-5 py-3 h-[50px] px-6 w-full text-gray-800 focus:ring-0 rounded-full border-white border-2"
            value={term}
            onChange={onChange}
            placeholder={displayPlaceholder}
            aria-label="Search term"
          />
          <button className="custom-search-button" onClick={() => handleSearchInput(term)} aria-label="Search">
            <span className="block">
              <Search2Icon height="24" width="24" />
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
            thin
            color="clear-underline"
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
