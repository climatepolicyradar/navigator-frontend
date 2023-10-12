import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./SearchForm";

interface DocumentSearchFormProps {
  input?: string;
  placeholder: string;
  handleSearchInput(term: string): void;
  featuredSearches: string[];
}

const DocumentSearchForm = ({ input, placeholder, handleSearchInput, featuredSearches }: DocumentSearchFormProps) => {
  return (
    <div className="p-4 rounded-xl bg-blue-100">
      <SearchForm placeholder={placeholder} handleSearchInput={handleSearchInput} input={""} />
      <div className="mt-4 md:flex gap-2 text-sm">
        <div className="mb-2 md:mb-0 flex-shrink-0 text-blue-900 pt-1">Featured searches</div>
        <ul className="flex gap-1 flex-wrap items-center">
          {featuredSearches.map((searchTerm) => (
            <li key={searchTerm}>
              <button
                onClick={() => handleSearchInput(searchTerm)}
                className="text-gray-800 bg-white border border-gray-300 rounded-[40px] py-1 px-2 transition hover:bg-blue-600 hover:text-white"
              >
                {searchTerm}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default DocumentSearchForm;
