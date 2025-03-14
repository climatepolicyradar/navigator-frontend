import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./SearchForm";
import { Button } from "@/components/atoms/button/Button";

interface DocumentSearchFormProps {
  input?: string;
  placeholder: string;
  handleSearchInput(term: string): void;
  featuredSearches: string[];
  showSuggestions?: boolean;
  suggestionsAsLinks?: boolean;
}

const DocumentSearchForm = ({
  input,
  placeholder,
  handleSearchInput,
  featuredSearches,
  showSuggestions,
  suggestionsAsLinks,
}: DocumentSearchFormProps) => {
  return (
    <div className="my-10">
      <SearchForm placeholder={placeholder} handleSearchInput={handleSearchInput} input={input} />
      {showSuggestions && (
        <div className="mt-4 md:flex gap-2 text-sm items-center">
          {suggestionsAsLinks && (
            <>
              <div className="mb-2 md:mb-0 flex-shrink-0 text-textDark">Featured searches</div>
              <ul className="flex gap-1 flex-wrap items-center">
                {featuredSearches.map((searchTerm) => (
                  <li key={searchTerm}>
                    <Button color="mono" rounded size="small" variant="outlined" onClick={() => handleSearchInput(searchTerm)}>
                      {searchTerm}
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!suggestionsAsLinks && (
            <>
              <div className="mb-2 md:mb-0 flex-shrink-0 text-blue-900">Examples:</div>
              <div className="text-[#536DA2]">{featuredSearches.join(", ")}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default DocumentSearchForm;
