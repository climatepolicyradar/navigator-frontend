import React, { useState, useEffect, useRef } from "react";
import Close from "../buttons/Close";
import SearchButton from "../buttons/SearchButton";
import useWindowResize from "@hooks/useWindowResize";
import { SearchDropdown } from "./SearchDropdown";

interface SearchFormProps {
  input?: string;
  placeholder: string;
  handleSearchInput(term: string): void;
  handleSuggestion?(term: string, filter?: string, filterValue?: string): void;
}

const SearchForm = ({ input, placeholder, handleSearchInput, handleSuggestion }: SearchFormProps) => {
  const [term, setTerm] = useState("");
  const [formFocus, setFormFocus] = useState(false);
  const formRef = useRef(null);
  const windowSize = useWindowResize();

  const clearSearch = () => {
    setTerm("");
    handleSearchInput("");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.currentTarget.value);
  };

  const handleSuggestionClick = (term: string, filter?: string, filterValue?: string) => {
    setTerm(term);
    if (handleSuggestion) {
      handleSuggestion(term, filter, filterValue);
    }
    return setFormFocus(false);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return setFormFocus(false);
  };

  const handleSearchButtonClick = () => {
    handleSearchInput(term);
    return setFormFocus(false);
  };

  useEffect(() => {
    if (input || input === "") setTerm(input);
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

  return (
    <form data-cy="search-form" ref={formRef} onSubmit={onFormSubmit}>
      <div className="relative z-40">
        <div className="shadow-md rounded-full bg-white relative z-20">
          <div className="absolute p-[1px] pr-0 top-0 left-0 h-full flex items-center justify-start z-20">
            <SearchButton onClick={handleSearchButtonClick} />
          </div>
          <input
            data-analytics="seachPage-searchInput"
            data-cy="search-input"
            className="w-full bg-white appearance-none py-2 px-10 z-10 leading-snug rounded-full relative flex-grow border-gray-300 placeholder:text-grey-300 md:pl-12"
            type="search"
            placeholder={`${windowSize.width > 767 ? placeholder : ""}`}
            value={term}
            onChange={onChange}
          />
          {term.length > 0 && (
            <div data-cy="search-clear-button" className="flex items-center shrink-0 px-2 absolute top-0 right-2 h-full z-20">
              <Close onClick={clearSearch} size="10" />
            </div>
          )}
        </div>
        {handleSuggestion && <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSuggestionClick} />}
      </div>
    </form>
  );
};
export default SearchForm;
