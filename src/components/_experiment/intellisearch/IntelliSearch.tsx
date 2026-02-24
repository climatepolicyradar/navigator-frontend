"use client";

import { Input } from "@base-ui/react/input";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { joinTailwindClasses } from "@/utils/tailwind";

import { IntelliSearchProps, TLabelsResponse, TConcept, TSuggestion } from "./IntelliSearch.types";

/**
 * IntelliSearch Component
 *
 * An intelligent search component that provides real-time suggestions from two sources:
 * 1. External Labels API - dynamically searched based on user input
 * 2. Concepts - pre-loaded data with definitions and alternative labels
 *
 * Features:
 * - Debounced search to minimize API calls
 * - Hover preview cards for concepts showing detailed information
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus and mouse-aware suggestion visibility
 * - Case-insensitive matching across multiple fields
 *
 * @example
 * ```tsx
 * <IntelliSearch placeholder="Search for concepts or labels..." />
 * ```
 */
export function IntelliSearch({
  className,
  placeholder = "Search...",
  debounceDelay = 300,
  maxSuggestions,
  topics,
  selectedLabels = [],
  onSelectConcept,
  setQuery,
}: IntelliSearchProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseInComponent, setIsMouseInComponent] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [hoveredConceptIndex, setHoveredConceptIndex] = useState<number | null>(null);
  const [labelsResults, setLabelsResults] = useState<TLabelsResponse["results"]>([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Debounced function to search labels API
   * Uses lodash debounce to wait for user to stop typing
   */
  const searchLabelsAPI = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          setLabelsResults([]);
          return;
        }

        setIsLoadingLabels(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org";
          const client = new ApiClient(apiUrl);
          const response = await client.get<TLabelsResponse>(`/search/labels?query=${encodeURIComponent(query)}`, null);
          setLabelsResults(response.data.results || []);
        } catch {
          // Silently handle error and show empty results
          setLabelsResults([]);
        } finally {
          setIsLoadingLabels(false);
        }
      }, debounceDelay),
    [debounceDelay]
  );

  /**
   * Effect to trigger debounced label search when searchTerm changes
   */
  useEffect(() => {
    searchLabelsAPI(searchTerm);
    // Cleanup function to cancel pending debounced calls
    return () => {
      searchLabelsAPI.cancel();
    };
  }, [searchTerm, searchLabelsAPI]);

  /**
   * Match concepts based on search term
   * Checks both preferred_label and all alternative_labels
   * Returns concept with matched label if alternative label matched
   */
  const matchedConcepts = useMemo(() => {
    if (!searchTerm.trim() || !topics.length) {
      return [];
    }

    const lowerQuery = searchTerm.toLowerCase();
    const matches: Array<{ concept: TConcept; matchedLabel?: string }> = [];

    for (const concept of topics) {
      // Check preferred label
      if (concept.preferred_label?.toLowerCase().includes(lowerQuery)) {
        matches.push({ concept });
        continue;
      }

      // Check alternative labels
      const matchedAlt = concept.alternative_labels?.find((alt: string) => alt.toLowerCase().includes(lowerQuery));

      if (matchedAlt) {
        matches.push({ concept, matchedLabel: matchedAlt });
      }
    }

    return matches;
  }, [searchTerm, topics]);

  /**
   * Unified suggestions list - labels first, then concepts.
   * Excludes concepts already in selectedLabels (Active filters).
   */
  const suggestions = useMemo(() => {
    const selectedSet = new Set(selectedLabels.map((s) => s.toLowerCase()));
    const unified: TSuggestion[] = [];

    // Add label suggestions first
    labelsResults.forEach((label) => {
      if (selectedSet.has(label.id.toLowerCase())) return; // Exclude if already selected as filter
      unified.push({ type: "label", data: label });
    });

    // Add concept suggestions, excluding already-selected topics
    matchedConcepts.forEach(({ concept, matchedLabel }) => {
      if (concept?.preferred_label && selectedSet.has(concept.preferred_label.toLowerCase())) return;
      unified.push({
        type: "concept",
        data: concept,
        matchedLabel,
      });
    });

    // Apply max suggestions limit if specified
    return maxSuggestions ? unified.slice(0, maxSuggestions) : unified;
  }, [labelsResults, matchedConcepts, maxSuggestions, selectedLabels]);

  /**
   * Determine if suggestions should be visible
   * Show when: input has value AND (input focused OR mouse in component)
   */
  const shouldShowSuggestions = searchTerm.trim() && (isInputFocused || isMouseInComponent) && suggestions.length > 0;

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setActiveSuggestionIndex(-1); // Reset active suggestion
  };

  /**
   * Handle keyboard navigation
   * Arrow Up/Down: Navigate through suggestions
   * Enter: Select active suggestion or trigger search with query
   * Escape: Clear input and blur
   */
  const handleKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // if (!shouldShowSuggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;

        case "Enter":
          e.preventDefault();
          // If a suggestion is active, trigger selection callback, otherwise search for string
          if (activeSuggestionIndex >= 0) {
            onSelectConcept?.(
              suggestions[activeSuggestionIndex]?.type === "concept"
                ? suggestions[activeSuggestionIndex].data.preferred_label
                : suggestions[activeSuggestionIndex]?.data.id
            );
            setSearchTerm("");
            setQuery?.("");
            setActiveSuggestionIndex(-1);
          } else if (searchTerm.trim()) {
            setQuery?.(searchTerm.trim());
          }
          inputRef.current?.blur();
          break;

        case "Escape":
          e.preventDefault();
          setSearchTerm("");
          setActiveSuggestionIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [activeSuggestionIndex, onSelectConcept, suggestions, setQuery, searchTerm]
  );

  /**
   * Get the currently hovered concept for preview card
   */
  const activeConcept = useMemo(() => {
    if (hoveredConceptIndex === null && activeSuggestionIndex === null) return null;
    const suggestion = suggestions[hoveredConceptIndex ?? activeSuggestionIndex ?? -1];
    return suggestion?.type === "concept" ? suggestion.data : null;
  }, [hoveredConceptIndex, activeSuggestionIndex, suggestions]);

  return (
    <div
      ref={containerRef}
      className={joinTailwindClasses("relative w-full max-w-2xl", className)}
      onMouseEnter={() => setIsMouseInComponent(true)}
      onMouseLeave={() => {
        setIsMouseInComponent(false);
        setHoveredConceptIndex(null);
      }}
    >
      {/* Input Field */}
      <div
        className={joinTailwindClasses(
          "w-full rounded-lg border border-gray-300 bg-white px-4 py-3",
          "shadow-sm transition-all duration-200",
          "hover:border-gray-400",
          "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md"
        )}
      >
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={handleKeyDownInput}
          placeholder={placeholder}
          aria-label="Intelligent search input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={shouldShowSuggestions}
          className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
        />
      </div>

      {/* Loading Indicator */}
      {isLoadingLabels && (
        <div className="absolute right-4 top-3.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}

      {/* Suggestions List */}
      {shouldShowSuggestions && (
        <div className="relative mt-2">
          <div
            id="suggestions-list"
            role="listbox"
            className={joinTailwindClasses(
              "absolute z-10 w-full",
              "max-h-96 overflow-y-auto",
              "rounded-lg border border-gray-200 bg-white shadow-xl",
              "py-2"
            )}
          >
            {suggestions.map((suggestion, index) => {
              const isActive = index === activeSuggestionIndex;

              return (
                <div
                  key={suggestion.type === "label" ? `label-${suggestion.data.id}` : `concept-${suggestion.data.wikibase_id}`}
                  role="option"
                  aria-selected={isActive}
                  className={joinTailwindClasses(
                    "px-4 py-2.5 cursor-pointer",
                    "transition-all duration-150",
                    "hover:bg-gray-100 hover:shadow-sm hover:scale-[1.01]",
                    isActive && "bg-blue-50 border-l-2 border-l-blue-500",
                    !isActive && "border-l-2 border-l-transparent"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => {
                    if (suggestion.type === "concept") {
                      setHoveredConceptIndex(index);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredConceptIndex(null);
                  }}
                  onClick={() => {
                    if (suggestion.type === "concept") {
                      onSelectConcept?.(suggestion.data.preferred_label);
                    } else {
                      onSelectConcept?.(suggestion.data.id);
                    }
                  }}
                >
                  {suggestion.type === "label" ? (
                    // Label format: "{id} — {title}"
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{suggestion.data.id}</span>
                      <span className="text-gray-500"> — </span>
                      <span className="text-gray-600 font-medium">Label: {suggestion.data.title}</span>
                    </div>
                  ) : (
                    // Concept format: "{preferred_label} - Concept (matched on {alt})"
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{suggestion.data.preferred_label}</span>
                      <span className="text-gray-500"> — </span>
                      <span className="text-indigo-600 font-medium">Concept</span>
                      {suggestion.matchedLabel && <span className="text-gray-500 italic text-xs ml-2">(matched on "{suggestion.matchedLabel}")</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Concept Preview Card */}
          {activeConcept && (
            <div
              className={joinTailwindClasses(
                "absolute left-full top-0 ml-4 z-20",
                "w-80 p-4 rounded-lg bg-white shadow-lg border border-gray-200",
                "transition-opacity duration-150"
              )}
              style={{
                // Fixed position relative to suggestions list
                marginTop: "0",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{activeConcept.preferred_label}</h3>

              {activeConcept.definition && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{activeConcept.definition}</p>
                </div>
              )}

              {/* {activeConcept.alternative_labels && activeConcept.alternative_labels.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Alternative Labels</h4>
                  <p className="text-sm text-gray-600">{activeConcept.alternative_labels.join(", ")}</p>
                </div>
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
