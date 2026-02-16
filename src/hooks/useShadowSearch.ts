import { useState, useCallback } from "react";

import { getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import {
  EMPTY_FILTERS,
  hasAnyFilters as checkHasAnyFilters,
  hasAnyMatches,
  hasRemainingSuggestions,
  SelectedFilters,
} from "@/utils/_experiment/suggestedFilterUtils";

/**
 * Encapsulates all state and behaviour for the shadow search (experimental search) page:
 * search input, raw query for results, string-only vs filter mode, and selected filters.
 */
export function useShadowSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [wasStringOnlySearch, setWasStringOnlySearch] = useState(false);
  const [filters, setFilters] = useState<SelectedFilters>(EMPTY_FILTERS);

  const rawMatches = getSuggestedFilterMatches(rawSearchTerm);
  const hasAnyFiltersFlag = checkHasAnyFilters(filters);
  const showStringOnlyResults = !!rawSearchTerm && wasStringOnlySearch && !hasAnyFiltersFlag && hasAnyMatches(rawMatches);

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const applyRawSearch = useCallback((trimmed: string) => {
    if (trimmed.length > 0) setRawSearchTerm(trimmed);
    setWasStringOnlySearch(false);
  }, []);

  const handleSelectConcept = useCallback(
    (concept: string) => {
      const trimmed = searchTerm.trim();
      const nextFilters: SelectedFilters = { ...filters, topics: [...filters.topics, concept] };
      setFilters(nextFilters);
      applyRawSearch(trimmed);
      if (!hasRemainingSuggestions(trimmed, nextFilters)) setSearchTerm("");
    },
    [searchTerm, filters, applyRawSearch]
  );

  const handleSelectGeo = useCallback(
    (geo: string) => {
      const trimmed = searchTerm.trim();
      const nextFilters: SelectedFilters = { ...filters, geos: [...filters.geos, geo] };
      setFilters(nextFilters);
      applyRawSearch(trimmed);
      if (!hasRemainingSuggestions(trimmed, nextFilters)) setSearchTerm("");
    },
    [searchTerm, filters, applyRawSearch]
  );

  const handleSelectYear = useCallback(
    (year: string) => {
      const trimmed = searchTerm.trim();
      const nextFilters: SelectedFilters = { ...filters, years: [...filters.years, year] };
      setFilters(nextFilters);
      applyRawSearch(trimmed);
      if (!hasRemainingSuggestions(trimmed, nextFilters)) setSearchTerm("");
    },
    [searchTerm, filters, applyRawSearch]
  );

  const handleSelectDocumentType = useCallback(
    (documentType: string) => {
      const trimmed = searchTerm.trim();
      const nextFilters: SelectedFilters = {
        ...filters,
        documentTypes: [...filters.documentTypes, documentType],
      };
      setFilters(nextFilters);
      applyRawSearch(trimmed);
      if (!hasRemainingSuggestions(trimmed, nextFilters)) setSearchTerm("");
    },
    [searchTerm, filters, applyRawSearch]
  );

  const handleApplyAll = useCallback(
    (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => {
      setFilters({
        topics: matches.concepts,
        geos: matches.geos,
        years: matches.years,
        documentTypes: matches.documentTypes,
      });
      setRawSearchTerm(searchTerm);
      setWasStringOnlySearch(false);
      setSearchTerm("");
    },
    [searchTerm]
  );

  const handleSearchOnly = useCallback(() => {
    setRawSearchTerm(searchTerm);
    setWasStringOnlySearch(true);
    setSearchTerm("");
  }, [searchTerm]);

  const resetFiltersToOriginalSearch = useCallback(() => {
    setSearchTerm(rawSearchTerm);
    clearAllFilters();
    setRawSearchTerm("");
  }, [rawSearchTerm, clearAllFilters]);

  const removeFilter = useCallback((update: Partial<SelectedFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...update };
      if (!checkHasAnyFilters(next)) setSearchTerm("");
      return next;
    });
  }, []);

  const removeTopic = useCallback(
    (topic: string) => removeFilter({ topics: filters.topics.filter((t) => t !== topic) }),
    [filters.topics, removeFilter]
  );
  const removeGeo = useCallback((geo: string) => removeFilter({ geos: filters.geos.filter((g) => g !== geo) }), [filters.geos, removeFilter]);
  const removeYear = useCallback((year: string) => removeFilter({ years: filters.years.filter((y) => y !== year) }), [filters.years, removeFilter]);
  const removeDocumentType = useCallback(
    (documentType: string) => removeFilter({ documentTypes: filters.documentTypes.filter((d) => d !== documentType) }),
    [filters.documentTypes, removeFilter]
  );

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
    resetFiltersToOriginalSearch,
    removeTopic,
    removeGeo,
    removeYear,
    removeDocumentType,
  };
}

export default useShadowSearch;
