import React, { useEffect, useState } from "react";

import Tooltip from "@components/tooltip";
import { ExternalLink } from "@components/ExternalLink";
import { DateRange } from "../filters/DateRange";
import { Accordian } from "@components/accordian/Accordian";
import { InputListContainer } from "@components/filters/InputListContainer";
import { TypeAhead } from "../forms/TypeAhead";
import { InputCheck } from "@components/forms/Checkbox";
import { InputRadio } from "@components/forms/Radio";
import { AppliedFilters } from "@components/filters/AppliedFilters";

import { currentYear, minYear } from "@constants/timedate";
import { QUERY_PARAMS } from "@constants/queryParams";
import { DOCUMENT_CATEGORIES, TDocumentCategory } from "@constants/documentCategories";
import { LAWS, POLICIES, UNFCCC, LITIGATION } from "@constants/categoryAliases";

import { TGeography, TSearchCriteria } from "@types";

const { default: MethodologyLink } = await import(`/themes/${process.env.THEME}/components/MethodologyLink`);

const isCategoryChecked = (selectedCatgeory: string, category: TDocumentCategory) => {
  if (!category) {
    return false;
  }

  if (selectedCatgeory) {
    if (category === "Legislation") {
      return LAWS.includes(selectedCatgeory);
    }
    if (category === "Policies") {
      return POLICIES.includes(selectedCatgeory);
    }
    if (category === "UNFCCC") {
      return UNFCCC.includes(selectedCatgeory);
    }
    if (category === "Litigation") {
      return LITIGATION.includes(selectedCatgeory);
    }
  } else if (category === "All") {
    return true;
  }

  // All
  return false;
};

type TSearchFiltersProps = {
  searchCriteria: TSearchCriteria;
  regions: TGeography[];
  filteredCountries: TGeography[];
  handleFilterChange(type: string, value: string): void;
  handleYearChange(values: number[], reset?: boolean): void;
  handleRegionChange(region: string): void;
  handleClearSearch(): void;
  handleDocumentCategoryClick(value: string): void;
};

const SearchFilters = ({
  searchCriteria,
  regions,
  filteredCountries,
  handleFilterChange,
  handleYearChange,
  handleRegionChange,
  handleClearSearch,
  handleDocumentCategoryClick,
}: TSearchFiltersProps) => {
  const [showClear, setShowClear] = useState(false);

  const {
    keyword_filters: { countries: countryFilters = [], regions: regionFilters = [], categories: categoryFilters = [] },
  } = searchCriteria;

  const thisYear = currentYear();

  // Show clear button if there are filters applied
  useEffect(() => {
    if (searchCriteria.year_range[0] !== minYear || searchCriteria.year_range[1] !== thisYear) {
      setShowClear(true);
    } else if (Object.keys(searchCriteria.keyword_filters).length > 0) {
      setShowClear(true);
    } else if (searchCriteria.exact_match) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [thisYear, searchCriteria]);

  return (
    <div id="search_filters" data-cy="seach-filters" className="text-sm text-textNormal flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <p className="text-xs uppercase">Filters </p>
          <Tooltip
            id="filter-by"
            tooltip={
              <>
                Selecting exact phrases only will narrow down your search to only show documents that contain the precise words you typed in the
                search bar. Our enhanced search will look for similar and related terms, so you’ll get more results, with the most relevant ones
                automatically appearing at the top. See our FAQs for more information.
              </>
            }
            icon="i"
            place="right"
          />
        </div>
        {showClear && (
          <button className="anchor underline text-[13px]" onClick={handleClearSearch}>
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2" data-cy="applied-filters">
        <AppliedFilters filterChange={handleFilterChange} />
      </div>

      <Accordian title="Category" data-cy="categories" startOpen>
        <InputListContainer>
          {DOCUMENT_CATEGORIES.map((category, i) => (
            <InputRadio
              key={category}
              label={category}
              checked={categoryFilters && isCategoryChecked(categoryFilters[0], category)}
              onChange={() => {
                handleDocumentCategoryClick(category);
              }}
            />
          ))}
        </InputListContainer>
      </Accordian>

      <Accordian title="Region" data-cy="regions">
        <InputListContainer>
          {regions.map((region) => (
            <InputCheck
              key={region.slug}
              label={region.display_value}
              checked={regionFilters && regionFilters.includes(region.slug)}
              onChange={() => {
                handleRegionChange(region.slug);
              }}
            />
          ))}
        </InputListContainer>
      </Accordian>

      <Accordian title="Published jurisdiction" data-cy="countries" overflowOverride>
        <InputListContainer>
          <TypeAhead
            list={filteredCountries}
            selectedList={countryFilters}
            keyField="slug"
            keyFieldDisplay="display_value"
            filterType={QUERY_PARAMS.country}
            handleFilterChange={handleFilterChange}
          />
        </InputListContainer>
      </Accordian>

      <Accordian title="Date" data-cy="date-range">
        <DateRange type="year_range" handleChange={handleYearChange} defaultValues={searchCriteria.year_range} min={minYear} max={thisYear} />
      </Accordian>

      <div className="my-5 pt-5 border-t" data-cy="methodology-notice">
        <p className="text-center mb-6">
          <ExternalLink url="https://form.jotform.com/233132076355350">Get notified when we add new filters</ExternalLink>
        </p>
        <p className="text-center">
          For more info see
          <br />
          <MethodologyLink />
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;
