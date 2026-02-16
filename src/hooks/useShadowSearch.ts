import { useState } from "react";

import { clausesToActiveFilters } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import { TFilterClause, TFilterFieldOptions } from "@/types";
import {
  addToFilterKey,
  EMPTY_FILTERS,
  hasAnyFilters as checkHasAnyFilters,
  hasAnyMatches,
  hasRemainingSuggestions,
  SelectedFilters,
} from "@/utils/_experiment/suggestedFilterUtils";

export interface UseShadowSearchParams {
  filterOptions?: TFilterFieldOptions;
}

/**
 * Encapsulates all state and behaviour for the shadow search (experimental search) page:
 * search input, raw query for results, string-only vs filter mode, and selected filters.
 */
export function useShadowSearch(params: UseShadowSearchParams = {}) {
  const { filterOptions } = params;
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [wasStringOnlySearch, setWasStringOnlySearch] = useState(false);
  const [filters, setFilters] = useState<SelectedFilters>(EMPTY_FILTERS);

  const rawMatches = getSuggestedFilterMatches(rawSearchTerm, filterOptions);
  const hasAnyFiltersFlag = checkHasAnyFilters(filters);
  const showStringOnlyResults = !!rawSearchTerm && wasStringOnlySearch && !hasAnyFiltersFlag && hasAnyMatches(rawMatches);

  function clearAllFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function applyRawSearch(trimmed: string) {
    if (trimmed.length > 0) setRawSearchTerm(trimmed);
    setWasStringOnlySearch(false);
  }

  function handleSelectConcept(concept: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, "topics", concept);
    setFilters(nextFilters);
    applyRawSearch(trimmed);
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) setSearchTerm("");
  }

  function handleSelectGeo(geo: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, "geos", geo);
    setFilters(nextFilters);
    applyRawSearch(trimmed);
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) setSearchTerm("");
  }

  function handleSelectYear(year: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, "years", year);
    setFilters(nextFilters);
    applyRawSearch(trimmed);
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) setSearchTerm("");
  }

  function handleSelectDocumentType(documentType: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, "documentTypes", documentType);
    setFilters(nextFilters);
    applyRawSearch(trimmed);
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) setSearchTerm("");
  }

  function handleApplyAll(matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) {
    setFilters({
      ...EMPTY_FILTERS,
      topics: matches.concepts,
      geos: matches.geos,
      years: matches.years,
      documentTypes: matches.documentTypes,
    });
    setRawSearchTerm(searchTerm);
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function applyAdvancedFilters(clauses: TFilterClause[]) {
    const active = clausesToActiveFilters(clauses);
    setFilters({
      topics: active.includedConcepts,
      geos: active.includedGeos,
      years: active.includedYears,
      documentTypes: active.includedDocumentTypes,
      topicsExcluded: active.excludedConcepts,
      geosExcluded: active.excludedGeos,
      yearsExcluded: active.excludedYears,
      documentTypesExcluded: active.excludedDocumentTypes,
    });
    setRawSearchTerm("");
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function handleSearchOnly() {
    setRawSearchTerm(searchTerm);
    setWasStringOnlySearch(true);
    setSearchTerm("");
  }

  function resetFiltersToOriginalSearch() {
    setSearchTerm(rawSearchTerm);
    clearAllFilters();
    setRawSearchTerm("");
  }

  function removeFilter(update: Partial<SelectedFilters>) {
    setFilters((prev) => {
      const next = { ...prev, ...update };
      if (!checkHasAnyFilters(next)) setSearchTerm("");
      return next;
    });
  }

  function removeFromFilter(key: keyof SelectedFilters, value: string) {
    const arr = filters[key];
    if (!Array.isArray(arr)) return;
    removeFilter({ [key]: arr.filter((x) => x !== value) } as Partial<SelectedFilters>);
  }

  function removeTopic(topic: string) {
    removeFromFilter("topics", topic);
  }
  function removeGeo(geo: string) {
    removeFromFilter("geos", geo);
  }
  function removeYear(year: string) {
    removeFromFilter("years", year);
  }
  function removeDocumentType(documentType: string) {
    removeFromFilter("documentTypes", documentType);
  }
  function removeTopicExcluded(topic: string) {
    removeFromFilter("topicsExcluded", topic);
  }
  function removeGeoExcluded(geo: string) {
    removeFromFilter("geosExcluded", geo);
  }
  function removeYearExcluded(year: string) {
    removeFromFilter("yearsExcluded", year);
  }
  function removeDocumentTypeExcluded(documentType: string) {
    removeFromFilter("documentTypesExcluded", documentType);
  }

  return {
    searchTerm,
    setSearchTerm,
    rawSearchTerm,
    rawMatches,
    filters,
    hasAnyFilters: hasAnyFiltersFlag,
    showStringOnlyResults,
    clearAllFilters,
    handleSelectConcept,
    handleSelectGeo,
    handleSelectYear,
    handleSelectDocumentType,
    handleApplyAll,
    handleSearchOnly,
    applyAdvancedFilters,
    resetFiltersToOriginalSearch,
    removeTopic,
    removeGeo,
    removeYear,
    removeDocumentType,
    removeTopicExcluded,
    removeGeoExcluded,
    removeYearExcluded,
    removeDocumentTypeExcluded,
  };
}

export default useShadowSearch;
