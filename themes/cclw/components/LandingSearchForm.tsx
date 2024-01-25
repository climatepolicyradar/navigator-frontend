import { useState, useEffect, useRef } from "react";
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
  const formRef = useRef(null);

  const onChange = (e) => {
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
      <div className="max-w-screen-lg mx-auto flex items-stretch relative text-indigo-400">
        <input
          id="landingPage-searchInput-cclw"
          data-analytics="landingPage-searchInput"
          data-cy="search-input"
          type="search"
          className="text-xl py-4 pl-6 pr-16 w-full text-cpr-dark focus:ring-0"
          value={term}
          onChange={onChange}
          placeholder={displayPlaceholder}
          aria-label="Search term"
        />
        <button className="absolute right-0 h-full pr-2 text-blue-400" onClick={() => handleSearchInput(term)} aria-label="Search">
          <span className="border-l py-1 pl-1 block">
            <SearchIcon height="30" width="40" />
          </span>
        </button>
        <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSearchInput} largeSpacing />
      </div>
    </form>
  );
};
export default LandingSearchForm;
