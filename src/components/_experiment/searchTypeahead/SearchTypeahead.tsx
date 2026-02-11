import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";

import { SuggestedFilters } from "@/components/_experiment/suggestedFilters/SuggestedFilters";

export interface SearchTypeaheadProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  selectedDocumentTypes: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onSelectDocumentType: (documentType: string) => void;
  onApplyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
  onSearchOnly: () => void;
  placeholder?: string;
}

export const SearchTypeahead = ({
  searchTerm,
  onSearchTermChange,
  selectedTopics,
  selectedGeos,
  selectedYears,
  selectedDocumentTypes,
  onSelectConcept,
  onSelectGeo,
  onSelectYear,
  onSelectDocumentType,
  onApplyAll,
  onSearchOnly,
  placeholder = "Search",
}: SearchTypeaheadProps) => {
  return (
    <div className="border border-border-lighter bg-white p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder={placeholder}
          onChange={(e) => {
            onSearchTermChange(e.target.value);
          }}
          className="h-[44px] w-full border border-border-lighter bg-surface-light px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand"
          value={searchTerm}
        />

        {searchTerm.length > 0 && (
          <div className="flex gap-2 justify-end sm:justify-start">
            <Button
              onClick={() => onSearchTermChange("")}
              className="inline-flex items-center border border-border-lighter bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-ui"
            >
              x
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-text-tertiary">Start typing to discover topics, geographies, years and document types we can turn into filters.</p>

      <SuggestedFilters
        searchTerm={searchTerm}
        selectedTopics={selectedTopics}
        selectedGeos={selectedGeos}
        selectedYears={selectedYears}
        selectedDocumentTypes={selectedDocumentTypes}
        onSelectConcept={onSelectConcept}
        onSelectGeo={onSelectGeo}
        onSelectYear={onSelectYear}
        onSelectDocumentType={onSelectDocumentType}
        onApplyAll={onApplyAll}
        onSearchOnly={onSearchOnly}
      />
    </div>
  );
};
