import { useState, useEffect, useRef, ChangeEvent } from "react";

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

  const displayPlaceholder = placeholder ?? "Search the full text of over 12,000 climate documents";

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchInput(term);
      }}
    >
      <div className="max-w-screen-lg mx-auto flex items-stretch relative text-white">
        <input
          id="landingPage-searchInput"
          data-analytics="landingPage-searchInput"
          type="search"
          className={`text-white placeholder:text-transparent py-4 pr-16 text-2xl bg-transparent border-t-0 border-l-0 border-r-0 border-white border-b-2 rounded-none focus:border-white focus:ring-0 w-full ${
            !showAnimation ? "placeholder:text-white" : ""
          }`}
          value={term}
          onChange={onChange}
          onFocus={clearPlaceholderAnimation}
          onBlur={showPlaceholderAnimation}
          placeholder={displayPlaceholder}
          aria-label="Search term"
        />
        {showAnimation && term.length === 0 && <div className="search-animated-placeholder">{displayPlaceholder}</div>}
        {term.length > 0 && (
          <div data-cy="search-clear-button" className="flex mx-2 shrink-0 absolute top-0 right-0 mr-11.5 z-20 h-full items-center">
            <Button
              content="icon"
              color="mono"
              variant="ghost"
              className="!text-text-light !outline-surface-light hover:!bg-transparent"
              onClick={clearSearch}
              type="button"
            >
              <Icon name="close" />
            </Button>
          </div>
        )}
        <button type="submit" className="absolute top-0 right-0 h-full" onClick={() => handleSearchInput(term)} aria-label="Search">
          <span className="block">
            <Icon name="search" height="30" width="40" />
          </span>
        </button>
        <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
      </div>
    </form>
  );
};

export default LandingSearchForm;
