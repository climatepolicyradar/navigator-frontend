import { Button } from "@base-ui/react/button";
import { useContext, useMemo } from "react";

import { TopicsContext } from "@/context/TopicsContext";
import useConfig from "@/hooks/useConfig";
import useShadowSearch from "@/hooks/useShadowSearch";
import { buildFilterFieldOptions } from "@/utils/_experiment/buildFilterFieldOptions";

import { SearchTypeahead } from "./SearchTypeahead";
import { SuggestedFilters } from "./SuggestedFilters";

export function Typeahead() {
  const topicsData = useContext(TopicsContext);
  const configQuery = useConfig();
  const { data: configData } = configQuery;
  const filterOptions = useMemo(
    () =>
      buildFilterFieldOptions({
        topics: topicsData?.topics,
        regions: configData?.regions,
        countries: configData?.countries,
        corpusTypes: configData?.corpus_types,
      }),
    [topicsData?.topics, configData?.regions, configData?.countries, configData?.corpus_types]
  );

  const { search, filters: filtersState, actions } = useShadowSearch({ filterOptions });
  const { term: searchTerm, setTerm: setSearchTerm, rawTerm: rawSearchTerm, matches: rawMatches, showStringOnlyResults } = search;
  const { value: filters, hasAny: hasAnyFilters } = filtersState;
  const removeFilter = actions.remove;
  const addFilter = actions.add;

  return (
    <section className="bg-surface-light py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">Experimental</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">Search</h1>
        </header>
        <div className="grid gap-8 md:grid-cols-12 items-start">
          <aside className="md:col-span-4 space-y-4 border border-border-lighter bg-white p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">Active filters</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium text-text-tertiary">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {filters.topics.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                  {filters.topics.map((topic: string) => (
                    <Button
                      key={topic}
                      onClick={() => removeFilter("topics", topic)}
                      className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                    >
                      <span>{topic}</span>
                      <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-text-tertiary">Geographies</p>
                <div className="flex flex-wrap gap-2">
                  {filters.geos.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                  {filters.geos.map((geo: string) => (
                    <Button
                      key={geo}
                      onClick={() => removeFilter("geos", geo)}
                      className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                    >
                      <span>{geo}</span>
                      <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-text-tertiary">Years</p>
                <div className="flex flex-wrap gap-2">
                  {filters.years.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                  {filters.years.map((year: string) => (
                    <Button
                      key={year}
                      onClick={() => removeFilter("years", year)}
                      className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                    >
                      <span>{year}</span>
                      <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-text-tertiary">Document types</p>
                <div className="flex flex-wrap gap-2">
                  {filters.documentTypes.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                  {filters.documentTypes.map((documentType: string) => (
                    <Button
                      key={documentType}
                      onClick={() => removeFilter("documentTypes", documentType)}
                      className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                    >
                      <span>{documentType}</span>
                      <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                    </Button>
                  ))}
                </div>
              </div>

              {(filters.topicsExcluded.length > 0 ||
                filters.geosExcluded.length > 0 ||
                filters.yearsExcluded.length > 0 ||
                filters.documentTypesExcluded.length > 0) && (
                <div className="border-t border-border-lighter pt-3 mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">Excluded</p>
                  <div className="space-y-2">
                    {filters.topicsExcluded.length > 0 && (
                      <div>
                        <p className="mb-1 text-[10px] font-medium text-text-tertiary">Topics</p>
                        <div className="flex flex-wrap gap-2">
                          {filters.topicsExcluded.map((topic: string) => (
                            <Button
                              key={topic}
                              onClick={() => removeFilter("topicsExcluded", topic)}
                              className="group inline-flex items-center gap-1 rounded-full border border-dashed border-border-lighter bg-surface-light/70 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-surface-ui hover:text-text-brand transition"
                            >
                              <span>{topic}</span>
                              <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {filters.geosExcluded.length > 0 && (
                      <div>
                        <p className="mb-1 text-[10px] font-medium text-text-tertiary">Geographies</p>
                        <div className="flex flex-wrap gap-2">
                          {filters.geosExcluded.map((geo: string) => (
                            <Button
                              key={geo}
                              onClick={() => removeFilter("geosExcluded", geo)}
                              className="group inline-flex items-center gap-1 rounded-full border border-dashed border-border-lighter bg-surface-light/70 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-surface-ui hover:text-text-brand transition"
                            >
                              <span>{geo}</span>
                              <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {filters.yearsExcluded.length > 0 && (
                      <div>
                        <p className="mb-1 text-[10px] font-medium text-text-tertiary">Years</p>
                        <div className="flex flex-wrap gap-2">
                          {filters.yearsExcluded.map((year: string) => (
                            <Button
                              key={year}
                              onClick={() => removeFilter("yearsExcluded", year)}
                              className="group inline-flex items-center gap-1 rounded-full border border-dashed border-border-lighter bg-surface-light/70 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-surface-ui hover:text-text-brand transition"
                            >
                              <span>{year}</span>
                              <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {filters.documentTypesExcluded.length > 0 && (
                      <div>
                        <p className="mb-1 text-[10px] font-medium text-text-tertiary">Document types</p>
                        <div className="flex flex-wrap gap-2">
                          {filters.documentTypesExcluded.map((documentType: string) => (
                            <Button
                              key={documentType}
                              onClick={() => removeFilter("documentTypesExcluded", documentType)}
                              className="group inline-flex items-center gap-1 rounded-full border border-dashed border-border-lighter bg-surface-light/70 px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:bg-surface-ui hover:text-text-brand transition"
                            >
                              <span>{documentType}</span>
                              <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {hasAnyFilters && (
              <Button
                onClick={filtersState.clearAll}
                className="mt-2 inline-flex items-center border border-border-lighter bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-ui"
              >
                Clear all filters
              </Button>
            )}
          </aside>

          <main className="md:col-span-8 space-y-6">
            <SearchTypeahead
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedTopics={filters.topics}
              selectedGeos={filters.geos}
              selectedYears={filters.years}
              selectedDocumentTypes={filters.documentTypes}
              onSelectConcept={(selectedConcept) => addFilter("topics", selectedConcept)}
              onSelectGeo={(selectedGeo) => addFilter("geos", selectedGeo)}
              onSelectYear={(selectedYear) => addFilter("years", selectedYear)}
              onSelectDocumentType={(selectedDocumentType) => addFilter("documentTypes", selectedDocumentType)}
              onApplyAll={actions.applyAll}
              onSearchOnly={actions.searchOnly}
              onApplyAdvancedFilters={actions.applyAdvanced}
              filterOptions={filterOptions}
            />

            {(rawSearchTerm || hasAnyFilters) && (
              <div className="space-y-3">
                {hasAnyFilters ? (
                  <div className="border border-border-lighter bg-white p-4 space-y-3">
                    <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
                    <div className="space-y-2 text-xs text-text-secondary">
                      <p>Your search has been converted into the filters on the left. Adjust or clear the filters to change these results.</p>
                      <Button
                        onClick={actions.resetToOriginalSearch}
                        className="inline-flex items-center border border-border-lighter bg-white px-3 py-2 text-[11px] font-medium text-text-primary hover:bg-surface-light"
                      >
                        Reset filters to original search
                      </Button>
                    </div>
                    <p className="text-xs text-text-tertiary">Search results will appear here.</p>
                  </div>
                ) : showStringOnlyResults ? (
                  <div className="border border-border-lighter bg-white p-4 space-y-3">
                    <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
                    <p className="text-sm text-text-primary">
                      Showing results for <span className="font-semibold">&ldquo;{rawSearchTerm}&rdquo;</span>
                    </p>
                    <p className="text-xs text-text-secondary">To get more precise results, try applying filters based on your search.</p>

                    <div className="mt-3 bg-surface-light p-3">
                      <SuggestedFilters
                        searchTerm={rawSearchTerm}
                        matches={rawMatches}
                        selectedTopics={filters.topics}
                        selectedGeos={filters.geos}
                        selectedYears={filters.years}
                        selectedDocumentTypes={filters.documentTypes}
                        onSelectConcept={(selectedConcept) => addFilter("topics", selectedConcept)}
                        onSelectGeo={(selectedGeo) => addFilter("geos", selectedGeo)}
                        onSelectYear={(selectedYear) => addFilter("years", selectedYear)}
                        onSelectDocumentType={(selectedDocumentType) => addFilter("documentTypes", selectedDocumentType)}
                        showHeader={false}
                        showEmptyCopy={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border border-border-lighter bg-white p-4 space-y-3">
                    <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Results</p>
                    <p className="text-xs text-text-tertiary">Search results will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
