import { Search } from "lucide-react";
import router from "next/router";
import { useState, useEffect, useRef, ChangeEvent } from "react";

import { SearchDropdown } from "@/components/forms/SearchDropdown";
import { QUERY_PARAMS } from "@/constants/queryParams";

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

  const displayPlaceholder = placeholder ?? "Search the full text of cases";

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
        <div className="max-w-screen-md flex items-stretch relative">
          <button className="absolute left-0 h-full px-4 text-text-primary" onClick={() => handleSearchInput(term)} aria-label="Search">
            <span className="block">
              <Search height="16" width="16" />
            </span>
          </button>
          <input
            id="landingPage-searchInput-ccc"
            data-analytics="landingPage-searchInput"
            data-cy="search-input"
            type="search"
            className="text-base py-3 h-[48px] pl-12 pr-3 w-full rounded-lg border-0 placeholder:text-text-tertiary bg-surface-heavy text-text-primary"
            value={term}
            onChange={onChange}
            placeholder={displayPlaceholder}
            aria-label="Search the full text of cases"
          />
          <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
        </div>
      </form>
    </>
  );
};
export default LandingSearchForm;
