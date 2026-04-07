import { Autocomplete } from "@base-ui/react/autocomplete";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { CornerDownLeft, LucideSearch, SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { TLabelResult, useLabelSearch } from "@/hooks/useLabelSearch";
import { partitionByAvailability } from "@/utils/_experiment/labelAggregationAvailability";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";
import { joinTailwindClasses } from "@/utils/tailwind";

import { IntelliSearchProps } from "./IntelliSearch.types";

const underlineFirstInstanceOfQuery = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "i");
  return text.replace(regex, "<b><u>$1</u></b>");
};

export function IntelliSearch({
  query,
  availableLabelIds,
  className,
  placeholder = "Search",
  debounceDelay = 50,
  maxSuggestions,
  selectedLabels = [],
  onSelectSuggestion,
  setQuery,
  onAdvancedClick,
}: IntelliSearchProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState(query);
  const [inputFocused, setInputFocused] = useState(false);
  const { results: labelsResults, isLoading: isLoadingLabels } = useLabelSearch(searchTerm, { debounceDelay });

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleSuggestionClick(suggestion: string) {
    onSelectSuggestion?.(suggestion);
    setQuery?.("");
    setSearchTerm("");
    inputRef.current?.blur();
  }

  function handleSearchClick() {
    setQuery?.(searchTerm.trim());
    inputRef.current?.blur();
  }

  function handleAdvancedClick() {
    onAdvancedClick?.();
    inputRef.current?.blur();
  }

  const isSuggestionAvailable = (suggestion: TLabelResult) => !availableLabelIds || availableLabelIds.has(suggestion.id);

  const suggestions = useMemo(() => {
    const selectedSet = new Set(selectedLabels.map((s) => s.toLowerCase()));
    const candidateLabels: TLabelResult[] = [];

    // Add label suggestions first. Unavailable ones stay visible but disabled.
    labelsResults.forEach((label) => {
      if (selectedSet.has(label.value.toLowerCase())) return; // Exclude if already selected as filter
      candidateLabels.push(label);
    });

    const { enabled, disabled } = partitionByAvailability(candidateLabels, availableLabelIds);
    const unified: TLabelResult[] = [...enabled, ...disabled];

    // Add search suggestion
    if (searchTerm.trim()) {
      unified.unshift({
        id: "search",
        type: "search",
        value: searchTerm.trim(),
      });
    }

    // Apply max suggestions limit if specified
    return maxSuggestions ? unified.slice(0, maxSuggestions) : unified;
  }, [availableLabelIds, labelsResults, maxSuggestions, selectedLabels, searchTerm]);

  const labelSuggestions = useMemo(() => suggestions.slice(1), [suggestions]);
  const firstDisabledIndex = useMemo(
    () => labelSuggestions.findIndex((s) => availableLabelIds && !availableLabelIds.has(s.id)),
    [labelSuggestions, availableLabelIds]
  );

  return (
    <div ref={containerRef} className={joinTailwindClasses("relative w-full", className)}>
      <Autocomplete.Root open items={suggestions} autoHighlight="always" keepHighlight>
        <div className="relative border border-transparent-regular rounded-xl">
          <div className="flex items-center gap-2 ml-6">
            <LucideSearch width={16} height={16} className="text-neutral-500" />
            <Autocomplete.Input
              className="w-full p-4 pl-0 border-0 bg-transparent text-base leading-5 text-inky-black placeholder-neutral-500"
              placeholder={placeholder}
              ref={inputRef}
              value={searchTerm}
              onKeyDown={(e) => {
                // We need to catch hitting enter with an empty string
                // Otherwise we can't clear the current search term using base-ui's autocomplete
                if (e.key === "Enter" && searchTerm.trim() === "") {
                  setQuery?.(searchTerm.trim());
                }
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoComplete="off"
            />
          </div>
          {isLoadingLabels && (
            <div className="absolute right-4 top-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </div>
          )}
        </div>
        <Autocomplete.Portal hidden={!inputFocused || searchTerm.trim() === ""}>
          <Autocomplete.Positioner className="outline-hidden" align="start" anchor={containerRef}>
            <Autocomplete.Popup className="mt-1 w-(--anchor-width) border bg-white border-transparent-regular rounded-xl">
              <ScrollArea.Root className="flex max-h-[60dvh] min-h-0 flex-[0_1_auto] overflow-hidden rounded-top-xl">
                <ScrollArea.Viewport className="min-h-0 flex-1 overscroll-contain scroll-py-2 focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-blue-800">
                  <ScrollArea.Content className="min-w-full">
                    <Autocomplete.List className="p-2">
                      {/* TEXT SEARCH */}
                      {searchTerm.trim() && (
                        <Autocomplete.Group className="block pb-2">
                          <Autocomplete.Item
                            value={{ value: searchTerm, type: "search" }}
                            onClick={() => handleSearchClick()}
                            className="flex min-h-8 cursor-pointer items-center gap-1 rounded-md pl-4 pr-3 text-base text-inky-black select-none outline-none scroll-my-1 group data-highlighted:bg-neutral-200"
                          >
                            <span dangerouslySetInnerHTML={{ __html: `Search for <b>${searchTerm}</b>` }} />
                            <div className="hidden text-sm text-neutral-600 gap-1 items-center ml-auto group-data-highlighted:inline-flex">
                              Enter
                              <CornerDownLeft height={16} width={16} className="inline" />
                            </div>
                          </Autocomplete.Item>
                        </Autocomplete.Group>
                      )}
                      {/* EMPTY STATE */}
                      <Autocomplete.Empty className="min-h-10 p-4 text-sm leading-4 text-gray-600 empty:m-0 empty:min-h-0 empty:p-0">
                        {searchTerm.trim().length === 0 ? "Enter a search query to see suggestions" : "No suggestions found for your query"}
                      </Autocomplete.Empty>
                      {/* SUGGESTIONS */}
                      {/* the first suggestion is always the search term, so we start from index 1 to show label suggestions first */}
                      {suggestions.length > 1 && (
                        <Autocomplete.Group items={labelSuggestions} className="block pb-2">
                          <Autocomplete.GroupLabel className="sticky top-0 z-1 m-0 mr-2 bg-white px-4 py-2 text-xs text-neutral-500">
                            Suggestions
                          </Autocomplete.GroupLabel>
                          {labelSuggestions.map((suggestion, idx) => {
                            const isAvailable = isSuggestionAvailable(suggestion);
                            return (
                              <div key={suggestion.id}>
                                {firstDisabledIndex > 0 && idx === firstDisabledIndex ? <div className="h-6" aria-hidden /> : null}
                                <Autocomplete.Item
                                  value={{ value: suggestion.value, type: "label" }}
                                  onClick={() => {
                                    if (!isAvailable) return;
                                    handleSuggestionClick(suggestion.value);
                                  }}
                                  className={joinTailwindClasses(
                                    "flex min-h-9 items-center gap-1 rounded-md pl-4 pr-3 text-base select-none outline-none scroll-my-1 group",
                                    isAvailable
                                      ? "cursor-pointer text-inky-black data-highlighted:bg-neutral-200"
                                      : "cursor-not-allowed text-neutral-400"
                                  )}
                                >
                                  <span
                                    className="truncate"
                                    dangerouslySetInnerHTML={{ __html: underlineFirstInstanceOfQuery(suggestion.value, searchTerm) }}
                                  />
                                  <span className={isAvailable ? "text-gray-500" : "text-neutral-400"}>—</span>
                                  <span
                                    className={joinTailwindClasses(
                                      "shrink-0 whitespace-nowrap",
                                      isAvailable ? "text-neutral-500" : "text-neutral-400"
                                    )}
                                  >
                                    {labelTypeLabel(suggestion.type)}
                                  </span>
                                  {isAvailable ? (
                                    <div className="hidden text-sm text-neutral-600 gap-1 items-center ml-auto group-data-highlighted:inline-flex">
                                      Enter
                                      <CornerDownLeft height={16} width={16} className="inline" />
                                    </div>
                                  ) : (
                                    <div className="text-xs text-neutral-400 ml-auto">Unavailable</div>
                                  )}
                                </Autocomplete.Item>
                              </div>
                            );
                          })}
                        </Autocomplete.Group>
                      )}
                    </Autocomplete.List>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="-mr-1 flex w-6 justify-center py-2">
                  <ScrollArea.Thumb className="flex w-full justify-center before:block before:h-full before:w-1 before:rounded-sm before:bg-neutral-400 before:content-['']" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>

              <div className="flex items-center justify-between border-t border-transparent-regular p-4 text-sm text-inky-black">
                <button
                  className="flex items-center gap-2 hover:bg-neutral-200 rounded-md p-1"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleAdvancedClick}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced
                </button>
              </div>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </div>
  );
}
