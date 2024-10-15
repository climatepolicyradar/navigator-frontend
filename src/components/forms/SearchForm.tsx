import React, { useState, useEffect, useRef } from "react";

import { SearchDropdown } from "./SearchDropdown";
import { TextInput } from "./TextInput";
import { Search2Icon } from "@components/svg/Icons";

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

  const onChange = (value: string) => {
    setTerm(value);
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
        <div className="relative z-20">
          <TextInput
            value={term}
            onChange={onChange}
            data-cy="search-input"
            data-analytics="seachPage-searchInput"
            placeholder={placeholder}
            type="search"
            size="large"
          >
            <button type="submit" className="flex cursor-pointer text-textDark" onClick={() => handleSearchButtonClick()} title="Click to search">
              <Search2Icon width="20" height="20" />
            </button>
          </TextInput>
        </div>
        {handleSuggestion && <SearchDropdown term={term} show={formFocus} handleSearchClick={handleSuggestionClick} />}
      </div>
    </form>
  );
};
export default SearchForm;
