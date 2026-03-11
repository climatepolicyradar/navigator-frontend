import { useRouter } from "next/router";
import { useState, useEffect, useRef, ChangeEvent } from "react";

import { SUGGESTED_SEARCHES } from "@/cclw/constants/suggestedSearches";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { SearchDropdown } from "@/components/forms/SearchDropdown";

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.currentTarget.value);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleSuggestedSearch = (params: Record<string, string>) => {
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
        {SUGGESTED_SEARCHES.map((suggestedSearch, searchIndex) => (
          <Button
            key={searchIndex}
            rounded
            className="!bg-cclw-light hover:!bg-gray-700 border !border-gray-500"
            onClick={() => handleSuggestedSearch(suggestedSearch.params)}
            data-cy={`quick-search-${searchIndex}`}
          >
            {suggestedSearch.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default LandingSearchForm;
