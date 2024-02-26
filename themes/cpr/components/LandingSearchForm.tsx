import { useState, useEffect, useRef, ChangeEvent } from "react";
import Close from "@components/buttons/Close";
import { SearchIcon } from "@components/svg/Icons";
import { SearchDropdown } from "@components/forms/SearchDropdown";

interface SearchFormProps {
  placeholder?: string;
  handleSearchInput(term: string, filter?: string, filterValue?: string): void;
  input?: string;
}

const LandingSearchForm = ({ placeholder, input, handleSearchInput }: SearchFormProps) => {
  const [term, setTerm] = useState("");
  const [formFocus, setFormFocus] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const formRef = useRef(null);

  const clearSearch = () => {
    setTerm("");
  };

  const clearPlaceholderAnimation = () => {
    setShowAnimation(false);
  };

  const showPlaceholderAnimation = () => {
    if (term.length === 0) setShowAnimation(true);
  };

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

  const displayPlaceholder = placeholder ?? "Search full text of 5000+ laws and policies";

  return (
    <form data-cy="search-form" ref={formRef} onSubmit={(e) => e.preventDefault()}>
      <div className="max-w-screen-lg mx-auto flex items-stretch relative text-white">
        <input
          id="landingPage-searchInput"
          data-analytics="landingPage-searchInput"
          data-cy="search-input"
          type="search"
          className="placeholder:text-white py-4 pr-16 text-2xl bg-transparent border-t-0 border-l-0 border-r-0 border-white border-b-2 focus:border-white focus:ring-0 w-full"
          value={term}
          onChange={onChange}
          onFocus={clearPlaceholderAnimation}
          onBlur={showPlaceholderAnimation}
          placeholder={displayPlaceholder}
          aria-label="Search term"
        />
        {showAnimation && term.length === 0 && <div className="search-animated-placeholder">{displayPlaceholder}</div>}
        {term.length > 0 && (
          <div data-cy="search-clear-button" className="flex mx-2 shrink-0 absolute top-0 right-0 mr-14 z-20 h-full items-center">
            <Close onClick={clearSearch} size="16" />
          </div>
        )}
        <button className="absolute top-0 right-0 h-full" onClick={() => handleSearchInput(term)} aria-label="Search">
          <span className="block">
            <SearchIcon height="30" width="40" />
          </span>
        </button>
        <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
      </div>
    </form>
  );
};
export default LandingSearchForm;
