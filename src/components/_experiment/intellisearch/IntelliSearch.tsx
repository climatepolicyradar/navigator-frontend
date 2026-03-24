import { Input } from "@base-ui/react/input";
import { LucideSearch } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useLabelSearch } from "@/hooks/useLabelSearch";
import { joinTailwindClasses } from "@/utils/tailwind";

import { IntelliSearchProps, TSuggestion } from "./IntelliSearch.types";

const underlineFirstInstanceOfQuery = (text: string, query: string) => {
  const regex = new RegExp(`(${query})`, "i");
  return text.replace(regex, "<u>$1</u>");
};

const displaySuggestion = (suggestion: TSuggestion, searchTerm: string) => {
  switch (suggestion.type) {
    case "label":
      return (
        <>
          <span
            className="font-medium text-gray-900"
            dangerouslySetInnerHTML={{ __html: underlineFirstInstanceOfQuery(suggestion.data.value, searchTerm) }}
          />
          <span className="text-gray-500"> — </span>
          <span className="text-gray-600 font-medium">{suggestion.data.type}</span>
        </>
      );
    case "search":
      return (
        <>
          <span>
            Search for "<b>{suggestion.data}</b>"
          </span>
        </>
      );
    default:
      return "";
  }
};

/**
 * IntelliSearch Component
 *
 * An intelligent search component that provides real-time suggestions from two sources:
 * 1. External Labels API - dynamically searched based on user input
 * 2. Concepts - pre-loaded data with definitions and alternative labels
 *
 * Features:
 * - Debounced search to minimize API calls
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus and mouse-aware suggestion visibility
 *
 * @example
 * ```tsx
 * <IntelliSearch placeholder="Search for concepts or labels..." />
 * ```
 */
export function IntelliSearch({
  className,
  placeholder = "Search",
  debounceDelay = 300,
  maxSuggestions,
  selectedLabels = [],
  onSelectSuggestion,
  setQuery,
}: IntelliSearchProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseInComponent, setIsMouseInComponent] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const { results: labelsResults, isLoading: isLoadingLabels } = useLabelSearch(searchTerm, { debounceDelay });

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetSearchState = () => {
    setSearchTerm("");
    setActiveSuggestionIndex(-1);
  };

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

    // Add search suggestion
    if (searchTerm.trim()) {
      unified.unshift({
        type: "search",
        data: searchTerm.trim(),
      });
    }

    // Apply max suggestions limit if specified
    return maxSuggestions ? unified.slice(0, maxSuggestions) : unified;
  }, [labelsResults, maxSuggestions, selectedLabels, searchTerm]);

  /**
   * Determine if suggestions should be visible
   * Show when: input has value AND (input focused OR mouse in component)
   */
  const shouldShowSuggestions = (isInputFocused || isMouseInComponent) && suggestions.length > 0;

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
            if (suggestions[activeSuggestionIndex].type === "label") {
              onSelectSuggestion?.(suggestions[activeSuggestionIndex].data.value);
            } else if (suggestions[activeSuggestionIndex].type === "search") {
              setQuery?.(suggestions[activeSuggestionIndex].data.trim());
            }
          } else {
            setQuery?.(searchTerm.trim());
            inputRef.current?.blur();
          }

          break;

        case "Escape":
          e.preventDefault();
          resetSearchState();
          inputRef.current?.blur();
          break;
      }
    },
    [activeSuggestionIndex, onSelectSuggestion, suggestions, setQuery, searchTerm]
  );

  return (
    <div
      ref={containerRef}
      className={joinTailwindClasses("relative w-full", className)}
      onMouseEnter={() => setIsMouseInComponent(true)}
      onMouseLeave={() => {
        setIsMouseInComponent(false);
      }}
    >
      {/* Input Field */}
      <div
        className={joinTailwindClasses(
          "w-full rounded-lg border border-transparent-regular bg-white p-4 relative flex flex-nowrap items-center gap-2 transition-all duration-200",
          "hover:border-gray-400",
          "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md"
        )}
      >
        <LucideSearch width={16} height={16} className="text-neutral-500" />
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
          className="w-full bg-transparent text-base leading-5 text-inky-black placeholder-neutral-500 outline-none border-0 p-0"
          autoComplete="off"
        />
      </div>

      {/* Loading Indicator */}
      {isLoadingLabels && (
        <div className="absolute right-6 top-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}

      {/* Suggestions List */}
      {shouldShowSuggestions && (
        <div className="relative mt-1">
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
              const isActive = activeSuggestionIndex === -1 ? index === 0 : index === activeSuggestionIndex;

              return (
                <div
                  key={`${suggestion.type}-${index}`}
                  role="option"
                  aria-selected={isActive}
                  className={joinTailwindClasses(
                    "relative px-4 py-2.5 cursor-pointer",
                    "transition-all duration-150",
                    "hover:bg-gray-100 hover:shadow-sm hover:scale-[1.01]",
                    isActive && "bg-blue-50 border-l-2 border-l-blue-500",
                    !isActive && "border-l-2 border-l-transparent"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (suggestion.type === "label") {
                      onSelectSuggestion?.(suggestion.data.value);
                      resetSearchState();
                    } else if (suggestion.type === "search") {
                      setQuery?.(suggestion.data.trim());
                    }
                  }}
                >
                  <div className="text-sm">{displaySuggestion(suggestion, searchTerm)}</div>
                  {isActive && <span className="absolute top-2 right-2 bg-white p-1 text-xs border border-gray-200">Enter</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
