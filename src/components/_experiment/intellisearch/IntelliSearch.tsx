import { Autocomplete } from "@base-ui/react/autocomplete";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { CornerDownLeft, LucideSearch, SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { TLabelResult, useLabelSearch } from "@/hooks/useLabelSearch";
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

  const suggestions = useMemo(() => {
    const selectedSet = new Set(selectedLabels.map((s) => s.toLowerCase()));
    const unified: TLabelResult[] = [];

    // Add label suggestions first
    labelsResults.forEach((label) => {
      if (selectedSet.has(label.value.toLowerCase())) return; // Exclude if already selected as filter
      unified.push(label);
    });

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
  }, [labelsResults, maxSuggestions, selectedLabels, searchTerm]);

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
                      {!!labelsResults.length && (
                        <Autocomplete.Group items={suggestions.slice(1, suggestions.length)} className="block pb-2">
                          <Autocomplete.GroupLabel className="sticky top-0 z-1 m-0 mr-2 bg-white px-4 py-2 text-xs text-neutral-500">
                            Suggestions
                          </Autocomplete.GroupLabel>
                          <Autocomplete.Collection>
                            {(suggestion: TLabelResult) => (
                              <Autocomplete.Item
                                key={suggestion.value}
                                value={{ value: suggestion.value, type: "label" }}
                                onClick={() => handleSuggestionClick(suggestion.value)}
                                className="flex min-h-9 cursor-pointer items-center gap-1 rounded-md pl-4 pr-3 text-base text-inky-black select-none outline-none scroll-my-1 group data-highlighted:bg-neutral-200"
                              >
                                <span
                                  className="truncate"
                                  dangerouslySetInnerHTML={{ __html: underlineFirstInstanceOfQuery(suggestion.value, searchTerm) }}
                                />
                                <span className="text-gray-500">—</span>
                                <span className="shrink-0 whitespace-nowrap text-neutral-500">{labelTypeLabel(suggestion.type)}</span>
                                <div className="hidden text-sm text-neutral-600 gap-1 items-center ml-auto group-data-highlighted:inline-flex">
                                  Enter
                                  <CornerDownLeft height={16} width={16} className="inline" />
                                </div>
                              </Autocomplete.Item>
                            )}
                          </Autocomplete.Collection>
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
                <button className="flex items-center gap-2 hover:bg-neutral-200 rounded-md p-1" onClick={onAdvancedClick}>
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
